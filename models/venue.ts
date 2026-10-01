import mongoose, { Schema, type InferSchemaType } from "mongoose";

const venueSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    city: { type: String, required: true, index: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    images: { type: [String], default: [] },

    youtubeVideos: {
      type: [
        {
          title: {
            type: String,
            required: true,
            trim: true,
          },
          url: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
      default: [],
    },

    startingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    venueType: {
      type: String,
      required: true,
      enum: [
        "Banquet Hall",
        "Wedding Lawn",
        "Resort",
        "Hotel",
        "Farmhouse",
        "Palace",
      ],
      index: true,
    },

    amenities: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    reviewCount: {
      type: Number,
      min: 0,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true },
);

venueSchema.index({
  city: 1,
  venueType: 1,
  status: 1,
});

venueSchema.index({
  name: "text",
  description: "text",
  city: "text",
  location: "text",
});

export type VenueDocument =
  InferSchemaType<typeof venueSchema>;

export const Venue =
  mongoose.models.Venue ||
  mongoose.model("Venue", venueSchema);