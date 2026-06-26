import { Router } from "express";
import healthRoutes from "./health.routes.js";
import inquiryRoutes from "./inquiry.routes.js";
import pitchRoutes from "./pitch.routes.js";
import cmsRoutes from "./cms.routes.js";
import uploadRoutes from "./upload.routes.js";
import passRoutes from "./pass.routes.js";
import companyLogoRoutes from "./companyLogo.routes.js";
import aboutRoutes from "./about.routes.js";
import communityRoutes from "./community.routes.js";
import cityRoutes from "./city.routes.js";
import journeyRoutes from "./journey.routes.js";
import adminAuthRoutes from "./adminAuth.routes.js";
import galleryRoutes from "./gallery.routes.js";
import { requireAdminAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/inquiries", inquiryRoutes);
router.use("/pitch", pitchRoutes);
router.use("/cms", cmsRoutes);
router.use("/cities", cityRoutes);
router.use("/admin/auth", adminAuthRoutes);
router.use("/admin/cities", requireAdminAuth, cityRoutes);
router.use("/", journeyRoutes);
router.use("/", galleryRoutes);
router.use("/uploads", requireAdminAuth, uploadRoutes);
router.use("/passes", requireAdminAuth, passRoutes);
router.use("/", companyLogoRoutes);
router.use("/v1/about", aboutRoutes);
router.use("/v1/community", communityRoutes);

export default router;
