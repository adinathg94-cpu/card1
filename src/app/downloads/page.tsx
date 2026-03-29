import TitleBadge from "@/components/TitleBadge";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionSecondary from "@/partials/CallToActionSecondary";
import SeoMeta from "@/partials/SeoMeta";
import type { RegularPage } from "@/types";
import Link from "next/link";
import { FaDownload, FaFilePdf } from "react-icons/fa6";

import { headers } from "next/headers";

export default async function DownloadsPage() {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let downloads: any = { frontmatter: {} };
  try {
    const res = await fetch(`${baseUrl}/api/posts?folder=downloads&isList=true`, {
      cache: "no-store",
    });
    if (res.ok) {
      downloads = await res.json();
    }
  } catch (error) {
    console.error("Error fetching downloads index from API:", error);
  }

  const { title, meta_title, description, image, badge } = downloads.frontmatter;

  // Get downloads from database via API
  let dbDownloads: any[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/downloads`, { cache: "no-store" });
    if (res.ok) {
      dbDownloads = await res.json();
    }
  } catch (error) {
    console.error("Error fetching downloads from API:", error);
  }
  const pdfFiles = dbDownloads.map((download) => ({
    name: download.name,
    url: download.url,
    size: download.file_size || "N/A",
    date: download.date || new Date().toISOString(),
  }));

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
                className="text-center text-balance text-[18px] tracking-[0.0005px] leading-[1.69]"
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



