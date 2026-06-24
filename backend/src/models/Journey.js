import mongoose from "mongoose";

const journeyMilestoneSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", trim: true },
    month: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const journeySchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },
    milestones: { type: [journeyMilestoneSchema], default: [] },
    displayOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true, versionKey: false }
);

journeySchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
});

export const Journey = mongoose.model("Journey", journeySchema);
