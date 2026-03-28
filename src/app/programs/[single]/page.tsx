import TitleBadge from "@/components/TitleBadge";
import ImageFallback from "@/helpers/ImageFallback";
import MDXContent from "@/helpers/MDXContent";
import { parseJSON } from "@/lib/db";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionQuaternary from "@/partials/CallToActionQuaternary";
import CallToActionSecondary from "@/partials/CallToActionSecondary";
import FAQs from "@/partials/FAQs";
import SeoMeta from "@/partials/SeoMeta";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

// Opt out of Full Route Cache so admin edits show immediately
export const revalidate = 0;

const ProgramSingle = async (props: { params: Promise<{ single: string }> }) => {
  const params = await props.params;
  const headerList = await headers();
  const host = headerList.get("host");
  
  // Use protocol-relative or detect protocol
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let program: any = null;

  try {
    // Fetch via API to avoid native SQLite bindings in the page worker
    // Using the detected host ensures it works on both dev/prod/preview domains
    const res = await fetch(`${baseUrl}/api/programs/${params.single}`, {
      cache: "no-store",
    });
    if (res.ok) {
      program = await res.json();
    }
  } catch (err) {
    console.error("Fetch error:", err);
    // Explicitly avoid fallback that imports native modules to prevent EEXIST crash
  }

  if (!program) {
    notFound();
  }

  const categories = parseJSON<string[]>(program.categories) || [];
  const { title, image, description, content } = program;

  const frontmatter = {
    title,
    description,
    image,
    meta_title: title,
  };

  return (
    <>
      <SeoMeta {...frontmatter} />
      <section className="section-lg pb-0">
        <div className="container">
          <article data-aos="fade-up-sm" data-aos-delay="150">
            <TitleBadge
              icon={"FaAngleRight"}
              label={categories.length > 0 ? categories.join(", ") : "Program"}
              bg_color={"bg-secondary"}
              isCenter={false}
            />
            <h1
              dangerouslySetInnerHTML={markdownify(title)}
              className="mb-8 mt-4 font-semibold text-balance"
            />

            {image && (
              <div className="mb-10 relative overflow-hidden rounded-4xl group">
                <ImageFallback
                  src={image}
                  height={600}
                  width={1280}
                  alt={title}
                  className="w-full aspect-16/7.5 object-cover object-center group-hover:scale-105 transition duration-700"
                  priority
                />
              </div>
            )}

            <div className="row justify-center mt-12">
              <div className="lg:col-10">
                <div className="content mb-10">
                  <MDXContent content={content} />
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
      <CallToActionQuaternary isNoSectionTop />
      <FAQs />
      <CallToActionSecondary />
    </>
  );
};

export default ProgramSingle;