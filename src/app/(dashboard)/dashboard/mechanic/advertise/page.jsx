"use client";
import { useState } from "react";
import axios from "axios";
import { UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { uploadImageToImgbb } from "@/lib/uploadImgbb";
import Button from "@/app/shared/Button";
import useUser from "@/hooks/useUser";

const Advertise = () => {
  const { user } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    bannerImage: "",
    startDate: "",
    endDate: "",
    duration: 1,
  });

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  // 🔹 Base Pricing Table
  const adPricing = {
    "1": 100,
    "3": 250,
    "5": 400,
    "7": 590,
    "15": 1250,
    "30": 2000,
  };

  // 🔹 Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Handle Dates & Auto Calculate Duration
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };

    // Calculate days difference if both dates selected
    if (updated.startDate && updated.endDate) {
      const start = new Date(updated.startDate);
      const end = new Date(updated.endDate);
      const diffTime = end - start;
      const diffDays = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);

      updated.duration = diffDays;
    }

    setFormData(updated);
  };

  // 🔹 Dynamic price calculation
  const getDynamicPrice = (days) => {
    if (adPricing[days]) return adPricing[days];
    const closestLower = Object.keys(adPricing)
      .map(Number)
      .reverse()
      .find((d) => d <= days);
    if (closestLower) {
      const ratio = days / closestLower;
      return Math.round(adPricing[closestLower] * ratio);
    }
    return 100; // default fallback
  };

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

  // 🔹 Submit Ad
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bannerImage) {
      toast.error("Please upload a banner image first!");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Please select both start and end dates!");
      return;
    }

    if (!user?.email) {
      toast.error("User email not found! Please log in again.");
      return;
    }

    const price = getDynamicPrice(formData.duration);

    setLoading(true);

    const adData = {
      title: formData.title,
      description: formData.description,
      bannerImage: formData.bannerImage,
      shopEmail: user.email,
      status: "pending",
      isPaid: false,
      duration: parseInt(formData.duration),
      price,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    try {
      const res = await axios.post("/api/ads", adData);

      if (res.status === 201) {
        await Swal.fire({
          title: "Ad Submitted Successfully!",
          text: `Your ad is set for ${formData.duration} day(s) — total price ${price} Tk.`,
          icon: "success",
          confirmButtonText: "Go to Profile",
          timer: 4000,
          timerProgressBar: true,
        });

        router.push("/dashboard/mechanic/profile");
        setFormData({
          title: "",
          description: "",
          bannerImage: "",
          startDate: "",
          endDate: "",
          duration: 1,
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
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-extrabold">
                {formData.title || "Ad Title Preview"}
              </h2>
              <p className="mt-4 text-lg md:text-xl mb-2">
                {formData.description || "Ad description preview will appear here."}
              </p>
              
              <Button className="mt-4">Browse Shop</Button>
            </div>
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
            <label className="block text-sm font-semibold mb-1">Advertisement Title</label>
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
            <label className="block text-sm font-semibold mb-1">Description</label>
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

          {/* Start and End Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleDateChange}
                required
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleDateChange}
                required
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* Duration & Price Summary */}
          <div className="bg-base-200/40 rounded-xl p-3 text-center text-sm font-medium">
            Showing ad for <b>{formData.duration}</b> day(s). Total price:{" "}
            <b>{getDynamicPrice(formData.duration)} Tk</b>
          </div>

          {/* Banner Upload */}
          <div>
            <label className="block text-sm font-semibold mb-1">Upload Banner Image</label>
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
                  <p className="text-sm text-center">Click or drag an image to upload</p>
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

          {/* Submit */}
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
