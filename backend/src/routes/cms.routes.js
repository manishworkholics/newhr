import { Router } from "express";
import {
  createCity,
  createEvent,
  deleteCity,
  deleteEvent,
  getCities,
  getCms,
  getEvents,
  getRoadshow,
  updateCity,
  updateEvent,
  updateRoadshow
} from "../controllers/cms.controller.js";

const router = Router();

router.get("/", getCms);
router.get("/roadshow", getRoadshow);
router.put("/roadshow", updateRoadshow);

router.get("/events", getEvents);
router.post("/events", createEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

router.get("/cities", getCities);
router.post("/cities", createCity);
router.put("/cities/:id", updateCity);
router.delete("/cities/:id", deleteCity);

export default router;
