// app/(dashboard)/dashboard/mechanic/settings/ProfileSettings.jsx
import { useState } from "react";
import { uploadImageToImgbb } from "@/lib/uploadImgbb";
import { Camera, Loader2, Store, Users, Phone, MessageCircle } from "lucide-react";

export default function ProfileSettings({ profile, setProfile, shopData }) {
  const [imageUploading, setImageUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProfile(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseInt(value) || 0 : value 
    }));
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    if (!image.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (image.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setImageUploading(true);
    try {
      const uploadedUrl = await uploadImageToImgbb(image);
      setProfile(prev => ({
        ...prev,
        logo: uploadedUrl
      }));
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const removeLogo = () => {
    setProfile(prev => ({
      ...prev,
      logo: ""
    }));
  };

  const currentLogo = profile.logo || shopData?.logo;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-base-content pb-2 border-b border-base-300">
        Shop Information
      </h2>

      {/* Shop Logo Upload */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 border border-base-300 rounded-xl bg-base-200">
        <div className="relative group flex-shrink-0">
          <div className="w-200 h-100 rounded-xl border-4 border-base-100 shadow-xl overflow-hidden bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            {currentLogo ? (
              <img
                src={currentLogo}
                alt="Shop Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <Store className="text-primary-content w-1/2 h-1/2" />
            )}
          </div>

          <label
            htmlFor="shopLogoUpload"
            className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          >
            {imageUploading ? (
              <Loader2 className="text-white animate-spin" size={24} />
            ) : (
              <Camera className="text-white" size={24} />
            )}
          </label>

          <input
            type="file"
            id="shopLogoUpload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={imageUploading}
          />
        </div>

        <div className="flex-1 text-center sm:text-left mt-3 sm:mt-0">
          <h3 className="font-bold text-lg text-base-content mb-1">Shop Logo</h3>
          <p className="text-sm text-base-content/70 mb-4">
            Upload your shop logo. JPG, PNG, WebP allowed. Max 5MB.
          </p>
          <div className="flex gap-3 justify-center sm:justify-start">
            <label
              htmlFor="shopLogoUpload"
              className="px-5 py-2 bg-primary text-primary-content text-sm rounded-xl hover:bg-secondary transition-colors cursor-pointer font-medium disabled:opacity-50"
              disabled={imageUploading}
            >
              {imageUploading ? "Uploading..." : "Change Logo"}
            </label>
            {currentLogo && (
              <button
                type="button"
                onClick={removeLogo}
                className="px-5 py-2 border border-base-300 bg-base-100 text-base-content text-sm rounded-xl hover:bg-base-300 transition-colors font-medium disabled:opacity-50"
                disabled={imageUploading}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Shop Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shop Name */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2">
            Shop Name *
          </label>
          <input
            type="text"
            name="shopName"
            value={profile.shopName}
            onChange={handleChange}
            className="w-full border border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            placeholder="Enter your shop name"
            required
          />
        </div>

        {/* Owner Name */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2">
            Owner Name *
          </label>
          <input
            type="text"
            name="ownerName"
            value={profile.ownerName}
            onChange={handleChange}
            className="w-full border border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            placeholder="Enter owner's name"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2">
            Contact Email *
          </label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full border border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            placeholder="Enter contact email"
            required
          />
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2">
          <Phone className="text-base-content/70" size={18} />
          <div className="flex-1">
            <label className="block text-sm font-medium text-base-content mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full border border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        {/* WhatsApp */}
        <div className="flex items-center gap-2">
          <MessageCircle className="text-base-content/70" size={18} />
          <div className="flex-1">
            <label className="block text-sm font-medium text-base-content mb-2">
              WhatsApp Number
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={profile.whatsapp}
              onChange={handleChange}
              className="w-full border border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              placeholder="Enter WhatsApp number"
            />
          </div>
        </div>

        {/* Mechanic Count */}
        <div className="flex items-center gap-2">
          <Users className="text-base-content/70" size={18} />
          <div className="flex-1">
            <label className="block text-sm font-medium text-base-content mb-2">
              Number of Mechanics
            </label>
            <input
              type="number"
              name="mechanicCount"
              value={profile.mechanicCount}
              onChange={handleChange}
              min="0"
              max="50"
              className="w-full border border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              placeholder="Number of mechanics"
            />
          </div>
        </div>
      </div>

      {/* Shop Description */}
      <div>
        <label className="block text-sm font-medium text-base-content mb-2">
          Shop Description *
        </label>
        <textarea
          name="description"
          value={profile.description}
          onChange={handleChange}
          rows={4}
          className="w-full border border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
          placeholder="Describe your shop services, specialties, and what makes you unique..."
          required
        />
        <p className="text-xs text-base-content/70 mt-1">
          This description will be shown to customers looking for services
        </p>
      </div>

      {/* Shop Status */}
      {shopData?.status && (
        <div className="p-4 border border-base-300 rounded-xl bg-base-200">
          <h3 className="font-semibold text-base-content mb-2">Shop Status</h3>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              shopData.status === 'approved' 
                ? 'bg-success/20 text-success border border-success/30'
                : shopData.status === 'pending'
                ? 'bg-warning/20 text-warning border border-warning/30'
                : 'bg-error/20 text-error border border-error/30'
            }`}>
              {shopData.status.charAt(0).toUpperCase() + shopData.status.slice(1)}
            </span>
            <p className="text-sm text-base-content/70">
              {shopData.status === 'approved' 
                ? 'Your shop is approved and visible to customers'
                : shopData.status === 'pending'
                ? 'Your shop is under review by administrators'
                : 'Your shop application was rejected'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}