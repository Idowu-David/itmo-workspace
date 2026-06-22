import { Router } from "express";
import {
  approveBooking,
  fetchAllBooking,
  rejectBooking,
  makeBookingRequest,
  checkinBooking,
  checkoutBooking,
  cancelBooking,
  myBooking,
} from "../controllers/booking.controller";
import { protect } from "../middlewares/protect";
import { adminOnly } from "../middlewares/admin";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.post("/", protect, upload.single("proofOfWork"), makeBookingRequest);
router.get("/", protect, adminOnly, fetchAllBooking);
router.get("/my-booking", protect, myBooking);
router.patch("/:id/checkin", protect, checkinBooking);
router.patch("/:id/checkout", protect, checkoutBooking);
router.patch("/:id/cancel", protect, cancelBooking);
router.patch("/:id/approve", protect, adminOnly, approveBooking);
router.patch("/:id/reject", protect, adminOnly, rejectBooking);

export default router;
