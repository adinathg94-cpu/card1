import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { cookies } from "next/headers";

// GET all downloads
export async function GET() {
  try {
    const db = getDB();
    const downloads = db
      .prepare("SELECT * FROM downloads ORDER BY date DESC, created_at DESC")
      .all();

    return NextResponse.json(downloads);
  } catch (error) {
    console.error("Error fetching downloads:", error);
    return NextResponse.json(
      { error: "Failed to fetch downloads" },
      { status: 500 }
    );
  }
}

// POST new download
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, url, file_size, file_type, description, date } = body;

    if (!name || !url) {
      return NextResponse.json(
        { error: "Name and URL are required" },
        { status: 400 }
      );
    }

    const db = getDB();
    const result = db
      .prepare(
        `INSERT INTO downloads (name, url, file_size, file_type, description, date)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        name,
        url,
        file_size || null,
        file_type || null,
        description || null,
        date || new Date().toISOString()
      );

    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    console.error("Error creating download:", error);
    return NextResponse.json(
      { error: "Failed to create download" },
      { status: 500 }
    );
  }
}
