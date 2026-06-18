import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    landmark: { type: String, default: "", trim: true },
    historicalEra: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },
    historicalInsight: { type: String, default: "", trim: true },
    networkingVibe: { type: String, default: "", trim: true },
    status: { type: String, default: "Published", enum: ["Published", "Draft"] },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true, versionKey: false }
);

citySchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
});

export const City = mongoose.model("City", citySchema);
