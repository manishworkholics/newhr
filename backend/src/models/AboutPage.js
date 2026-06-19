import mongoose from "mongoose";

const aboutPageSchema = new mongoose.Schema(
  {
    badge: { type: String, default: "", trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "", trim: true },
    heroImage: { type: String, default: "", trim: true },
    content: { type: String, required: true },
    status: { type: String, default: "Published", enum: ["Published", "Draft"] }
  },
  { timestamps: true, versionKey: false }
);

aboutPageSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export const AboutPage = mongoose.model("AboutPage", aboutPageSchema);
