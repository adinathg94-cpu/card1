

import Features from "@/components/Features";
import ImpactResults from "@/components/ImpactResults";
import TeamCard from "@/components/TeamCard";
import TitleBadge from "@/components/TitleBadge";
import BrandSlider from "@/layouts/components/BrandSlider";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionSecondary from "@/partials/CallToActionSecondary";
import NumbersBanner from "@/partials/NumbersBanner";
import SeoMeta from "@/partials/SeoMeta";
import Testimonial from "@/partials/Testimonial";

import ImageFallback from "@/helpers/ImageFallback";
import { getListPage, getAdministrationMembersFromDB } from "@/lib/contentParser";
import type { AboutPage } from "@/types";
import Link from "next/link";


export default function AboutPage() {
  const about = getListPage<AboutPage["frontmatter"]>("about/_index.md");
  const {
    title,
    description,
    meta_title,
    image,
    badge,
    button,
    features,
    numbers_banner,
    impact_results,
    brands,
    team: teamConfig,
  } = about.frontmatter;

  // Get team members from database
  const dbMembers = getAdministrationMembersFromDB();

  // Merge database members with team config
  const team = {
    ...teamConfig,
    members: dbMembers.length > 0
      ? dbMembers.map((member) => ({
        name: member.name,
        designation: member.designation,
        image: member.image,
      }))
      : (teamConfig.members || []),
  };

  return (
    <>
      <SeoMeta title={title} meta_title={meta_title} description={description} image={image} />
      <section className="section pb-18 xl:pb-24 pt-24 lg:pt-32 mb-0" style={{ marginBottom: '0px' }}>
        <div className="container">
          <div
            data-aos="fade-up-sm"
            data-aos-delay="150"
            className="row justify-center"
          >
            <div className="col-10 lg:col-7">
              {team.badge.enable && (
                <TitleBadge
                  icon={team.badge.icon}
                  label={team.badge.label}
                  bg_color={team.badge.bg_color}
                />
              )}
              <h2
                className="py-4 text-center"
                dangerouslySetInnerHTML={markdownify(team.title || "")}
              />
              <p
                className="text-center text-balance text-[18px] tracking-[0.0005px] leading-[1.69]"
                dangerouslySetInnerHTML={markdownify(team.description || "")}
              />
            </div>
          </div>
          <div className="pt-14">
            {/* First Row: Patron, President */}
            <div className="row g-4 justify-center">
              {team.members?.filter((member) => {
                const designation = member.designation?.toLowerCase() || '';
                return designation === 'patron' || designation === 'president';
              }).map((member, i) => {
                const originalIndex = team.members?.findIndex(m => m.name === member.name) || i;
                return (
                  <div className="col-10 sm:col-6 md:col-4 lg:col-3 mx-auto" key={`first-${i}`}>
                    <TeamCard member={member} index={originalIndex} />
                  </div>
                );
              })}
            </div>
            {/* Second Row: Director, Secretary, Treasurer, Asst.Director */}
            <div className="row g-4 pt-4">
              {team.members?.filter((member) => {
                const designation = member.designation?.toLowerCase() || '';
                return designation === 'director' || designation === 'secretary' ||
                  designation === 'treasurer' || designation === 'asst.director';
              }).map((member, i) => {
                // Use local index i for animation delay to make second row appear faster
                return (
                  <div className="col-10 sm:col-6 md:col-4 lg:col-3 mx-auto" key={`second-${i}`}>
                    <TeamCard member={member} index={i} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="section-lg pt-0 xl:pt-4">
        <div className="container">
          <div
            data-aos="fade-up-sm"
            data-aos-delay="150"
            className="row justify-between items-center max-lg:text-center"
          >
            <div className="lg:col-7">
              {badge && <TitleBadge
                icon={badge.icon}
                label={badge.label}
                bg_color={badge.bg_color}
                isCenter={false}
              />}
              <h2 className="py-4 h1" dangerouslySetInnerHTML={markdownify(title || "")} />
            </div>
            <div className="lg:col-5">
              <p className="text-balance text-[18px] tracking-[0.0005px] leading-[1.69]" dangerouslySetInnerHTML={markdownify(description || "")} />
              {button?.enable && (
                <Link href={button.link} className="btn btn-primary mt-4">
                  {button.label}
                </Link>
              )}
            </div>
            <ImageFallback
              src={image!}
              alt={title || "About Image"}
              width={1280}
              height={720}
              className="w-full rounded-4xl pt-12"
            />
          </div>
          <BrandSlider brands={brands} />
          <Features features={features} />
        </div>
      </section>
      {numbers_banner.enable && (
        <section className="section pt-0">
          <div className="container">
            <div
              data-aos="fade-up-sm"
              data-aos-delay="150"
              className="row justify-center"
            >
              <div className="col-11 lg:col-7">
                {numbers_banner.badge.enable && (
                  <TitleBadge
                    icon={numbers_banner.badge.icon}
                    label={numbers_banner.badge.label}
                    bg_color={numbers_banner.badge.bg_color}
                  />
                )}
                <h2
                  className="py-4 text-center"
                  dangerouslySetInnerHTML={markdownify(numbers_banner.title || "")}
                />
                <p
                  className="text-center text-balance text-[18px] tracking-[0.0005px] leading-[1.69]"
                  dangerouslySetInnerHTML={markdownify(numbers_banner.description || "")}
                />
              </div>
            </div>
            <NumbersBanner numbers_banner={numbers_banner} bgColor="bg-tertiary/60" />
            <ImpactResults impactResults={impact_results} />
          </div>
        </section>
      )}
      <Testimonial />
      <CallToActionSecondary />
    </>
  );
}