import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { MarketplaceSetting } from "@/models";

export const dynamic = "force-dynamic";

const fallback = {
  venuePriceOptions: [
    { label: "Under ₹1L", value: 100000 },
    { label: "Under ₹2L", value: 200000 },
    { label: "Under ₹5L", value: 500000 },
    { label: "Under ₹10L", value: 1000000 },
  ],
  vendorPriceOptions: {
    Photographer: [{label:"Under ₹50k",value:50000},{label:"Under ₹1L",value:100000},{label:"Under ₹2L",value:200000},{label:"Under ₹5L",value:500000}],
    "Makeup Artist": [{label:"Under ₹50k",value:50000},{label:"Under ₹1L",value:100000},{label:"Under ₹2L",value:200000},{label:"Under ₹5L",value:500000}],
    Decorator: [{label:"Under ₹50k",value:50000},{label:"Under ₹1L",value:100000},{label:"Under ₹2L",value:200000},{label:"Under ₹5L",value:500000}],
    Caterer: [{label:"Under ₹500 / plate",value:500},{label:"Under ₹750 / plate",value:750},{label:"Under ₹1,000 / plate",value:1000},{label:"Under ₹1,500 / plate",value:1500}],
    "Mehendi Artist": [{label:"Under ₹10k",value:10000},{label:"Under ₹20k",value:20000},{label:"Under ₹30k",value:30000},{label:"Under ₹50k",value:50000}],
    DJ: [{label:"Under ₹50k",value:50000},{label:"Under ₹1L",value:100000},{label:"Under ₹2L",value:200000},{label:"Under ₹5L",value:500000}],
  },
};

export async function GET() {
  try {
    await connectDB();
    const setting = await MarketplaceSetting.findOne({ key: "marketplace" }).lean();
    if (!setting) return NextResponse.json(fallback);
    const vendorPriceOptions = setting.vendorPriceOptions
  ? Object.fromEntries(Object.entries(setting.vendorPriceOptions))
  : {};
    return NextResponse.json({ venuePriceOptions: setting.venuePriceOptions, vendorPriceOptions });
  } catch {
    return NextResponse.json(fallback);
  }
}
