"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/admin/components/AdminLayout";
import RichTextEditor from "@/app/admin/components/RichTextEditor";
import ImageUpload from "@/app/admin/components/ImageUpload";

export default function NewProgramPage() {
  const router = useRouter();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/programs");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to create program");
      }
    } catch (error) {
      console.error("Error creating program:", error);
      alert("Failed to create program");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Program</h1>
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
                placeholder="e.g. community-rebuilding"
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
              placeholder="e.g. Community Rebuilding"
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
              placeholder="e.g. Education, Health"
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
              placeholder="Brief summary for cards..."
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
              className="px-8 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Program"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 bg-dark/10 rounded-lg hover:bg-dark/20 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
