import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { cookies } from "next/headers";

// GET all administration members
export async function GET() {
  try {
    const db = getDB();
    const members = db
      .prepare(
        "SELECT * FROM administration_members ORDER BY order_index ASC, created_at ASC"
      )
      .all();

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

// POST new administration member
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, designation, image, is_lead_team, bio, order_index } = body;

    if (!name || !designation) {
      return NextResponse.json(
        { error: "Name and designation are required" },
        { status: 400 }
      );
    }

    const db = getDB();
    const result = db
      .prepare(
        `INSERT INTO administration_members (name, designation, image, is_lead_team, bio, order_index)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        name,
        designation,
        image || null,
        is_lead_team ? 1 : 0,
        bio || null,
        order_index || 0
      );

    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500 }
    );
  }
}

