import Link from "next/link";
import Image from "next/image";
import type { ProductsSection } from "@/types";
import { markdownify } from "@/lib/utils/textConverter";

interface Props {
  products: ProductsSection["frontmatter"]["products"];
}

const Products = ({ products }: Props) => {
  if (!products || products.length === 0) return null;

  return (
    <div data-aos="fade-up-sm" data-aos-delay="200" className="pt-10">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
        {products.map((p, i) => (
          <div
            key={i}
            className="group bg-white rounded-3xl overflow-hidden border border-border/60 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
          >
            <div className="relative w-full h-72 md:h-80 lg:h-96 overflow-hidden">
              <Image
                src={p.image}
                alt={p.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

              <div className="absolute left-0 bottom-0 p-8 text-white w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl lg:text-7xl font-bold leading-none tracking-tight">{p.count}</span>
                </div>
                <div className="h-1 w-12 bg-primary mb-4 rounded-full" />
                <div className="text-base font-medium text-white/90 leading-snug max-w-[90%]">{p.meta}</div>
              </div>
            </div>

            <div className="p-8 flex flex-col gap-6 flex-1 relative">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold tracking-tight text-text-dark group-hover:text-primary transition-colors duration-300" dangerouslySetInnerHTML={markdownify(p.title)} />
                <p className="text-text/80 text-[18px] leading-[1.25] tracking-[0.0005px] line-clamp-4" dangerouslySetInnerHTML={markdownify(p.description)} />
              </div>

              <div className="mt-auto pt-4">
                {p.button?.enable && (
                  <Link
                    href={p.button.link}
                    className="btn btn-outline w-full sm:w-auto inline-flex items-center justify-center gap-2.5 !py-3 !px-8 text-base group/btn"
                  >
                    {p.button.label}
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
