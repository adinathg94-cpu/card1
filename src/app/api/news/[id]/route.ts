import { NextRequest, NextResponse } from "next/server";
import { getDB, serializeJSON, parseJSON } from "@/lib/db";
import { cookies } from "next/headers";

// GET single blog post (by numeric ID or slug)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDB();

    // Support lookup by slug (string) or numeric ID
    const isNumeric = /^\d+$/.test(id);
    const post = isNumeric
      ? (db.prepare("SELECT * FROM blog_posts WHERE id = ?").get(parseInt(id)) as any)
      : (db.prepare("SELECT * FROM blog_posts WHERE slug = ?").get(id) as any);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Parse JSON fields
    const parsedPost = {
      ...post,
      categories: parseJSON<string[]>(post.categories) || [],
      frontmatter: parseJSON(post.frontmatter) || {},
      draft: Boolean(post.draft),
      featured: Boolean(post.featured),
    };

    return NextResponse.json(parsedPost);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT update blog post
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
      slug,
      title,
      description,
      content,
      image,
      date,
      categories,
      draft,
      featured,
      meta_title,
      meta_description,
    } = body;

    const db = getDB();
    db.prepare(
      `UPDATE blog_posts SET
        slug = ?, title = ?, description = ?, content = ?, image = ?,
        date = ?, categories = ?, draft = ?, featured = ?,
        meta_title = ?, meta_description = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`
    ).run(
      slug,
      title,
      description || null,
      content || null,
      image || null,
      date || new Date().toISOString(),
      serializeJSON(categories || []),
      draft ? 1 : 0,
      featured ? 1 : 0,
      meta_title || null,
      meta_description || null,
      parseInt(id)
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating post:", error);
    if (error.message?.includes("UNIQUE constraint")) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE blog post
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
    db.prepare("DELETE FROM blog_posts WHERE id = ?").run(parseInt(id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

