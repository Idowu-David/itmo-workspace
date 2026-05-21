import { Router } from "express";
import { makeBookingRequest } from "../controllers/booking.controller";
import { protect } from "../middlewares/protect";

const router = Router();

router.post('/', protect, makeBookingRequest)

export default router;
