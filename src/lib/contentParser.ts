import fs from "fs";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import path from "path";
import { getDB, parseJSON } from "./db";

const contentPath = "src/content";

// Helper function to read file content
const readFile = (filePath: string) => {
  return fs.readFileSync(filePath, "utf-8");
};

// Helper function to parse frontmatter
const parseFrontmatter = <T>(frontmatter: T): T => {
  const frontmatterString = JSON.stringify(frontmatter);
  return JSON.parse(frontmatterString);
};

// get list page data, ex: _index.md
export const getListPage = <T>(filePath: string) => {
  const pageDataPath = path.join(process.cwd(), contentPath, filePath);

  if (!fs.existsSync(pageDataPath)) {
    notFound();
  }

  const pageData = readFile(pageDataPath);
  const { content, data: frontmatter } = matter(pageData);

  return {
    frontmatter: parseFrontmatter<T>(frontmatter as T) as T,
    content,
  };
};

// get all single pages, ex: blog/post.md
export const getSinglePage = <T extends Record<string, any>>(
  folder: string
) => {
  const folderPath = path.join(contentPath, folder);

  if (!fs.existsSync(folderPath) || !fs.lstatSync(folderPath).isDirectory()) {
    notFound();
  }

  const filesPath = fs.readdirSync(folderPath);
  const sanitizeFiles = filesPath.filter((file) => file.endsWith(".md"));
  const filterSingleFiles = sanitizeFiles.filter((file) =>
    file.match(/^(?!_)/)
  );

  const singlePages = filterSingleFiles.map((filename) => {
    const slug = filename.replace(".md", "");
    const filePath = path.join(folderPath, filename);
    const pageData = readFile(filePath);
    const { content, data: frontmatter } = matter(pageData);
    const url = frontmatter.url ? frontmatter.url.replace("/", "") : slug;

    return {
      frontmatter: parseFrontmatter(frontmatter) as T,
      slug: url,
      content,
    };
  });

  const publishedPages = singlePages.filter(
    (page) => !page.frontmatter.draft && page
  );
  const filterByDate = publishedPages.filter(
    (page) => new Date(page.frontmatter.date || new Date()) <= new Date()
  );

  return filterByDate;
};

// Database fetching functions for CMS-managed content

// Get blog posts from database
export const getBlogPostsFromDB = () => {
  try {
    const db = getDB();
    const posts = db
      .prepare("SELECT * FROM blog_posts WHERE draft = 0 ORDER BY date DESC, created_at DESC")
      .all() as any[];

    return posts.map((post: any) => ({
      slug: post.slug,
      frontmatter: {
        title: post.title,
        description: post.description,
        image: post.image,
        date: post.date,
        categories: parseJSON<string[]>(post.categories) || [],
        draft: Boolean(post.draft),
        featured: Boolean(post.featured),
        meta_title: post.meta_title,
        meta_description: post.meta_description,
      },
      content: post.content || "",
    }));
  } catch (error) {
    console.error("Error fetching blog posts from DB:", error);
    return [];
  }
};

// Get single blog post from database
export const getBlogPostFromDB = (slug: string) => {
  try {
    const db = getDB();
    const post = db
      .prepare("SELECT * FROM blog_posts WHERE slug = ? AND draft = 0")
      .get(slug) as any;

    if (!post) {
      return null;
    }

    return {
      slug: post.slug,
      frontmatter: {
        title: post.title,
        description: post.description,
        image: post.image,
        date: post.date,
        categories: parseJSON<string[]>(post.categories) || [],
        draft: Boolean(post.draft),
        featured: Boolean(post.featured),
        meta_title: post.meta_title,
        meta_description: post.meta_description,
      },
      content: post.content || "",
    };
  } catch (error) {
    console.error("Error fetching blog post from DB:", error);
    return null;
  }
};

// Get downloads from database
export const getDownloadsFromDB = () => {
  try {
    const db = getDB();
    const downloads = db
      .prepare("SELECT * FROM downloads ORDER BY date DESC, created_at DESC")
      .all() as any[];

    return downloads.map((download: any) => ({
      name: download.name,
      url: download.url,
      file_size: download.file_size,
      file_type: download.file_type,
      description: download.description,
      date: download.date,
    }));
  } catch (error) {
    console.error("Error fetching downloads from DB:", error);
    return [];
  }
};

// Get administration members from database
export const getAdministrationMembersFromDB = () => {
  try {
    const db = getDB();
    const members = db
      .prepare(
        "SELECT * FROM administration_members ORDER BY order_index ASC, created_at ASC"
      )
      .all() as any[];

    return members.map((member: any) => ({
      name: member.name,
      designation: member.designation,
      image: member.image,
      is_lead_team: Boolean(member.is_lead_team),
      bio: member.bio,
      order_index: member.order_index,
    }));
  } catch (error) {
    console.error("Error fetching administration members from DB:", error);
    return [];
  }
};

// Get media items from database
export const getMediaItemsFromDB = (type?: string) => {
  try {
    const db = getDB();
    let query = "SELECT * FROM media_items";
    if (type) {
      query += " WHERE type = ?";
    }
    query += " ORDER BY order_index ASC, created_at DESC";

    const items = type
      ? (db.prepare(query).all(type) as any[])
      : (db.prepare(query).all() as any[]);

    return items.map((item: any) => ({
      type: item.type,
      title: item.title,
      description: item.description,
      image: item.image,
      link: item.link,
      embed_id: item.embed_id,
      thumbnail: item.thumbnail,
      order_index: item.order_index,
    }));
  } catch (error) {
    console.error("Error fetching media items from DB:", error);
    return [];
  }
};
