import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    caption: { type: String, default: "", trim: true },
    image: { type: String, required: true, trim: true },
    eventName: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    year: { type: String, default: "", trim: true },
    status: { type: String, default: "Published", enum: ["Published", "Draft"] },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true, versionKey: false }
);

galleryImageSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
});

export const GalleryImage = mongoose.model("GalleryImage", galleryImageSchema);
