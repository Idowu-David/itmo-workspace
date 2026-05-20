import { register, login, getMe } from "../controllers/auth.controller";
import { Router } from "express";
import { protect } from "../middlewares/protect";

const router = Router();

router.post('/register', register)
router.post('/login', login);
router.post('/me', protect, getMe);


export default router;