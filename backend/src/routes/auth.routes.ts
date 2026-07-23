import { register, login, getMe, googleLogin, verifyEmail, forgotPassword, resetPassword } from "../controllers/auth.controller";
import { Router } from "express";
import { protect } from "../middlewares/protect";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/me", protect, getMe);
router.post("/google", googleLogin);
router.get('/verify-email', verifyEmail)
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password', resetPassword);

export default router;
