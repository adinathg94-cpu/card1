import ReviewCard from "@/components/ReviewCard";
import TitleBadge from "@/components/TitleBadge";
import { markdownify } from "@/lib/utils/textConverter";
import { ReviewsSection } from "@/types";

import { headers } from "next/headers";

const ReviewSection = async () => {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

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
    console.error("Error fetching review section from API:", error);
  }

  const { enable, title, description, badge, reviews } =
    reviewsSectionByFile.frontmatter;

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