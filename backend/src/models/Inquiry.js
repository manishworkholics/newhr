import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      default: "N/A",
      trim: true
    },
    designation: {
      type: String,
      default: "N/A",
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    interestArea: {
      type: String,
      default: "Sponsorship Opportunity",
      trim: true
    },
    message: {
      type: String,
      default: "",
      trim: true
    },
    status: {
      type: String,
      default: "Pending Review",
      enum: ["Pending Review", "Approved VIP", "Bypassed", "Rejected"]
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

inquirySchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    ret.timestamp = ret.createdAt;
    delete ret._id;
    return ret;
  }
});

export const Inquiry = mongoose.model("Inquiry", inquirySchema);
