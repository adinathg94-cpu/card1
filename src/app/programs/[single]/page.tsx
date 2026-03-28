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

// Opt out of Full Route Cache so admin edits show immediately
export const revalidate = 0;

const ProgramSingle = async (props: { params: Promise<{ single: string }> }) => {
  const params = await props.params;

  // Use the API route so we don't initiate a second SQLite connection
  // on an ESM worker thread (avoids EEXIST on stdin in Hostinger env)
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  let program: any = null;

  try {
    const res = await fetch(`${baseUrl}/api/programs/${params.single}`, {
      cache: "no-store",
    });
    if (res.ok) {
      program = await res.json();
    }
  } catch {
    // fallback: try direct DB import as last resort
    try {
      const { getDB } = await import("@/lib/db");
      const db = getDB();
      program = db
        .prepare("SELECT * FROM programs WHERE slug = ?")
        .get(params.single);
    } catch {
      // ignore — notFound() below handles missing program
    }
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
                  className="w-full aspect-[16/7.5] object-cover object-center group-hover:scale-105 transition duration-700"
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