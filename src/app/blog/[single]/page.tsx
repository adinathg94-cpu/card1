
import BlogCard from "@/components/BlogCard";
import Disqus from "@/components/Disqus";
import TitleBadge from "@/components/TitleBadge";
import config from "@/config/config.json";
import ImageFallback from "@/helpers/ImageFallback";
import MDXContent from "@/helpers/MDXContent";
import { getSinglePage } from "@/lib/contentParser";
import similarItems from "@/lib/utils/similarItems";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionSecondary from "@/partials/CallToActionSecondary";
import SeoMeta from "@/partials/SeoMeta";
import { BlogPost } from "@/types";


const { blog_folder } = config.settings;

// remove dynamicParams
export const dynamicParams = false;

// generate static params
export const generateStaticParams: () => { single: string }[] = () => {
  const posts = getSinglePage(blog_folder);

  const paths = posts.map((post) => ({
    single: post.slug!,
  }));

  return paths;
};

const PostSingle = async (props: { params: Promise<{ single: string }> }) => {
  const params = await props.params;
  const posts = getSinglePage<BlogPost["frontmatter"]>("blog");
  const post = posts.filter((page) => page.slug === params.single)[0];

  const { title, meta_title, description, image, badge, categories } =
    post.frontmatter;
  const similarPosts = similarItems(post, posts);

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
              label={categories?.map((category) => category).join(", ")}
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
                  className="w-full aspect-[16/7.5] object-cover  object-center rounded-4xl"
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
}

export default PostSingle;