import HeroBanner from "@/partials/HeroBanner";
import PromotionsSection from "@/components/PromotionsSection";
import ImpactResultsSection from "@/partials/ImpactResultsSection";
import CallToActionPrimary from "@/partials/CallToActionPrimary";
import ProgramsSection from "@/partials/ProgramsSection";
import SuccessNumbers from "@/components/SuccessNumbers";
import FeaturesSection from "@/partials/FeaturesSection";
import ProductsSection from "@/partials/ProductsSection";
import CallToActionTertiary from "@/partials/CallToActionTertiary";
import ReviewSection from "@/partials/ReviewSection";
import CallToActionSecondary from "@/partials/CallToActionSecondary";
import FAQs from "@/partials/FAQs";
import SeoMeta from "@/partials/SeoMeta";
import { getListPage } from "@/lib/contentParser";
import type { Homepage } from "@/types";

export default function Home() {
  const homepage = getListPage<Homepage["frontmatter"]>("homepage/_index.md");
  const { banner, promotions, impact_results } = homepage.frontmatter;

  return (
    <>
      <SeoMeta {...homepage.frontmatter} />
      <HeroBanner banner={banner} />
      <PromotionsSection promotions={promotions} />
      <ImpactResultsSection impactResults={impact_results} />
      <CallToActionPrimary />
      <ProgramsSection />
      <SuccessNumbers />
      <FeaturesSection />
      <ProductsSection />
      <CallToActionTertiary />
      <ReviewSection />
      <CallToActionSecondary />
      <FAQs />
    </>
  );
}