import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { Review, Venue } from "@/models";
import { syncReviewStats } from "@/lib/review-stats";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await connectDB();

    const { slug } = await params;

    console.log("VENUE SLUG:", slug);

    const venueDoc = await Venue.findOne({
      slug: slug.trim().toLowerCase(),
      status: "active",
    });

    console.log("VENUE FOUND:", !!venueDoc);

    if (!venueDoc) {
      return NextResponse.json(
        {
          message: "Venue not found.",
          slug,
        },
        { status: 404 },
      );
    }

    // Keep Venue.rating and Venue.reviewCount
    // synchronized with all approved reviews.
    const stats = await syncReviewStats(
      "venue",
      venueDoc._id.toString(),
    );

    const reviews = await Review.find({
      venue: venueDoc._id,
      status: "approved",
    })
      .sort({ date: -1 })
      .limit(20)
      .lean();

    console.log("REVIEWS FOUND:", reviews.length);

    return NextResponse.json({
      venue: {
        ...venueDoc.toObject(),
        rating: stats.rating,
        reviewCount: stats.reviewCount,
      },
      reviews,
    });
  } catch (error) {
    console.error(
      "GET /api/venues/[slug] ERROR:",
      error,
    );

    return NextResponse.json(
      {
        message: "Unable to load venue.",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 },
    );
  }
}