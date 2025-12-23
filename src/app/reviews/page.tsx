import ReviewCard from "@/components/ReviewCard";
import TitleBadge from "@/components/TitleBadge";
import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionSecondary from "@/partials/CallToActionSecondary";
import SeoMeta from "@/partials/SeoMeta";
import type { ReviewsPage, ReviewsSection } from "@/types";

export default function ReviewsPage() {
  const reviewsIndex = getListPage<ReviewsPage["frontmatter"]>("reviews/_index.md");
  const reviewsSection = getListPage<ReviewsSection["frontmatter"]>(
    "sections/reviews-section.md"
  );

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
              {reviewsSection.frontmatter.reviews?.map((review, i) => (
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