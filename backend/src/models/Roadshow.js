import mongoose from "mongoose";

const metricSchema = new mongoose.Schema(
  {
    value: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const citySectionSchema = new mongoose.Schema(
  {
    badge: { type: String, default: "", trim: true },
    title: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    landmarkLabel: { type: String, default: "", trim: true },
    networkingLabel: { type: String, default: "", trim: true },
    ctaLabel: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const eventSectionSchema = new mongoose.Schema(
  {
    badge: { type: String, default: "", trim: true },
    title: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    viewAllLabel: { type: String, default: "", trim: true },
    cardCtaLabel: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const roadshowSchema = new mongoose.Schema(
  {
    badge: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    ctaLabel: { type: String, default: "Reserve Your City Slot Now", trim: true },
    metrics: { type: [metricSchema], default: [] },
    citySection: { type: citySectionSchema, default: () => ({}) },
    eventSection: { type: eventSectionSchema, default: () => ({}) }
  },
  { timestamps: true, versionKey: false }
);

roadshowSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
});

export const Roadshow = mongoose.model("Roadshow", roadshowSchema);
