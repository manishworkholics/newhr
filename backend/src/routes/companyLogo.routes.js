import { Router } from "express";
import {
  createCompanyLogo,
  deleteCompanyLogo,
  getAdminCompanyLogos,
  getPublicCompanyLogos,
  updateCompanyLogo
} from "../controllers/companyLogo.controller.js";

const router = Router();

router.get("/company-logos", getPublicCompanyLogos);
router.get("/admin/company-logos", getAdminCompanyLogos);
router.post("/admin/company-logos", createCompanyLogo);
router.put("/admin/company-logos/:id", updateCompanyLogo);
router.delete("/admin/company-logos/:id", deleteCompanyLogo);

export default router;
