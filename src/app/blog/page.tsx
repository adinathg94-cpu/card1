import BlogCard from "@/components/BlogCard";
import Pagination from "@/components/Pagination";
import TitleBadge from "@/components/TitleBadge";
import config from "@/config/config.json";
import SeoMeta from "@/partials/SeoMeta";
import { getBlogPostsFromDB, getListPage, getSinglePage } from "@/lib/contentParser";
import { sortByDate } from "@/lib/utils/sortFunctions";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionSecondary from "@/partials/CallToActionSecondary";
import { BlogPage, BlogPost } from "@/types";

const { blog_folder } = config.settings;

export const dynamic = "force-dynamic";

export default function BlogIndexPage() {
  // Try database first, fallback to markdown
  const dbPosts = getBlogPostsFromDB();
  let posts;
  
  if (dbPosts.length > 0) {
    // Convert DB posts to the format expected by the component
    posts = dbPosts.map((post) => ({
      slug: post.slug,
      frontmatter: post.frontmatter,
      content: post.content,
    }));
  } else {
    // Fallback to markdown
    posts = getSinglePage<BlogPost["frontmatter"]>(blog_folder);
  }
  
  const postIndex = getListPage<BlogPage["frontmatter"]>(`${blog_folder}/_index.md`);
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