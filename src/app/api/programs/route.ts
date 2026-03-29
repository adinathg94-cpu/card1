import { NextRequest, NextResponse } from "next/server";
import { getDB, serializeJSON, parseJSON } from "@/lib/db";
import { cookies } from "next/headers";

// GET all programs
export async function GET() {
  try {
    const db = getDB();
    const programs = db
      .prepare(
        "SELECT * FROM programs ORDER BY order_index ASC, created_at DESC"
      )
      .all() as any[];

    // Parse JSON categories field
    const parsedPrograms = programs.map((p) => ({
      ...p,
      categories: parseJSON<string[]>(p.categories) || [],
    }));

    return NextResponse.json(parsedPrograms);
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { error: "Failed to fetch programs" },
      { status: 500 }
    );
  }
}

// POST new program
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
      slug, title, description, content, image, 
      date, end_date, categories, goal, raised, 
      featured, order_index 
    } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { error: "Slug and title are required" },
        { status: 400 }
      );
    }

    const db = getDB();
    const result = db
      .prepare(
        `INSERT INTO programs (
          slug, title, description, content, image, 
          date, end_date, categories, goal, raised, 
          featured, order_index
        )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        slug,
        title,
        description || null,
        content || null,
        image || null,
        date || null,
        end_date || null,
        serializeJSON(categories || []),
        goal || '',
        raised || '',
        featured ? 1 : 0,
        order_index || 0
      );

    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    console.error("Error creating program:", error);
    return NextResponse.json(
      { error: "Failed to create program" },
      { status: 500 }
    );
  }
}
