import Features from "@/components/Features";
import TitleBadge from "@/components/TitleBadge";
import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import type { FeaturesSection } from "@/types";

const FeaturesSection = () => {
  const featuresSection = getListPage<FeaturesSection["frontmatter"]>(
    "sections/features-section.md"
  );
  const { enable, title, description, badge, features } =
    featuresSection.frontmatter;

  return (
    <>
      {enable && (
        <section className="section pt-0 overflow-hidden">
          <div className="container">
            <div
              data-aos="fade-up-sm"
              data-aos-delay="100"
              className="row justify-center"
            >
              <div className="col-10 lg:col-6">
                {badge && badge.enable && (
                  <TitleBadge
                    icon={badge.icon}
                    label={badge.label}
                    bg_color={badge.bg_color}
                  />
                )}
                <h2
                  className="py-4 text-center"
                  dangerouslySetInnerHTML={markdownify(title || "")}
                />
                <p
                  className="text-center text-balance text-[18px] tracking-[0.0005px] leading-[1.69]"
                  dangerouslySetInnerHTML={markdownify(description || "")}
                />


              </div>
            </div>
            <Features features={features} />
          </div>
        </section>
      )}
    </>
  );
};

export default FeaturesSection;