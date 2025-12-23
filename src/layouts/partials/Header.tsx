"use client";

import Logo from "@/components/Logo";
import config from "@/config/config.json";
import menu from "@/config/menu.json";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaAngleDown, FaArrowRightLong } from "react-icons/fa6";

const Header = () => {
  const [isNavToggled, setIsNavToggled] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsNavToggled(false);
  }, [pathname]);

  // Handle hamburger menu toggle
  const handleNavToggle = () => {
    setIsNavToggled(!isNavToggled);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navMenu = document.getElementById("nav-menu");
      const navToggle = document.getElementById("nav-toggle") as HTMLInputElement;

      if (
        navMenu &&
        !navMenu.contains(event.target as Node) &&
        !document.querySelector(".ham-btn")?.contains(event.target as Node)
      ) {
        setIsNavToggled(false);
        if (navToggle) navToggle.checked = false;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header z-30">
      <nav className="navbar container px-4 flex items-center justify-between gap-6 flex-nowrap">
        {/* logo */}
        <div className="order-0 flex items-center flex-shrink-0">
          <Logo />
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end header-menu">
          {/* Desktop Donate Button */}
          <div className="ml-auto flex items-center lg:ml-2 order-1">
            {config.navigation_button && config.navigation_button.enable && (
              <Link
                className="btn btn-primary lg:inline-flex hidden items-center gap-2 rounded-full bg-[#0c79c0] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0a68a6] whitespace-nowrap"
                aria-label={config.navigation_button.label}
                href={config.navigation_button.link}
              >
                {config.navigation_button.label}
                <FaArrowRightLong className="text-base" />
              </Link>
            )}
          </div>
          {/* navbar toggler - moved to right */}
          <input
            id="nav-toggle"
            type="checkbox"
            className="hidden"
            title="nav-toggle"
            checked={isNavToggled}
            onChange={handleNavToggle}
          />
          <label
            htmlFor="nav-toggle"
            className="cursor-pointer flex items-center lg:hidden order-2"
          >
            <div id="show-button">
              <div className={`ham-btn ${isNavToggled ? "active" : ""}`}>
                <span></span>
              </div>
            </div>
          </label>
          {/* /navbar toggler */}
          <ul
            id="nav-menu"
            className={`navbar-nav absolute left-0 right-0 lg:static lg:flex items-center lg:w-auto lg:space-x-4 lg:pb-0 whitespace-nowrap ${isNavToggled ? "" : "hidden"
              } lg:flex lg:justify-center`}
          >
            {menu.main.map((item, i) => (
              <li key={i} className="nav-item">
                <Link
                  href={item.url}
                  aria-label={item.name}
                  className="nav-link inline-flex items-center cursor-pointer text-[15px] font-regular tracking-[0.14em] uppercase text-[#034833]"
                >
                  {item.name}
                  {item.name === "Activities" && (
                    <FaAngleDown className="ml-1 text-[10px]" />
                  )}
                </Link>
              </li>
            ))}
            {config.navigation_button && config.navigation_button.enable && (
              <li className="lg:hidden mt-4 flex justify-center">
                <Link
                  className="btn py-2 px-4  btn-primary"
                  aria-label={config.navigation_button.label}
                  href={config.navigation_button.link}
                >
                  {config.navigation_button.label}
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;