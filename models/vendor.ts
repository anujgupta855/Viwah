import mongoose, { Schema, type InferSchemaType } from "mongoose";

const packageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const vendorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Photographer", "Makeup Artist", "Decorator", "Caterer", "Mehendi Artist", "DJ"],
      index: true,
    },
    city: { type: String, required: true, index: true, trim: true },
    description: { type: String, required: true },
    profileImage: { type: String, required: true },
    portfolioImages: { type: [String], default: [] },
    startingPrice: { type: Number, required: true, min: 0 },
    pricingUnit: { type: String, enum: ["package", "per_plate"], default: "package" },
    packages: { type: [packageSchema], default: [] },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, min: 0, default: 0 },
    phone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    address: { type: String, required: true },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "inactive"], default: "active", index: true },
  },
  { timestamps: true },
);

vendorSchema.index({ city: 1, category: 1, status: 1 });
vendorSchema.index({ name: "text", description: "text", city: "text", category: "text" });

export type VendorDocument = InferSchemaType<typeof vendorSchema>;
export const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);
