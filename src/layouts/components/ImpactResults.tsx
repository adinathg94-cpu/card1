import DynamicIcon from '@/helpers/DynamicIcon';
import ImageFallback from '@/helpers/ImageFallback';
import { markdownify } from '@/lib/utils/textConverter';
import { AboutPage, Homepage } from '@/types';
import Link from 'next/link';
import Counter from './Counter';

interface Props {
  impactResults: AboutPage["frontmatter"]["impact_results"] | Homepage["frontmatter"]["impact_results"]
}

const ImpactResults = ({ impactResults }: Props) => {
  return (
    <div className="row justify-center">
      <div className="lg:col-11">
        <div className="pt-14">
          {
            impactResults?.results.map((item, index) => (
              <div key={index} className="row justify-center lg:justify-between items-center g-5 mb-[6rem] last:mb-0">
                <div
                  data-aos="fade-up-sm"
                  data-aos-delay="100"
                  className={`col-11 lg:col-6 order-2 ${index % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}
                >
                  <div>
                    <p
                      dangerouslySetInnerHTML={markdownify(item.subtitle)}
                      className="px-4 py-1 rounded-full bg-transparent border border-border text-xs mb-4 w-fit max-lg:mx-auto"
                    />
                    <h2
                      dangerouslySetInnerHTML={markdownify(item.title || "")}
                      className="lg:h1 mb-4 h4 font-semibold tracking-wide max-lg:text-center"
                    />
                    <p
                      dangerouslySetInnerHTML={markdownify(item.description || "")}
                      className="mb-12 max-lg:text-center"
                    />

                    {item?.metrics && item?.metrics.length > 0 && (
                      <div className="flex rounded-2xl border border-border overflow-hidden">
                        {item?.metrics?.map((metric, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center lg:items-start py-5 px-4 border-r last:border-r-0 border-border">
                            <div
                              className={`w-9 h-9 ${metric.bg_color} rounded-full flex items-center justify-center mb-3`}
                            >

                              <DynamicIcon
                                icon={metric?.icon}
                                className="text-white text-sm"
                              />
                            </div>
                            <p
                              className="text-xs mb-3"
                              dangerouslySetInnerHTML={markdownify(metric.title)}
                            />
                            <p className="h4 font-medium text-dark">
                              <Counter
                                count={metric.counter.count}
                                suffix={metric.counter.count_suffix}
                                prefix={metric.counter.count_prefix}
                                duration={metric.counter.count_duration}
                              />
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {item?.button?.enable && (
                      <Link href={item.button.link} className="btn btn-primary mt-2">
                        {item.button.label}
                      </Link>
                    )}
                  </div>
                </div>

                <div
                  data-aos="fade-up-sm"
                  data-aos-delay="100"
                  className={`col-11 lg:col-6 order-1 ${index % 2 !== 0 ? "lg:order-2" : "lg:order-1"}`}
                >
                  <div className="bg-transparent rounded-3xl flex flex-col relative">
                    <ImageFallback
                      src={item.image!}
                      alt={item.title!}
                      className="size-full rounded-3xl z-10"
                      width={500}
                      height={500}
                    />
                    <ImageFallback
                      src={item.image_2}
                      alt={item.title!}
                      width={222}
                      height={223}
                      className={`rounded-3xl max-md:hidden absolute bottom-10 right-10 z-20 ${index % 2 !== 0 ? "left-10" : "right-10"}`}
                    />
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>

  )
}

export default ImpactResults