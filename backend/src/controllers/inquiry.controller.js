import { Inquiry } from "../models/Inquiry.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getInquiries = asyncHandler(async (_req, res) => {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  res.json({ success: true, inquiries });
});

export const createInquiry = asyncHandler(async (req, res) => {
  const { name, company, designation, email, interestArea, message } = req.body;

  if (!name || !email) {
    res.status(400).json({ success: false, error: "Name and email are required" });
    return;
  }

  const inquiry = await Inquiry.create({
    name,
    company,
    designation,
    email,
    interestArea,
    message
  });

  res.status(201).json({ success: true, inquiry });
});

export const updateInquiryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    res.status(400).json({ success: false, error: "Status is required" });
    return;
  }

  const inquiry = await Inquiry.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!inquiry) {
    res.status(404).json({ success: false, error: "Inquiry not found" });
    return;
  }

  res.json({ success: true, inquiry });
});
