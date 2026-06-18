import { asyncHandler } from "../utils/asyncHandler.js";
import { generatePitchPreview } from "../utils/pitchGenerator.js";
import { PassRequest } from "../models/PassRequest.js";

export const generatePitch = asyncHandler(async (req, res) => {
  const { name, company, designation } = req.body;

  if (!name || !company || !designation) {
    res.status(400).json({
      success: false,
      error: "Name, Company, and Designation are required"
    });
    return;
  }

  const data = generatePitchPreview(req.body);
  await PassRequest.create({
    ...req.body,
    vipBadgeCode: data.vipBadgeCode,
    property: req.body.property || ""
  });
  res.json({ success: true, simulated: true, data });
});
