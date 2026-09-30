import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Enquiry } from "@/models";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email(),
  phone: z.string().trim().min(7).max(20),
  eventDate: z.string().optional(),
  message: z.string().trim().min(10).max(2000),
  vendorId: z.string().optional(),
  venueId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ message: "Please check the form details.", errors: parsed.error.flatten() }, { status: 400 });
    await connectDB();
    const { vendorId, venueId, eventDate, ...rest } = parsed.data;
    const enquiry = await Enquiry.create({ ...rest, vendor: vendorId || null, venue: venueId || null, eventDate: eventDate ? new Date(eventDate) : null });
    return NextResponse.json({ message: "Enquiry submitted successfully.", id: enquiry._id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/enquiries", error);
    return NextResponse.json({ message: "Unable to submit enquiry right now." }, { status: 500 });
  }
}
