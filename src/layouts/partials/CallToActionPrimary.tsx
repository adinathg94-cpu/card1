import DynamicIcon from "@/helpers/DynamicIcon";
import ImageFallback from "@/helpers/ImageFallback";
import { markdownify } from "@/lib/utils/textConverter";
import { CtaPrimarySection } from "@/types";
import VideoPlayer from "../components/VideoPlayer";

interface Props {
  isNoSectionTop?: boolean;
}

import { headers } from "next/headers";

const CallToActionPrimary = async ({ isNoSectionTop }: Props) => {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let callToAction: any = { frontmatter: { facts: [], media_section: {} } };
  try {
    const res = await fetch(
      `${baseUrl}/api/posts?file=sections/call-to-action-primary.md`,
      { cache: "no-store" }
    );
    if (res.ok) {
      callToAction = await res.json();
    }
  } catch (error) {
    console.error("Error fetching primary CTA from API:", error);
  }

  if (!callToAction.frontmatter.enable) {
    return null;
  }

  return (
    <section className={`section ${isNoSectionTop && "pt-0"}`}>
      <div className="container">
        <div
          className="bg-[url(/images/homepage/cta-bg-1.png)] bg-cover rounded-4xl overflow-hidden xl:bg-contain relative"
          style={{
            backgroundImage: `url(/images/homepage/cta-bg-1.png)`,
          }}
        >
          <div className="px-7 py-9 lg:py-14 lg:px-14">
            <div className="row justify-center lg:justify-between relative z-20">
                <div className="col-11 lg:col-5">
                <h3
                  className="mb-15 max-lg:text-center text-white"
                  dangerouslySetInnerHTML={markdownify(callToAction.frontmatter.title)}
                />
                <div className="space-y-5">
                  {callToAction.frontmatter.facts.map((fact, i) => (
                  <div
                    key={i}
                    data-aos="zoom-in-sm"
                    data-aos-delay={i * 150 + 50}
                    className="bg-body rounded-[28px] p-6"
                  >
                    <div className="flex items-start sm:items-center gap-2 mb-3">
                    <DynamicIcon
                      icon={fact.icon}
                      className="inline text-text-dark text-xl"
                    />
                    <h6
                      className="font-semibold"
                      dangerouslySetInnerHTML={markdownify(fact.title)}
                    />
                    </div>
                    <p
                    className="text-sm font-semibold"
                    dangerouslySetInnerHTML={markdownify(fact.content)}
                    />
                  </div>
                  ))}
                </div>
                </div>

              <div className="lg:col-7 ml-auto">
                <p
                  className="text-balance text-white font-medium text-dark text-center lg:text-right max-lg:mt-10 text-[18px] tracking-[0.0005px] leading-[1.69]"
                  dangerouslySetInnerHTML={markdownify(callToAction.frontmatter.description)}
                />

                <div className="flex flex-col lg:flex-row max-lg:items-center justify-between max-lg:gap-y-6 pt-16">
                  {callToAction.frontmatter.media_section.enable && (
                    <VideoPlayer
                      video={{
                        ...callToAction.frontmatter.media_section,
                        isAbsolute: false,
                      }}
                    />
                  )}

                  <ul className="text-center lg:text-left -space-y-1.5">
                    {callToAction.frontmatter.dialogues?.map((item, i) => (
                      <li
                        key={i}
                        data-aos="fade-up-sm"
                        data-aos-delay={i * 200 + 100}
                        className="w-full"
                      >
                        <span
                          className="mx-auto lg:mx-0 w-max bg-body text-text-dark text-sm font-medium px-4 py-px rounded-full mb-px"
                          dangerouslySetInnerHTML={markdownify(item)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {callToAction.frontmatter.image && (
            <ImageFallback
              className="lg:absolute bottom-0 -right-10 z-10"
              src={callToAction.frontmatter.image}
              alt="cta-image"
              width={880}
              height={680}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default CallToActionPrimary;
