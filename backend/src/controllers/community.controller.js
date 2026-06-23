import { CommunityRegistration } from "../models/community.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function validateRegistration(body) {
  const required = ["name", "contactNumber", "email", "city", "profession"];
  const missing = required.find((field) => !String(body[field] || "").trim());
  if (missing) return `${missing} is required`;
  if (!/^\d{10,}$/.test(String(body.contactNumber))) return "Contact number must contain at least 10 digits";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email))) return "Valid email is required";
  return null;
}

export const registerCommunityMember = asyncHandler(async (req, res) => {
  const error = validateRegistration(req.body);
  if (error) {
    res.status(400).json({ success: false, error });
    return;
  }

  await CommunityRegistration.create({
    name: req.body.name,
    contactNumber: req.body.contactNumber,
    email: req.body.email,
    city: req.body.city,
    profession: req.body.profession,
    companyName: req.body.companyName || ""
  });

  res.status(201).json({ success: true, message: "Registration submitted successfully" });
});

export const getCommunityRegistrations = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 100);
  const filter = {};
  const search = String(req.query.search || "").trim();

  if (["new", "contacted"].includes(req.query.status)) {
    filter.status = req.query.status;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { contactNumber: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } },
      { profession: { $regex: search, $options: "i" } },
      { companyName: { $regex: search, $options: "i" } }
    ];
  }

  const [registrations, total] = await Promise.all([
    CommunityRegistration.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    CommunityRegistration.countDocuments(filter)
  ]);

  res.json({
    success: true,
    registrations,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1)
    }
  });
});

export const updateCommunityStatus = asyncHandler(async (req, res) => {
  const status = req.body.status;
  if (!["new", "contacted"].includes(status)) {
    res.status(400).json({ success: false, error: "Invalid status" });
    return;
  }

  const registration = await CommunityRegistration.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  if (!registration) {
    res.status(404).json({ success: false, error: "Registration not found" });
    return;
  }

  res.json({ success: true, registration });
});

export const deleteCommunityRegistration = asyncHandler(async (req, res) => {
  const registration = await CommunityRegistration.findByIdAndDelete(req.params.id);
  if (!registration) {
    res.status(404).json({ success: false, error: "Registration not found" });
    return;
  }

  res.json({ success: true });
});
