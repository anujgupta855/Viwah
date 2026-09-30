import { NextRequest, NextResponse } from "next/server";

const COOKIE = "viwah_admin_session";

async function validSession(token: string | undefined) {
  const secret = process.env.AUTH_SECRET;
  if (!secret || !token) return false;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const expected = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(encoded),
  );

  const actual = Uint8Array.from(
    atob(
      signature
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(Math.ceil(signature.length / 4) * 4, "="),
    ),
    (c) => c.charCodeAt(0),
  );

  const expectedBytes = new Uint8Array(expected);

  if (actual.length !== expectedBytes.length) return false;

  let diff = 0;

  for (let i = 0; i < actual.length; i++) {
    diff |= actual[i] ^ expectedBytes[i];
  }

  if (diff !== 0) return false;

  try {
    const json = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(
          atob(
            encoded
              .replace(/-/g, "+")
              .replace(/_/g, "/")
              .padEnd(Math.ceil(encoded.length / 4) * 4, "="),
          ),
          (c) => c.charCodeAt(0),
        ),
      ),
    );

    return Boolean(
      json?.id &&
      json?.email &&
      json?.exp > Date.now(),
    );
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public admin authentication pages
  // These pages must work without an existing admin session.
  if (
    !path.startsWith("/admin") ||
    path === "/admin/login" ||
    path === "/admin/reset-password"
  ) {
    return NextResponse.next();
  }

  // All other /admin routes require a valid session.
  const ok = await validSession(
    request.cookies.get(COOKIE)?.value,
  );

  if (ok) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();

  url.pathname = "/admin/login";
  url.searchParams.set("next", path);

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};