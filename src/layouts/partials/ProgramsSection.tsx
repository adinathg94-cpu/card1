import { headers } from "next/headers";
import ProgramCard from "@/components/ProgramCard";
import TitleBadge from "@/components/TitleBadge";
import { sortByDate } from "@/lib/utils/sortFunctions";
import { markdownify } from "@/lib/utils/textConverter";
import { Program, RegularPage } from "@/types";

import config from "@/config/config.json";
const { blog_folder } = config.settings;

const ProgramsSection = async () => {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let programsIndex: any = { frontmatter: {} };
  let programs: any[] = [];

  try {
    const res = await fetch(
      `${baseUrl}/api/posts?file=sections/programs-homepage-section.md`,
      { cache: "no-store" }
    );
    if (res.ok) programsIndex = await res.json();
  } catch (error) {
    console.error("Error fetching programs index from API:", error);
  }

  try {
    const res = await fetch(`${baseUrl}/api/posts?folder=programs`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      programs = sortByDate(data);
    }
  } catch (error) {
    console.error("Error fetching programs from API:", error);
  }

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
              className="text-center text-balance text-[18px] tracking-[0.0005px] leading-[1.69]"
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