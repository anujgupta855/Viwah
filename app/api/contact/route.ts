import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { ContactMessage } from "@/models";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email(),
  phone: z.string().trim().min(7).max(20),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(3000),
});

export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ message: "Please complete all fields correctly." }, { status: 400 });
    await connectDB();
    const item = await ContactMessage.create(parsed.data);
    return NextResponse.json({ message: "Thanks — your message has been received.", id: item._id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/contact", error);
    return NextResponse.json({ message: "Unable to send your message right now." }, { status: 500 });
  }
}
