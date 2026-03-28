

import DynamicIcon from "@/helpers/DynamicIcon";
import ImageFallback from "@/helpers/ImageFallback";
import { markdownify } from "@/lib/utils/textConverter";
import type { PromotionsSection } from "@/types";
import { FC } from "react";
import Counter from "./Counter";
import TitleBadge from "./TitleBadge";
import Link from "next/link";

interface Props {
  promotions: PromotionsSection;
}

const PromotionsSection: FC<Props> = ({ promotions }) => {
  return (
    <>
      {promotions?.enable && (
        <section className="section p-0">
          <div className="container">
            <div
              data-aos="fade-up-sm"
              data-aos-delay="100"
              className="row justify-center"
            >
              <div className="col-10 lg:col-7">
                {promotions?.badge.enable && (
                  <div className="mt-5.5">
                    <TitleBadge
                      icon={promotions.badge.icon}
                      label={promotions.badge.label}
                      bg_color={promotions.badge.bg_color}
                    />
                  </div>
                )}

                <h2
                  className="py-4 text-center"
                  dangerouslySetInnerHTML={markdownify(promotions.title || "")}
                />
                <p
                  className="text-center text-balance text-[18px] tracking-[0.0005px] leading-[1.69]"
                  dangerouslySetInnerHTML={markdownify(promotions.description || "")}
                />
              </div>
            </div>

            <div
              data-aos="fade-up-sm"
              data-aos-delay="100"
              className="metrics-cards pt-14"
            >
              {promotions?.cards &&
                promotions.cards.length > 0 &&
                promotions.cards.map((card, i) => (
                  <div className="card" key={i}>
                    <p className={`h1 font-semibold text-white`}>
                      <Counter
                        count={card.counter.count}
                        suffix={card.counter.count_suffix}
                        prefix={card.counter.count_prefix}
                        duration={card.counter.count_duration}
                      />
                    </p>

                    <h6
                      className={`text-base font-medium tracking-wider text-white pb-8 pt-2`}
                      dangerouslySetInnerHTML={markdownify(card.title || "")}
                    />

                    <ul className="text-center lg:text-left">
                      {card.list.map((item, index) => (
                        <li key={index} className="w-full">
                          <div className="mx-auto lg:mx-0 w-fit bg-body text-dark text-sm font-medium px-4 py-px rounded-full mb-px z-20 wrap-break-word text-wrap">
                            {item}
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-8 max-lg:mx-auto hidden">
                      {card.button.enable && (
                        <Link
                          className="btn btn-icon"
                          href={card.button.link}
                          aria-label={"External Link Button"}
                        >
                          <span className="icon-wrapper">
                            <span className="icon">
                              <DynamicIcon icon={"FaArrowRight"} />
                            </span>
                            <span className="icon" aria-hidden="true">
                              <DynamicIcon icon={"FaArrowRight"} />
                            </span>
                          </span>
                        </Link>
                      )}
                    </div>

                    {card.image && (
                      <ImageFallback
                        src={card.image}
                        alt={card.title}
                        className={`absolute ${i === 0
                          ? "bottom-0 right-0"
                          : "-bottom-[35%] left-1/2 -translate-x-1/2"
                          } -z-10 overflow-hidden`}
                        width={i === 0 ? 220 : 420}
                        height={400}
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default PromotionsSection;
