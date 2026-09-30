import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    userName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", default: null },
    venue: { type: Schema.Types.ObjectId, ref: "Venue", default: null },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
  },
  { timestamps: true },
);

reviewSchema.index({ vendor: 1, status: 1 });
reviewSchema.index({ venue: 1, status: 1 });

export const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
