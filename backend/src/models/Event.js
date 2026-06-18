import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    badge: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },
    details: { type: [String], default: [] },
    status: { type: String, default: "Published", enum: ["Published", "Draft"] },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true, versionKey: false }
);

eventSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret.slug;
    delete ret._id;
    return ret;
  }
});

export const Event = mongoose.model("Event", eventSchema);
