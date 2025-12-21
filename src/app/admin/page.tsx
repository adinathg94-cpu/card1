"use client";

import { useEffect, useState } from "react";
import AdminLayout from "./components/AdminLayout";
import Link from "next/link";
import {
  FaNewspaper,
  FaDownload,
  FaUsers,
  FaPhotoFilm,
} from "react-icons/fa6";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    news: 0,
    downloads: 0,
    administration: 0,
    media: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [newsRes, downloadsRes, adminRes, mediaRes] = await Promise.all([
        fetch("/api/news?includeDrafts=true"),
        fetch("/api/downloads"),
        fetch("/api/administration"),
        fetch("/api/media"),
      ]);

      const news = await newsRes.json();
      const downloads = await downloadsRes.json();
      const admin = await adminRes.json();
      const media = await mediaRes.json();

      setStats({
        news: Array.isArray(news) ? news.length : 0,
        downloads: Array.isArray(downloads) ? downloads.length : 0,
        administration: Array.isArray(admin) ? admin.length : 0,
        media: Array.isArray(media) ? media.length : 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "News & Updates",
      count: stats.news,
      icon: FaNewspaper,
      href: "/admin/news",
      color: "bg-blue-500",
    },
    {
      title: "Downloads",
      count: stats.downloads,
      icon: FaDownload,
      href: "/admin/downloads",
      color: "bg-green-500",
    },
    {
      title: "Administration",
      count: stats.administration,
      icon: FaUsers,
      href: "/admin/administration",
      color: "bg-purple-500",
    },
    {
      title: "Media",
      count: stats.media,
      icon: FaPhotoFilm,
      href: "/admin/media",
      color: "bg-orange-500",
    },
  ];

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="bg-white dark:bg-dark-theme-light rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {card.title}
                      </p>
                      <p className="text-3xl font-bold">{card.count}</p>
                    </div>
                    <div className={`${card.color} p-4 rounded-lg text-white`}>
                      <Icon className="text-2xl" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
