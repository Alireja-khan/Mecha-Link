"use client";
import { useState } from "react";
import axios from "axios";
import { UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import { uploadImageToImgbb } from "@/lib/uploadImgbb";
import Button from "@/app/shared/Button";

const Advertise = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    bannerImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  // 🔹 Handle image upload
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
      const uploadedUrl = await uploadImageToImgbb(image);
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

  // 🔹 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Submit Ad using Axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bannerImage) {
      toast.error("Please upload a banner image first!");
      return;
    }

    setLoading(true);

    const adData = {
      title: formData.title,
      description: formData.description,
      bannerImage: formData.bannerImage,
      status: "pending",
      isPaid: false,
    };

    try {
      const res = await axios.post("/api/ads", adData);
console.log(res);
      if (res.status === 201) {
        toast.success("Your ad has been submitted successfully!");
        setFormData({
          title: "",
          description: "",
          bannerImage: "",
        });
        setPreview(null);
      } else {
        toast.error("Failed to submit the ad. Try again later.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while submitting the ad!");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 md:p-10">
      {/* 🔹 Live Hero Preview */}
      {preview && (
        <section className="relative py-10 md:py-16">
          <div className="flex flex-col lg:flex-row items-center gap-8 rounded-2xl shadow-lg overflow-hidden border border-base-200 p-4 md:p-6">
            {/* Left: Title & Description */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-extrabold">
                {formData.title || "Ad Title Preview"}
              </h2>
              <p className="mt-4 text-lg md:text-xl mb-4">
                {formData.description ||
                  "Ad description preview will appear here."}
              </p>
              <Button>Browse Shop</Button>
            </div>

            {/* Right: Banner Image */}
            <div className="flex-1 relative w-full h-64 md:h-80">
              <img
                src={preview}
                alt="Banner Preview"
                className="w-full h-full object-cover rounded-lg shadow"
              />
            </div>
          </div>
        </section>
      )}

      {/* 🔹 Ad Form */}
      <div className="rounded-2xl shadow-md border border-base-200 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Advertise Your Mechanic Shop
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Advertisement Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Summer Engine Service Discount"
              required
              className="input input-bordered w-full text-base-content"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your offer, discount, or service..."
              required
              rows={4}
              className="textarea textarea-bordered w-full resize-none text-base-content"
            />
          </div>

          {/* Banner Upload */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Upload Banner Image
            </label>
            <label
              htmlFor="bannerImage"
              className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer hover:border-primary transition"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg shadow-sm"
                />
              ) : (
                <>
                  <UploadCloud size={32} className="mb-2" />
                  <p className="text-sm text-center">
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

          

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 btn btn-primary ${
              loading && "loading"
            }`}
          >
            {loading ? "Submitting..." : "Submit Advertisement"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Advertise;
