import DonationForm from "@/components/DonationForm";
import SuccessNumbers from "@/components/SuccessNumbers";
import TitleBadge from "@/components/TitleBadge";
import config from "@/config/config.json";
import ReviewSlider from "@/layouts/components/ReviewSlider";
import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionPrimary from "@/partials/CallToActionPrimary";
import FeaturesSection from "@/partials/FeaturesSection";
import ImpactResultsSection from "@/partials/ImpactResultsSection";
import SeoMeta from "@/partials/SeoMeta";
import type { DonationPage, Homepage, ReviewsSection } from "@/types";
import Link from "next/link";

export default function DonationPage() {
  const donationIndex = getListPage<DonationPage["frontmatter"]>("donation/_index.md");
  const { contact_form_action } = config.params;
  const { badge, title, description, packages } = donationIndex.frontmatter;
  const reviewsSection = getListPage<ReviewsSection["frontmatter"]>(
    "sections/reviews-section.md"
  );
  const { impact_results } = getListPage<Homepage["frontmatter"]>("homepage/_index.md").frontmatter;

  return (
    <>
      <SeoMeta {...donationIndex.frontmatter} />
      <section className="section-lg">
        <div className="container">
          <div
            data-aos="fade-up-sm"
            data-aos-delay="200"
            className="row g-4 justify-between items-start"
          >
            <div className="lg:col-6 max-lg:text-center">
              <TitleBadge
                icon={badge.icon}
                label={badge.label}
                bg_color={badge.bg_color}
                isCenter={false}
              />
              <h1 className="pt-4 pb-10" dangerouslySetInnerHTML={markdownify(title || "")} />
              <ReviewSlider data={reviewsSection.frontmatter} isDonationPage />
            </div>
            <div data-aos="fade-up-sm" data-aos-delay="200" className="lg:col-6">
              <DonationForm
                description={description || ""}
                contactFormAction={contact_form_action}
              />
            </div>
          </div>
        </div>
      </section>
      {packages.enable && (
        <section className="section-lg pt-0">
          <div className="container">
            <div
              data-aos="fade-up-sm"
              data-aos-delay="100"
              className="row justify-center"
            >
              <div className="col-10 lg:col-6">
                {badge.enable && (
                  <TitleBadge
                    icon={packages.badge.icon}
                    label={packages.badge.label}
                    bg_color={packages.badge.bg_color}
                  />
                )}
                <h2
                  className="py-4 text-center"
                  dangerouslySetInnerHTML={markdownify(packages.title || "")}
                />
                <p
                  className="text-center text-balance"
                  dangerouslySetInnerHTML={markdownify(packages.description || "")}
                />
              </div>
            </div>
            <div className="pt-14 metrics-cards">
              {packages.plans &&
                packages.plans.length > 0 &&
                packages.plans.map((plan, i) => (
                  <div
                    data-aos="fade-up-sm"
                    data-aos-delay={i * 100}
                    className="card"
                    key={i}
                  >
                    <h4
                      className="mb-4 text-white font-semibold"
                      dangerouslySetInnerHTML={markdownify(plan.title || "")}
                    />
                    <p dangerouslySetInnerHTML={markdownify(plan.description || "")} />
                    <p
                      dangerouslySetInnerHTML={markdownify(plan.amount || "")}
                      className={`h1 mt-8 font-semibold`}
                    />
                    <p
                      className="-mt-2 mb-12"
                      dangerouslySetInnerHTML={markdownify(plan.billed_per || "")}
                    />
                    {plan.button.enable && (
                      <Link href={plan.button.link} className="btn btn-outline py-3">
                        {plan.button.label}
                      </Link>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}
      <FeaturesSection />
      <ImpactResultsSection impactResults={impact_results} isNoSectionTop />
      <CallToActionPrimary />
      <SuccessNumbers />
    </>
  );
}