import { NextRequest, NextResponse } from "next/server";
import { getDB, serializeJSON } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// GET single program
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDB();
    const program = db
      .prepare("SELECT * FROM programs WHERE id = ? OR slug = ?")
      .get(id, id);

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json(program);
  } catch (error) {
    console.error("Error fetching program:", error);
    return NextResponse.json(
      { error: "Failed to fetch program" },
      { status: 500 }
    );
  }
}

// PUT update program
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const db = getDB();
    const result = db
      .prepare(
        `UPDATE programs 
         SET slug = ?, title = ?, description = ?, content = ?, image = ?, 
             date = ?, end_date = ?, categories = ?, goal = ?, raised = ?, 
             featured = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
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
        order_index || 0,
        id
      );

    if (result.changes === 0) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Revalidate the cached pages so changes show immediately (ISR)
    try {
      revalidatePath(`/programs/${slug}`, "page");
      revalidatePath("/programs", "page");
    } catch {
      // ignore revalidation errors — not critical
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating program:", error);
    return NextResponse.json(
      { error: "Failed to update program" },
      { status: 500 }
    );
  }
}

// DELETE program
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check authentication
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDB();
    const result = db.prepare("DELETE FROM programs WHERE id = ?").run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting program:", error);
    return NextResponse.json(
      { error: "Failed to delete program" },
      { status: 500 }
    );
  }
}
