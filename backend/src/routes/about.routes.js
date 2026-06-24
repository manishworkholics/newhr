import { Router } from "express";
import { createAbout, getAbout, updateAbout } from "../controllers/about.controller.js";
import { requireAdminAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getAbout);
router.post("/", requireAdminAuth, createAbout);
router.put("/:id", requireAdminAuth, updateAbout);

export default router;
