import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";
import { MarketplaceSetting } from "@/models";

const option = z.object({ label: z.string().trim().min(1).max(80), value: z.coerce.number().min(0) });
const schema = z.object({
  venuePriceOptions: z.array(option).max(20),
  vendorPriceOptions: z.record(z.string(), z.array(option).max(20)),
});

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const setting = await MarketplaceSetting.findOne({ key: "marketplace" }).lean();
return NextResponse.json({
  venuePriceOptions: setting?.venuePriceOptions ?? [],
  vendorPriceOptions: setting?.vendorPriceOptions
    ? Object.fromEntries(Object.entries(setting.vendorPriceOptions))
    : {},
});
}

export async function PUT(request: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = schema.parse(await request.json());
    await connectDB();
    const item = await MarketplaceSetting.findOneAndUpdate(
      { key: "marketplace" },
      { key: "marketplace", venuePriceOptions: data.venuePriceOptions, vendorPriceOptions: data.vendorPriceOptions },
      { upsert: true, new: true, runValidators: true },
    ).lean();
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid settings" }, { status: 400 });
  }
}
