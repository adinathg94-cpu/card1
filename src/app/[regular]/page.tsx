import TitleBadge from "@/components/TitleBadge";
import MDXContent from "@/helpers/MDXContent";
import { getSinglePage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionSecondary from "@/partials/CallToActionSecondary";
import SeoMeta from "@/partials/SeoMeta";
import type { RegularPage } from "@/types";
import { notFound } from "next/navigation";

// remove dynamicParams
export const dynamicParams = false;

// generate static params
export async function generateStaticParams() {
  const pages = getSinglePage<RegularPage["frontmatter"]>("pages");
  return pages.map((page) => ({ regular: page.slug }));
}

import { headers } from "next/headers";

const RegularPage = async (props: { params: Promise<{ regular: string }> }) => {
  const params = await props.params;
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let page: any = null;
  try {
    const res = await fetch(
      `${baseUrl}/api/posts?folder=pages&slug=${params.regular}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      page = await res.json();
    }
  } catch (error) {
    console.error("Error fetching regular page from API:", error);
  }

  if (!page) {
    return notFound();
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
              <p className="text-center text-balance text-[18px] tracking-[0.0005px] leading-[1.69]" dangerouslySetInnerHTML={markdownify(description || "")} />
            </div>
          </div>
          <div className="row justify-center mt-2">
            <div className="lg:col-8">
              <div data-aos="fade-up-sm" data-aos-delay="150" className="content">
                <MDXContent content={page.content} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <CallToActionSecondary isNoSectionTop />
    </>
  );
}

export default RegularPage;