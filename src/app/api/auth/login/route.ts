import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDB } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
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

    // Create session token (simple approach - in production, use JWT or proper session store)
    const sessionToken = Buffer.from(
      `${user.id}:${Date.now()}:${Math.random()}`
    ).toString("base64");

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
