"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import Link from "next/link";
import { FaPlus, FaPenToSquare, FaTrash } from "react-icons/fa6";

interface MediaItem {
  id: number;
  type: string;
  title: string;
  link?: string;
}

export default function MediaListPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/media");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching media items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;

    try {
      const response = await fetch(`/api/media/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchItems();
      } else {
        alert("Failed to delete media item");
      }
    } catch (error) {
      console.error("Error deleting media item:", error);
      alert("Failed to delete media item");
    }
  };

  const filteredItems = filter
    ? items.filter((item) => item.type === filter)
    : items;

  const types = [
    "success_story",
    "case_study",
    "innovation",
    "youtube_video",
    "print_media",
    "reel",
    "poster",
  ];

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Media</h1>
          <Link href="/admin/media/new" className="btn btn-primary">
            <FaPlus className="mr-2" />
            New Media Item
          </Link>
        </div>

        <div className="mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg"
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No media items found. Create your first item!
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-theme-light rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-theme-light dark:bg-dark-theme-light">
                <tr>
                  <th className="px-6 py-4 text-left">Title</th>
                  <th className="px-6 py-4 text-left">Type</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-border hover:bg-theme-light dark:hover:bg-dark-theme-light"
                  >
                    <td className="px-6 py-4">{item.title}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                        {item.type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/media/${item.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <FaPenToSquare />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
