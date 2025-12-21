import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { cookies } from "next/headers";

// GET single media item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDB();
    const item = db
      .prepare("SELECT * FROM media_items WHERE id = ?")
      .get(parseInt(id));

    if (!item) {
      return NextResponse.json(
        { error: "Media item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching media item:", error);
    return NextResponse.json(
      { error: "Failed to fetch media item" },
      { status: 500 }
    );
  }
}

// PUT update media item
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
    const {
      type,
      title,
      description,
      image,
      link,
      embed_id,
      thumbnail,
      order_index,
    } = body;

    const db = getDB();
    db.prepare(
      `UPDATE media_items SET
        type = ?, title = ?, description = ?, image = ?,
        link = ?, embed_id = ?, thumbnail = ?, order_index = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`
    ).run(
      type,
      title,
      description || null,
      image || null,
      link || null,
      embed_id || null,
      thumbnail || null,
      order_index || 0,
      parseInt(id)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating media item:", error);
    return NextResponse.json(
      { error: "Failed to update media item" },
      { status: 500 }
    );
  }
}

// DELETE media item
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
    db.prepare("DELETE FROM media_items WHERE id = ?").run(parseInt(id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting media item:", error);
    return NextResponse.json(
      { error: "Failed to delete media item" },
      { status: 500 }
    );
  }
}
