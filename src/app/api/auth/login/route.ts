import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDB } from "@/lib/db";
import { cookies } from "next/headers";
import { checkRateLimit, createRateLimitHeaders } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Check rate limit: 5 login attempts per 15 minutes
  const rateLimit = checkRateLimit(request, {
    maxRequests: 5,
    windowSeconds: 15 * 60, // 15 minutes
  });

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: createRateLimitHeaders(rateLimit)
      }
    );
  }

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const db = getDB();
    const user = db
      .prepare("SELECT id, username, password_hash FROM users WHERE username = ?")
      .get(username) as
      | { id: number; username: string; password_hash: string }
      | undefined;

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create session token with cryptographically secure random bytes
    const crypto = await import('crypto');
    const sessionToken = crypto.randomBytes(32).toString('base64url');

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

