import { Router } from "express";
import {
  createJourneyEntry,
  deleteJourneyEntry,
  getAdminJourney,
  getJourneyEntry,
  getPublicJourney,
  updateJourneyEntry
} from "../controllers/journey.controller.js";
import { requireAdminAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/journey", getPublicJourney);
router.get("/journey/:id", getJourneyEntry);
router.get("/admin/journey", requireAdminAuth, getAdminJourney);
router.post("/admin/journey", requireAdminAuth, createJourneyEntry);
router.put("/admin/journey/:id", requireAdminAuth, updateJourneyEntry);
router.delete("/admin/journey/:id", requireAdminAuth, deleteJourneyEntry);

export default router;
