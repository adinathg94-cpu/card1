import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import { CtaTertiarySection } from "@/types";
import Link from "next/link";

const CallToActionTertiary = () => {
  const callToActionData = getListPage<CtaTertiarySection["frontmatter"]>(
    "sections/call-to-action-tertiary.md"
  );

  return (
    <>
      {callToActionData.frontmatter.enable && (
        <section className="section pt-0">
          <div className="container">
            {/* bg-[url(/images/homepage/cta-bg-3.png)] */}
            <div
              className={`bg-[url(${callToActionData.frontmatter.image})] bg-cover rounded-4xl overflow-hidden bg-center bg-no-repeat`}
            >
              <div className="py-24 px-10 lg:py-32 lg:px-14">
                <div className="row">
                  <div className="lg:col-6">
                    <div
                      data-aos="zoom-in-sm"
                      data-aos-delay="150"
                      className="bg-body p-10 rounded-4xl max-lg:text-center"
                    >
                      <h2
                        dangerouslySetInnerHTML={markdownify(callToActionData.frontmatter.title || "")}
                        className="mb-6 h4 font-semibold text-balance leading-[50px]"
                      />
                      <p
                        dangerouslySetInnerHTML={markdownify(callToActionData.frontmatter.description || "")}
                        className="mb-12 text-balance"
                      />
                      {callToActionData.frontmatter.button.enable && (
                        <Link
                          className="btn btn-primary w-full text-center"
                          href={callToActionData.frontmatter.button.link}
                        >
                          {callToActionData.frontmatter.button.label}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default CallToActionTertiary;