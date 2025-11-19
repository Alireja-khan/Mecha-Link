"use client";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {
  Upload,
  PlusCircle,
  XCircle,
  Calendar,
  FileText,
  Tag,
  ImageIcon,
} from "lucide-react";
import {uploadImageToImgbb} from "@/lib/uploadImgbb";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function AdminAddBlogForm() {
  const {register, handleSubmit, reset} = useForm();
  const [categories, setCategories] = useState([
    "Maintenance",
    "Engine Care",
    "Safety",
    "Expert Tips",
    "Technology",
    "Battery Care",
  ]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const onSubmit = (data) => {
    const blogData = {
      title: data.title,
      description: data.description,
      category: isAddingCategory && newCategory ? newCategory : data.category,
      image: profileImage,
      date: data.date || new Date().toLocaleDateString(),
    };

    setProfileImage("");
    axios.post("/api/blogs", blogData).then((res) => {
      if (res.data.id) {
        Swal.fire({
          title: res?.data?.message,
          
          icon: "success",
          iconColor: "var(--color-success)",
        });
      }
    });
    reset();
    setIsAddingCategory(false);
    setNewCategory("");
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    if (image.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    if (!image.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    try {
      setLoading(true);
      const uploaded = await uploadImageToImgbb(image);
      setProfileImage(uploaded);
      toast.success("Profile image uploaded successfully");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setIsAddingCategory(false);
    }
  };

  return (
    <div className="container  bg-base-100/80 backdrop-blur p-8 rounded-box shadow-lg mt-12 border border-base-300">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-xl mb-3">
          <FileText className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-base-content">
          📝 Add New Blog Post
        </h2>
        <p className="text-base-content/70 mt-2">
          Share your insights with the community
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload - Moved to top */}
        <div className="group">
          <label className="block text-base-content font-semibold mb-3">
            Featured Image
          </label>
          <div className="flex flex-col items-center">
            <label
              htmlFor="imageInput"
              className={`cursor-pointer flex flex-col items-center justify-center w-full max-w-md rounded-box border-2 border-dashed transition-all duration-300 p-8 ${
                profileImage
                  ? "border-success bg-success/10"
                  : "border-base-300 bg-base-200 hover:border-primary hover:bg-base-300"
              } ${loading ? "opacity-50" : ""}`}
            >
              {profileImage ? (
                <div className="text-center">
                  <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto mb-3">
                    <ImageIcon className="w-6 h-6 text-success-content" />
                  </div>
                  <span className="text-success font-semibold">
                    Image Uploaded Successfully!
                  </span>
                  <p className="text-success/80 text-sm mt-1">
                    Click to change image
                  </p>
                </div>
              ) : (
                <>
                  <Upload
                    className={`w-10 h-10 mb-3 ${
                      loading ? "text-base-content/40" : "text-primary"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      loading ? "text-base-content/50" : "text-base-content"
                    }`}
                  >
                    {loading
                      ? "Uploading..."
                      : "Click to upload featured image"}
                  </span>
                  <span className="text-base-content/60 text-sm mt-1">
                    PNG, JPG, WEBP (max 5MB)
                  </span>
                </>
              )}
            </label>
            <input
              type="file"
              accept="image/*"
              id="imageInput"
              onChange={handleImageUpload}
              className="hidden"
              disabled={loading}
            />
          </div>
        </div>

        {/* Blog Title */}
        <div className="group">
          <label className="block text-base-content font-semibold mb-2">
            Blog Title
          </label>
          <input
            {...register("title", {required: true})}
            type="text"
            placeholder="Enter blog title..."
            className="w-full border border-base-300 bg-base-100 focus:border-primary rounded-field px-4 py-3 text-base-content focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
          />
        </div>

        {/* Excerpt */}
        <div className="group">
          <label className="block text-base-content font-semibold mb-2">
            Description
          </label>
          <textarea
            {...register("description", {required: true})}
            placeholder="Write a blog description..."
            className="w-full border border-base-300 bg-base-100 focus:border-primary rounded-field px-4 py-3 text-base-content focus:ring-2 focus:ring-primary/20 outline-none min-h-[120px] resize-none transition-all duration-200"
          />
        </div>

        {/* Date */}
        <div className="group">
          <label className="block text-base-content font-semibold mb-2">
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
            <input
              {...register("date")}
              type="date"
              className="w-full border border-base-300 bg-base-100 focus:border-primary rounded-field pl-10 pr-4 py-3 text-base-content focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Category */}
        <div className="group">
          <label className="block text-base-content font-semibold mb-2">
            Category
          </label>

          {!isAddingCategory ? (
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                <select
                  {...register("category")}
                  className="w-full border border-base-300 bg-base-100 rounded-field pl-10 pr-4 py-3 text-base-content focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all duration-200"
                >
                  {categories.map((cat, i) => (
                    <option key={i} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingCategory(true)}
                className="flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors duration-200 whitespace-nowrap"
              >
                <PlusCircle className="w-5 h-5" />
                Add New
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category"
                className="flex-1 border border-base-300 bg-base-100 rounded-field px-4 py-3 text-base-content focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="flex items-center gap-2 bg-primary text-primary-content px-4 py-3 rounded-field font-medium hover:bg-primary/90 transition-all duration-200"
              >
                <PlusCircle className="w-4 h-4" /> Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingCategory(false)}
                className="flex items-center gap-2 text-base-content/70 hover:text-error transition-colors duration-200"
              >
                <XCircle className="w-4 h-4" /> Cancel
              </button>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="text-center pt-4">
          <button
            type="submit"
            className="bg-primary text-primary-content hover:bg-primary/90 transition-all duration-300 px-12 py-3.5 rounded-field font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Publish Blog
          </button>
        </div>
      </form>
    </div>
  );
}
