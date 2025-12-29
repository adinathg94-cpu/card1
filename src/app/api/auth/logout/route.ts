import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDB } from "@/lib/db";

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  // Delete session from database if it exists
  if (sessionToken) {
    const db = getDB();
    db.prepare("DELETE FROM sessions WHERE session_token = ?").run(sessionToken);
  }

  // Delete cookie
  cookieStore.delete("admin_session");

  return NextResponse.json({ success: true });
}


