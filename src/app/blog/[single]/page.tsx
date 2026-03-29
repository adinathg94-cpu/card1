import { notFound } from "next/navigation";
import BlogCard from "@/components/BlogCard";
import Disqus from "@/components/Disqus";
import TitleBadge from "@/components/TitleBadge";
import config from "@/config/config.json";
import ImageFallback from "@/helpers/ImageFallback";
import MDXContent from "@/helpers/MDXContent";
import similarItems from "@/lib/utils/similarItems";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionSecondary from "@/partials/CallToActionSecondary";
import SeoMeta from "@/partials/SeoMeta";
import { BlogPost } from "@/types";
import { headers } from "next/headers";

const { blog_folder } = config.settings;

// Opt out of Full Route Cache so DB edits show immediately
export const revalidate = 0;

const PostSingle = async (props: { params: Promise<{ single: string }> }) => {
  const params = await props.params;
  const headerList = await headers();
  const host = headerList.get("host");

  // Use protocol detection or fallback to detected host
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let post: any = null;

  try {
    // Fetch by slug using the API route on the same host to avoid native DB loading in worker context
    const res = await fetch(`${baseUrl}/api/news/${params.single}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      post = {
        slug: data.slug,
        frontmatter: {
          title: data.title,
          meta_title: data.meta_title,
          description: data.description,
          image: data.image,
          categories: data.categories || [],
          badge: data.frontmatter?.badge || null,
        },
        content: data.content || "",
      };
    }
  } catch (err) {
    console.error("News fetch error:", err);
    // Explicitly avoid fallback that imports native modules to prevent EEXIST crash
  }

  // Fallback to markdown files via API (no direct DB call)
  if (!post) {
    try {
      const res = await fetch(
        `${baseUrl}/api/posts?folder=${blog_folder}&slug=${params.single}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const mdPost = await res.json();
        post = {
          slug: mdPost.slug,
          frontmatter: mdPost.frontmatter as any,
          content: mdPost.content,
        };
      }
    } catch (err) {
      console.error("Markdown post fetch error:", err);
    }
  }

  if (!post) notFound();

  // Get all posts for "similar posts" section via API
  let allPosts: any[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/news`, { cache: "no-store" });
    if (res.ok) {
      const dbPosts = await res.json();
      allPosts = dbPosts.map((p: any) => ({
        slug: p.slug,
        frontmatter: {
          title: p.title,
          description: p.description,
          image: p.image,
          categories: p.categories || [],
          date: p.date,
        },
        content: p.content || "",
      }));
    }
  } catch {
    console.warn("News API failed for similar posts, trying markdown API");
  }

  if (allPosts.length === 0) {
    try {
      const res = await fetch(`${baseUrl}/api/posts?folder=${blog_folder}`, {
        cache: "no-store",
      });
      if (res.ok) {
        allPosts = await res.json();
      }
    } catch (err) {
      console.error("Markdown posts fetch error for similar posts:", err);
    }
  }

  const similarPosts = similarItems(post, allPosts);

  const { title, meta_title, description, image, badge, categories } =
    post.frontmatter as any;

  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        description={description}
        image={image}
      />
      <section className="section-lg pb-0">
        <div className="container">
          <article data-aos="fade-up-sm" data-aos-delay="150">
            <TitleBadge
              icon={"FaAngleRight"}
              label={categories?.map((category: string) => category).join(", ")}
              bg_color={(badge && badge.bg_color) || "bg-secondary"}
              isCenter={false}
            />
            <h1
              dangerouslySetInnerHTML={markdownify(title)}
              className="mb-8 mt-4 font-semibold text-balance"
            />
            {image && (
              <div className="mb-10">
                <ImageFallback
                  src={image}
                  height={600}
                  width={1280}
                  alt={title}
                  className="w-full aspect-16/7.5 object-cover object-center rounded-4xl"
                />
              </div>
            )}
            <div className="row justify-center">
              <div className="lg:col-10">
                <div className="content mb-10">
                  <MDXContent content={post.content} />
                </div>
                <Disqus className="pt-10" />
              </div>
            </div>
          </article>

          {similarPosts.length > 0 && (
            <div className="section">
              <div data-aos="fade-up-sm" data-aos-delay="100" className="row justify-center">
                <div className="col-10 lg:col-6">
                  {badge && badge.enable && (
                    <TitleBadge
                      icon={badge.icon}
                      label={badge.label}
                      bg_color={badge.bg_color}
                    />
                  )}
                  <h2 className="pt-4 text-center" dangerouslySetInnerHTML={{ __html: "Read Other Articles" }} />
                </div>
              </div>
              <div className="pt-14">
                <div className="row g-4 justify-center">
                  {similarPosts.map((post) => (
                    <div key={post.slug} className="md:col-5">
                      <BlogCard data={post} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <CallToActionSecondary isNoSectionTop={true} />
    </>
  );
};

export default PostSingle;