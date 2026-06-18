import { City } from "../models/City.js";
import { Event } from "../models/Event.js";
import { Roadshow } from "../models/Roadshow.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function parseDetails(details) {
  if (Array.isArray(details)) return details;
  if (typeof details === "string") {
    return details
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export const getCms = asyncHandler(async (_req, res) => {
  const [roadshow, events, cities] = await Promise.all([
    Roadshow.findOne().sort({ createdAt: 1 }),
    Event.find().sort({ sortOrder: 1, createdAt: 1 }),
    City.find().sort({ sortOrder: 1, createdAt: 1 })
  ]);

  res.json({ success: true, roadshow, events, cities });
});

export const getRoadshow = asyncHandler(async (_req, res) => {
  const roadshow = await Roadshow.findOne().sort({ createdAt: 1 });
  res.json({ success: true, roadshow });
});

export const updateRoadshow = asyncHandler(async (req, res) => {
  const existing = await Roadshow.findOne().sort({ createdAt: 1 });
  const metrics = typeof req.body.metrics === "string" ? JSON.parse(req.body.metrics) : req.body.metrics;

  const payload = {
    badge: req.body.badge,
    title: req.body.title,
    description: req.body.description,
    ctaLabel: req.body.ctaLabel,
    metrics
  };

  const roadshow = existing
    ? await Roadshow.findByIdAndUpdate(existing._id, payload, { new: true, runValidators: true })
    : await Roadshow.create(payload);

  res.json({ success: true, roadshow });
});

export const getEvents = asyncHandler(async (_req, res) => {
  const events = await Event.find().sort({ sortOrder: 1, createdAt: 1 });
  res.json({ success: true, events });
});

export const createEvent = asyncHandler(async (req, res) => {
  const event = await Event.create({
    ...req.body,
    slug: req.body.slug || req.body.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    details: parseDetails(req.body.details)
  });
  res.status(201).json({ success: true, event });
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findOneAndUpdate(
    { slug: req.params.id },
    { ...req.body, details: parseDetails(req.body.details) },
    { new: true, runValidators: true }
  );

  if (!event) {
    res.status(404).json({ success: false, error: "Event not found" });
    return;
  }

  res.json({ success: true, event });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findOneAndDelete({ slug: req.params.id });
  if (!event) {
    res.status(404).json({ success: false, error: "Event not found" });
    return;
  }
  res.json({ success: true });
});

export const getCities = asyncHandler(async (_req, res) => {
  const cities = await City.find().sort({ sortOrder: 1, createdAt: 1 });
  res.json({ success: true, cities });
});

export const createCity = asyncHandler(async (req, res) => {
  const city = await City.create(req.body);
  res.status(201).json({ success: true, city });
});

export const updateCity = asyncHandler(async (req, res) => {
  const city = await City.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!city) {
    res.status(404).json({ success: false, error: "City not found" });
    return;
  }

  res.json({ success: true, city });
});

export const deleteCity = asyncHandler(async (req, res) => {
  const city = await City.findByIdAndDelete(req.params.id);
  if (!city) {
    res.status(404).json({ success: false, error: "City not found" });
    return;
  }
  res.json({ success: true });
});
