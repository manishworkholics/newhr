import { Router } from "express";
import {
  createCity,
  deleteCity,
  getCities,
  getCityBySlug,
  updateCity
} from "../controllers/cms.controller.js";
import { requireAdminAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getCities);
router.get("/:slug", getCityBySlug);
router.post("/", requireAdminAuth, createCity);
router.put("/:id", requireAdminAuth, updateCity);
router.delete("/:id", requireAdminAuth, deleteCity);

export default router;
