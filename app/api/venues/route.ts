import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Venue } from "@/models";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = request.nextUrl;
    const q = searchParams.get("q")?.trim();
    const city = searchParams.get("city")?.trim();
    const venueType = searchParams.get("venueType")?.trim();
    const minPrice = Number(searchParams.get("minPrice") || 0);
    const maxPrice = Number(searchParams.get("maxPrice") || 0);
    const minCapacity = Number(searchParams.get("minCapacity") || 0);
    const minRating = Number(searchParams.get("minRating") || 0);
    const sort = searchParams.get("sort") || "featured";
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 12)));

    const filter: Record<string, unknown> = { status: "active" };
    if (city) filter.city = city;
    if (venueType) filter.venueType = venueType;
    if (minPrice > 0 || maxPrice > 0) filter.startingPrice = { ...(minPrice > 0 ? { $gte: minPrice } : {}), ...(maxPrice > 0 ? { $lte: maxPrice } : {}) };
    if (minCapacity > 0) filter.capacity = { $gte: minCapacity };
    if (minRating > 0) filter.rating = { $gte: minRating };
    if (q) filter.$text = { $search: q };

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      featured: { featured: -1, rating: -1, createdAt: -1 },
      rating: { rating: -1, reviewCount: -1 },
      price_asc: { startingPrice: 1 },
      price_desc: { startingPrice: -1 },
      popular: { reviewCount: -1, rating: -1 },
    };
    const [items, total] = await Promise.all([
      Venue.find(filter).sort(sortMap[sort] || sortMap.featured).skip((page - 1) * limit).limit(limit).lean(),
      Venue.countDocuments(filter),
    ]);
    return NextResponse.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error("GET /api/venues", error);
    return NextResponse.json({ message: "Unable to load venues." }, { status: 500 });
  }
}
