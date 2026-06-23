import { Router } from "express";
import { createAbout, getAbout, updateAbout } from "../controllers/about.controller.js";

const router = Router();

router.get("/", getAbout);
router.post("/", createAbout);
router.put("/:id", updateAbout);

export default router;
