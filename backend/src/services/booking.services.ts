import mongoose from "mongoose";
import Booking, { IBooking } from "../models/Booking";
import { IBookingInput } from "../models/Booking";
import Desk from "../models/Desk";
import { BookingStatus, DeskStatus } from "../types";

export const checkExistingBooking = async (id: string) => {
  return await Booking.findOne({
    userId: id,
    status: { $in: ["pending", "approved", "checked-in"] },
  });
};

export const createNewBooking = async (bookingData: IBookingInput) => {
  return await Booking.create(bookingData);
};

export const fetchBooking = async (status?: BookingStatus) => {
  return await Booking.find(status ? { status } : {});
};

export const fetchBookingByID = async (id: string) => {
  return await Booking.findById({ _id: id });
};

