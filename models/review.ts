import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  userName: string;
  rating: number;
  comment: string;
  vendor?: mongoose.Types.ObjectId;
  venue?: mongoose.Types.ObjectId;
  date: Date;
  status: "approved";
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      default: undefined,
    },

    venue: {
      type: Schema.Types.ObjectId,
      ref: "Venue",
      default: undefined,
    },

    status: {
      type: String,
      enum: ["approved"],
      default: "approved",
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ status: 1 });
reviewSchema.index({ vendor: 1, status: 1 });
reviewSchema.index({ venue: 1, status: 1 });

const Review: Model<IReview> =
  mongoose.models.Review ||
  mongoose.model<IReview>("Review", reviewSchema);

export default Review;