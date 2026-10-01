import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { Venue } from "../../../../../models";
import { getAdminSession } from "../../../../../lib/admin-auth";
import { z } from "zod";

const youtubeVideoSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
});

const schema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  location: z.string().min(2),
  description: z.string().min(10),
  images: z.array(z.string().url()),
  youtubeVideos: z.array(youtubeVideoSchema).default([]),
  startingPrice: z.coerce.number().min(0),
  capacity: z.coerce.number().min(1),
  venueType: z.enum([
    "Banquet Hall",
    "Wedding Lawn",
    "Resort",
    "Hotel",
    "Farmhouse",
    "Palace",
  ]),
  amenities: z.array(z.string()),
  rating: z.coerce.number().min(0).max(5),
  reviewCount: z.coerce.number().min(0),
  featured: z.boolean(),
  status: z.enum(["active", "inactive"]),
});

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  await connectDB();

  const { id } = await params;

  const item = await Venue.findById(id).lean();

  if (!item) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ item });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    await connectDB();

    const { id } = await params;

    const data = schema.parse(await request.json());

    const existing = await Venue.findById(id);

    if (!existing) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 },
      );
    }

    let slug = slugify(data.name);

    if (
      await Venue.findOne({
        slug,
        _id: { $ne: id },
      })
    ) {
      slug = `${slug}-${String(id).slice(-5)}`;
    }

    const item = await Venue.findByIdAndUpdate(
      id,
      {
        ...data,
        slug,
      },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    return NextResponse.json({ item });
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof Error
            ? e.message
            : "Invalid venue data",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  await connectDB();

  const { id } = await params;

  const item = await Venue.findByIdAndDelete(id);

  if (!item) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}