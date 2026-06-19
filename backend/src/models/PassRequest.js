import mongoose from "mongoose";

const passRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobileNumber: { type: String, required: true, trim: true },
    city: { type: String, default: "", trim: true },
    property: { type: String, default: "", trim: true },
    goal: { type: String, default: "", trim: true },
    vipBadgeCode: { type: String, default: "", trim: true },
    status: { type: String, default: "Generated", enum: ["Generated", "Pending", "Approved"] }
  },
  { timestamps: true, versionKey: false }
);

passRequestSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
});

export const PassRequest = mongoose.model("PassRequest", passRequestSchema);
