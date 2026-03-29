import { NextRequest, NextResponse } from "next/server";
import { getSinglePage, getListPage } from "@/lib/contentParser";
import config from "@/config/config.json";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder") || config.settings.blog_folder;
    const isList = searchParams.get("isList") === "true";
    const slug = searchParams.get("slug");
    const file = searchParams.get("file");

    if (file) {
      const pageData = getListPage(file);
      return NextResponse.json(pageData);
    }

    if (isList) {
      const pageData = getListPage(`${folder}/_index.md`);
      return NextResponse.json(pageData);
    }

    const posts = getSinglePage(folder);

    if (slug) {
      const post = posts.find((p) => p.slug === slug);
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      return NextResponse.json(post);
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error in posts API:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
