import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AdminUser } from "../models/AdminUser.js";

export async function requireAdminAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) {
      res.status(401).json({ success: false, error: "Authentication token is required" });
      return;
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const admin = await AdminUser.findOne({ _id: payload.sub, isActive: true });

    if (!admin) {
      res.status(401).json({ success: false, error: "Invalid or expired admin session" });
      return;
    }

    req.admin = admin;
    next();
  } catch {
    res.status(401).json({ success: false, error: "Invalid or expired admin session" });
  }
}
