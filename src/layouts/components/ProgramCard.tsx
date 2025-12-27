import ImageFallback from "@/helpers/ImageFallback";
import { humanize, markdownify } from "@/lib/utils/textConverter";
import type { Program } from "@/types";
import Link from "next/link";

interface Props {
  data: Program;
  aosDelay?: number;
}

const ProgramCard: React.FC<Props> = ({ data, aosDelay }) => {
  const { title, image, description, end_date, categories, goal, raised } =
    data.frontmatter;

  const today = new Date();
  const endDate = new Date(end_date!);
  const diffTime = endDate.getTime() - today.getTime();
  const daysLeft = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);

  return (
    <div
      data-aos="fade-up-sm"
      data-aos-delay={aosDelay}
      className="col-11 md:col-6 lg:col-4 group"
    >
      <div className="px-6 py-5 border border-border rounded-4xl flex flex-col h-full">
        {
          image && (<div className="group overflow-hidden rounded-2xl mb-10">
            <ImageFallback
              src={image}
              alt={title}
              width={400}
              height={300}
              className="overflow-hidden object-cover w-full md:aspect-16/10 rounded-2xl group-hover:scale-110 transition duration-700"
              priority
            />
          </div>)
        }


        <ul className="flex justify-between items-baseline mb-4">
          <li className="mr-4 flex gap-2 flex-wrap">
            {categories?.map((category, index) => (
              <p key={index} className="px-4 py-1 rounded-full bg-transparent border border-border text-xs w-fit font-semibold">
                {humanize(category)}
              </p>
            ))}
          </li>
          <li className="inline-block text-sm">{daysLeft} Days Left</li>
        </ul>

        <h3
          className="h6 mb-2"
          dangerouslySetInnerHTML={markdownify(title || "")}
        />
        <p className="text-[18px] tracking-[0.0005px] leading-[1.69]" dangerouslySetInnerHTML={markdownify(description || "")} />

        <div className="flex justify-between mt-4 mb-6 text-text-dark">
          <div>
            <span className="text-sm" dangerouslySetInnerHTML={markdownify("Goal")} />
            <p className="mt-2 h6 font-semibold" dangerouslySetInnerHTML={markdownify(goal || "")} />
          </div>

          <div>
            <span className="text-sm" dangerouslySetInnerHTML={markdownify("Raised")} />
            <p className="mt-2 h6 font-semibold" dangerouslySetInnerHTML={markdownify(raised || "")} />
          </div>
        </div>

        <Link
          className="btn btn-outline w-full py-3 mt-auto"
          href={`/${"programs"}/${data.slug}`}
        >
          View Program
        </Link>
      </div>
    </div>
  );
};

export default ProgramCard;