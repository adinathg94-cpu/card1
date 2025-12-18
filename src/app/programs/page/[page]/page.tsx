import Pagination from "@/components/Pagination";
import ProgramCard from "@/components/ProgramCard";
import TitleBadge from "@/components/TitleBadge";
import config from "@/config/config.json";
import { getListPage, getSinglePage } from "@/lib/contentParser";
import { sortByDate } from "@/lib/utils/sortFunctions";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionSecondary from "@/partials/CallToActionSecondary";
import FAQs from "@/partials/FAQs";
import NumbersBanner from "@/partials/NumbersBanner";
import type { Program, ProgramsPage } from "@/types";

// remove dynamicParams
export const dynamicParams = false;

// generate static params
export const generateStaticParams = () => {
  const allPrograms = getSinglePage<Program["frontmatter"]>("programs");
  const allSlug: string[] = allPrograms.map((item) => item.slug!);
  const totalPages = Math.ceil(allSlug.length / config.settings.pagination);
  let paths: { page: string }[] = [];

  for (let i = 1; i < totalPages; i++) {
    paths.push({
      page: (i + 1).toString(),
    });
  }

  return paths;
};

const ProgramsPage = async (props: { params: Promise<{ page: number }> }) => {
  const params = await props.params;
  const programsIndex = getListPage<ProgramsPage["frontmatter"]>("programs/_index.md");
  const { all_programs, numbers_banner } = programsIndex.frontmatter;

  const programs = getSinglePage<Program>("programs");
  const sortedPrograms = sortByDate(programs);
  const currentPage =
    params.page && !isNaN(Number(params.page)) ? Number(params.page) : 1;
  const indexOfLastPost = currentPage * config.settings.pagination;
  const indexOfFirstPost = indexOfLastPost - config.settings.pagination;
  const currentPrograms = sortedPrograms.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(programs.length / config.settings.pagination);

  return (
    <>
      <section className="section-lg">
        <div className="container">
          <div className="row justify-center">
            <div className="col-10 lg:col-7">
              {all_programs?.badge?.enable && (
                <TitleBadge
                  icon={all_programs?.badge?.icon}
                  label={all_programs?.badge?.label}
                  bg_color={all_programs?.badge?.bg_color}
                />
              )}
              <h2
                className="py-4 text-center"
                dangerouslySetInnerHTML={markdownify(all_programs?.title || "")}
              />
              <p
                className="text-center text-balance"
                dangerouslySetInnerHTML={markdownify(all_programs?.description || "")}
              />
            </div>
          </div>

          <div className="pt-14">
            <div className="row g-4 max-md:justify-center">
              {currentPrograms?.map((program, i) => (
                <ProgramCard key={program.slug} data={program} aosDelay={100 * (i % 3)} />
              ))}
              <Pagination
                section="programs"
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
      </section>

      {numbers_banner && numbers_banner.enable && (
        <section className="section pt-0">
          <div className="container">
            <div className="row justify-center">
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
                  className="text-center text-balance"
                  dangerouslySetInnerHTML={markdownify(numbers_banner?.description || "")}
                />
              </div>
            </div>

            <NumbersBanner numbers_banner={numbers_banner as any} bgColor="bg-secondary" />
          </div>
        </section>
      )}

      <FAQs />
      <CallToActionSecondary isNoSectionTop={true} />
    </>
  );
}

export default ProgramsPage;