import { Journey } from "../models/Journey.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function normalizeMilestones(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => ({
      title: String(item?.title || "").trim(),
      month: String(item?.month || "").trim()
    }))
    .filter((item) => item.title || item.month);
}

function normalizeJourneyPayload(body) {
  return {
    year: Number(body.year || 0),
    title: body.title,
    shortDescription: body.shortDescription,
    image: body.image,
    milestones: normalizeMilestones(body.milestones),
    displayOrder: Number(body.displayOrder || 0),
    isPublished: body.isPublished === false ? false : true
  };
}

const sortJourney = { displayOrder: 1, year: 1, createdAt: 1 };

export const getPublicJourney = asyncHandler(async (_req, res) => {
  const journey = await Journey.find({ isPublished: true }).sort(sortJourney);
  res.json({ success: true, journey });
});

export const getAdminJourney = asyncHandler(async (_req, res) => {
  const journey = await Journey.find().sort(sortJourney);
  res.json({ success: true, journey });
});

export const getJourneyEntry = asyncHandler(async (req, res) => {
  const numericYear = Number(req.params.id);
  const query = Number.isNaN(numericYear)
    ? { _id: req.params.id, isPublished: true }
    : { year: numericYear, isPublished: true };
  const entry = await Journey.findOne(query);
  if (!entry) {
    res.status(404).json({ success: false, error: "Journey entry not found" });
    return;
  }

  const relatedJourney = await Journey.find({
    isPublished: true,
    _id: { $ne: entry._id }
  })
    .sort(sortJourney)
    .limit(3);

  res.json({ success: true, journey: entry, relatedJourney });
});

export const createJourneyEntry = asyncHandler(async (req, res) => {
  const journey = await Journey.create(normalizeJourneyPayload(req.body));
  res.status(201).json({ success: true, journey });
});

export const updateJourneyEntry = asyncHandler(async (req, res) => {
  const journey = await Journey.findByIdAndUpdate(req.params.id, normalizeJourneyPayload(req.body), {
    new: true,
    runValidators: true
  });
  if (!journey) {
    res.status(404).json({ success: false, error: "Journey entry not found" });
    return;
  }
  res.json({ success: true, journey });
});

export const deleteJourneyEntry = asyncHandler(async (req, res) => {
  const journey = await Journey.findByIdAndDelete(req.params.id);
  if (!journey) {
    res.status(404).json({ success: false, error: "Journey entry not found" });
    return;
  }
  res.json({ success: true });
});
