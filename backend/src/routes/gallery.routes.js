import { Router } from "express";
import {
  createGalleryImage,
  deleteGalleryImage,
  getGalleryById,
  getPublicGallery,
  updateGalleryImage
} from "../controllers/cms.controller.js";
import { requireAdminAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/gallery-events", getPublicGallery);
router.get("/gallery-events/:id", getGalleryById);
router.post("/gallery-events", requireAdminAuth, createGalleryImage);
router.put("/gallery-events/:id", requireAdminAuth, updateGalleryImage);
router.delete("/gallery-events/:id", requireAdminAuth, deleteGalleryImage);

export default router;
