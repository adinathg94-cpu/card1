"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHouse,
  FaNewspaper,
  FaDownload,
  FaUsers,
  FaPhotoFilm,
  FaRightFromBracket,
} from "react-icons/fa6";

interface AdminNavProps {
  pathname: string;
  onLogout: () => void;
}

export default function AdminNav({ pathname, onLogout }: AdminNavProps) {
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: FaHouse },
    { href: "/admin/news", label: "News & Updates", icon: FaNewspaper },
    { href: "/admin/downloads", label: "Downloads", icon: FaDownload },
    { href: "/admin/administration", label: "Administration", icon: FaUsers },
    { href: "/admin/media", label: "Media", icon: FaPhotoFilm },
  ];

  return (
    <nav className="w-64 bg-white dark:bg-dark-theme-light border-r border-border min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>
      <ul className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "hover:bg-theme-light dark:hover:bg-dark-theme-light"
                }`}
              >
                <Icon className="text-lg" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 pt-8 border-t border-border">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-theme-light dark:hover:bg-dark-theme-light w-full text-left"
        >
          <FaRightFromBracket className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
