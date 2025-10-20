"use client";
import { useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// ✅ Example upload helper — replace with your real API upload function
const uploadImageToImgbb = async (image) => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_KEY; // or your backend API
  const formData = new FormData();
  formData.append("image", image);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return data.data.url; // returns uploaded image URL
};

const Advertise = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    bannerImage: "",
    requestFeatured: false,
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  // ✅ Handle Image Upload
  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    // Validate size (max 5MB)
    if (image.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Validate type
    if (!image.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    try {
      setLoading(true);
      const uploadedUrl = await uploadImageToImgbb(image); // or your own API
      setFormData((prev) => ({ ...prev, bannerImage: uploadedUrl }));
      setPreview(uploadedUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Other Inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Submit Ad Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const adData = {
      title: formData.title,
      description: formData.description,
      bannerImage: formData.bannerImage,
      status: "pending",
      isPaid: false,
      requestFeatured: formData.requestFeatured,
    };

    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adData),
      });

      if (res.ok) {
        toast.success("Your ad has been submitted successfully!");
        setFormData({
          title: "",
          description: "",
          bannerImage: "",
          requestFeatured: false,
        });
        setPreview(null);
      } else {
        toast.error("Failed to submit the ad. Try again later.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
        Advertise Your Mechanic Shop
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Advertisement Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Summer Engine Service Discount"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your offer, discount, or service..."
            required
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        {/* Banner Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Upload Banner Image
          </label>
          <label
            htmlFor="bannerImage"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg shadow-sm"
              />
            ) : (
              <>
                <UploadCloud size={32} className="text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm text-center">
                  Click or drag an image to upload
                </p>
              </>
            )}
            <input
              type="file"
              name="bannerImage"
              accept="image/*"
              onChange={handleImageUpload}
              required
              className="hidden"
              id="bannerImage"
            />
          </label>
        </div>

        {/* Featured Request */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="requestFeatured"
            name="requestFeatured"
            checked={formData.requestFeatured}
            onChange={handleChange}
            className="w-4 h-4 accent-blue-600"
          />
          <label
            htmlFor="requestFeatured"
            className="text-gray-700 text-sm select-none"
          >
            Request Featured Ad (extra cost may apply)
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition ${
            loading && "opacity-75 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Submitting...
            </>
          ) : (
            "Submit Advertisement"
          )}
        </button>
      </form>
    </div>
  );
};

export default Advertise;
