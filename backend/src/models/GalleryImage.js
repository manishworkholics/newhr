import mongoose from "mongoose";

const galleryImageItemSchema = new mongoose.Schema(
  {
    image: { type: String, required: true, trim: true },
    caption: { type: String, default: "", trim: true },
    sortOrder: { type: Number, default: 0 }
  },
  { _id: false }
);

const galleryImageSchema = new mongoose.Schema(
  {
    eventTitle: { type: String, required: true, trim: true },
    eventName: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true, maxlength: 220 },
    coverImage: { type: String, required: true, trim: true },
    images: { type: [galleryImageItemSchema], default: [] },
    status: { type: String, default: "Published", enum: ["Published", "Draft"] },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true, versionKey: false }
);

galleryImageSchema.pre("validate", function setGalleryDefaults(next) {
  if ((!this.images || this.images.length === 0) && this.coverImage) {
    this.images = [{ image: this.coverImage, caption: "", sortOrder: 0 }];
  }

  next();
});

galleryImageSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    if (!Array.isArray(ret.images) || ret.images.length === 0) {
      ret.images = ret.coverImage ? [{ image: ret.coverImage, caption: "", sortOrder: 0 }] : [];
    }
    return ret;
  }
});

export const GalleryImage = mongoose.model("GalleryImage", galleryImageSchema);
