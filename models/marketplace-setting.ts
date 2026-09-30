import mongoose, { Schema, type InferSchemaType } from "mongoose";

const priceOptionSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const marketplaceSettingSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    vendorPriceOptions: {
      type: Map,
      of: [priceOptionSchema],
      default: {},
    },

    venuePriceOptions: {
      type: [priceOptionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export type MarketplaceSettingDocument =
  InferSchemaType<typeof marketplaceSettingSchema>;

const MarketplaceSettingModel =
  mongoose.models.MarketplaceSetting as mongoose.Model<MarketplaceSettingDocument> | undefined;

export const MarketplaceSetting: mongoose.Model<MarketplaceSettingDocument> =
  MarketplaceSettingModel ??
  mongoose.model<MarketplaceSettingDocument>(
    "MarketplaceSetting",
    marketplaceSettingSchema,
  );