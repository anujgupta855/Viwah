import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Admin } from "../../../../models";
import {
  createSessionToken,
  verifyPassword,
  ADMIN_COOKIE,
} from "../../../../lib/admin-auth";
import { rateLimit } from "../../../../lib/rate-limit";

export async function POST(request: Request) {
  try {
    // Rate limiting
    const forwarded = request.headers
      .get("x-forwarded-for")
      ?.split(",")[0]
      ?.trim();

    const ip =
      forwarded ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const limiter = rateLimit(
      `admin-login:${ip}`,
      8,
      10 * 60 * 1000,
    );

    if (!limiter.allowed) {
      return NextResponse.json(
        {
          error:
            "Too many login attempts. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "600",
          },
        },
      );
    }

    // Parse request body
    const body = await request.json();

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    const password = String(body.password ?? "");

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required.",
        },
        { status: 400 },
      );
    }

    // Password length validation
    if (password.length < 8) {
      return NextResponse.json(
        {
          error: "Password must be at least 8 characters.",
        },
        { status: 400 },
      );
    }

    if (password.length > 128) {
      return NextResponse.json(
        {
          error: "Password must not exceed 128 characters.",
        },
        { status: 400 },
      );
    }

    // Connect database
    await connectDB();

    // Find active admin
    const admin = await Admin.findOne({
      email,
      active: true,
    }).lean();

    // Verify credentials
    if (
      !admin ||
      !verifyPassword(password, admin.passwordHash)
    ) {
      return NextResponse.json(
        {
          error: "Invalid admin credentials.",
        },
        { status: 401 },
      );
    }

    // Create session
    const token = createSessionToken({
      id: String(admin._id),
      email: admin.email,
      exp: Date.now() + 1000 * 60 * 60 * 8,
    });

    // Set secure HTTP-only cookie
    const response = NextResponse.json({
      ok: true,
    });

    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        error: "Unable to sign in.",
      },
      { status: 500 },
    );
  }
}