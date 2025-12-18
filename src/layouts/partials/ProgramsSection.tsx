import { getListPage, getSinglePage } from "@/lib/contentParser";
import ProgramCard from "@/components/ProgramCard";
import TitleBadge from "@/components/TitleBadge";
import { sortByDate } from "@/lib/utils/sortFunctions";
import { markdownify } from "@/lib/utils/textConverter";
import { Program, RegularPage } from "@/types";

const ProgramsSection = () => {
  const programsIndex = getListPage<RegularPage["frontmatter"]>("sections/programs-homepage-section.md");
  const programs = sortByDate(getSinglePage<Program["frontmatter"]>("programs"));

  return (
    <section className="section pt-0">
      <div className="container">
        <div data-aos="fade-up-sm" data-aos-delay="150" className="row justify-center">
          <div className="col-10 lg:col-8">
            {programsIndex.frontmatter.badge && programsIndex.frontmatter.badge.enable && (
              <TitleBadge
                icon={programsIndex.frontmatter.badge.icon}
                label={programsIndex.frontmatter.badge.label}
                bg_color={programsIndex.frontmatter.badge.bg_color}
              />
            )}
            <h2
              className="py-4 text-center"
              dangerouslySetInnerHTML={markdownify(programsIndex.frontmatter.title || "")}
            />
            <p
              className="text-center text-balance"
              dangerouslySetInnerHTML={markdownify(programsIndex.frontmatter.description || "")}
            />
          </div>
        </div>
        <div className="pt-14">
          <div className="row g-4 max-md:justify-center">
            {programs?.slice(0, 3).map((program, i) => {
              const aosDelay = 100 * (i % 3);
              return <ProgramCard key={program.slug} data={program} aosDelay={aosDelay} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;