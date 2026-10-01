import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { Review } from "../../../../../models";
import { getAdminSession } from "../../../../../lib/admin-auth";
import { syncReviewStats } from "../../../../../lib/review-stats";
export async function PUT(request:Request,{params}:{params:Promise<{id:string}>}){if(!(await getAdminSession()))return NextResponse.json({error:"Unauthorized"},{status:401});const {status}=await request.json();if(!["pending","approved","rejected"].includes(status))return NextResponse.json({error:"Invalid status"},{status:400});await connectDB();const item=await Review.findByIdAndUpdate((await params).id,{status},{new:true}).lean();if(!item)return NextResponse.json({error:"Not found"},{status:404});return NextResponse.json({item});}
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

  // First fetch the review so we know whether
  // it belongs to a venue or a vendor.
  const item = await Review.findById(id);

  if (!item) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 },
    );
  }

  const venueId = item.venue?.toString();
  const vendorId = item.vendor?.toString();

  // Delete the review.
  await Review.findByIdAndDelete(id);

  // Recalculate rating and review count
  // after deletion.
  if (venueId) {
    await syncReviewStats("venue", venueId);
  }

  if (vendorId) {
    await syncReviewStats("vendor", vendorId);
  }

  return NextResponse.json({ ok: true });
}