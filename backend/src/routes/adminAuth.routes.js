import { Router } from "express";
import {
  changeAdminPassword,
  getAdminSession,
  loginAdmin
} from "../controllers/adminAuth.controller.js";
import { requireAdminAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", loginAdmin);
router.get("/me", requireAdminAuth, getAdminSession);
router.put("/change-password", requireAdminAuth, changeAdminPassword);

export default router;
