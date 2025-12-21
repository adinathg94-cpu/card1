"use client";

import { useState } from "react";

interface FileUploadProps {
  value?: string;
  onChange: (url: string, fileSize: string, fileType: string) => void;
  label?: string;
  accept?: string;
}

export default function FileUpload({
  value,
  onChange,
  label = "File",
  accept = ".pdf,.doc,.docx",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError("File size must be less than 50MB");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "file");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        onChange(data.url, formatFileSize(file.size), file.type);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      {value && (
        <div className="mb-4 p-3 bg-theme-light dark:bg-dark-theme-light rounded-lg">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {value.split("/").pop()}
          </a>
        </div>
      )}
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}
