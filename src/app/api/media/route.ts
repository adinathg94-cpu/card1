import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { cookies } from "next/headers";

// GET all media items
export async function GET(request: NextRequest) {
  try {
    const db = getDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    let query = "SELECT * FROM media_items";
    if (type) {
      query += " WHERE type = ?";
    }
    query += " ORDER BY order_index ASC, created_at DESC";

    const items = type
      ? db.prepare(query).all(type)
      : db.prepare(query).all();

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching media items:", error);
    return NextResponse.json(
      { error: "Failed to fetch media items" },
      { status: 500 }
    );
  }
}

// POST new media item
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    if (!type || !title) {
      return NextResponse.json(
        { error: "Type and title are required" },
        { status: 400 }
      );
    }

    const db = getDB();
    const result = db
      .prepare(
        `INSERT INTO media_items (type, title, description, image, link, embed_id, thumbnail, order_index)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        type,
        title,
        description || null,
        image || null,
        link || null,
        embed_id || null,
        thumbnail || null,
        order_index || 0
      );

    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    console.error("Error creating media item:", error);
    return NextResponse.json(
      { error: "Failed to create media item" },
      { status: 500 }
    );
  }
}

