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
      console.log(`Login failed: User '${username}' not found in DB`);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      console.log(`Login failed: Password mismatch for user '${username}'`);
      console.log(`Provided password: '${password}'`);
      console.log(`Stored hash: '${user.password_hash}'`);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token (stateless, works in serverless environments)
    const { generateToken } = await import("@/lib/jwt");
    const token = generateToken(user.id, user.username);

    // Set cookie with JWT token
    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
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

