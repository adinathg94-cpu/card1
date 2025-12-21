"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import Link from "next/link";
import { FaPlus, FaPenToSquare, FaTrash } from "react-icons/fa6";

interface Member {
  id: number;
  name: string;
  designation: string;
  is_lead_team: boolean;
}

export default function AdministrationListPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/administration");
      const data = await response.json();
      // Filter to only show members with designations displayed on frontend
      const frontendDesignations = ['patron', 'president', 'director', 'secretary', 'treasurer', 'asst.director'];
      const filteredData = data.filter((member: Member) => 
        frontendDesignations.includes(member.designation?.toLowerCase() || '')
      );
      setMembers(filteredData);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      const response = await fetch(`/api/administration/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchMembers();
      } else {
        alert("Failed to delete member");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Failed to delete member");
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Administration</h1>
          <Link href="/admin/administration/new" className="btn btn-primary">
            <FaPlus className="mr-2" />
            Add Member
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : members.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No members found. Add your first member!
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-theme-light rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-theme-light dark:bg-dark-theme-light">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Designation</th>
                  <th className="px-6 py-4 text-left">Type</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-t border-border hover:bg-theme-light dark:hover:bg-dark-theme-light"
                  >
                    <td className="px-6 py-4">{member.name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {member.designation}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          member.is_lead_team
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {member.is_lead_team ? "Lead Team" : "Regular"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/administration/${member.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <FaPenToSquare />
                        </Link>
                        <button
                          onClick={() => handleDelete(member.id)}
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
