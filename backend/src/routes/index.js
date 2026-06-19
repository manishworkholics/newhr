import { Router } from "express";
import healthRoutes from "./health.routes.js";
import inquiryRoutes from "./inquiry.routes.js";
import pitchRoutes from "./pitch.routes.js";
import cmsRoutes from "./cms.routes.js";
import uploadRoutes from "./upload.routes.js";
import passRoutes from "./pass.routes.js";
import companyLogoRoutes from "./companyLogo.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/inquiries", inquiryRoutes);
router.use("/pitch", pitchRoutes);
router.use("/cms", cmsRoutes);
router.use("/uploads", uploadRoutes);
router.use("/passes", passRoutes);
router.use("/", companyLogoRoutes);

export default router;
