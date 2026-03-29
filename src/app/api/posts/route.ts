import { NextResponse } from "next/server";
import { getBlogPostsFromDB, getListPage, getSinglePage } from "@/lib/contentParser";
import config from "@/config/config.json";
import { BlogPost, BlogPage } from "@/types";

const { blog_folder } = config.settings;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    const dbPosts = getBlogPostsFromDB();
    let posts;
    
    if (dbPosts.length > 0) {
      posts = dbPosts.map((post) => ({
        slug: post.slug,
        frontmatter: post.frontmatter,
        content: post.content,
      }));
    } else {
      posts = getSinglePage<BlogPost["frontmatter"]>(blog_folder);
    }

    if (slug) {
      const post = posts.find(p => p.slug === slug);
      if (!post) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(post);
    }
    
    const postIndex = getListPage<BlogPage["frontmatter"]>(`${blog_folder}/_index.md`);

    return NextResponse.json({
      posts,
      postIndex,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
