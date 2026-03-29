import ReviewCard from "@/components/ReviewCard";
import TitleBadge from "@/components/TitleBadge";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionSecondary from "@/partials/CallToActionSecondary";
import SeoMeta from "@/partials/SeoMeta";
import type { ReviewsPage, ReviewsSection } from "@/types";

import { headers } from "next/headers";

export default async function Reviews() {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let reviewsIndex: ReviewsPage = { frontmatter: { badge: {} } as any };
  try {
    const res = await fetch(`${baseUrl}/api/posts?folder=reviews&isList=true`, {
      cache: "no-store",
    });
    if (res.ok) {
      reviewsIndex = await res.json();
    }
  } catch (error) {
    console.error("Error fetching reviews index from API:", error);
  }

  let reviewsSectionByFile: ReviewsSection = { frontmatter: {} as any };
  try {
    const res = await fetch(
      `${baseUrl}/api/posts?file=sections/reviews-section.md`,
      { cache: "no-store" }
    );
    if (res.ok) {
      reviewsSectionByFile = await res.json();
    }
  } catch (error) {
    console.error("Error fetching reviews section from API:", error);
  }

  return (
    <>
      <SeoMeta {...reviewsIndex.frontmatter} />
      <section className="section-lg">
        <div className="container">
          <div
            data-aos="fade-up-sm"
            data-aos-delay="100"
            className="row justify-center"
          >
            <div className="col-10 lg:col-6">
              {reviewsIndex.frontmatter.badge.enable && (
                <TitleBadge
                  icon={reviewsIndex.frontmatter.badge.icon}
                  label={reviewsIndex.frontmatter.badge.label}
                  bg_color={reviewsIndex.frontmatter.badge.bg_color}
                />
              )}
              <h2
                className="py-4 text-center"
                dangerouslySetInnerHTML={markdownify(
                  reviewsIndex.frontmatter.title || ""
                )}
              />
              <p
                className="text-center text-balance text-[18px] tracking-[0.0005px] leading-[1.69]"
                dangerouslySetInnerHTML={markdownify(
                  reviewsIndex.frontmatter.description || ""
                )}
              />
            </div>
          </div>

          <div className="pt-14">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 h-auto">
              {reviewsSectionByFile.frontmatter.reviews?.map((review: any, i: number) => (
                <ReviewCard key={i} review={review} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <CallToActionSecondary isNoSectionTop />
    </>
  );
}