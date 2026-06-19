import { Router } from "express";
import {
  createCity,
  createEvent,
  createGalleryImage,
  deleteCity,
  deleteEvent,
  deleteGalleryImage,
  getCities,
  getCms,
  getEvents,
  getGallery,
  getRoadshow,
  getAboutPage,
  updateCity,
  updateEvent,
  updateGalleryImage,
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

const router = Router();

router.get("/", getCms);
router.get("/roadshow", getRoadshow);
router.put("/roadshow", updateRoadshow);
router.get("/about", getAboutPage);
router.put("/about", updateAboutPage);

router.get("/events", getEvents);
router.post("/events", createEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

router.get("/upcoming-events", getUpcomingEvents);
router.post("/upcoming-events", createUpcomingEvent);
router.put("/upcoming-events/:id", updateUpcomingEvent);
router.delete("/upcoming-events/:id", deleteUpcomingEvent);

router.get("/cities", getCities);
router.post("/cities", createCity);
router.put("/cities/:id", updateCity);
router.delete("/cities/:id", deleteCity);

router.get("/gallery", getGallery);
router.post("/gallery", createGalleryImage);
router.put("/gallery/:id", updateGalleryImage);
router.delete("/gallery/:id", deleteGalleryImage);

router.get("/testimonials", getTestimonials);
router.post("/testimonials", createTestimonial);
router.put("/testimonials/:id", updateTestimonial);
router.delete("/testimonials/:id", deleteTestimonial);

export default router;
