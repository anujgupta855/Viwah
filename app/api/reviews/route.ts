import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Review from "@/models/review";
import { syncReviewStats } from "@/lib/review-stats";

const reviewSchema = z.object({
  userName: z.string().trim().min(2).max(100),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(3).max(2000),

  vendor: z.string().optional().nullable(),
  venue: z.string().optional().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const vendor = searchParams.get("vendor");
    const venue = searchParams.get("venue");

    const query: Record<string, unknown> = {
      status: "approved",
    };

    if (vendor) query.vendor = vendor;
    if (venue) query.venue = venue;

    const reviews = await Review.find(query)
      .populate("vendor", "name slug")
      .populate("venue", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("GET /api/reviews error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reviews",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid name, rating and review.",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { userName, rating, comment, vendor, venue } = parsed.data;

    if (!vendor && !venue) {
      return NextResponse.json(
        {
          success: false,
          message: "A review must belong to a vendor or venue.",
        },
        { status: 400 }
      );
    }

    if (vendor && venue) {
      return NextResponse.json(
        {
          success: false,
          message: "Review cannot belong to both vendor and venue.",
        },
        { status: 400 }
      );
    }

    const review = await Review.create({
      userName,
      rating,
      comment,
      vendor: vendor || undefined,
      venue: venue || undefined,
      status: "approved",
      date: new Date(),
    });
    if (vendor) {
  await syncReviewStats("vendor", vendor);
   }

if (venue) {
  await syncReviewStats("venue", venue);
}

    const populatedReview = await Review.findById(review._id)
      .populate("vendor", "name slug")
      .populate("venue", "name slug")
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully.",
        review: populatedReview,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/reviews error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit review.",
      },
      { status: 500 }
    );
  }
}