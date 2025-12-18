
import TeamCard from "@/components/TeamCard";
import TitleBadge from "@/components/TitleBadge";
import { getListPage, getSinglePage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionPrimary from "@/partials/CallToActionPrimary";
import FAQs from "@/partials/FAQs";
import FeaturesSection from "@/partials/FeaturesSection";
import SeoMeta from "@/partials/SeoMeta";
import { TeamMember, TeamsPage } from "@/types";

export default function Teams() {
  const teamsIndex = getListPage<TeamsPage["frontmatter"]>("teams/_index.md");
  const { badge, title, description, team_1, team_2 } = teamsIndex.frontmatter;
  const teams = getSinglePage<TeamMember["frontmatter"]>("teams");
  const leadTeam = teams.filter((member) => member.frontmatter.isLeadTeam);
  const otherTeam = teams.filter((member) => !member.frontmatter.isLeadTeam);

  return (
    <>
      <SeoMeta {...teamsIndex.frontmatter} />
      <section className="section-lg">
        <div className="container">
          <div data-aos="fade-up-sm" data-aos-delay="100" className="row justify-center">
            <div className="col-10 lg:col-6">
              {badge?.enable && (
                <TitleBadge
                  icon={badge.icon}
                  label={badge.label}
                  bg_color={badge.bg_color}
                />
              )}
              <h2 className="py-4 text-center" dangerouslySetInnerHTML={markdownify(title || "")} />
              <p className="text-center text-balance" dangerouslySetInnerHTML={markdownify(description || "")} />
            </div>
          </div>

          <div data-aos="fade-up-sm" data-aos-delay="100" className="pt-16">
            {team_1?.title && (
              <h2 className="h4 font-semibold mb-2" dangerouslySetInnerHTML={markdownify(team_1.title)} />
            )}
            {team_1?.description && (
              <p className="mb-10 text-balance" dangerouslySetInnerHTML={markdownify(team_1.description)} />
            )}
            <div className="row g-4">
              {leadTeam.map((member, i) => (
                <div key={member.slug} className="col-10 sm:col-6 lg:col-4 max-md:mx-auto">
                  <TeamCard member={member.frontmatter} index={i} />
                </div>
              ))}
            </div>
          </div>

          <div data-aos="fade-up-sm" data-aos-delay="100" className="pt-16">
            {team_2?.title && (
              <h2 className="h4 font-semibold mb-2" dangerouslySetInnerHTML={markdownify(team_2.title)} />
            )}
            {team_2?.description && (
              <p className="mb-10 text-balance" dangerouslySetInnerHTML={markdownify(team_2.description)} />
            )}
            <div className="row g-4">
              {otherTeam.map((member, i) => (
                <div key={member.slug} className="col-10 sm:col-6 md:col-4 lg:col-3 max-md:mx-auto">
                  <TeamCard member={member.frontmatter} index={i} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <FeaturesSection />
      <CallToActionPrimary isNoSectionTop />
      <FAQs />
    </>
  );
}