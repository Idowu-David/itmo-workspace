import Booking from "../models/Booking";
import { IBookingInput } from "../models/Booking";
import { BookingStatus } from "../types";

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
