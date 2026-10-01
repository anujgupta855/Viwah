import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { Enquiry, ContactMessage } from "../../../../../models";
import { getAdminSession } from "../../../../../lib/admin-auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: NextRequest,
  { params }: Params
) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const { status, source } = body;

    const allowedStatuses =
      source === "contact"
        ? ["new", "read", "accepted", "rejected", "replied", "closed"]
        : ["new", "read", "accepted", "rejected", "contacted", "closed"];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    await connectDB();

    if (source === "contact") {
      const item = await ContactMessage.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      ).lean();

      if (!item) {
        return NextResponse.json(
          { error: "Contact message not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        item,
      });
    }

    const item = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("vendor", "name")
      .populate("venue", "name")
      .lean();

    if (!item) {
      return NextResponse.json(
        { error: "Enquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("PUT /api/admin/enquiries/[id]", error);

    return NextResponse.json(
      { error: "Unable to update enquiry." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    const source = body?.source;

    await connectDB();

    if (source === "contact") {
      const deleted = await ContactMessage.findByIdAndDelete(id);

      if (!deleted) {
        return NextResponse.json(
          { error: "Contact message not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Contact message deleted.",
      });
    }

    const deleted = await Enquiry.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Enquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry deleted.",
    });
  } catch (error) {
    console.error("DELETE /api/admin/enquiries/[id]", error);

    return NextResponse.json(
      { error: "Unable to delete enquiry." },
      { status: 500 }
    );
  }
}