import ImageFallback from "@/helpers/ImageFallback";
import { ReviewsSection } from "@/types";

interface Props {
  review: ReviewsSection["frontmatter"]["reviews"][number];
  index: number;
}

const ReviewCard: React.FC<Props> = ({ review, index }) => {
  const markdownify = (text: string) =>
    text.replace(/\n/g, "<br />").replace(/`/g, "&#96;");

  return (
    <div
      data-aos="zoom-out-sm"
      data-aos-delay={index * 100 + 50}
      className="rounded-4xl border border-border p-8 min-h-full"
    >
      <div
        className="stars"
        //@ts-ignore
        style={{ "--rating": review.ratings }}
        aria-label="Rating from the company"
      ></div>
      <p className="h6 mb-8 mt-4 font-medium before:content-['“'] after:content-['”']">
        {review.content}
      </p>
      <div className="flex justify-between items-center">
        <div className="flex mt-auto items-center gap-2">
          <ImageFallback
            className="h-10 w-10 rounded-full object-cover"
            src={review.avatar}
            alt={review.name}
            width={48}
            height={48}
          />
          <div>
            <h6
              className="mb-1 text-sm text-text-dark font-semibold"
              dangerouslySetInnerHTML={{ __html: markdownify(review.name) }}
            />
            <p
              className="text-xs"
              dangerouslySetInnerHTML={{
                __html: markdownify(review.designation),
              }}
            />
          </div>
        </div>
        <ImageFallback
          className="object-contain max-h-7 max-w-24"
          src={review.company_logo}
          alt="logo of the company"
          width={140}
          height={30}
        />
      </div>
    </div>
  );
};

export default ReviewCard;