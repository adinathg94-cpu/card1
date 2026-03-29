import ReviewSlider from "@/components/ReviewSlider";
import TitleBadge from "@/components/TitleBadge";
import { markdownify } from "@/lib/utils/textConverter";
import type { ReviewsSection } from "@/types";

import { headers } from "next/headers";

const Testimonial = async () => {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let reviewsSection: any = { frontmatter: {} };
  try {
    const res = await fetch(
      `${baseUrl}/api/posts?file=sections/reviews-section.md`,
      { cache: "no-store" }
    );
    if (res.ok) {
      reviewsSection = await res.json();
    }
  } catch (error) {
    console.error("Error fetching testimonials from API:", error);
  }

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