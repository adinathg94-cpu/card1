import DynamicIcon from "@/helpers/DynamicIcon";
import { markdownify } from "@/lib/utils/textConverter";
import { SuccessNumbersSection } from "@/types";
import TitleBadge from "./TitleBadge";

import { headers } from "next/headers";

const SuccessNumbers = async () => {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let successNumbersByFile: any = { frontmatter: {} };
  try {
    const res = await fetch(
      `${baseUrl}/api/posts?file=sections/success-numbers.md`,
      { cache: "no-store" }
    );
    if (res.ok) {
      successNumbersByFile = await res.json();
    }
  } catch (error) {
    console.error("Error fetching success numbers from API:", error);
  }

  const { enable, badge, facts, title, description } =
    successNumbersByFile.frontmatter;

  return (
    <>
      {enable && (
        <section className="section pt-0 overflow-x-hidden">
          <div className="container">
            <div data-aos="fade-up-sm" data-aos-delay="150" className="row justify-center">
              <div className="col-10 lg:col-6">
                {badge && badge.enable && (
                  <TitleBadge
                    icon={badge.icon}
                    label={badge.label}
                    bg_color={badge.bg_color}
                  />
                )}
                <h2 className="py-4 text-center" dangerouslySetInnerHTML={markdownify(title)} />
                {description && <p className="text-center text-balance" dangerouslySetInnerHTML={markdownify(description)} />}
              </div>
            </div>
            <div className="success-banners">
              {facts &&
                facts.length > 0 &&
                facts.map((fact, i: number) => (
                  <div
                    key={i}
                    data-aos="fade-up-sm"
                    data-aos-delay={i * 100 + 50}
                    className={`banner`}
                  >
                    <div
                      className="absolute top-[70%] lg:top-[55%] left-1/2 -translate-x-1/2 z-0 rounded-full bg-body/30"
                      style={{ width: "100vw", height: "200vw" }}
                    />
                    <div className="relative z-20">
                      <p className="h6 font-semibold text-text-dark">
                        <DynamicIcon
                          icon={fact.icon}
                          className="inline text-body -mt-1 rounded-sm mr-1 text-xl"
                        />
                        {fact.title}
                      </p>
                      <p
                        className="h1 lg:text-7xl font-semibold text-text-dark mt-4 mb-5"
                        dangerouslySetInnerHTML={markdownify(fact.number || "")}
                      />
                      <p
                        className="text-balance text-text-dark font-medium text-sm"
                        dangerouslySetInnerHTML={markdownify(fact.description || "")}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default SuccessNumbers;