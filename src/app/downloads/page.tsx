import TitleBadge from "@/components/TitleBadge";
import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionSecondary from "@/partials/CallToActionSecondary";
import SeoMeta from "@/partials/SeoMeta";
import type { RegularPage } from "@/types";
import Link from "next/link";
import { FaDownload, FaFilePdf } from "react-icons/fa6";

// Sample PDF data - in production, this would come from a CMS or API
const pdfFiles = [
  {
    name: "Annual Report 2023",
    url: "/pdfs/annual-report-2023.pdf",
    size: "2.5 MB",
    date: "2023-12-31"
  },
  {
    name: "Impact Assessment Report",
    url: "/pdfs/impact-assessment-2023.pdf",
    size: "1.8 MB",
    date: "2023-11-15"
  },
  {
    name: "Financial Statement 2023",
    url: "/pdfs/financial-statement-2023.pdf",
    size: "950 KB",
    date: "2023-10-20"
  },
  {
    name: "Program Overview",
    url: "/pdfs/program-overview.pdf",
    size: "1.2 MB",
    date: "2023-09-10"
  },
  {
    name: "Community Impact Study",
    url: "/pdfs/community-impact-study.pdf",
    size: "3.1 MB",
    date: "2023-08-05"
  }
];

export default function DownloadsPage() {
  const downloads = getListPage<RegularPage["frontmatter"]>("downloads/_index.md");
  const { title, meta_title, description, image, badge } = downloads.frontmatter;

  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        description={description}
        image={image}
      />
      <section className="section-lg">
        <div className="container">
          <div
            data-aos="fade-up-sm"
            data-aos-delay="150"
            className="row justify-center"
          >
            <div className="col-10 lg:col-7">
              {badge && badge.enable && (
                <TitleBadge
                  icon={badge.icon}
                  label={badge.label}
                  bg_color={badge.bg_color}
                />
              )}
              <h2
                className="py-4 text-center"
                dangerouslySetInnerHTML={markdownify(title || "")}
              />
              <p
                className="text-center text-balance"
                dangerouslySetInnerHTML={markdownify(description || "")}
              />
            </div>
          </div>

          <div className="pt-14">
            <div className="row g-4 justify-center">
              {pdfFiles.map((pdf, i) => (
                <div
                  key={i}
                  className="col-11 md:col-6 lg:col-4"
                  data-aos="fade-up-sm"
                  data-aos-delay={100 * (i % 3)}
                >
                  <div className="rounded-2xl bg-dark/2 p-6 h-full flex flex-col group hover:bg-dark/5 transition-colors">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <FaFilePdf className="text-2xl text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                          {pdf.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-text-dark mt-2">
                          <span>{pdf.size}</span>
                          <span>•</span>
                          <span>{new Date(pdf.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary mt-auto w-full group-hover:scale-105 transition-transform"
                    >
                      <FaDownload className="mr-2" />
                      Download PDF
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CallToActionSecondary isNoSectionTop={true} />
    </>
  );
}

