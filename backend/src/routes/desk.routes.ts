import { Router } from "express";
import { getDeskPins, getDesks } from "../controllers/desk.controller";
import { protect } from "../middlewares/protect";
import { adminOnly } from "../middlewares/admin";

const router = Router();

router.get("/", getDesks);
router.get("/pins", protect, adminOnly, getDeskPins);

export default router;
