import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Admin, Enquiry, Review, Vendor, Venue } from "../../../../models";
import { getAdminSession } from "../../../../lib/admin-auth";
export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const [vendors, venues, reviews, enquiries, activeVendors, activeVenues, recentVendors, recentReviews, recentEnquiries] = await Promise.all([
    Vendor.countDocuments(), Venue.countDocuments(), Review.countDocuments(), Enquiry.countDocuments(), Vendor.countDocuments({ status: "active" }), Venue.countDocuments({ status: "active" }),
    Vendor.find().sort({ createdAt: -1 }).limit(5).select("name category city status createdAt").lean(),
    Review.find().sort({ createdAt: -1 }).limit(5).select("userName rating status comment createdAt").lean(),
    Enquiry.find().sort({ createdAt: -1 }).limit(5).populate("vendor", "name").populate("venue", "name").select("name email status createdAt vendor venue").lean(),
  ]);
  return NextResponse.json({ stats: { vendors, venues, reviews, enquiries, activeVendors, activeVenues }, recent: { vendors: recentVendors, reviews: recentReviews, enquiries: recentEnquiries } });
}
