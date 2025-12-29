import Products from "@/components/Products";
import TitleBadge from "@/components/TitleBadge";
import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import type { ProductsSection } from "@/types";

const ProductsSection = () => {
  const productsSection = getListPage<ProductsSection["frontmatter"]>(
    "sections/products-section.md"
  );

  const { enable, title, description, badge, products } =
    productsSection.frontmatter;

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
