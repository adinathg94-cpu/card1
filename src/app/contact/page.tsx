import { getBackgroundClass } from '@/components/Features';
import TitleBadge from '@/components/TitleBadge';
import DynamicIcon from '@/helpers/DynamicIcon';
import { getListPage } from '@/lib/contentParser';
import { markdownify } from '@/lib/utils/textConverter';
import CallToActionSecondary from '@/partials/CallToActionSecondary';
import FAQs from '@/partials/FAQs';
import SeoMeta from '@/partials/SeoMeta';
import type { ContactPage } from '@/types';
import Link from 'next/link';
import ContactForm from '@/layouts/components/ContactForm';

const ContactPage = () => {
  const contactIndex = getListPage<ContactPage["frontmatter"]>('contact/_index.md');
  const { badge, title, description, cta_banners, contact_form_intro } = contactIndex.frontmatter;
  return (
    <>
      <SeoMeta {...contactIndex.frontmatter} />

      <section className="section-lg">
        <div className="container">
          {/* Section Title */}
          <div
            data-aos="fade-up-sm"
            data-aos-delay="100"
            className="row justify-center"
          >
            <div className="col-10 lg:col-6">
              {badge &&
                badge.enable && (
                  <TitleBadge
                    icon={badge.icon}
                    label={badge.label}
                    bg_color={badge.bg_color}
                  />
                )
              }
              <h2 className="py-4 text-center" dangerouslySetInnerHTML={markdownify(title || "")} />
              <p
                className="text-center text-balance text-[18px] tracking-[0.0005px] leading-[1.69]"
                dangerouslySetInnerHTML={markdownify(description || "")}
              />
            </div>
          </div>

          <div className="pt-14">
            <div className="row g-4">
              {
                cta_banners?.map((banner, i) => (
                  <div
                    key={i}
                    className="md:col-6 mx-auto"
                    data-aos="fade-up-sm"
                    data-aos-delay={100 * (i % 2)}
                  >
                    <div
                      className={`${banner.banner_color} rounded-4xl p-14 text-wrap wrap-break-word relative overflow-hidden`}
                    >
                      {/* Circle Background */}
                      <div
                        className="absolute top-[70%] lg:top-[55%] left-1/2 -translate-x-1/2 z-0 rounded-full bg-body/30"
                        style={{ width: '100vw', height: '200vw' }}
                      />

                      <div className="relative z-10 flex flex-col items-center">
                        <h3
                          className="mb-4 h4 font-semibold text-center"
                          dangerouslySetInnerHTML={markdownify(banner.title || "")}
                        />
                        <p
                          className="mb-6 text-center text-balance text-sm text-text-dark"
                          dangerouslySetInnerHTML={markdownify(banner.description || "")}
                        />
                        {banner.button?.enable && (
                          <Link
                            href={banner.button.link}
                            className="btn btn-primary w-full text-center"
                          >
                            {banner.button.label}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          {/* section title   */}
          <div className="row g-4 justify-between items-center">
            <div
              data-aos="fade-up-sm"
              data-aos-delay="200"
              className="lg:col-6 max-lg:text-center"
            >
              <TitleBadge
                icon={contact_form_intro.badge.icon}
                label={contact_form_intro.badge.label}
                bg_color={contact_form_intro.badge.bg_color}
                isCenter={false}
              />
              <h2
                className="py-4"
                dangerouslySetInnerHTML={markdownify(contact_form_intro.title || "")}
              />
              <p
                className="text-balance text-[18px] tracking-[0.0005px] leading-[1.69]"
                dangerouslySetInnerHTML={markdownify(contact_form_intro.description || "")}
              />

              <div className="grid md:grid-cols-2 gap-4 pt-14">
                {
                  contact_form_intro.highlights.map((highlight, i) => {
                    const bgClass = getBackgroundClass(i);
                    return (
                      <div key={i}>
                        <div
                          className={`w-fit max-lg:mx-auto p-2 rounded-xl ${bgClass} mb-8`}
                        >
                          <DynamicIcon
                            icon={highlight.icon}
                            className="text-white text-xl"
                          />
                        </div>

                        <h6
                          className="font-semibold"
                          dangerouslySetInnerHTML={markdownify(highlight.title || "")}
                        />
                        <p
                          className="mt-3 mb-6"
                          dangerouslySetInnerHTML={markdownify(highlight.description || "")}
                        />
                      </div>
                    );
                  })
                }
              </div>
            </div>

            <div data-aos="fade-up-sm" data-aos-delay="200" className="lg:col-6">
              <div className="bg-dark/2 p-10 rounded-2xl">
                <h6 className="h4 mb-2 font-semibold">Let’s Chat</h6>
                <p>Want to learn more about Us, we are ready to help.</p>

                {/* Client-side contact form handles optional mobile number and submits to /api/contact */}
                <div className="mt-8">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQs />
      <CallToActionSecondary isNoSectionTop />
    </>
  )
}

export default ContactPage