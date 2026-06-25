import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, default: "About EventMax", trim: true },
    heroDescription: { type: String, default: "", trim: true },
    story: { type: String, default: "" },
    vision: { type: String, default: "", trim: true },
    mission: { type: String, default: "", trim: true },
    aboutImage: { type: String, default: "", trim: true },
    stats: {
      events: { type: Number, default: 0, min: 0 },
      clients: { type: Number, default: 0, min: 0 },
      partners: { type: Number, default: 0, min: 0 },
      years: { type: Number, default: 0, min: 0 }
    }
  },
  { timestamps: true, versionKey: false }
);

aboutSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export const About = mongoose.model("About", aboutSchema);
