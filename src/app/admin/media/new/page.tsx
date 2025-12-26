"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";
import ImageUpload from "../../components/ImageUpload";

const MEDIA_TYPES = [
  "success_story",
  "case_study",
  "innovation",
  "youtube_video",
  "print_media",
  "reel",
  "poster",
];

export default function NewMediaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "success_story",
    title: "",
    description: "",
    image: "",
    link: "",
    embed_id: "",
    thumbnail: "",
    order_index: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/media");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to create media item");
      }
    } catch (error) {
      console.error("Error creating media item:", error);
      alert("Failed to create media item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">New Media Item</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                className="w-full px-4 py-2 border border-border rounded-lg"
              >
                {MEDIA_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
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

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg"
            />
          </div>

          <ImageUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            label="Image"
          />

          {formData.type === "youtube_video" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  YouTube Embed ID
                </label>
                <input
                  type="text"
                  value={formData.embed_id}
                  onChange={(e) => setFormData({ ...formData, embed_id: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg"
                  placeholder="dQw4w9WgXcQ"
                />
              </div>
              <ImageUpload
                value={formData.thumbnail}
                onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                label="Thumbnail"
              />
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Link
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg"
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Creating..." : "Create Media Item"}
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

