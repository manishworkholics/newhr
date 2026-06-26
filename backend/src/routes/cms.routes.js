import { Router } from "express";
import {
  createCity,
  createEvent,
  deleteCity,
  deleteEvent,
  getCities,
  getCityBySlug,
  getCms,
  getEvents,
  getRoadshow,
  getAboutPage,
  updateCity,
  updateEvent,
  updateRoadshow,
  updateAboutPage,
  createTestimonial,
  deleteTestimonial,
  getTestimonials,
  updateTestimonial,
  createUpcomingEvent,
  deleteUpcomingEvent,
  getUpcomingEvents,
  updateUpcomingEvent
} from "../controllers/cms.controller.js";
import { requireAdminAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getCms);
router.get("/roadshow", getRoadshow);
router.put("/roadshow", requireAdminAuth, updateRoadshow);
router.get("/about", getAboutPage);
router.put("/about", requireAdminAuth, updateAboutPage);

router.get("/events", getEvents);
router.post("/events", requireAdminAuth, createEvent);
router.put("/events/:id", requireAdminAuth, updateEvent);
router.delete("/events/:id", requireAdminAuth, deleteEvent);

router.get("/upcoming-events", getUpcomingEvents);
router.post("/upcoming-events", requireAdminAuth, createUpcomingEvent);
router.put("/upcoming-events/:id", requireAdminAuth, updateUpcomingEvent);
router.delete("/upcoming-events/:id", requireAdminAuth, deleteUpcomingEvent);

router.get("/cities", getCities);
router.get("/cities/:slug", getCityBySlug);
router.post("/cities", requireAdminAuth, createCity);
router.put("/cities/:id", requireAdminAuth, updateCity);
router.delete("/cities/:id", requireAdminAuth, deleteCity);

router.get("/testimonials", getTestimonials);
router.post("/testimonials", requireAdminAuth, createTestimonial);
router.put("/testimonials/:id", requireAdminAuth, updateTestimonial);
router.delete("/testimonials/:id", requireAdminAuth, deleteTestimonial);

export default router;
