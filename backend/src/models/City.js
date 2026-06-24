import mongoose from "mongoose";

export function createCitySlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const featureCardSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const statSchema = new mongoose.Schema(
  {
    label: { type: String, default: "", trim: true },
    value: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    cityName: { type: String, trim: true },
    slug: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
    cityTagline: { type: String, default: "", trim: true },
    shortDescription: { type: String, default: "", trim: true },
    aboutTitle: { type: String, default: "", trim: true },
    aboutDescription: { type: String, default: "", trim: true },
    landmark: { type: String, default: "", trim: true },
    historicalEra: { type: String, default: "", trim: true },
    historicalInsight: { type: String, default: "", trim: true },
    networkingVibe: { type: String, default: "", trim: true },
    cityHighlights: { type: [String], default: [] },
    featureCards: { type: [featureCardSchema], default: [] },
    sidebarTitle: { type: String, default: "", trim: true },
    sidebarDescription: { type: String, default: "", trim: true },
    stats: { type: [statSchema], default: [] },
    image: { type: String, default: "", trim: true },
    status: { type: String, default: "Published", enum: ["Published", "Draft"] },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true, versionKey: false }
);

citySchema.pre("validate", function setCitySlug(next) {
  if (this.cityName && this.cityName !== this.name) {
    this.name = this.cityName;
  }

  if (!this.cityName) {
    this.cityName = this.name;
  }

  if (this.isModified("name") || this.isModified("cityName") || !this.slug) {
    this.slug = createCitySlug(this.cityName || this.name);
  }

  next();
});

citySchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    ret.cityName = ret.cityName || ret.name;
    ret.name = ret.name || ret.cityName;
    ret.slug = ret.slug || createCitySlug(ret.cityName || ret.name);
    delete ret._id;
    return ret;
  }
});

export const City = mongoose.model("City", citySchema);
