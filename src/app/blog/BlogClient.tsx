"use client";

import { useEffect, useState } from "react";
import BlogCard from "@/components/BlogCard";
import Pagination from "@/components/Pagination";
import TitleBadge from "@/components/TitleBadge";
import config from "@/config/config.json";
import SeoMeta from "@/partials/SeoMeta";
import { sortByDate } from "@/lib/utils/sortFunctions";
import { markdownify } from "@/lib/utils/textConverter";

const { blog_folder, pagination } = config.settings;

export default function BlogClient({ slug }: { slug?: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    }
    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="section-lg text-center min-h-[50vh] flex items-center justify-center">
        <h2>Loading...</h2>
      </div>
    );
  }

  const { posts, postIndex } = data;
  const currentPage = slug && !isNaN(Number(slug)) ? Number(slug) : 1;

  const { badge, title, description, meta_title, image } = postIndex.frontmatter;
  const sortedPosts = sortByDate(posts);
  const totalPages = Math.ceil(posts.length / pagination);
  
  const indexOfLastPost = currentPage * pagination;
  const indexOfFirstPost = indexOfLastPost - pagination;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

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
            {currentPosts.map((post: any, i: number) => {
              const aosDelay = 100 * (i % 2);
              return (
                <div key={post.slug} className="mb-14 md:col-6">
                  <BlogCard data={post} aosDelay={aosDelay} />
                </div>
              );
            })}
            <Pagination
              section={blog_folder}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      </section>
    </>
  );
}
