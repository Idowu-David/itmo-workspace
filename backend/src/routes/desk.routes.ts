import { Router } from "express";
import { getDesks } from "../controllers/desk.controller";

const router = Router()

router.get('/', getDesks);

export default router