import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { Review, Vendor } from "@/models";
import { syncReviewStats } from "@/lib/review-stats";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await connectDB();

    const { slug } = await params;

    const vendorDoc = await Vendor.findOne({
      slug: slug.trim().toLowerCase(),
      status: "active",
    });

    if (!vendorDoc) {
      return NextResponse.json(
        { message: "Vendor not found." },
        { status: 404 },
      );
    }

    // Keep Vendor.rating and Vendor.reviewCount
    // synchronized with all approved reviews.
    const stats = await syncReviewStats(
      "vendor",
      vendorDoc._id.toString(),
    );

    // Show latest 20 reviews on the page.
    // Rating/count are calculated from ALL approved reviews.
    const reviews = await Review.find({
      vendor: vendorDoc._id,
      status: "approved",
    })
      .sort({ date: -1 })
      .limit(20)
      .lean();

    const vendor = vendorDoc.toObject();

    return NextResponse.json({
      vendor: {
        ...vendor,
        rating: stats.rating,
        reviewCount: stats.reviewCount,
      },
      reviews,
    });
  } catch (error) {
    console.error("GET /api/vendors/[slug]", error);

    return NextResponse.json(
      { message: "Unable to load vendor." },
      { status: 500 },
    );
  }
}