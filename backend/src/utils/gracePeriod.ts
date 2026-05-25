import Booking from "../models/Booking";
import Desk from "../models/Desk";
import { IBooking } from "../models/Booking";
import { Server } from "socket.io";
import { fetchBookingByID } from "../services/booking.services";

export const startGracePeriod = (booking: IBooking, io: Server) => {
  setTimeout(
    async () => {
      const freshBooking = await fetchBookingByID(String(booking._id));

      if (!freshBooking) return;

      if (freshBooking.status === "approved") {
        freshBooking.status = "expired";
        await freshBooking.save();

        await Desk.findByIdAndUpdate(freshBooking.deskId, {
          status: "available",
          currentBooking: null,
        });

        io.emit("desk-update", {
          deskId: freshBooking.deskId,
          status: "available",
        });

        console.log(`Booking ${booking._id} expired - Desk released`);
      }
    },
    15 * 60 * 1000,
  );
};
