import ImageFallback from "@/helpers/ImageFallback";
import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import { CtaSecondarySection } from "@/types";
import Link from "next/link";
import Counter from "../components/Counter";

interface Props {
  isNoSectionTop?: boolean;
}

const CallToActionSecondary = ({ isNoSectionTop = false }: Props) => {
  const callToActionData = getListPage<CtaSecondarySection["frontmatter"]>(
    "sections/call-to-action-secondary.md"
  );
  const { enable, title, image, description, buttons, facts } =
    callToActionData.frontmatter;

  return (
    <>
      {enable && (
        <section
          data-aos="fade-up-sm"
          data-aos-delay={"150"}
          className={`section ${isNoSectionTop && "pt-0"}`}
        >
          <div className="container">
            <div className="relative px-14 pt-18 bg-[url(/images/homepage/cta-bg-2.png)] bg-cover bg-center bg-no-repeat rounded-4xl overflow-hidden text-white/90">
              <h3
                className="mb-4 text-center text-white"
                dangerouslySetInnerHTML={markdownify(title || "")}
              />
              <p
                className="font-semibold text-center text-[18px] tracking-[0.0005px] leading-[1.69]"
                dangerouslySetInnerHTML={markdownify(description || "")}
              />

              <ul className="flex flex-wrap justify-center gap-4 mt-6">
                {buttons?.map((button, i) =>
                  button.enable ? (
                    <li key={i}>
                      <Link
                        className={`btn ${i % 2 === 0 ? "btn-primary" : "btn-outline py-3 px-10"
                          }`}
                        href={button.link}
                      >
                        {button.label}
                      </Link>
                    </li>
                  ) : null
                )}
              </ul>

              <div className="flex flex-col lg:flex-row items-center pt-5 lg:justify-between max-lg:pb-40">
                <div className="space-y-4 max-lg:mx-auto max-lg:text-center max-lg:mb-4">
                  {facts.title && (
                    <h6
                      className="text-base font-normal text-white"
                      dangerouslySetInnerHTML={markdownify(facts.title || "")}
                    />
                  )}
                  {facts.content && (
                    <p
                      className="text-sm"
                      dangerouslySetInnerHTML={markdownify(facts.content || "")}
                    />
                  )}
                  <div className="flex items-center max-lg:justify-center -space-x-2">
                    {facts.team?.map((t, i) => (
                      <div
                        key={i}
                        data-aos="fade-right-sm"
                        data-aos-delay={i * 200 + 100}
                      >
                        <ImageFallback
                          src={t}
                          alt="Badge"
                          width={50}
                          height={50}
                          className="w-9 aspect-square rounded-full bg-body"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="h6">
                    <Counter
                      count={facts.counter.count || 0}
                      suffix={facts.counter.count_suffix}
                      duration={facts.counter.count_duration}
                      prefix={facts.counter.count_prefix}
                    />
                  </p>
                </div>

                <ul className="text-center lg:text-left space-y-px">
                  {facts.dialogues?.map((fact, i) => (
                    <li
                      key={i}
                      data-aos="fade-up-sm"
                      data-aos-delay={i * 200 + 100}
                      className="w-full"
                    >
                      <span
                        className="block mx-auto lg:mx-0 w-max bg-body text-text-dark text-sm font-medium px-4 py-px rounded-full"
                        dangerouslySetInnerHTML={markdownify(fact || "")}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="absolute top-[85%] lg:top-[70%] left-1/2 -translate-x-1/2 z-0 rounded-full bg-body/30"
                style={{ width: "90%", paddingBottom: "90%" }}
              />
              <ImageFallback
                className="relative z-10 mx-auto -mt-[150px]"
                src={image!}
                alt="cta"
                width={880}
                height={680}
                loading="lazy"
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default CallToActionSecondary;
