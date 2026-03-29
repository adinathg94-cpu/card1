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
import { headers } from "next/headers";
import type { Homepage } from "@/types";

export default async function Home() {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let homepage: any = { frontmatter: {} };
  try {
    const res = await fetch(
      `${baseUrl}/api/posts?folder=homepage&isList=true`,
      { cache: "no-store" }
    );
    if (res.ok) {
      homepage = await res.json();
    }
  } catch (error) {
    console.error("Error fetching homepage from API:", error);
  }

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