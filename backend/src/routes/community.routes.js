import { Router } from "express";
import {
  deleteCommunityRegistration,
  getCommunityRegistrations,
  registerCommunityMember,
  updateCommunityStatus
} from "../controllers/community.controller.js";
import { requireAdminAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerCommunityMember);
router.get("/", requireAdminAuth, getCommunityRegistrations);
router.put("/:id/status", requireAdminAuth, updateCommunityStatus);
router.delete("/:id", requireAdminAuth, deleteCommunityRegistration);

export default router;
