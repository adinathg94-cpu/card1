import BlogCard from "@/components/BlogCard";
import Pagination from "@/components/Pagination";
import TitleBadge from "@/components/TitleBadge";
import config from "@/config/config.json";
import { getListPage, getSinglePage } from "@/lib/contentParser";
import { sortByDate } from "@/lib/utils/sortFunctions";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionSecondary from "@/partials/CallToActionSecondary";
import SeoMeta from "@/partials/SeoMeta";
import type { BlogPage, BlogPost } from "@/types";
import { notFound } from "next/navigation";

const { blog_folder } = config.settings;

export async function generateStaticParams() {
  const posts = getSinglePage<BlogPost["frontmatter"]>(blog_folder);
  const totalPages = Math.ceil(posts.length / config.settings.pagination);
  const paths = [];

  for (let i = 1; i <= totalPages; i++) {
    paths.push({
      params: {
        slug: i.toString(),
      },
    });
  }
  return paths;
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const currentPage = slug && !isNaN(Number(slug)) ? Number(slug) : 1;

  const postIndex = getListPage<BlogPage["frontmatter"]>(`${blog_folder}/_index.md`);
  const { badge, title, description } = postIndex.frontmatter;
  const posts = getSinglePage<BlogPost["frontmatter"]>(blog_folder);
  const sortedPosts = sortByDate(posts);
  const totalPages = Math.ceil(posts.length / config.settings.pagination);
  const indexOfLastPost = currentPage * config.settings.pagination;
  const indexOfFirstPost = indexOfLastPost - config.settings.pagination;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  if (!postIndex) {
    return notFound();
  }

  return (
    <>
      <SeoMeta {...postIndex.frontmatter} />
      <section className="section-lg">
        <div className="container">
          <div data-aos="fade-up-sm" data-aos-delay="100" className="row justify-center">
            <div className="col-10 lg:col-6">
              {badge && badge.enable && (
                <TitleBadge icon={badge.icon} label={badge.label} bg_color={badge.bg_color} />
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
            <Pagination section={blog_folder} currentPage={currentPage} totalPages={totalPages} />
          </div>
        </div>
      </section>
      <CallToActionSecondary isNoSectionTop />
    </>
  );
}