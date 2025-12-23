import DynamicIcon from "@/helpers/DynamicIcon";
import { markdownify } from "@/lib/utils/textConverter";
import { AboutPage, FeaturesSection } from "@/types";
import Link from "next/link";

export function getBackgroundClass(i: number): string {
  const bgCycle = [
    "bg-secondary",
    "bg-tertiary/70",
    "bg-primary",
    "bg-primary",
    "bg-secondary",
    "bg-tertiary/70",
  ];
  return bgCycle[i % bgCycle.length];
}

interface Props {
  features: FeaturesSection["frontmatter"]["features"] | AboutPage["frontmatter"]["features"];
}

const Features = ({ features }: Props) => {

  return (
    <div data-aos="fade-up-sm" data-aos-delay="200" className="pt-14">
      <div className="border-t border-l rounded-2xl border-border overflow-hidden">
        <div className="features-grid grid md:grid-cols-2 lg:grid-cols-3">
          {features.length > 0 &&
            features.map((feature, i) => {
              const bgClass = getBackgroundClass(i);
              return (
                <div
                  className={`flex flex-col items-center text-center px-10 py-12 border-r w-full border-b border-border min-h-full`}
                  key={i}
                >
                  <div className={`mx-auto p-2 rounded-xl ${bgClass} mb-6`}>
                    <DynamicIcon
                      icon={feature.icon}
                      className="text-white text-xl"
                    />
                  </div>

                  <h6
                    className="font-medium"
                    dangerouslySetInnerHTML={markdownify(feature.title || "")}
                  />
                  <p
                    className="mt-3 mb-6 text-[18px] tracking-[0.0005px] leading-[1.69]"
                    dangerouslySetInnerHTML={markdownify(feature.description || "")}
                  />

                  {feature.button.enable && (
                    <Link
                      className="btn btn-outline w-full py-3 mt-auto"
                      href={feature.button.link}
                    >
                      {feature.button.label}
                    </Link>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Features;