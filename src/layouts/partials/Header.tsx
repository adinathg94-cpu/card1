"use client";

import Logo from "@/components/Logo";
import config from "@/config/config.json";
import menu from "@/config/menu.json";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaAngleDown, FaArrowRightLong } from "react-icons/fa6";

const Header = () => {
  const [isNavToggled, setIsNavToggled] = useState(false);
  const [dropdownVisibility, setDropdownVisibility] = useState({});
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  // Handle screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    // Initial check
    checkScreenSize();

    // Add resize event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Handle hamburger menu toggle
  const handleNavToggle = () => {
    setIsNavToggled(!isNavToggled);
  };

  // Handle dropdown toggle for mobile screens
  const handleDropdownToggle = (id: string) => {
    if (isLargeScreen) return; // Don't toggle on large screens

    setDropdownVisibility((prev) => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev],
    }));
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
        <div className="order-0 flex items-center">
          <Logo />
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
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
            className={`navbar-nav absolute left-0 right-0 lg:static lg:flex items-center lg:w-auto lg:space-x-4 lg:pb-0 whitespace-nowrap ${
              isNavToggled ? "" : "hidden"
            } lg:flex lg:justify-center`}
          >
            {menu.main.map((item, i) => (
              <li
                key={i}
                id={item.hasChildren ? "all-pages" : undefined}
                className={`nav-item ${item.hasChildren ? "nav-dropdown group relative" : ""
                  }`}
                onClick={
                  item.hasChildren
                    ? () => handleDropdownToggle(`dropdown-${i}`)
                    : undefined
                }
              >
                <Link
                  href={item.url}
                  aria-label={item.name}
                  className="nav-link inline-flex items-center cursor-pointer text-[15px] font-semibold tracking-[0.14em] uppercase text-[#034833]"
                >
                  {item.name}
                  <FaAngleDown className="ml-1 text-[10px]" />
                </Link>
                {item.hasChildren && (
                  <ul
                    className={`grid sm:grid-cols-2 md:grid-cols-3 lg:mt-12 gap-x-4 border border-border bg-body p-8 lg:pr-0 mb-2 lg:mb-0
         lg:duration-200 lg:absolute lg:left-0 lg:invisible lg:group-hover:visible
         lg:opacity-0 lg:group-hover:opacity-100 lg:scale-95 lg:group-hover:scale-100
         lg:group-hover:grid max-w-fit lg:min-w-max nav-dropdown-list ${!isLargeScreen &&
                        !dropdownVisibility[`dropdown-${i}` as keyof typeof dropdownVisibility]
                        ? "hidden"
                        : ""
                      }`}
                    id={`dropdown-${i}`}
                  >
                    {item.children.map((child: any, j: number) => (
                      <li key={j} className="nav-dropdown-item">
                        <Link
                          href={child.url}
                          className="nav-dropdown-link"
                          aria-label={`menu: ${child.name}`}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
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