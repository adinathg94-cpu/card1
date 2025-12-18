import Partners from "@/components/Partners";
import ImageFallback from "@/helpers/ImageFallback";
import { markdownify } from "@/lib/utils/textConverter";
import { BannerSection } from "@/types";
import Link from "next/link";
import { FaAngleRight } from "react-icons/fa6";
import Counter from "../components/Counter";
import VideoPlayer from "../components/VideoPlayer";

const HeroBanner = ({ banner }: { banner: BannerSection }) => {
  const { badge, partners, media_section, impact_metrics } = banner;

  return (
    <section className="section pt-[9.25rem]">
      <div className="container flex flex-col-reverse xl:flex-row gap-5">
        <div
          data-aos="fade-up-sm"
          data-aos-delay="150"
          className="w-full md:w-[80%] xl:w-[45%] space-y-8 max-xl:flex max-xl:flex-col max-xl:items-center max-xl:text-center mx-auto max-xl:mt-8 overflow-hidden"
        >
          {badge.enable && (
            <div className="flex items-center gap-1.5">
              {badge.images?.map((image, i) => (
                <ImageFallback
                  key={i}
                  src={image}
                  alt="Badge"
                  width={20}
                  height={20}
                  className={`w-6 p-px border-1 border-border aspect-square rounded-full -mr-3 bg-white relative`}
                  style={{ zIndex: badge.images.length - i }}
                  loading="eager"
                />
              ))}
              <span className="text-text text-sm font-medium px-4">
                {badge.label}
              </span>
            </div>
          )}

          <h1
            dangerouslySetInnerHTML={markdownify(banner.title)}
            className="text-h2 -mt-4 lg:text-[80px] font-semibold tracking-tight xl:leading-[92px]"
          />
          <p
            dangerouslySetInnerHTML={markdownify(banner.content)}
            className="text-lg text-balance text-text"
          />

          <div className="flex gap-3 flex-col lg:flex-row items-center">
            {banner.button_solid.enable && (
              <div className="flex items-center group -space-x-2">
                <Link
                  className="btn btn-primary"
                  href={banner.button_solid.link}
                  target={
                    banner.button_solid.link.startsWith("http")
                      ? "_blank"
                      : "_self"
                  }
                  rel="noopener"
                >
                  {banner.button_solid.label}
                </Link>
                <Link
                  className="btn btn-primary p-3 relative"
                  href={banner.button_solid.link}
                  target={
                    banner.button_solid.link.startsWith("http")
                      ? "_blank"
                      : "_self"
                  }
                  rel="noopener"
                  aria-label="External Link"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--token-96b06de6-276f-47e3-a541-f01772f9ea0a, rgb(255, 255, 255))"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:-rotate-45"
                  >
                    <line x1={5} y1={12} x2={19} y2={12} />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            )}

            {banner.button_link.enable && (
              <Link
                href={banner.button_link.link}
                target="_blank"
                rel="noopener"
                className="btn btn-secondary flex items-center group"
              >
                {banner.button_link.label}{" "}
                <FaAngleRight className="ml-2 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            )}
          </div>

          <Partners partners={partners} />
        </div>

        <div className="w-full md:w-[70%] xl:w-[53%] mx-auto relative -mt-[8%] lg:-mt-[15%] xl:-mt-[11.5%]">
          {banner.image && (
            <>
              <ImageFallback
                src={banner.image}
                height={1000}
                width={911}
                alt="banner"
                className="size-full max-md:h-[600px] object-cover rounded-4xl"
                loading="eager"
              />

              {banner.testimonial_image && (
                <ImageFallback
                  data-aos="fade-up-sm"
                  data-aos-delay="150"
                  src={banner.testimonial_image}
                  className="absolute top-[10%] md:top-[23%] left-1/2 max-md:-translate-x-1/2 md:left-[15%] w-[364px] h-[64px] max-md:scale-70"
                  alt="testimonial"
                  width={364}
                  height={64}
                />
              )}

              {media_section.enable && <VideoPlayer video={media_section} />}

              <div
                data-aos="fade-up-sm"
                data-aos-delay="150"
                className="absolute bottom-10 w-[85%] left-1/2 -translate-x-1/2"
              >
                <div className="flex flex-col md:flex-row items-center gap-y-6 text-center md:text-left">
                  <ul className="flex-1 mt-auto -space-y-1.5">
                    {impact_metrics.secondary_labels &&
                      impact_metrics.secondary_labels.map((item, i) => (
                        <li
                          key={i}
                          data-aos="fade-up-sm"
                          data-aos-delay={i * 200 + 100}
                          className="w-full md:text-left text-center"
                        >
                          <span className="mx-auto lg:mx-0 w-max bg-body text-text-dark text-sm font-medium px-4 py-px rounded-full mb-px">
                            {item}
                          </span>
                        </li>
                      ))}
                  </ul>

                  <div
                    data-aos="fade-up-sm"
                    data-aos-delay="150"
                    className="bg-body rounded-4xl p-6 w-52"
                  >
                    <h6
                      className="text-base font-semibold"
                      dangerouslySetInnerHTML={markdownify(impact_metrics.label)}
                    />
                    <p
                      className="text-xs mt-2 mb-6"
                      dangerouslySetInnerHTML={markdownify(impact_metrics.description)}
                    />

                    <div className="flex">
                      {impact_metrics.team && (
                        <div className="flex items-center -space-x-2">
                          {impact_metrics.team.map((image, i) => (
                            <div
                              key={i}
                              data-aos="fade-right-sm"
                              data-aos-delay={i * 200 + 100}
                            >
                              <ImageFallback
                                src={image}
                                alt="Badge"
                                width={40}
                                height={40}
                                className="w-8 aspect-square rounded-full bg-yellow-300"
                                loading="eager"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {impact_metrics.counter && (
                        <p className="h4 font-semibold text-dark ml-auto">
                          <Counter
                            duration={impact_metrics.counter.count_duration}
                            count={impact_metrics.counter.count}
                            suffix={impact_metrics.counter.count_suffix}
                            prefix={impact_metrics.counter.count_prefix}
                          />
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
