import mongoose from "mongoose";
import Desk from "../models/Desk";
import { IBooking } from "../models/Booking";
import { DeskStatus } from "../types";
import crypto from "crypto";

export const getAllDesks = async () => {
  return await Desk.find({}).sort({ deskNumber: 1 });
};

export const checkDesk = async (id: string) => {
  return await Desk.findById(id);
};

export const getDeskByID = async (id: mongoose.Types.ObjectId) => {
  return await Desk.findById(id).select("+pin");
};

export const updateDeskStatus = async (
  booking: IBooking,
  status: DeskStatus,
  bookingId?: mongoose.Types.ObjectId,
) => {
  return await Desk.findByIdAndUpdate(booking.deskId, {
    status: status,
    currentBookingId: bookingId ? bookingId : null,
  });
};

export const deskPins = async () => {
  return await Desk.find().select("+pin").sort({ deskNumber: 1 });
};

export const updateDeskPin = async (booking: IBooking) => {
  const generatePIN = () => {
    return crypto.randomInt(1000, 9999).toString();
  };

  return await Desk.findByIdAndUpdate(
    booking.deskId,
    {
      status: "booked",
      pin: generatePIN(),
    },
    { new: true },
  );
};
