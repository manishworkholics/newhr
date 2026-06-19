import { Router } from "express";
import {
  createInquiry,
  deleteInquiry,
  getInquiries,
  updateInquiryStatus
} from "../controllers/inquiry.controller.js";

const router = Router();

router.get("/", getInquiries);
router.post("/", createInquiry);
router.patch("/:id/status", updateInquiryStatus);
router.delete("/:id", deleteInquiry);

export default router;
