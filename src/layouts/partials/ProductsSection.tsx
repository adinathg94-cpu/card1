import Products from "@/components/Products";
import TitleBadge from "@/components/TitleBadge";
import { markdownify } from "@/lib/utils/textConverter";
import type { ProductsSection } from "@/types";
import { headers } from "next/headers";

const ProductsSection = async () => {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let productsSectionByFile: any = { frontmatter: {} };
  try {
    const res = await fetch(
      `${baseUrl}/api/posts?file=sections/products-section.md`,
      { cache: "no-store" }
    );
    if (res.ok) {
      productsSectionByFile = await res.json();
    }
  } catch (error) {
    console.error("Error fetching products section from API:", error);
  }

  const { enable, title, description, badge, products } =
    productsSectionByFile.frontmatter;

  return (
    <>
      {enable && (
        <section className="section pb-0 overflow-hidden mb-20">
          <div className="container">
            <div
              data-aos="fade-up-sm"
              data-aos-delay="100"
              className="row justify-center"
            >
              <div className="col-10 lg:col-6">
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
                {description && (
                  <p
                    className="text-center text-balance"
                    dangerouslySetInnerHTML={markdownify(description || "")}
                  />
                )}
              </div>
            </div>

            <Products products={products} />
          </div>
        </section>
      )}
    </>
  );
};

export default ProductsSection;
