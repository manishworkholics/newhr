import { About } from "../models/about.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function aboutPayload(body) {
  return {
    heroTitle: body.heroTitle || "About EventMax",
    heroDescription: body.heroDescription || "",
    story: body.story || "",
    vision: body.vision || "",
    mission: body.mission || "",
    aboutImage: body.aboutImage || "",
    stats: {
      events: Number(body.stats?.events || 0),
      clients: Number(body.stats?.clients || 0),
      partners: Number(body.stats?.partners || 0),
      years: Number(body.stats?.years || 0)
    }
  };
}

export const getAbout = asyncHandler(async (_req, res) => {
  const about = await About.findOne().sort({ createdAt: 1 });
  res.json({ success: true, about });
});

export const createAbout = asyncHandler(async (req, res) => {
  const existing = await About.findOne().sort({ createdAt: 1 });
  const payload = aboutPayload(req.body);
  const about = existing
    ? await About.findByIdAndUpdate(existing._id, payload, { new: true, runValidators: true })
    : await About.create(payload);

  res.status(existing ? 200 : 201).json({ success: true, about });
});

export const updateAbout = asyncHandler(async (req, res) => {
  let existing = await About.findById(req.params.id);
  if (!existing) {
    existing = await About.findOne().sort({ createdAt: 1 });
  }
  const payload = aboutPayload(req.body);
  const about = existing
    ? await About.findByIdAndUpdate(existing._id, payload, { new: true, runValidators: true })
    : await About.create(payload);

  res.json({ success: true, about });
});
