import { Router } from "express";
import { uploadImage } from "../controllers/upload.controller.js";
import { imageUpload } from "../middleware/upload.js";

const router = Router();

router.post("/image", imageUpload.single("image"), uploadImage);

export default router;
