import mongoose from "mongoose";

const communityRegistrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    city: { type: String, required: true, trim: true },
    profession: { type: String, required: true, trim: true },
    companyName: { type: String, default: "", trim: true },
    status: { type: String, enum: ["new", "contacted"], default: "new" }
  },
  { timestamps: true, versionKey: false }
);

communityRegistrationSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export const CommunityRegistration = mongoose.model("CommunityRegistration", communityRegistrationSchema);
