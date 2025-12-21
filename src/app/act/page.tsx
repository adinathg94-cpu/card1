
import TitleBadge from "@/components/TitleBadge";
import ImageFallback from "@/helpers/ImageFallback";
import MDXContent from "@/helpers/MDXContent";
import { getSinglePage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionSecondary from "@/partials/CallToActionSecondary";
import SeoMeta from "@/partials/SeoMeta";
import { RegularPage } from "@/types";

const ActPage = async () => {
  const pages = getSinglePage<RegularPage["frontmatter"]>("pages");
  const page = pages.filter((p) => p.slug === "act")[0];

  if (!page) {
    return <div>Page not found</div>;
  }

  const { title, meta_title, description, image, badge } = page.frontmatter;

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
            {badge?.enable && (
              <TitleBadge
                icon={badge.icon}
                label={badge.label}
                bg_color={badge.bg_color}
                isCenter={false}
              />
            )}
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
                  className="w-full aspect-[16/7.5] object-cover object-center rounded-4xl"
                />
              </div>
            )}
            <div className="row justify-center">
              <div className="lg:col-10">
                <div className="content mb-10">
                  <MDXContent content={page.content} />
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
      <CallToActionSecondary isNoSectionTop={true} />
    </>
  );
}

export default ActPage;
