import { markdownify } from "@/lib/utils/textConverter";
import { AboutPage } from "@/types";
import Counter from "../components/Counter";

interface Props {
  numbers_banner: AboutPage["frontmatter"]["numbers_banner"]
  bgColor?: string;
}

const NumbersBanner = ({ numbers_banner, bgColor }: Props) => {
  return (
    <div
      data-aos="fade-up-sm"
      data-aos-delay="250"
      className={`mt-14 ${bgColor} rounded-4xl p-16 ${numbers_banner.metrics.length < 2
        ? "text-center"
        : "grid justify-start text-left md:grid-cols-2 lg:grid-cols-4"
        } gap-6 text-wrap break-words relative overflow-hidden`}
    >
      <div
        className="absolute top-[70%] lg:top-[50%] left-1/2 -translate-x-1/2 z-0 rounded-full bg-body/30"
        style={{ width: "210vw", height: "200vw" }}
      ></div>
      {numbers_banner.metrics?.map((metric, index) => (
        <div
          key={index}
          className={`relative z-10 ${numbers_banner.metrics.length < 2 && "text-center"
            }`}
        >
          <p
            className={`${numbers_banner.metrics.length < 2 ? "h1" : "h2 lg:h3"
              } font-bold text-text-dark mb-2 break-words overflow-hidden`}
          >
            <Counter
              count={metric.counter.count}
              suffix={metric.counter.count_suffix}
              prefix={metric.counter.count_prefix}
              duration={metric.counter.count_duration}
            />
          </p>
          <h3
            className="text-balance font-medium text-sm text-text-dark/80"
            dangerouslySetInnerHTML={markdownify(metric.title || "")}
          />
        </div>
      ))}
    </div>
  );
};

export default NumbersBanner;
