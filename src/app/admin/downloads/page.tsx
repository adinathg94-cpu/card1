"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import Link from "next/link";
import { FaPlus, FaPenToSquare, FaTrash } from "react-icons/fa6";

interface Download {
  id: number;
  name: string;
  url: string;
  file_size: string;
  date: string;
}

export default function DownloadsListPage() {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const response = await fetch("/api/downloads");
      const data = await response.json();
      setDownloads(data);
    } catch (error) {
      console.error("Error fetching downloads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this download?")) return;

    try {
      const response = await fetch(`/api/downloads/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchDownloads();
      } else {
        alert("Failed to delete download");
      }
    } catch (error) {
      console.error("Error deleting download:", error);
      alert("Failed to delete download");
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Downloads</h1>
          <Link href="/admin/downloads/new" className="btn btn-primary">
            <FaPlus className="mr-2" />
            New Download
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : downloads.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No downloads found. Create your first download!
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-theme-light rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-theme-light dark:bg-dark-theme-light">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Size</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {downloads.map((download) => (
                  <tr
                    key={download.id}
                    className="border-t border-border hover:bg-theme-light dark:hover:bg-dark-theme-light"
                  >
                    <td className="px-6 py-4">{download.name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {download.file_size || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(download.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/downloads/${download.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <FaPenToSquare />
                        </Link>
                        <button
                          onClick={() => handleDelete(download.id)}
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
