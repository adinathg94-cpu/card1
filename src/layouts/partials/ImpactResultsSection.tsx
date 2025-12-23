import ImpactResults from "@/components/ImpactResults";
import TitleBadge from "@/components/TitleBadge";
import { markdownify } from "@/lib/utils/textConverter";
import type { ImpactResultsSection } from "@/types";

interface Props {
  isNoSectionTop?: boolean;
  impactResults: ImpactResultsSection;
}

const ImpactResultsSection = ({ impactResults, isNoSectionTop = false }: Props) => {

  return (
    <>
      {impactResults.enable && (
        <section
          className={`section ${isNoSectionTop && "pt-0"} pb-0 overflow-hidden`}
        >
          <div className="container">
            <div
              data-aos="fade-up-sm"
              data-aos-delay="100"
              className="row justify-center"
            >
              <div className="col-10 lg:col-7">
                {impactResults.badge.enable && (
                  <TitleBadge
                    icon={impactResults.badge.icon}
                    label={impactResults.badge.label}
                    bg_color={impactResults.badge.bg_color}
                  />
                )}
                <h2
                  className="py-4 text-center"
                  dangerouslySetInnerHTML={markdownify(impactResults.title)}
                />
                <p
                  className="text-center text-balance text-[18px] tracking-[0.0005px] leading-[1.69]"
                  dangerouslySetInnerHTML={markdownify(impactResults.description)}
                />
              </div>
            </div>
            <ImpactResults impactResults={impactResults} />
          </div>
        </section>
      )}
    </>
  );
};

export default ImpactResultsSection;