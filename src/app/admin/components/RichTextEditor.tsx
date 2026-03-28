"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import react-quill (and its CSS) to avoid SSR issues in React 19
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    await import("react-quill/dist/quill.snow.css");
    return RQ;
  },
  {
    ssr: false,
    loading: () => (
      <div className="h-48 border border-border rounded-b-lg bg-white dark:bg-dark-theme-light flex items-center justify-center text-gray-400 text-sm">
        Loading editor...
      </div>
    ),
  }
);

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
  // Wait until client-side mount so react-quill picks up the correct initial value
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // React 19 compatibility: Polyfill for findDOMNode used internally by react-quill
    if (typeof window !== "undefined") {
      import("react-dom").then((module) => {
        const ReactDOM = module.default || (module as any);
        // @ts-ignore
        if (!ReactDOM.findDOMNode) {
          // @ts-ignore
          ReactDOM.findDOMNode = (node: any) => {
            if (node == null) return null;
            if (node instanceof HTMLElement) return node;
            if (node?._reactInternals?.stateNode instanceof HTMLElement) {
              return node._reactInternals.stateNode;
            }
            return node;
          };
        }
      });
    }
    setMounted(true);
  }, []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["blockquote", "code-block"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "link",
    "image",
    "blockquote",
    "code-block",
  ];

  return (
    <div className="rich-text-editor-wrapper">
      <label className="block text-sm font-medium mb-2">{label}</label>
      {mounted && (
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          className="bg-white dark:bg-dark-theme-light"
          style={{ minHeight: "200px" }}
        />
      )}
      {!mounted && (
        <div className="h-48 border border-border rounded-lg bg-white dark:bg-dark-theme-light flex items-center justify-center text-gray-400 text-sm">
          Loading editor...
        </div>
      )}
    </div>
  );
}
