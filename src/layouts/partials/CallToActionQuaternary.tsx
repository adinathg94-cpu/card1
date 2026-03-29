import { markdownify } from "@/lib/utils/textConverter";
import { type CtaTertiarySection } from "@/types";
import Link from "next/link";

interface Props {
  isNoSectionTop?: boolean;
}

import { headers } from "next/headers";

const CallToActionQuaternary = async ({ isNoSectionTop = false }: Props) => {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let callToAction: any = { frontmatter: { button: {} } };
  try {
    const res = await fetch(
      `${baseUrl}/api/posts?file=sections/call-to-action-quaternary.md`,
      { cache: "no-store" }
    );
    if (res.ok) {
      callToAction = await res.json();
    }
  } catch (error) {
    console.error("Error fetching quaternary CTA from API:", error);
  }

  return (
    <>
      {callToAction.frontmatter.enable && (
        <section
          data-aos="fade-up-sm"
          data-aos-delay={"150"}
          className={`section ${isNoSectionTop && "pt-0"}`}
        >
          <div className="container">
            <div
              className={`${callToAction.frontmatter.banner_color} rounded-4xl p-14 text-wrap wrap-break-word relative overflow-hidden`}
            >
              {/* Circle Background */}
              <div
                className="absolute top-[70%] lg:top-[55%] left-1/2 -translate-x-1/2 z-0 rounded-full bg-body/30"
                style={{ width: "100vw", height: "200vw" }}
              />

              <div className="relative z-10 flex flex-col items-center">
                <h3
                  className="mb-4 font-semibold text-center"
                  dangerouslySetInnerHTML={markdownify(callToAction.frontmatter.title || "")}
                />
                <p
                  className="mb-14 text-center text-balance text-[18px] tracking-[0.0005px] leading-[1.69]"
                  dangerouslySetInnerHTML={markdownify(callToAction.frontmatter.description || "")}
                />
                {callToAction.frontmatter.button?.enable && (
                  <Link
                    href={callToAction.frontmatter.button.link}
                    className="btn btn-primary text-center"
                  >
                    {callToAction.frontmatter.button.label}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default CallToActionQuaternary;