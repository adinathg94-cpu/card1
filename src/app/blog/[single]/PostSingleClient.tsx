"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import BlogCard from "@/components/BlogCard";
import Disqus from "@/components/Disqus";
import TitleBadge from "@/components/TitleBadge";
import ImageFallback from "@/helpers/ImageFallback";
import MDXContent from "@/helpers/MDXContent";
import similarItems from "@/lib/utils/similarItems";
import { markdownify } from "@/lib/utils/textConverter";
import SeoMeta from "@/partials/SeoMeta";

export default function PostSingleClient({ single }: { single: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postRes, allPostsRes] = await Promise.all([
          fetch(`/api/posts?slug=${single}`),
          fetch(`/api/posts`)
        ]);

        let postData = null;
        let allPostsData = { posts: [] };

        if (postRes.ok) {
          postData = await postRes.json();
        }
        
        if (allPostsRes.ok) {
          allPostsData = await allPostsRes.json();
        }

        setData({
          post: postData,
          allPosts: allPostsData.posts || []
        });
      } catch (err) {
        console.error("Error fetching single post:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [single]);

  if (loading) {
    return (
      <div className="section-lg text-center min-h-[50vh] flex items-center justify-center">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!data?.post) {
    notFound();
  }

  const { post, allPosts } = data;
  const similarPosts = similarItems(post, allPosts);
  const { title, meta_title, description, image, badge, categories } = post.frontmatter;

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
                  {similarPosts.map((post: any) => (
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
    </>
  );
}
