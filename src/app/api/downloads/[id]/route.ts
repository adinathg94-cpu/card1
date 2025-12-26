import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { cookies } from "next/headers";

// GET single download
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDB();
    const download = db
      .prepare("SELECT * FROM downloads WHERE id = ?")
      .get(parseInt(id));

    if (!download) {
      return NextResponse.json(
        { error: "Download not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(download);
  } catch (error) {
    console.error("Error fetching download:", error);
    return NextResponse.json(
      { error: "Failed to fetch download" },
      { status: 500 }
    );
  }
}

// PUT update download
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, url, file_size, file_type, description, date } = body;

    const db = getDB();
    db.prepare(
      `UPDATE downloads SET
        name = ?, url = ?, file_size = ?, file_type = ?,
        description = ?, date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`
    ).run(
      name,
      url,
      file_size || null,
      file_type || null,
      description || null,
      date || new Date().toISOString(),
      parseInt(id)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating download:", error);
    return NextResponse.json(
      { error: "Failed to update download" },
      { status: 500 }
    );
  }
}

// DELETE download
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = getDB();
    db.prepare("DELETE FROM downloads WHERE id = ?").run(parseInt(id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting download:", error);
    return NextResponse.json(
      { error: "Failed to delete download" },
      { status: 500 }
    );
  }
}

