import Social from "@/components/Social";
import config from "@/config/config.json";
import menu from "@/config/menu.json";
import social from "@/config/social.json";
import ImageFallback from "@/helpers/ImageFallback";
import { markdownify } from "@/lib/utils/textConverter";
import Link from "next/link";

const Footer = () => {
  const { copyright, footer_description } = config.params;

  const replaceYear = (text: string): string => {
    const year = new Date().getFullYear();
    return text.replace("{year}", year.toString());
  };

  return (
    <footer data-aos="fade-up-sm" data-aos-delay="150" className="section py-0">
      <div className="container">
        <div className="row justify-center">
          <div className="col-11">
            <div className="row gx-4">
              <div className="md:col-6 lg:col-4">
                <div className="mb-10 lg:mb-8">
                  <ImageFallback
                    src={config.site.logo}
                    width={192}
                    height={36}
                    alt="footer logo"
                    className="mb-5"
                    loading="lazy"
                  />
                  <p
                    className="mb-4 md:text-balance text-lg text-text lg:mb-8 max-xl:[&>br]:hidden"
                    dangerouslySetInnerHTML={markdownify(footer_description)}
                  />
                  {config.subscription_in_footer &&
                    config.subscription_in_footer.enable && (
                      <form
                        action={
                          config.subscription_in_footer
                            .mailchimp_form_action
                        }
                        target="_blank"
                        method="post"
                        className="flex justify-between rounded-full bg-dark/3 pl-1.5"
                      >
                        <span className="bg-body p-2 rounded-full m-auto">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="none"
                          >
                            <g
                              stroke="#030303"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeMiterlimit="10"
                              strokeWidth="1.5"
                              opacity={0.4}
                            >
                              <>
                                <path d="M14.167 17.083H5.834c-2.5 0-4.167-1.25-4.167-4.166V7.082c0-2.917 1.667-4.167 4.167-4.167h8.333c2.5 0 4.167 1.25 4.167 4.167v5.833c0 2.917-1.667 4.167-4.167 4.167Z" />
                                <path d="m14.166 7.5-2.608 2.083c-.858.684-2.267.684-3.125 0L5.833 7.5" />
                              </>
                            </g>
                          </svg>
                        </span>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="form-input text-sm text-text-dark! w-full rounded-full !border-transparent bg-transparent py-2! pl-2! placeholder:!opacity-100 placeholder:text-text focus:ring-0"
                          required
                          name={
                            config.subscription_in_footer
                              .mailchimp_form_name
                          }
                        />
                        <button
                          className="rounded-full bg-dark text-sm text-white px-4 py-3 font-medium transition hover:opacity-80 cursor-pointer"
                          type="submit"
                        >
                          Subscribe
                        </button>
                      </form>
                    )}
                </div>
              </div>
              <div className="md:col-6 lg:col-7 ml-auto">
                <div className="mb-10 lg:mb-8">
                  <div className="row max-lg:gy-4 justify-start lg:justify-end">
                    {menu.footer.map((menu) => (
                      <div
                        key={menu.title}
                        className="col-6 md:col-6 lg:col-3 pr-0"
                      >
                        <h5 className="mb-7 font-medium text-base lg:mb-6">
                          {menu.title}
                        </h5>
                        <ul>
                          {menu.children.map((child) => (
                            <li
                              key={child.name}
                              className="mb-4 text-text text-base hover:text-primary"
                            >
                              <Link href={child.url}>{child.name}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="text-center text-sm pt-8 pb-14 pb border-t border-border flex flex-col md:flex-row gap-y-6 justify-between"
            >
              {config.params.copyright && (
                <p
                  className="[&>a]:underline text-text"
                  dangerouslySetInnerHTML={markdownify(replaceYear(copyright))}
                />
              )}
              <Social source={social.main} className="social-icons" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;