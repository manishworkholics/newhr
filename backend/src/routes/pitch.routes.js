import { Router } from "express";
import { generatePitch } from "../controllers/pitch.controller.js";

const router = Router();

router.post("/generate", generatePitch);

export default router;
