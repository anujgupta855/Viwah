import mongoose, { Schema } from "mongoose";

const enquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", default: null },
    venue: { type: Schema.Types.ObjectId, ref: "Venue", default: null },
    eventDate: { type: Date, default: null },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ["new", "read", "contacted", "closed"], default: "new", index: true },
  },
  { timestamps: true },
);

export const Enquiry = mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema);
