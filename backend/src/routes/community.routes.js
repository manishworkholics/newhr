import { Router } from "express";
import {
  deleteCommunityRegistration,
  getCommunityRegistrations,
  registerCommunityMember,
  updateCommunityStatus
} from "../controllers/community.controller.js";

const router = Router();

router.post("/register", registerCommunityMember);
router.get("/", getCommunityRegistrations);
router.put("/:id/status", updateCommunityStatus);
router.delete("/:id", deleteCommunityRegistration);

export default router;
