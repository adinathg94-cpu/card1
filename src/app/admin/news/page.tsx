"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import Link from "next/link";
import { FaPlus, FaPenToSquare, FaTrash } from "react-icons/fa6";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  date: string;
  draft: boolean;
}

export default function NewsListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/news?includeDrafts=true");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPosts();
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">News & Updates</h1>
          <Link href="/admin/news/new" className="btn btn-primary">
            <FaPlus className="mr-2" />
            New Post
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No posts found. Create your first post!
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-theme-light rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-theme-light dark:bg-dark-theme-light">
                <tr>
                  <th className="px-6 py-4 text-left">Title</th>
                  <th className="px-6 py-4 text-left">Slug</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-t border-border hover:bg-theme-light dark:hover:bg-dark-theme-light"
                  >
                    <td className="px-6 py-4">{post.title}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {post.slug}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(post.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          post.draft
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {post.draft ? "Draft" : "Published"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/news/${post.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <FaPenToSquare />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
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
