import { Inquiry } from "../models/Inquiry.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getInquiries = asyncHandler(async (_req, res) => {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  res.json({ success: true, inquiries });
});

export const createInquiry = asyncHandler(async (req, res) => {
  const { name, company, designation, email, interestArea, message } = req.body;
  const mobileNumber = req.body.mobileNumber || req.body.mobile || req.body.phone || req.body.phoneNumber;

  if (!name?.trim() || !email?.trim() || !mobileNumber?.trim()) {
    res.status(400).json({ success: false, error: "Name, email and mobile number are required" });
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    res.status(400).json({ success: false, error: "Please provide a valid email address" });
    return;
  }

  const normalizedMobile = mobileNumber.trim().replace(/[\s()-]/g, "");
  if (!/^\+?\d{7,15}$/.test(normalizedMobile)) {
    res.status(400).json({ success: false, error: "Please provide a valid mobile number" });
    return;
  }

  const inquiry = await Inquiry.create({
    name: name.trim(),
    company: company?.trim() || "N/A",
    designation: designation?.trim() || "N/A",
    email: email.trim(),
    mobileNumber: normalizedMobile,
    interestArea: interestArea?.trim() || "Sponsorship Opportunity",
    message: message?.trim() || ""
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

export const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
  if (!inquiry) {
    res.status(404).json({ success: false, error: "Inquiry not found" });
    return;
  }
  res.json({ success: true });
});
