import { Request, Response } from "express";
import { checkDesk, getDeskByID } from "../services/desk.services";
import mongoose from "mongoose";
import {
  checkExistingBooking,
  createNewBooking,
  fetchBooking,
  fetchBookingByID,
  } from "../services/booking.services";
import { BookingStatus } from "../types";
import { startGracePeriod } from "../utils/gracePeriod";
import { updateDeskStatus } from "../services/desk.services";

// POST /api/booking
export const makeBookingRequest = async (req: Request, res: Response) => {
  try {
    const { deskId, name, purpose, phoneNumber, proofOfWork } = req.body;
    const userId = (req as any).user!.id;

    if (!deskId || !name || !purpose || !phoneNumber || !proofOfWork) {
      return res.status(400).json({
        status: "error",
        message: "All input fields are required",
      });
    }

    if (!mongoose.isValidObjectId(deskId)) {
      res.status(400).json({
        status: "error",
        message: "Invalid Desk ID",
      });
    }

    const desk = await checkDesk(String(deskId));

    if (!desk) {
      return res.status(404).json({
        status: "error",
        message: "Desk not foundd",
      });
    }

    if (desk.status !== "available") {
      return res.status(400).json({
        status: "error",
        message: "Desk is not available",
      });
    }

    const existingBooking = await checkExistingBooking(userId);

    if (existingBooking) {
      return res.status(400).json({
        status: "error",
        message: "You already have an active booking",
      });
    }

    const bookingData = {
      deskId,
      userId,
      name,
      purpose,
      phoneNumber,
      proofOfWork,
    };

    const newBooking = await createNewBooking(bookingData);

    if (!newBooking) {
      return res.status(400).json({
        status: "error",
        message: "Booking could not be created",
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Booking created succesfully",
      data: newBooking,
    });
  } catch (error) {
    console.error("Error occured: ", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error occured",
    });
  }
};

export const fetchAllBooking = async (req: Request, res: Response) => {
  try {
    const status =
      typeof req.query.status === "string"
        ? (req.query.status as BookingStatus)
        : undefined;

    const bookings = await fetchBooking(status);

    if (!bookings) {
      return res.status(404).json({
        status: "error",
        message: "No booking found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    console.error("Error occured: ", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error occured",
    });
  }
};

// PATCH /api/booking/:id/approve
export const approveBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        status: "error",
        message: "Invalid Booking ID",
      });
    }

    const booking = await fetchBookingByID(String(id));

    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        status: "error",
        messag: "Booking is not pending",
      });
    }

    booking.status = "approved";
    booking.approvedAt = new Date();
    await booking.save();

    await updateDeskStatus(booking, "pending", booking._id);

    startGracePeriod(booking, req.app.locals.io);

    return res.status(200).json({
      status: "success",
      message: "Booking approved",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error,
    });
  }
};

// PATCH /api/booking/:id/reject
export const rejectBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        status: "error",
        message: "Invalid Booking ID",
      });
    }

    const booking = await fetchBookingByID(String(id));

    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found",
      });
    }

    booking.status = "rejected";
    await booking.save();

    await updateDeskStatus(booking, "available");

    return res.status(200).json({
      status: "success",
      message: "Booking rejected",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error,
    });
  }
};

// PATCH /api/booking/:id/checkin
export const checkinBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { pin } = req.body;

    const userId = (req as any).user.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid Booking ID",
      });
    }

    if (!pin) {
      return res.status(400).json({
        status: "error",
        message: "PIN is required",
      });
    }

    const booking = await fetchBookingByID(String(id));

    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found",
      });
    }

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({
        status: "error",
        message: "Not your booking",
      });
    }

    const fifteenMinutes = 15 * 60 * 1000;
    const timeElapsed = Date.now() - new Date(booking.approvedAt!).getTime();
    if (timeElapsed > fifteenMinutes) {
      return res.status(400).json({
        status: "error",
        message: "Check-in window has expired",
      });
    }

    if (booking.status === "approved") {
      const desk = await getDeskByID(booking.deskId);

      if (!desk) {
        return res.status(404).json({
          status: "error",
          message: "Desk not found",
        });
      }

      if (desk.pin !== pin) {
        return res.status(400).json({
          status: "error",
          message: "Incorrect PIN",
        });
      }

      booking.status = "checked-in";
      await booking.save();

      await updateDeskStatus(booking, "booked", booking._id)

      const io = req.app.locals.io;
      io.emit("desk-update", {
        deskId: booking.deskId,
        status: "occupied",
      });

      return res.status(200).json({
        status: "success",
        message: "Successfully checked in",
        data: booking,
      });
    }

    return res.status(400).json({
      status: "error",
      message: "Booking status is not approved",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error,
    });
  }
};
