import ReviewSlider from "@/components/ReviewSlider";
import TitleBadge from "@/components/TitleBadge";
import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import type { ReviewsSection } from "@/types";

const Testimonial = () => {
  const reviewsSection = getListPage<ReviewsSection["frontmatter"]>("sections/reviews-section.md");

  return (
    <>
      {reviewsSection.frontmatter.enable && (
        <section className="section py-0">
          <div className="container">
            <div data-aos="fade-up-sm" data-aos-delay="150" className="row justify-center">
              <div className="col-10 lg:col-7">
                {reviewsSection.frontmatter.badge && reviewsSection.frontmatter.badge.enable && (
                  <TitleBadge {...reviewsSection.frontmatter.badge} />
                )}
                {reviewsSection.frontmatter.title && (
                  <h2
                    className="py-4 text-center"
                    dangerouslySetInnerHTML={markdownify(reviewsSection.frontmatter.title)}
                  />
                )}
                {reviewsSection.frontmatter.description && (
                  <p
                    className="text-center text-balance"
                    dangerouslySetInnerHTML={markdownify(reviewsSection.frontmatter.description)}
                  />
                )}
              </div>
            </div>
            <div className="pt-14">
              <div className="row">
                <div className="lg:col-8 mx-auto">
                  <ReviewSlider data={reviewsSection.frontmatter} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Testimonial;