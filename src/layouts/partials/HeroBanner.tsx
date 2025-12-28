"use client";

import ImageFallback from "@/helpers/ImageFallback";
import { markdownify } from "@/lib/utils/textConverter";
import { BannerSection } from "@/types";
import Link from "next/link";
import { FaArrowRightLong, FaPhone, FaEnvelope } from "react-icons/fa6";
import { useState, useEffect } from "react";

const HeroVideoPlayer = ({ video }: { video: { label: string; url: string } }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-4 cursor-pointer group"
      >
        {/* Play Button Circle */}
        <div className="w-[55px] h-[55px] rounded-full border-2 border-white flex items-center justify-center group-hover:bg-white/10 transition-all">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-white ml-1"
          >
            <path
              d="M6.5 4.5L14.5 10L6.5 15.5V4.5Z"
              fill="currentColor"
            />
          </svg>
        </div>
        {/* Video Label */}
        <p
          dangerouslySetInnerHTML={markdownify(video.label)}
          className="text-white text-lg font-semibold"
        />
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="relative w-[80%] max-w-3xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
            >
              ×
            </button>
            <iframe
              width="100%"
              height="500"
              src={video.url}
              title="YouTube Video"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

const HeroBanner = ({ banner }: { banner: BannerSection }) => {
  const { media_section, contact_info } = banner as BannerSection & {
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
        <div className="w-full max-w-[680px] space-y-8">
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

            {/* Watch Our Videos */}
            {media_section?.enable && (
              <HeroVideoPlayer video={media_section} />
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
