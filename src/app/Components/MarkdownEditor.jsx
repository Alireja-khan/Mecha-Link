"use client";
import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Upload, Image as ImageIcon } from "lucide-react";

const MarkdownEditor = ({ value, onChange, placeholder = "What's on your mind?" }) => {
  const [isUploading, setIsUploading] = useState(false);

  // Image upload handler
  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      setIsUploading(true);
      
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        
        if (result.success) {
          // Insert Markdown image syntax at cursor position
          const markdownImage = `![${file.name}](${result.imageUrl})`;
          onChange(value ? value + "\n" + markdownImage : markdownImage);
        } else {
          alert("Failed to upload image");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Error uploading image");
      } finally {
        setIsUploading(false);
      }
    };
  };

  return (
    <div className="markdown-editor">
      {/* Custom Toolbar */}
      <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-t-lg bg-gray-50">
        <button
          type="button"
          onClick={handleImageUpload}
          disabled={isUploading}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          <ImageIcon size={16} />
          {isUploading ? "Uploading..." : "Add Image"}
        </button>
        <div className="text-sm text-gray-500 ml-auto">
          Supports Markdown formatting
        </div>
      </div>
      
      {/* MD Editor */}
      <MDEditor
        value={value}
        onChange={onChange}
        preview="edit"
        height={300}
        placeholder={placeholder}
        style={{ 
          borderRadius: "0 0 8px 8px",
          borderTop: "none"
        }}
      />
      
      {/* Preview Toggle */}
      <div className="mt-2 flex gap-2 text-sm">
        <span className="text-gray-600">Tip: Use</span>
        <code className="bg-gray-100 px-1 rounded">**bold**</code>
        <code className="bg-gray-100 px-1 rounded">*italic*</code>
        <code className="bg-gray-100 px-1 rounded">[links](url)</code>
        <code className="bg-gray-100 px-1 rounded">- lists</code>
      </div>
    </div>
  );
};

export default MarkdownEditor;