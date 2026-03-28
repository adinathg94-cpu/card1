"use client";

import ImageFallback from "@/helpers/ImageFallback";
import { markdownify } from "@/lib/utils/textConverter";
import { BannerSection } from "@/types";
import Link from "next/link";
import { FaArrowRightLong, FaPhone, FaEnvelope } from "react-icons/fa6";




const HeroBanner = ({ banner }: { banner: BannerSection }) => {
  const { contact_info } = banner as BannerSection & {
    contact_info?: {
      enable: boolean;
      phone: string;
      email: string;
    };
  };

  return (
    <section className="relative w-full h-[800px] overflow-hidden pt-24 lg:pt-32">
      {/* Background Image */}
      {banner.image && (
        <div className="absolute inset-0 w-full h-full">
          <ImageFallback
            src={banner.image}
            alt="Hero Banner"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Content Container */}
      <div className="container relative z-10 h-full flex items-center">
        <div className="w-full max-w-[680px] space-y-6">
          {/* Subtitle/Badge */}
          {banner.subtitle && (
            <div 
              className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full"
              data-aos="fade-up-sm"
              data-aos-delay="100"
            >
              <span className="text-white text-sm font-bold tracking-widest uppercase">
                {banner.subtitle}
              </span>
            </div>
          )}

          {/* Main Heading */}
          <h1
            dangerouslySetInnerHTML={markdownify(banner.title)}
            className="text-[48px] md:text-[60px] lg:text-[75px] font-bold leading-tight text-white capitalize"
            data-aos="fade-up-sm"
            data-aos-delay="150"
          />

          {/* Buttons Row */}
          <div
            className="flex flex-wrap items-center gap-6"
            data-aos="fade-up-sm"
            data-aos-delay="200"
          >
            {/* Read More Button */}
            {banner.button_solid.enable && (
              <Link
                href={banner.button_solid.link}
                className="flex items-center gap-2.5 border border-white rounded-full px-[30px] py-[20px] text-white text-sm font-semibold hover:bg-white hover:text-dark transition-all duration-300"
              >
                {banner.button_solid.label}
                <FaArrowRightLong className="text-sm" />
              </Link>
            )}


          </div>

          {/* Contact Information */}
          {contact_info?.enable && (
            <div
              className="flex flex-col gap-4 mt-8"
              data-aos="fade-up-sm"
              data-aos-delay="250"
            >
              <div className="flex items-center gap-4">
                <div className="w-[27px] h-[27px] rounded-full bg-white/20 flex items-center justify-center">
                  <FaPhone className="text-white text-xs" />
                </div>
                <p className="text-white text-lg font-normal">{contact_info.phone}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-[27px] h-[27px] rounded-full bg-white/20 flex items-center justify-center">
                  <FaEnvelope className="text-white text-xs" />
                </div>
                <p className="text-white text-lg font-normal">{contact_info.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Image/Emblem - positioned absolutely */}
        <div className="absolute right-[150px] top-[604px] w-[206px] h-[206px] hidden xl:block">
          {/* Add your emblem/image here if needed */}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
