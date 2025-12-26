"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../components/AdminLayout";
import ImageUpload from "../../components/ImageUpload";

export default function NewMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    image: "",
    is_lead_team: false,
    bio: "",
    order_index: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/administration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/administration");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to create member");
      }
    } catch (error) {
      console.error("Error creating member:", error);
      alert("Failed to create member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Add Administration Member</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Designation *
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                required
                className="w-full px-4 py-2 border border-border rounded-lg"
              />
            </div>
          </div>

          <ImageUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
          />

          <div>
            <label className="block text-sm font-medium mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="flex items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_lead_team}
                  onChange={(e) => setFormData({ ...formData, is_lead_team: e.target.checked })}
                />
                <span>Lead Team Member</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Creating..." : "Create Member"}
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

