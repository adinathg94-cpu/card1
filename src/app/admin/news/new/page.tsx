"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";
import RichTextEditor from "../../components/RichTextEditor";
import ImageUpload from "../../components/ImageUpload";

export default function NewNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    description: "",
    content: "",
    image: "",
    date: new Date().toISOString().split("T")[0],
    categories: [] as string[],
    draft: false,
    featured: false,
    meta_title: "",
    meta_description: "",
  });
  const [categoryInput, setCategoryInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/news");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const addCategory = () => {
    if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
      setFormData({
        ...formData,
        categories: [...formData.categories, categoryInput.trim()],
      });
      setCategoryInput("");
    }
  };

  const removeCategory = (cat: string) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter((c) => c !== cat),
    });
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">New News Post</h1>
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
                placeholder="my-news-post"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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

          <div>
            <label className="block text-sm font-medium mb-2">
              Categories
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
                className="flex-1 px-4 py-2 border border-border rounded-lg"
                placeholder="Add category"
              />
              <button
                type="button"
                onClick={addCategory}
                className="btn btn-primary"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full flex items-center gap-2"
                >
                  {cat}
                  <button
                    type="button"
                    onClick={() => removeCategory(cat)}
                    className="text-primary hover:text-primary/70"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Meta Description
              </label>
              <textarea
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-border rounded-lg"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.draft}
                onChange={(e) => setFormData({ ...formData, draft: e.target.checked })}
              />
              <span>Save as Draft</span>
            </label>
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
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Creating..." : "Create Post"}
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

