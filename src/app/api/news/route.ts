import { NextRequest, NextResponse } from "next/server";
import { getDB, serializeJSON, parseJSON } from "@/lib/db";
import { cookies } from "next/headers";

// GET all blog posts
export async function GET(request: NextRequest) {
  try {
    const db = getDB();
    const { searchParams } = new URL(request.url);
    const includeDrafts = searchParams.get("includeDrafts") === "true";

    let query = "SELECT * FROM blog_posts";
    if (!includeDrafts) {
      query += " WHERE draft = 0";
    }
    query += " ORDER BY date DESC, created_at DESC";

    const posts = db.prepare(query).all() as any[];

    // Parse JSON fields
    const parsedPosts = posts.map((post) => ({
      ...post,
      categories: parseJSON<string[]>(post.categories) || [],
      frontmatter: parseJSON(post.frontmatter) || {},
      draft: Boolean(post.draft),
      featured: Boolean(post.featured),
    }));

    return NextResponse.json(parsedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST new blog post
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

    if (!slug || !title) {
      return NextResponse.json(
        { error: "Slug and title are required" },
        { status: 400 }
      );
    }

    const db = getDB();
    const result = db
      .prepare(
        `INSERT INTO blog_posts (
        slug, title, description, content, image, date, categories,
        draft, featured, meta_title, meta_description, frontmatter
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
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
        serializeJSON({})
      );

    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error: any) {
    console.error("Error creating post:", error);
    if (error.message?.includes("UNIQUE constraint")) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

