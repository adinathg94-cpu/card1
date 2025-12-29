import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  // Delete JWT cookie (tokens are stateless, no database cleanup needed)
  cookieStore.delete("admin_session");

  return NextResponse.json({ success: true });
}
