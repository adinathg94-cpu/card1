import BlogCard from "@/components/BlogCard";
import Pagination from "@/components/Pagination";
import TitleBadge from "@/components/TitleBadge";
import config from "@/config/config.json";
import SeoMeta from "@/partials/SeoMeta";
import { sortByDate } from "@/lib/utils/sortFunctions";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionSecondary from "@/partials/CallToActionSecondary";
import { BlogPage, BlogPost } from "@/types";

const { blog_folder } = config.settings;

import { headers } from "next/headers";

export default async function BlogIndexPage() {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  // Try database API first
  let posts: any[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/news`, { cache: "no-store" });
    if (res.ok) {
      const dbPosts = await res.json();
      posts = dbPosts.map((post: any) => ({
        slug: post.slug,
        frontmatter: post.frontmatter,
        content: post.content,
      }));
    }
  } catch (error) {
    console.error("Error fetching news from API:", error);
  }

  // Fallback to markdown API if no posts found
  if (posts.length === 0) {
    try {
      const res = await fetch(`${baseUrl}/api/posts?folder=${blog_folder}`, {
        cache: "no-store",
      });
      if (res.ok) {
        posts = await res.json();
      }
    } catch (error) {
      console.error("Error fetching posts from API:", error);
    }
  }

  // Fetch index page data via API
  let postIndex: any = { frontmatter: {} };
  try {
    const res = await fetch(
      `${baseUrl}/api/posts?folder=${blog_folder}&isList=true`,
      { cache: "no-store" }
    );
    if (res.ok) {
      postIndex = await res.json();
    }
  } catch (error) {
    console.error("Error fetching post index from API:", error);
  }

  const { badge, title, description, meta_title, image } =
    postIndex.frontmatter;
  const sortedPosts = sortByDate(posts);
  const totalPages = Math.ceil(posts.length / config.settings.pagination);
  const currentPosts = sortedPosts.slice(0, config.settings.pagination);

  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        image={image}
        description={description}
      />
      <section className="section-lg">
        <div className="container">
          <div data-aos="fade-up-sm" data-aos-delay="100" className="row justify-center">
            <div className="col-10 lg:col-6">
              {badge && badge.enable && (
                <TitleBadge
                  icon={badge.icon}
                  label={badge.label}
                  bg_color={badge.bg_color}
                />
              )}
              <h2 className="py-4 text-center" dangerouslySetInnerHTML={markdownify(title || "")} />
              <p className="text-center text-balance" dangerouslySetInnerHTML={markdownify(description || "")} />
            </div>
          </div>
          <div className="row mt-14">
            {currentPosts.map((post, i) => {
              const aosDelay = 100 * (i % 2);
              return (
                <div key={post.slug} className="mb-14 md:col-6">
                  <BlogCard data={post} aosDelay={aosDelay} />
                </div>
              );
            })}
            <Pagination
              section={blog_folder}
              currentPage={1}
              totalPages={totalPages}
            />
          </div>
        </div>
      </section>
      <CallToActionSecondary isNoSectionTop />
    </>
  );
}