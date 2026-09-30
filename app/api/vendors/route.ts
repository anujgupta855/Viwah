import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Vendor } from "@/models";

export const dynamic = "force-dynamic";

const categoryMap: Record<string, string> = {
  photographer: "Photographer",
  "makeup artist": "Makeup Artist",
  makeup: "Makeup Artist",
  decor: "Decorator",
  decorator: "Decorator",
  catering: "Caterer",
  caterer: "Caterer",
  mehendi: "Mehendi Artist",
  "mehendi artist": "Mehendi Artist",
  dj: "DJ",
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = request.nextUrl;

    const q = searchParams.get("q")?.trim();
    const city = searchParams.get("city")?.trim();
    const categoryParam = searchParams
      .get("category")
      ?.trim()
      .toLowerCase();

    const minPrice = Number(searchParams.get("minPrice") || 0);
    const maxPrice = Number(searchParams.get("maxPrice") || 0);
    const minRating = Number(searchParams.get("minRating") || 0);

    const sort = searchParams.get("sort") || "featured";

    const page = Math.max(
      1,
      Number(searchParams.get("page") || 1)
    );

    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") || 12))
    );

    const filter: Record<string, unknown> = {
      status: "active",
    };

    if (city) {
      filter.city = city;
    }

    if (categoryParam) {
      filter.category =
        categoryMap[categoryParam] || categoryParam;
    }

    if (minPrice > 0 || maxPrice > 0) {
      filter.startingPrice = {
        ...(minPrice > 0 ? { $gte: minPrice } : {}),
        ...(maxPrice > 0 ? { $lte: maxPrice } : {}),
      };
    }

    if (minRating > 0) {
      filter.rating = { $gte: minRating };
    }

    if (q) {
      filter.$text = { $search: q };
    }

    const sortMap: Record<
      string,
      Record<string, 1 | -1>
    > = {
      featured: {
        featured: -1,
        rating: -1,
        createdAt: -1,
      },
      rating: {
        rating: -1,
        reviewCount: -1,
      },
      price_asc: {
        startingPrice: 1,
      },
      price_desc: {
        startingPrice: -1,
      },
      popular: {
        reviewCount: -1,
        rating: -1,
      },
    };

    const [items, total] = await Promise.all([
      Vendor.find(filter)
        .sort(sortMap[sort] || sortMap.featured)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Vendor.countDocuments(filter),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/vendors", error);

    return NextResponse.json(
      { message: "Unable to load vendors." },
      { status: 500 }
    );
  }
}