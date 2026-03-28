"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/app/admin/components/AdminLayout";
import RichTextEditor from "@/app/admin/components/RichTextEditor";
import ImageUpload from "@/app/admin/components/ImageUpload";

export default function EditProgramPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    description: "",
    content: "",
    image: "",
    date: "",
    end_date: "",
    categories: [] as string[],
    goal: "",
    raised: "",
    featured: false,
    order_index: 0,
  });

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const id = params.id;
        if (!id) return;

        const response = await fetch(`/api/programs/${id}`);
        if (response.ok) {
          const data = await response.json();
          let categoriesArr = [];
          try {
            categoriesArr = typeof data.categories === 'string' ? JSON.parse(data.categories) : (data.categories || []);
          } catch (error) {
            categoriesArr = [];
          }

          setFormData({
            slug: data.slug || "",
            title: data.title || "",
            description: data.description || "",
            content: data.content || "",
            image: data.image || "",
            date: data.date ? data.date.split('T')[0] : "",
            end_date: data.end_date ? data.end_date.split('T')[0] : "",
            categories: categoriesArr,
            goal: data.goal || "",
            raised: data.raised || "",
            featured: Boolean(data.featured),
            order_index: data.order_index || 0,
          });
        } else {
          alert("Failed to fetch program");
          router.push("/admin/programs");
        }
      } catch (error) {
        console.error("Error fetching program:", error);
        alert("Error fetching program");
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/programs/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/programs");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update program");
      }
    } catch (error) {
      console.error("Error updating program:", error);
      alert("Failed to update program");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Edit Program</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                className="w-full px-4 py-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Order Index
              </label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Goal (e.g. $10,000)
              </label>
              <input
                type="text"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Raised (e.g. $2,000)
              </label>
              <input
                type="text"
                value={formData.raised}
                onChange={(e) => setFormData({ ...formData, raised: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Categories (comma separated)
            </label>
            <input
              type="text"
              value={formData.categories.join(", ")}
              onChange={(e) => setFormData({ ...formData, categories: e.target.value.split(",").map(s => s.trim()).filter(s => s !== "") })}
              className="w-full px-4 py-2 border border-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-border rounded-lg"
            />
          </div>

          <ImageUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
          />

          <RichTextEditor
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
          />

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              <span>Featured</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? "Saving..." : "Update Program"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
