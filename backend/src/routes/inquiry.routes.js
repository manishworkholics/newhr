import { Router } from "express";
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus
} from "../controllers/inquiry.controller.js";

const router = Router();

router.get("/", getInquiries);
router.post("/", createInquiry);
router.patch("/:id/status", updateInquiryStatus);

export default router;
