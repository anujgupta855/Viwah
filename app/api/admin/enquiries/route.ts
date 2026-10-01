import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Enquiry, ContactMessage } from "../../../../models";
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

    const [enquiries, contactMessages] = await Promise.all([
      Enquiry.find()
        .sort({ createdAt: -1 })
        .limit(200)
        .populate("vendor", "name")
        .populate("venue", "name")
        .lean(),

      ContactMessage.find()
        .sort({ createdAt: -1 })
        .limit(200)
        .lean(),
    ]);

    const enquiryItems = enquiries.map((item: any) => ({
      ...item,
      source: "enquiry",
      subject: null,
    }));

    const contactItems = contactMessages.map((item: any) => ({
      ...item,
      source: "contact",
      vendor: null,
      venue: null,
      eventDate: null,
    }));

    const items = [...enquiryItems, ...contactItems]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 200);

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/admin/enquiries", error);

    return NextResponse.json(
      { error: "Unable to load enquiries." },
      { status: 500 }
    );
  }
}