import { Router } from "express";
import { fetchAllBooking, makeBookingRequest } from "../controllers/booking.controller";
import { protect } from "../middlewares/protect";

const router = Router();

router.post('/', protect, makeBookingRequest)
router.get('/', fetchAllBooking);
export default router;
