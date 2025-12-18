"use client";

import config from "@/config/config.json";
import AOS from "aos";
import "aos/dist/aos.css";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Initialize AOS and sticky header
  useEffect(() => {
    const sticky_header = config.settings.sticky_header;

    // Initialize sticky header navigation
    const stickyNavInit = () => {
      const header = document.querySelector(".header");
      let lastScroll = 0;
      const onScroll = () => {
        const currentScroll = window.scrollY;
        if (
          sticky_header &&
          currentScroll > 300 &&
          currentScroll > lastScroll &&
          header
        ) {
          header.classList.add("header-reveal");
        } else if (currentScroll < 250 && header) {
          header.classList.remove("header-reveal");
        }
        lastScroll = currentScroll;
      };
      window.addEventListener("scroll", onScroll);
      onScroll();
    };

    // Initialize AOS
    AOS.init({
      duration: 600,
      offset: 100,
      once: true,
    });

    // Initialize sticky nav
    stickyNavInit();

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", stickyNavInit);
    };
  }, []);

  return <>{children}</>;
}
