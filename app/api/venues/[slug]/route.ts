import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import { Review, Venue } from "@/models";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await connectDB();

    const { slug } = await params;

    const venueDoc = await Venue.findOne({
      slug,
      status: "active",
    });

    if (!venueDoc) {
      return NextResponse.json(
        { message: "Venue not found." },
        { status: 404 },
      );
    }

    const reviews = await Review.find({
      venue: venueDoc._id,
      status: "approved",
    })
      .sort({ date: -1 })
      .limit(20)
      .lean();

    const venue = venueDoc.toObject();

    return NextResponse.json({
      venue,
      reviews,
    });
  } catch (error) {
    console.error("GET /api/venues/[slug]", error);

    return NextResponse.json(
      { message: "Unable to load venue." },
      { status: 500 },
    );
  }
}