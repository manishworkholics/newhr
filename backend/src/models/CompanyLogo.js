import mongoose from "mongoose";

const companyLogoSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    logoImage: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true, versionKey: false }
);

companyLogoSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    ret.status = ret.isActive ? "Active" : "Inactive";
    delete ret._id;
  }
});

export const CompanyLogo = mongoose.model("CompanyLogo", companyLogoSchema);
