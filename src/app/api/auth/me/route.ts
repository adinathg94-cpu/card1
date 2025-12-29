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

    // Validate session token from database
    const db = getDB();

    // Clean up expired sessions first
    db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();

    // Check if session exists and is valid
    const session = db
      .prepare(
        `SELECT s.user_id, u.username 
         FROM sessions s 
         JOIN users u ON s.user_id = u.id 
         WHERE s.session_token = ? AND s.expires_at > datetime('now')`
      )
      .get(sessionToken) as
      | { user_id: number; username: string }
      | undefined;

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: { id: session.user_id, username: session.username },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

