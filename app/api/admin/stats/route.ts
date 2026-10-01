import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import {
  Enquiry,
  ContactMessage,
  Review,
  Vendor,
  Venue,
} from "../../../../models";
import { getAdminSession } from "../../../../lib/admin-auth";

export async function GET() {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // Active enquiries only.
    // Accepted / rejected / closed enquiries are not counted
    // as pending admin enquiries.
    const enquiryActiveFilter = {
      status: {
        $in: ["new", "read", "contacted"],
      },
    };

    // Active contact messages.
    // Accepted / rejected / closed are removed from active count.
    const contactActiveFilter = {
      status: {
        $in: ["new", "read", "replied"],
      },
    };

    const [
      vendors,
      venues,
      reviews,
      enquiryCount,
      contactCount,
      activeVendors,
      activeVenues,
      recentVendors,
      recentReviews,
      recentEnquiries,
      recentContactMessages,
    ] = await Promise.all([
      Vendor.countDocuments(),

      Venue.countDocuments(),

      Review.countDocuments(),

      Enquiry.countDocuments(enquiryActiveFilter),

      ContactMessage.countDocuments(contactActiveFilter),

      Vendor.countDocuments({
        status: "active",
      }),

      Venue.countDocuments({
        status: "active",
      }),

      // Latest vendors
      Vendor.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "name category city status createdAt"
        )
        .lean(),

      // Latest reviews
      Review.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "userName rating status comment createdAt"
        )
        .lean(),

      // Latest marketplace enquiries
      Enquiry.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("vendor", "name")
        .populate("venue", "name")
        .select(
          "name email status createdAt vendor venue eventDate message"
        )
        .lean(),

      // Latest contact-form messages
      ContactMessage.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select(
          "name email phone subject message status createdAt"
        )
        .lean(),
    ]);

    /*
     * Convert contact messages to the same shape
     * used by the dashboard's Recent enquiries section.
     */
    const contactItems = recentContactMessages.map(
      (item: any) => ({
        ...item,
        source: "contact",
        vendor: null,
        venue: null,
        eventDate: null,
      })
    );

    const enquiryItems = recentEnquiries.map(
      (item: any) => ({
        ...item,
        source: "enquiry",
      })
    );

    /*
     * Combine both types and show the latest 5.
     */
    const recentCombinedEnquiries = [
      ...enquiryItems,
      ...contactItems,
    ]
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    const enquiries =
      enquiryCount + contactCount;

    return NextResponse.json({
      stats: {
        vendors,
        venues,
        reviews,
        enquiries,
        activeVendors,
        activeVenues,
      },

      recent: {
        vendors: recentVendors,
        reviews: recentReviews,
        enquiries: recentCombinedEnquiries,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/admin/stats",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load dashboard data.",
      },
      { status: 500 }
    );
  }
}