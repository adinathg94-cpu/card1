import Features from "@/components/Features";
import TitleBadge from "@/components/TitleBadge";
import { markdownify } from "@/lib/utils/textConverter";
import type { FeaturesSection } from "@/types";

import { headers } from "next/headers";

const FeaturesSection = async () => {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let featuresSectionByFile: any = { frontmatter: {} };
  try {
    const res = await fetch(
      `${baseUrl}/api/posts?file=sections/features-section.md`,
      { cache: "no-store" }
    );
    if (res.ok) {
      featuresSectionByFile = await res.json();
    }
  } catch (error) {
    console.error("Error fetching features section from API:", error);
  }

  const { enable, title, description, badge, features } =
    featuresSectionByFile.frontmatter;

  return (
    <>
      {enable && (
        <section className="section pt-0 overflow-hidden pb-0">
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