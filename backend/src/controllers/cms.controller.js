import { City, createCitySlug } from "../models/City.js";
import { Event } from "../models/Event.js";
import { GalleryImage } from "../models/GalleryImage.js";
import { Roadshow } from "../models/Roadshow.js";
import { AboutPage } from "../models/AboutPage.js";
import { Testimonial } from "../models/Testimonial.js";
import { UpcomingEvent } from "../models/UpcomingEvent.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function normalizeStringList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeObjectList(value, fields) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) =>
      fields.reduce((acc, field) => {
        acc[field] = String(item?.[field] || "").trim();
        return acc;
      }, {})
    )
    .filter((item) => fields.some((field) => item[field]));
}

function normalizeCityPayload(body) {
  const cityName = body.cityName || body.name;
  return {
    name: cityName,
    cityName,
    slug: createCitySlug(cityName),
    cityTagline: body.cityTagline,
    shortDescription: body.shortDescription,
    aboutTitle: body.aboutTitle,
    aboutDescription: body.aboutDescription,
    landmark: body.landmark,
    historicalEra: body.historicalEra,
    historicalInsight: body.historicalInsight,
    networkingVibe: body.networkingVibe,
    cityHighlights: normalizeStringList(body.cityHighlights),
    featureCards: normalizeObjectList(body.featureCards, ["title", "description"]),
    sidebarTitle: body.sidebarTitle,
    sidebarDescription: body.sidebarDescription,
    stats: normalizeObjectList(body.stats, ["label", "value"]),
    sortOrder: Number(body.sortOrder || 0),
    image: body.image,
    status: body.status || "Published"
  };
}

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

function normalizeGalleryImages(value, coverImage = "") {
  let items = [];
  if (Array.isArray(value)) {
    items = value;
  } else if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      items = Array.isArray(parsed) ? parsed : [];
    } catch {
      items = value
        .split("\n")
        .map((image) => ({ image: image.trim(), caption: "", sortOrder: 0 }))
        .filter((item) => item.image);
    }
  }

  const normalized = items
    .map((item, index) => ({
      image: String(item?.image || "").trim(),
      caption: String(item?.caption || "").trim(),
      sortOrder: Number(item?.sortOrder ?? index)
    }))
    .filter((item) => item.image)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (!normalized.length && coverImage) {
    return [{ image: coverImage, caption: "", sortOrder: 0 }];
  }

  return normalized;
}

function normalizeGalleryPayload(body) {
  const coverImage = String(body.coverImage || "").trim();
  const eventTitle = String(body.eventTitle || "").trim();
  const eventName = String(body.eventName || "").trim();
  const city = String(body.city || "").trim();
  const shortDescription = String(body.shortDescription || "").trim().slice(0, 220);

  return {
    eventTitle,
    eventName,
    city,
    year: String(body.year || "").trim(),
    shortDescription,
    coverImage,
    images: normalizeGalleryImages(body.images, coverImage),
    status: body.status || "Published",
    displayOrder: Number(body.displayOrder ?? 0)
  };
}

function getGalleryImagesForResponse(item) {
  const images = Array.isArray(item.images) ? item.images : [];
  if (images.length) return images.sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
  return item.coverImage ? [{ image: item.coverImage, caption: "", sortOrder: 0 }] : [];
}

function toGalleryListItem(item) {
  const json = item.toJSON ? item.toJSON() : item;
  return {
    ...json,
    images: getGalleryImagesForResponse(json)
  };
}

export const getCms = asyncHandler(async (_req, res) => {
  const [roadshow, events, upcomingEvents, cities, gallery, about, testimonials] = await Promise.all([
    Roadshow.findOne().sort({ createdAt: 1 }),
    Event.find().sort({ sortOrder: 1, createdAt: 1 }),
    UpcomingEvent.find().sort({ sortOrder: 1, createdAt: 1 }),
    City.find().sort({ sortOrder: 1, createdAt: 1 }),
    GalleryImage.find().sort({ displayOrder: 1, createdAt: -1 }),
    AboutPage.findOne().sort({ createdAt: 1 }),
    Testimonial.find().sort({ sortOrder: 1, createdAt: 1 })
  ]);

  res.json({ success: true, roadshow, events, upcomingEvents, cities, gallery, about, testimonials });
});

export const getAboutPage = asyncHandler(async (_req, res) => {
  const about = await AboutPage.findOne().sort({ createdAt: 1 });
  res.json({ success: true, about });
});

export const updateAboutPage = asyncHandler(async (req, res) => {
  const existing = await AboutPage.findOne().sort({ createdAt: 1 });
  const payload = {
    badge: req.body.badge,
    title: req.body.title,
    subtitle: req.body.subtitle,
    heroImage: req.body.heroImage,
    content: req.body.content,
    status: req.body.status || "Published"
  };
  const about = existing
    ? await AboutPage.findByIdAndUpdate(existing._id, payload, { new: true, runValidators: true })
    : await AboutPage.create(payload);
  res.json({ success: true, about });
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
    metrics,
    citySection: req.body.citySection,
    eventSection: req.body.eventSection
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

export const getCityBySlug = asyncHandler(async (req, res) => {
  const requestedSlug = createCitySlug(req.params.slug);
  let city = await City.findOne({ slug: requestedSlug, status: { $ne: "Draft" } });
  if (!city) {
    const cities = await City.find({ status: { $ne: "Draft" } });
    city = cities.find((item) => createCitySlug(item.cityName || item.name) === requestedSlug);
  }
  if (!city) {
    res.status(404).json({ success: false, error: "City not found" });
    return;
  }
  res.json({ success: true, city });
});

export const createCity = asyncHandler(async (req, res) => {
  const city = await City.create(normalizeCityPayload(req.body));
  res.status(201).json({ success: true, city });
});

export const updateCity = asyncHandler(async (req, res) => {
  const city = await City.findByIdAndUpdate(req.params.id, normalizeCityPayload(req.body), {
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

export const getGallery = asyncHandler(async (req, res) => {
  const filter = req.query.published === "true" ? { status: "Published" } : {};
  const galleryRecords = await GalleryImage.find(filter).sort({ displayOrder: 1, createdAt: -1 });
  const gallery = galleryRecords.map(toGalleryListItem);
  res.json({ success: true, gallery });
});

export const createGalleryImage = asyncHandler(async (req, res) => {
  const galleryImage = await GalleryImage.create(normalizeGalleryPayload(req.body));
  res.status(201).json({ success: true, galleryImage });
});

export const updateGalleryImage = asyncHandler(async (req, res) => {
  const galleryImage = await GalleryImage.findByIdAndUpdate(req.params.id, normalizeGalleryPayload(req.body), {
    new: true,
    runValidators: true
  });

  if (!galleryImage) {
    res.status(404).json({ success: false, error: "Gallery image not found" });
    return;
  }

  res.json({ success: true, galleryImage });
});

export const deleteGalleryImage = asyncHandler(async (req, res) => {
  const galleryImage = await GalleryImage.findByIdAndDelete(req.params.id);
  if (!galleryImage) {
    res.status(404).json({ success: false, error: "Gallery image not found" });
    return;
  }
  res.json({ success: true });
});

export const getUpcomingEvents = asyncHandler(async (_req, res) => {
  const upcomingEvents = await UpcomingEvent.find().sort({ sortOrder: 1, createdAt: 1 });
  res.json({ success: true, upcomingEvents });
});

export const createUpcomingEvent = asyncHandler(async (req, res) => {
  const upcomingEvent = await UpcomingEvent.create({
    ...req.body,
    slug: req.body.slug || req.body.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    details: parseDetails(req.body.details)
  });
  res.status(201).json({ success: true, upcomingEvent });
});

export const updateUpcomingEvent = asyncHandler(async (req, res) => {
  const upcomingEvent = await UpcomingEvent.findOneAndUpdate(
    { slug: req.params.id },
    { ...req.body, details: parseDetails(req.body.details) },
    { new: true, runValidators: true }
  );
  if (!upcomingEvent) {
    res.status(404).json({ success: false, error: "Upcoming event not found" });
    return;
  }
  res.json({ success: true, upcomingEvent });
});

export const deleteUpcomingEvent = asyncHandler(async (req, res) => {
  const upcomingEvent = await UpcomingEvent.findOneAndDelete({ slug: req.params.id });
  if (!upcomingEvent) {
    res.status(404).json({ success: false, error: "Upcoming event not found" });
    return;
  }
  res.json({ success: true });
});

export const getPublicGallery = asyncHandler(async (_req, res) => {
  const galleryRecords = await GalleryImage.find({ status: "Published" }).sort({ displayOrder: 1, createdAt: -1 });
  const gallery = galleryRecords.map((item) => {
    const json = toGalleryListItem(item);
    return {
      _id: json._id,
      id: json.id,
      eventTitle: json.eventTitle,
      eventName: json.eventName,
      city: json.city,
      year: json.year,
      shortDescription: json.shortDescription,
      coverImage: json.coverImage
    };
  });
  res.json({ success: true, gallery });
});

export const getGalleryById = asyncHandler(async (req, res) => {
  const gallery = /^[a-f\d]{24}$/i.test(req.params.id)
    ? await GalleryImage.findOne({ _id: req.params.id, status: "Published" })
    : null;
  if (!gallery) {
    res.status(404).json({ success: false, error: "Gallery event not found" });
    return;
  }

  const json = toGalleryListItem(gallery);
  res.json({
    success: true,
    gallery: {
      ...json,
      images: getGalleryImagesForResponse(json)
    }
  });
});

export const getTestimonials = asyncHandler(async (req, res) => {
  const filter = req.query.published === "true" ? { status: "Published" } : {};
  const testimonials = await Testimonial.find(filter).sort({ sortOrder: 1, createdAt: 1 });
  res.json({ success: true, testimonials });
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json({ success: true, testimonial });
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!testimonial) {
    res.status(404).json({ success: false, error: "Testimonial not found" });
    return;
  }
  res.json({ success: true, testimonial });
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) {
    res.status(404).json({ success: false, error: "Testimonial not found" });
    return;
  }
  res.json({ success: true });
});
