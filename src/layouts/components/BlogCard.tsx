import config from "@/config/config.json";
import ImageFallback from "@/helpers/ImageFallback";
import dateFormat from "@/lib/utils/dateFormat";
import { humanize, plainify } from "@/lib/utils/textConverter";
import { BlogPost } from "@/types";
import Link from "next/link";

interface Props {
  data: BlogPost;
  aosDelay?: number;
}

const BlogCard: React.FC<Props> = ({ data, aosDelay }) => {
  const { blog_folder } = config.settings;
  const { title, image, date, categories } = data.frontmatter;

  return (
    <div
      data-aos="fade-up-sm"
      data-aos-delay={aosDelay}
      className="bg-body border border-border rounded-4xl p-8 group"
    >
      {image && (
        <div className="overflow-hidden rounded-2xl mb-6">
          <ImageFallback
            className="overflow-hidden w-full object-cover md:aspect-[16/9] rounded-2xl group-hover:scale-110 transition duration-700"
            src={image}
            alt={title}
            width={550}
            height={350}
            priority
          />
        </div>
      )}

      <ul className="flex justify-between items-baseline mb-10 mt-8">
        <li className="mr-4 flex gap-2 flex-wrap">
          {categories.map((category) => (
            <p key={category} className="px-4 py-1 rounded-full bg-transparent border border-border text-xs w-fit font-semibold">
              {humanize(category)}
            </p>
          ))}
        </li>
        {date && (
          <li className="inline-block text-xs font-semibold">
            {dateFormat(date)}
          </li>
        )}
      </ul>

      <h4 className="mb-3 h6 font-semibold hover:text-secondary duration-200">
        <Link href={`/${blog_folder}/${data.slug}`}> {title}</Link>
      </h4>
      {data.content && <p className="mb-10 line-clamp-2">{plainify(data.content)}</p>}
      <Link
        className="btn btn-outline w-full py-3"
        href={`/${blog_folder}/${data.slug}`}
      >
        read more
      </Link>
    </div>
  );
};

export default BlogCard;