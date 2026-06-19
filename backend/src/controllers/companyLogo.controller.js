import { CompanyLogo } from "../models/CompanyLogo.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function normalizePayload(body) {
  const isActive = typeof body.isActive === "boolean"
    ? body.isActive
    : body.status
      ? body.status === "Active"
      : true;
  return {
    companyName: body.companyName,
    logoImage: body.logoImage,
    isActive,
    sortOrder: Number(body.sortOrder || 0)
  };
}

export const getPublicCompanyLogos = asyncHandler(async (_req, res) => {
  const companyLogos = await CompanyLogo.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 });
  res.json({ success: true, companyLogos });
});

export const getAdminCompanyLogos = asyncHandler(async (_req, res) => {
  const companyLogos = await CompanyLogo.find().sort({ sortOrder: 1, createdAt: 1 });
  res.json({ success: true, companyLogos });
});

export const createCompanyLogo = asyncHandler(async (req, res) => {
  const companyLogo = await CompanyLogo.create(normalizePayload(req.body));
  res.status(201).json({ success: true, companyLogo });
});

export const updateCompanyLogo = asyncHandler(async (req, res) => {
  const companyLogo = await CompanyLogo.findByIdAndUpdate(
    req.params.id,
    normalizePayload(req.body),
    { new: true, runValidators: true }
  );
  if (!companyLogo) {
    res.status(404).json({ success: false, error: "Company logo not found" });
    return;
  }
  res.json({ success: true, companyLogo });
});

export const deleteCompanyLogo = asyncHandler(async (req, res) => {
  const companyLogo = await CompanyLogo.findByIdAndDelete(req.params.id);
  if (!companyLogo) {
    res.status(404).json({ success: false, error: "Company logo not found" });
    return;
  }
  res.json({ success: true });
});
