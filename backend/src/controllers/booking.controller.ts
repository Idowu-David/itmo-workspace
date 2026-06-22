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
import { IBookingInput } from "../models/Booking";

// POST /api/booking
export const makeBookingRequest = async (req: Request, res: Response) => {
  console.log("=== BOOKING REQUEST HIT ===");

  try {
    const { deskId, name, purpose, phoneNumber } = req.body;
    const proofOfWork = req.file?.path;

    const userId = (req as any).user!.id;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

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
        message: "Desk not found",
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

    const bookingData: IBookingInput = {
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

    await updateDeskStatus(newBooking, "pending", newBooking._id);

    const io = req.app.locals.io;

    io.emit("desk-update", {
      deskId: newBooking.deskId,
      status: "booked",
    });

    io.emit("booking-update", newBooking);

    return res.status(201).json({
      status: "success",
      message: "Booking created succesfully",
      data: newBooking,
    });
  } catch (error: any) {
    console.error("FULL ERROR:", error);
    console.error("ERROR MESSAGE:", error?.message);
    return res.status(500).json({
      status: "error",
      message: error?.message || "Internal server error occurred",
    });
  }
};

// GET /api/booking
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
    const io = req.app.locals.io;

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

    io.emit("desk-update", {
      deskId: booking.deskId,
      status: "pending",
    });

    const desk = await getDeskByID(booking.deskId);
    // emit specifically to the student who booked
    io.emit("booking-approved", {
      booking,
      desk,
    });

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
    const io = req.app.locals.io;

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

    io.emit("desk-update", {
      deskId: booking.deskId,
      status: "available",
    });

    const desk = await getDeskByID(booking.deskId);

    io.to(booking.userId.toString()).emit("booking-rejected", {
      booking,
      desk,
    });

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

      await updateDeskStatus(booking, "booked", booking._id);

      const io = req.app.locals.io;
      io.emit("desk-update", {
        deskId: booking.deskId,
        status: "booked",
      });

      io.emit("booking-update", booking);

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

export const checkoutBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userId = (req as any).user.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
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

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({
        status: "error",
        message: "Not your booking",
      });
    }

    if (booking.status === "checked-in") {
      const desk = await getDeskByID(booking.deskId);

      if (!desk) {
        return res.status(404).json({
          status: "error",
          message: "Desk not found",
        });
      }

      booking.status = "checked-out";
      await booking.save();

      await updateDeskStatus(booking, "available", booking._id);

      const io = req.app.locals.io;
      
      io.emit("desk-update", {
        deskId: booking.deskId,
        status: "available",
      });

      io.emit("booking-update", booking);

      return res.status(200).json({
        status: "success",
        message: "Successfully checked out",
        data: booking,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error,
    });
  }
};

// PATCH /api/booking/:id/cancel
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const io = req.app.locals.io;

    const booking = await fetchBookingByID(String(id));

    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found",
      });
    }

    if (booking.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ status: "error", message: "Not your booking" });
    }

    if (!["pending", "approved"].includes(booking.status)) {
      return res
        .status(400)
        .json({ status: "error", message: "Booking cannot be cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    await updateDeskStatus(booking, "available");

    io.emit("desk-update", {
      deskId: booking.deskId,
      status: "available",
    });

    io.emit("booking-update", booking);

    return res.status(200).json({
      status: "success",
      message: "Booking cancelled",
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

export const myBooking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user!.id;
    const existingBooking = await checkExistingBooking(userId);

    return res.status(200).json({
      status: "success",
      data: existingBooking ?? null,
    });
  } catch (error) {
    console.error("Error occured: ", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error occured",
      error,
    });
  }
};
