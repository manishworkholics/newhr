import { asyncHandler } from "../utils/asyncHandler.js";
import { generatePitchPreview } from "../utils/pitchGenerator.js";
import { PassRequest } from "../models/PassRequest.js";

export const generatePitch = asyncHandler(async (req, res) => {
  const { name, company, designation, email, mobileNumber } = req.body;

  if (!name?.trim() || !company?.trim() || !designation?.trim() || !email?.trim() || !mobileNumber?.trim()) {
    res.status(400).json({
      success: false,
      error: "Name, company, designation, email, and mobile number are required"
    });
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

  const payload = {
    ...req.body,
    name: name.trim(),
    company: company.trim(),
    designation: designation.trim(),
    email: email.trim(),
    mobileNumber: normalizedMobile
  };
  const data = generatePitchPreview(payload);
  await PassRequest.create({
    ...payload,
    vipBadgeCode: data.vipBadgeCode,
    property: payload.property || ""
  });
  res.json({ success: true, simulated: true, data });
});
