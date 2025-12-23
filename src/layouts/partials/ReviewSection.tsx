import ReviewCard from "@/components/ReviewCard";
import TitleBadge from "@/components/TitleBadge";
import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import { ReviewsSection } from "@/types";

const ReviewSection = () => {
  const reviewsSection = getListPage<ReviewsSection["frontmatter"]>("sections/reviews-section.md");
  const { enable, title, description, badge, reviews } = reviewsSection.frontmatter;

  return (
    <>
      {enable && (
        <section className="section py-0">
          <div className="container">
            <div data-aos="fade-up-sm" data-aos-delay="150" className="row justify-center">
              <div className="col-10 lg:col-7">
                {badge && badge.enable && <TitleBadge {...badge} />}
                {title && (
                  <h2 className="py-4 text-center" dangerouslySetInnerHTML={markdownify(title)} />
                )}
                {description && (
                  <p className="text-center text-balance text-[18px] tracking-[0.0005px] leading-[1.69]" dangerouslySetInnerHTML={markdownify(description)} />
                )}
              </div>
            </div>
            <div className="pt-14">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 h-auto">
                {reviews?.slice(0, 6).map((review, i: number) => (
                  <ReviewCard key={i} review={review} index={i} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ReviewSection;