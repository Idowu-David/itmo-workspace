import { Request, Response } from "express";
import { checkDesk } from "../services/desk.services";
import mongoose from "mongoose";
import {
  checkExistingBooking,
  createNewBooking,
} from "../services/booking.services";
import { IBookingInput } from "../models/Booking";

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
