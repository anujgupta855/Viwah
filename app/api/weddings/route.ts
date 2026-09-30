import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { WeddingStory } from "@/models";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const items = await WeddingStory.find({}).sort({ weddingDate: -1 }).lean();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/weddings", error);
    return NextResponse.json({ message: "Unable to load wedding stories." }, { status: 500 });
  }
}
