import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDB } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // In a production app, you'd validate the session token properly
    // For now, we'll just check if it exists and get user info
    const db = getDB();
    // Extract user ID from session (simplified - in production use proper session management)
    try {
      const decoded = Buffer.from(sessionToken, "base64").toString();
      const userId = parseInt(decoded.split(":")[0]);

      const user = db
        .prepare("SELECT id, username FROM users WHERE id = ?")
        .get(userId) as { id: number; username: string } | undefined;

      if (!user) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
      }

      return NextResponse.json({
        authenticated: true,
        user: { id: user.id, username: user.username },
      });
    } catch {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

