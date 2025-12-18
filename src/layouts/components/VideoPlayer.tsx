"use client";

import { markdownify } from "@/lib/utils/textConverter";
import React, { useEffect, useState } from "react";

interface VideoPlayerProps {
  video: {
    label: string;
    url: string;
    isAbsolute?: boolean;
  };
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  const { label, url, isAbsolute = true } = video;

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

  useEffect(() => {
    const header = document.querySelector(".header");

    if (isOpen) {
      header && header.classList.replace("z-30", "z-10");
    } else {
      header && header.classList.replace("z-10", "z-30");
    }

    return () => {
      header && header.classList.replace("z-10", "z-30");
    };
  }, [isOpen]);

  const openVideo = () => {
    setIsOpen(true);
  };

  const closeVideo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div
        onClick={openVideo}
        className={`${isAbsolute
          ? "absolute top-[25%] md:top-[40%] left-1/2 transform -translate-x-1/2 flex items-center gap-2 w-full justify-center"
          : "flex items-center gap-2"
          }`}
      >
        <p
          dangerouslySetInnerHTML={markdownify(label)}
          className="cursor-pointer text-dark bg-body rounded-full py-1 px-5 text-base font-semibold leading-6"
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="55"
          height="55"
          fill="none"
          className="cursor-pointer text-body"
        >
          <g clipPath="url(#a)">
            <circle cx="28" cy="27" r="20" fill="#030303" />
            <path
              fill="currentcolor"
              d="M27.5 0C12.312 0 0 12.312 0 27.5S12.312 55 27.5 55 55 42.688 55 27.5C54.984 12.319 42.68.016 27.5 0Zm11.58 28.376c-.19.382-.5.692-.882.882v.01l-15.714 7.857a1.964 1.964 0 0 1-2.842-1.768V19.643a1.964 1.964 0 0 1 2.842-1.758L38.2 25.742a1.964 1.964 0 0 1 .882 2.634Z"
            />
          </g>
          <defs>
            <clipPath id="a">
              <path fill="currentcolor" d="M0 0h55v55H0z" />
            </clipPath>
          </defs>
        </svg>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] transition-opacity duration-500 ease-in-out opacity-100"
          onClick={closeVideo}
        >
          <div className="relative w-[80%] max-w-3xl transition-all duration-500 ease-in-out transform scale-100 opacity-100">
            <iframe
              width="100%"
              height="500"
              src={url}
              title="YouTube Video"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoPlayer;
