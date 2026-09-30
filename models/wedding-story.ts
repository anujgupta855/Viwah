import mongoose, { Schema } from "mongoose";

const weddingStorySchema = new Schema(
  {
    coupleName: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    weddingDate: { type: Date, required: true },
    story: { type: String, required: true },
    coverImage: { type: String, required: true },
    gallery: { type: [String], default: [] },
    weddingStyle: { type: String, required: true, trim: true },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

weddingStorySchema.index({ location: 1 });

export const WeddingStory = mongoose.models.WeddingStory || mongoose.model("WeddingStory", weddingStorySchema);
