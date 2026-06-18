import { Router } from "express";
import {
  deletePassRequest,
  getPassRequests,
  updatePassRequest
} from "../controllers/pass.controller.js";

const router = Router();

router.get("/", getPassRequests);
router.put("/:id", updatePassRequest);
router.delete("/:id", deletePassRequest);

export default router;
