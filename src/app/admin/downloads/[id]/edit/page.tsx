"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "../../../components/AdminLayout";
import FileUpload from "../../../components/FileUpload";

export default function EditDownloadPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    file_size: "",
    file_type: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchDownload();
  }, [id]);

  const fetchDownload = async () => {
    try {
      const response = await fetch(`/api/downloads/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || "",
          url: data.url || "",
          file_size: data.file_size || "",
          file_type: data.file_type || "",
          description: data.description || "",
          date: data.date ? data.date.split("T")[0] : new Date().toISOString().split("T")[0],
        });
      }
    } catch (error) {
      console.error("Error fetching download:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (url: string, fileSize: string, fileType: string) => {
    setFormData({
      ...formData,
      url,
      file_size: fileSize,
      file_type: fileType,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/downloads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/downloads");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update download");
      }
    } catch (error) {
      console.error("Error updating download:", error);
      alert("Failed to update download");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Edit Download</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <FileUpload
            value={formData.url}
            onChange={handleFileUpload}
            label="File *"
          />

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

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? "Saving..." : "Save Changes"}
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
