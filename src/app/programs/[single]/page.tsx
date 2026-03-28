import TitleBadge from "@/components/TitleBadge";
import ImageFallback from "@/helpers/ImageFallback";
import MDXContent from "@/helpers/MDXContent";
import { getDB, parseJSON } from "@/lib/db";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionQuaternary from "@/partials/CallToActionQuaternary";
import CallToActionSecondary from "@/partials/CallToActionSecondary";
import FAQs from "@/partials/FAQs";
import SeoMeta from "@/partials/SeoMeta";
import { notFound } from "next/navigation";

// remove dynamicParams
export const dynamicParams = true;

// generate static params
export async function generateStaticParams() {
  const db = getDB();
  const programs = db.prepare("SELECT slug FROM programs").all() as { slug: string }[];

  return programs.map((program) => ({
    single: program.slug,
  }));
}

const ProgramSingle = async (props: { params: Promise<{ single: string }> }) => {
  const params = await props.params;
  const db = getDB();
  const program = db.prepare("SELECT * FROM programs WHERE slug = ?").get(params.single) as any;

  if (!program) {
    notFound();
  }

  const categories = parseJSON<string[]>(program.categories) || [];
  const { title, image, description, content, goal, raised } = program;

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
            
            <div className="flex flex-wrap gap-4 mb-8">
              {goal && (
                <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-semibold border border-secondary/20">
                  Goal: {goal}
                </span>
              )}
              {raised && (
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold border border-green-200">
                  Raised: {raised}
                </span>
              )}
            </div>

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
}

export default ProgramSingle;