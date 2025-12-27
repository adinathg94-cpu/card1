"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

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
  // React 19 compatibility: Polyfill for findDOMNode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ReactDOM = require('react-dom');
      if (!ReactDOM.findDOMNode) {
        ReactDOM.findDOMNode = (node: any) => {
          if (node == null) return null;
          if (node instanceof HTMLElement) return node;
          // For React components, try to get the DOM node
          if (node?._reactInternals?.stateNode instanceof HTMLElement) {
            return node._reactInternals.stateNode;
          }
          return node;
        };
      }
    }
  }, []);

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

