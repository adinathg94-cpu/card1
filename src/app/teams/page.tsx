
import TeamCard from "@/components/TeamCard";
import TitleBadge from "@/components/TitleBadge";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionPrimary from "@/partials/CallToActionPrimary";
import FAQs from "@/partials/FAQs";
import FeaturesSection from "@/partials/FeaturesSection";
import SeoMeta from "@/partials/SeoMeta";
import { TeamMember, TeamsPage } from "@/types";

import { headers } from "next/headers";

export default async function Teams() {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  // Fetch teams index via API
  let teamsIndex: any = { frontmatter: {} };
  try {
    const res = await fetch(`${baseUrl}/api/posts?folder=teams&isList=true`, {
      cache: "no-store",
    });
    if (res.ok) {
      teamsIndex = await res.json();
    }
  } catch (error) {
    console.error("Error fetching teams index from API:", error);
  }

  const { badge, title, description, team_1, team_2 } = teamsIndex.frontmatter;

  // Get team members from database via API
  let dbMembers: any[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/administration`, {
      cache: "no-store",
    });
    if (res.ok) {
      dbMembers = await res.json();
    }
  } catch (error) {
    console.error("Error fetching administration members from API:", error);
  }

  let leadTeam: any[] = [],
    otherTeam: any[] = [];
  if (dbMembers.length > 0) {
    // Convert DB members to the format expected by TeamCard
    const allMembers = dbMembers.map((member: any) => ({
      slug: member.name.toLowerCase().replace(/\s+/g, "-"),
      frontmatter: {
        name: member.name,
        designation: member.designation,
        image: member.image,
        isLeadTeam: Boolean(member.is_lead_team),
      },
      content: "",
    }));
    leadTeam = allMembers.filter((member) => member.frontmatter.isLeadTeam);
    otherTeam = allMembers.filter((member) => !member.frontmatter.isLeadTeam);
  } else {
    // Fallback to markdown via API
    try {
      const res = await fetch(`${baseUrl}/api/posts?folder=teams`, {
        cache: "no-store",
      });
      if (res.ok) {
        const teams = await res.json();
        leadTeam = teams.filter((member: any) => member.frontmatter.isLeadTeam);
        otherTeam = teams.filter(
          (member: any) => !member.frontmatter.isLeadTeam
        );
      }
    } catch (error) {
      console.error("Error fetching teams from API:", error);
    }
  }

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
              <p className="text-center text-balance text-[18px] tracking-[0.0005px] leading-[1.69]" dangerouslySetInnerHTML={markdownify(description || "")} />
            </div>
          </div>

          <div data-aos="fade-up-sm" data-aos-delay="100" className="pt-16">
            {team_1?.title && (
              <h2 className="h4 font-semibold mb-2" dangerouslySetInnerHTML={markdownify(team_1.title)} />
            )}
            {team_1?.description && (
              <p className="mb-10 text-balance text-[18px] tracking-[0.0005px] leading-[1.69]" dangerouslySetInnerHTML={markdownify(team_1.description)} />
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
              <p className="mb-10 text-balance text-[18px] tracking-[0.0005px] leading-[1.69]" dangerouslySetInnerHTML={markdownify(team_2.description)} />
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