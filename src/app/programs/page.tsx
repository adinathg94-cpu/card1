import Pagination from '@/components/Pagination';
import ProgramCard from '@/components/ProgramCard';
import TitleBadge from '@/components/TitleBadge';
import config from "@/config/config.json";
import ImageFallback from '@/helpers/ImageFallback';
import { getListPage, getSinglePage } from '@/lib/contentParser';
import { markdownify } from '@/lib/utils/textConverter';
import CallToActionSecondary from '@/partials/CallToActionSecondary';
import FAQs from '@/partials/FAQs';
import NumbersBanner from '@/partials/NumbersBanner';
import SeoMeta from '@/partials/SeoMeta';
import type { Program, ProgramsPage } from '@/types';
import Link from 'next/link';
const FOLDER = "programs";

const ProgramsPage = () => {
  const programsIndex = getListPage<ProgramsPage["frontmatter"]>(`${FOLDER}/_index.md`);
  const { title, description, badge, all_programs, button, numbers_banner } =
    programsIndex.frontmatter;
  const programs = getSinglePage<Program["frontmatter"]>(FOLDER);

  const featuredProgram = programs
    .filter((program) => program?.frontmatter?.featured)
    .slice(0, 1);
  const totalPages: number = Math.ceil(
    programs.length / config.settings.pagination
  );
  return (
    <>
      <SeoMeta
        {...programsIndex.frontmatter}
      />

      <section className="section-lg">
        <div className="container">
          {/* section title   */}
          <div
            data-aos="fade-up-sm"
            data-aos-delay="150"
            className="row justify-between items-center max-lg:text-center"
          >
            <div className="lg:col-7">
              {badge && <TitleBadge
                icon={badge?.icon}
                label={badge?.label}
                bg_color={badge?.bg_color}
                isCenter={false}
              />}
              <h2 className="py-4 h1" dangerouslySetInnerHTML={markdownify(title || "")} />
            </div>

            <div className="lg:col-5">
              <p className="text-balance text-[18px] tracking-[0.0005px] leading-[1.69]" dangerouslySetInnerHTML={markdownify(description || "")} />

              {
                button?.enable && (
                  <Link href={button.link} className="btn btn-primary mt-4">
                    {button.label}
                  </Link>
                )
              }
            </div>
          </div>

          <div className="pt-14">
            {
              featuredProgram.map((program, i) => (
                <div
                  key={i}
                  className="rounded-[32px] bg-dark/2 group p-10"
                  data-aos="fade-up-sm"
                  data-aos-delay="200"
                >
                  <div className="row items-center g-4">
                    <div className="col-11 lg:col-5 mx-auto">
                      <div className="relative group overflow-hidden rounded-2xl">
                        <ImageFallback
                          src={program.frontmatter.image!}
                          alt={program.frontmatter.title!}
                          width={500}
                          height={460}
                          className="object-cover rounded-2xl w-full group-hover:scale-110 transition duration-700"
                          loading={"eager"}
                        />
                      </div>
                    </div>

                    <div className="col-11 lg:col-6 mx-auto">
                      {program.frontmatter.title && (
                        <h2
                          className="h4 font-semibold mb-6"
                          dangerouslySetInnerHTML={markdownify(program.frontmatter.title)}
                        />
                      )}
                      {program.content && (
                        <div
                          className="line-clamp-3"
                          dangerouslySetInnerHTML={markdownify(program.content)}
                        />
                      )}

                      <Link
                        className="btn btn-primary my-8"
                        href={`/${FOLDER}/${program.slug}`}
                        rel="noopener"
                        data-aos="fade-up-sm"
                        data-aos-delay="200"
                      >
                        {"View Program"}
                      </Link>

                      <div className="flex flex-wrap lg:w-1/2 justify-between text-text-dark">
                        <div>
                          <span className="text-sm" dangerouslySetInnerHTML={markdownify("Goal")} />
                          <p
                            className="mt-2 h6 font-bold"
                            dangerouslySetInnerHTML={markdownify(program.frontmatter.goal || "")}
                          />
                        </div>

                        <div>
                          <span className="text-sm" dangerouslySetInnerHTML={markdownify("Raised")} />
                          <p
                            className="mt-2 h6 font-bold"
                            dangerouslySetInnerHTML={markdownify(program.frontmatter.raised || "")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          {/* Section Title */}
          <div
            data-aos="fade-up-sm"
            data-aos-delay="150"
            className="row justify-center"
          >
            <div className="col-10 lg:col-7">
              {
                all_programs?.badge?.enable && (
                  <TitleBadge
                    icon={all_programs?.badge?.icon}
                    label={all_programs?.badge?.label}
                    bg_color={all_programs?.badge?.bg_color}
                  />
                )
              }
              <h2
                className="py-4 text-center"
                dangerouslySetInnerHTML={markdownify(all_programs?.title || "")}
              />
              <p
                className="text-center text-balance text-[18px] tracking-[0.0005px] leading-[1.69]"
                dangerouslySetInnerHTML={markdownify(all_programs?.description || "")}
              />
            </div>
          </div>

          <div className="pt-14">
            <div className="row g-4 max-md:justify-center">
              {
                programs?.map((program, i) => {
                  const aosDelay = 100 * (i % 3);
                  return <ProgramCard key={program.slug} data={program} aosDelay={aosDelay} />;
                })
              }
              <Pagination
                section={FOLDER}
                currentPage={1}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
      </section>

      {
        numbers_banner && numbers_banner.enable && (
          <section className="section pt-0">
            <div className="container">
              {/* Section Title */}
              <div
                data-aos="fade-up-sm"
                data-aos-delay="150"
                className="row justify-center"
              >
                <div className="col-10 lg:col-7">
                  {numbers_banner?.badge?.enable && (
                    <TitleBadge
                      icon={numbers_banner?.badge?.icon}
                      label={numbers_banner?.badge?.label}
                      bg_color={numbers_banner?.badge?.bg_color}
                    />
                  )}
                  <h2
                    className="py-4 text-center"
                    dangerouslySetInnerHTML={markdownify(numbers_banner?.title || "")}
                  />
                  <p
                    className="text-center text-balance text-[18px] tracking-[0.0005px] leading-[1.69]"
                    dangerouslySetInnerHTML={markdownify(numbers_banner?.description || "")}
                  />
                </div>
              </div>

              <NumbersBanner
                numbers_banner={numbers_banner as any}
                bgColor="bg-secondary"
              />
            </div>
          </section>
        )
      }

      <FAQs />
      <CallToActionSecondary isNoSectionTop />
    </>
  )
}

export default ProgramsPage