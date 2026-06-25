import { Router } from "express";
import {
  createInquiry,
  deleteInquiry,
  getInquiries,
  updateInquiryStatus
} from "../controllers/inquiry.controller.js";
import { requireAdminAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAdminAuth, getInquiries);
router.post("/", createInquiry);
router.patch("/:id/status", requireAdminAuth, updateInquiryStatus);
router.delete("/:id", requireAdminAuth, deleteInquiry);

export default router;
