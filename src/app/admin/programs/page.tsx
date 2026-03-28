"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import Link from "next/link";
import { FaPlus, FaPenToSquare, FaTrash } from "react-icons/fa6";

interface Program {
  id: number;
  slug: string;
  title: string;
  featured: boolean;
}

export default function ProgramsListPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch("/api/programs");
      const data = await response.json();
      setPrograms(data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this program?")) return;

    try {
      const response = await fetch(`/api/programs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPrograms();
      } else {
        alert("Failed to delete program");
      }
    } catch (error) {
      console.error("Error deleting program:", error);
      alert("Failed to delete program");
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Programs</h1>
          <Link href="/admin/programs/new" className="btn btn-primary">
            <FaPlus className="mr-2" />
            Add Program
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No programs found. Add your first program!
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-theme-light rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-theme-light dark:bg-dark-theme-light">
                <tr>
                  <th className="px-6 py-4 text-left">Title</th>
                  <th className="px-6 py-4 text-left">Slug</th>
                  <th className="px-6 py-4 text-left">Featured</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((program) => (
                  <tr
                    key={program.id}
                    className="border-t border-border hover:bg-theme-light dark:hover:bg-dark-theme-light"
                  >
                    <td className="px-6 py-4 font-medium">{program.title}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {program.slug}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          program.featured
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {program.featured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/programs/${program.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <FaPenToSquare />
                        </Link>
                        <button
                          onClick={() => handleDelete(program.id)}
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
