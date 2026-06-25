import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AdminUser } from "../models/AdminUser.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function signAdminToken(admin) {
  return jwt.sign(
    {
      sub: admin._id.toString(),
      email: admin.email
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

function sanitizeAdmin(admin) {
  return {
    id: admin._id.toString(),
    name: admin.name,
    email: admin.email
  };
}

export const loginAdmin = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password) {
    res.status(400).json({ success: false, error: "Email and password are required" });
    return;
  }

  const admin = await AdminUser.findOne({ email, isActive: true }).select("+password");
  if (!admin || !(await admin.comparePassword(password))) {
    res.status(401).json({ success: false, error: "Invalid admin credentials" });
    return;
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  res.json({
    success: true,
    token: signAdminToken(admin),
    admin: sanitizeAdmin(admin)
  });
});

export const getAdminSession = asyncHandler(async (req, res) => {
  res.json({ success: true, admin: sanitizeAdmin(req.admin) });
});

export const changeAdminPassword = asyncHandler(async (req, res) => {
  const currentPassword = String(req.body.currentPassword || "");
  const newPassword = String(req.body.newPassword || "");

  if (!currentPassword || !newPassword) {
    res.status(400).json({ success: false, error: "Current password and new password are required" });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({ success: false, error: "New password must be at least 8 characters" });
    return;
  }

  const admin = await AdminUser.findById(req.admin._id).select("+password");
  if (!admin || !(await admin.comparePassword(currentPassword))) {
    res.status(401).json({ success: false, error: "Current password is incorrect" });
    return;
  }

  admin.password = newPassword;
  await admin.save();

  res.json({ success: true });
});
