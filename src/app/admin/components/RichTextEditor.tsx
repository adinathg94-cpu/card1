"use client";

import dynamic from "next/dynamic";

// Dynamically import react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  label = "Content",
}: RichTextEditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="bg-white dark:bg-dark-theme-light"
      />
    </div>
  );
}

