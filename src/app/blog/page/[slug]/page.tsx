import CallToActionSecondary from "@/partials/CallToActionSecondary";
import BlogClient from "../../BlogClient";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <BlogClient slug={slug} />
      <CallToActionSecondary isNoSectionTop />
    </>
  );
}