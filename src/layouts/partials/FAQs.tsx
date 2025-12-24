

import TitleBadge from "@/components/TitleBadge";
import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import Accordion, { AccordionProvider } from "@/shortcodes/Accordion";
import { FaqsSection } from "@/types";
import Link from "next/link";

const FAQs = () => {
  const faqsData = getListPage<FaqsSection["frontmatter"]>("sections/faqs.md");
  const { enable, title, description, button, badge, list } =
    faqsData.frontmatter;

  return (
    <>
      {enable && (
        <section
          data-aos="fade-up-sm"
          data-aos-delay={"150"}
          className="section pt-0"
        >
          <div className="container">
            <div className="bg-dark/2 rounded-4xl p-6 py-12 md:p-12">
              <div className="row justify-between items-center max-lg:text-center">
                <div className="lg:col-5">
                  {badge && <TitleBadge
                    icon={badge.icon}
                    label={badge.label}
                    bg_color={badge.bg_color}
                    isCenter={false}
                  />}
                  <h2
                    className="py-4"
                    dangerouslySetInnerHTML={markdownify(title || "")}
                  />
                </div>

                <div className="lg:col-5">
                  <p
                    className="text-balance text-[18px] tracking-[0.0005px] leading-[1.69]"
                    dangerouslySetInnerHTML={markdownify(description || "")}
                  />

                  {button.enable && (
                    <Link href={button.link} className="btn btn-primary mt-4">
                      {button.label}
                    </Link>
                  )}
                </div>
              </div>

              <div className="pt-10">
                <AccordionProvider>
                  {list?.map((item, index) => (
                    <div
                      data-aos="fade-up-sm"
                      data-aos-delay={index * 100 + 50}
                      className="mb-1"
                      key={index}
                    >
                      <Accordion title={item.question} id={index}>
                        <div
                          className="text-[18px] tracking-[0.0005px] leading-[1.25]"
                          dangerouslySetInnerHTML={markdownify(item.answer)}
                        />
                      </Accordion>
                    </div>
                  ))}
                </AccordionProvider>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default FAQs;