import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// GET single administration member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDB();
    const member = db
      .prepare("SELECT * FROM administration_members WHERE id = ?")
      .get(parseInt(id));

    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("Error fetching member:", error);
    return NextResponse.json(
      { error: "Failed to fetch member" },
      { status: 500 }
    );
  }
}

// PUT update administration member
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
    const { name, designation, image, is_lead_team, bio, order_index } = body;

    const db = getDB();
    db.prepare(
      `UPDATE administration_members SET
        name = ?, designation = ?, image = ?, is_lead_team = ?,
        bio = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`
    ).run(
      name,
      designation,
      image || null,
      is_lead_team ? 1 : 0,
      bio || null,
      order_index || 0,
      parseInt(id)
    );

    // Revalidate the cached team page
    try {
      revalidatePath("/teams", "page");
    } catch {
       // ignore
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 }
    );
  }
}

// DELETE administration member
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
    db.prepare("DELETE FROM administration_members WHERE id = ?").run(
      parseInt(id)
    );

    // Revalidate the cached team page
    try {
       revalidatePath("/teams", "page");
    } catch {
       // ignore
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 }
    );
  }
}

