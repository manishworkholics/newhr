import { Router } from "express";
import {
  createCompanyLogo,
  deleteCompanyLogo,
  getAdminCompanyLogos,
  getPublicCompanyLogos,
  updateCompanyLogo
} from "../controllers/companyLogo.controller.js";
import { requireAdminAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/company-logos", getPublicCompanyLogos);
router.get("/admin/company-logos", requireAdminAuth, getAdminCompanyLogos);
router.post("/admin/company-logos", requireAdminAuth, createCompanyLogo);
router.put("/admin/company-logos/:id", requireAdminAuth, updateCompanyLogo);
router.delete("/admin/company-logos/:id", requireAdminAuth, deleteCompanyLogo);

export default router;
