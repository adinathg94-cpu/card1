"use client";

import { markdownify } from "@/lib/utils/textConverter";
import type { ReviewsSection } from "@/types";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import ImageFallback from "@/helpers/ImageFallback";
import "swiper/css";
import "swiper/css/pagination";

interface Props {
  data: ReviewsSection["frontmatter"];
}

interface Review {
  id: string;
  content: string;
  ratings: number;
  avatar: string;
  name: string;
  designation: string;
}

// Extending ReviewsSection to ensure it has reviews property
interface ExtendedReviewsSection extends ReviewsSection {
  reviews: Review[];
}

const ReviewSlider: React.FC<Props> = ({ data }) => {
  // Cast data to ExtendedReviewsSection
  const reviewData = data as unknown as ExtendedReviewsSection;

  return (
    <div data-aos="fade-up-sm" data-aos-delay="200" className="swiper testimonial-slider">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={24}
        loop={true}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
        }}
        className="swiper-wrapper"
      >
        {reviewData.reviews?.map((review) => (
          <SwiperSlide key={review.id} className="swiper-slide">
            <div
              className="flex flex-col items-center"
            >
              <div
                className="stars"
                style={{ "--rating": review.ratings } as React.CSSProperties}
                aria-label="Rating from the company"
              />
              <p
                className="h4 text-center font-semibold mb-8 mt-4 text-text-dark/90 before:content-['“'] after:content-['”']"
                dangerouslySetInnerHTML={markdownify(review.content)}
              />
              <div className="flex justify-between items-center">
                <div className="flex mt-auto items-center gap-2">
                  <ImageFallback
                    className="h-12 w-12 rounded-full object-cover border border-border"
                    src={review.avatar}
                    alt={review.name}
                    width={54}
                    height={54}
                  />
                  <div>
                    <h6
                      className="mb-1 text-sm text-text-dark font-semibold"
                      dangerouslySetInnerHTML={markdownify(review.name)}
                    />
                    <p
                      className="text-xs"
                      dangerouslySetInnerHTML={markdownify(review.designation)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="testimonial-slider-pagination mt-9 flex items-center justify-center text-center">
      </div>
    </div>
  );
};

export default ReviewSlider;