import { register, login, getMe, googleLogin, verifyEmail } from "../controllers/auth.controller";
import { Router } from "express";
import { protect } from "../middlewares/protect";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/me", protect, getMe);
router.post("/google", googleLogin);
router.get('/verify-email', verifyEmail)

export default router;
