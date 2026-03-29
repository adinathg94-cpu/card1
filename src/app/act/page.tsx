
import TitleBadge from "@/components/TitleBadge";
import ImageFallback from "@/helpers/ImageFallback";
import MDXContent from "@/helpers/MDXContent";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionSecondary from "@/partials/CallToActionSecondary";
import SeoMeta from "@/partials/SeoMeta";
import { RegularPage } from "@/types";

import { headers } from "next/headers";

const ActPage = async () => {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let page: any = null;
  try {
    const res = await fetch(`${baseUrl}/api/posts?folder=pages&slug=act`, {
      cache: "no-store",
    });
    if (res.ok) {
      page = await res.json();
    }
  } catch (error) {
    console.error("Error fetching act page from API:", error);
  }

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
            {description && (
              <p
                dangerouslySetInnerHTML={markdownify(description)}
                className="mb-10 text-balance text-[18px] tracking-[0.0005px] leading-[1.69]"
              />
            )}
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



