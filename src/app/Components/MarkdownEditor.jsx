"use client";
import { useState, useRef } from "react";
import { Image as ImageIcon, X } from "lucide-react";

const MarkdownEditor = ({ value, onChange, placeholder = "What's on your mind?", onImagesChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const textareaRef = useRef(null);

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
          const newImage = result.imageUrl;
          const updatedImages = [...uploadedImages, newImage];
          setUploadedImages(updatedImages);
          onImagesChange(updatedImages); // Notify parent component
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

  const removeImage = (index) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    onImagesChange(updatedImages); // Notify parent component
  };

  return (
    <div className="space-y-4">
      {/* Textarea - now clean without image URLs */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
      
      {/* Uploaded Images Preview */}
      {uploadedImages.length > 0 && (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</h4>
          <div className="flex flex-wrap gap-3">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative group">
                <img 
                  src={image} 
                  alt={`Uploaded ${index}`}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-100 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
                <div className="text-xs text-gray-500 mt-1 truncate w-20">
                  Image {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleImageUpload}
          disabled={isUploading}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <ImageIcon size={16} />
          {isUploading ? "Uploading..." : "Add Image"}
        </button>
        
        <div className="text-sm text-gray-500">
          {uploadedImages.length} image(s) attached
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;