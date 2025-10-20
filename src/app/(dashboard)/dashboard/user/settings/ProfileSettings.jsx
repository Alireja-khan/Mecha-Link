import { useState } from "react";
import { uploadImageToImgbb } from "@/lib/uploadImgbb";
import { Camera, Loader2, User as UserIcon, Car } from "lucide-react";
import useUser from "@/hooks/useUser";

export default function ProfileSettings({ profile, setProfile }) {
  const [imageUploading, setImageUploading] = useState(false);
  const { user: loggedInUser } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
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
        photoURL: uploadedUrl
      }));
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const removeProfileImage = () => {
    setProfile(prev => ({
      ...prev,
      photoURL: ""
    }));
  };

  const currentImage = profile.photoURL || loggedInUser?.profileImage;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-base-content pb-2 border-b border-base-300">
        Personal Information
      </h2>

      {/* Profile Image Upload Container */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 border border-base-300 rounded-xl bg-base-200">
        <div className="relative group flex-shrink-0">
          <div className="w-36 h-36 rounded-xl border-4 border-base-100 shadow-xl overflow-hidden bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            {currentImage ? (
              <img
                src={currentImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="text-primary-content w-1/2 h-1/2" />
            )}
          </div>

          <label
            htmlFor="profileImageUpload"
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
            id="profileImageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={imageUploading}
          />
        </div>

        <div className="flex-1 text-center sm:text-left mt-3 sm:mt-0">
          <h3 className="font-bold text-lg text-base-content mb-1">Profile Photo</h3>
          <p className="text-sm text-base-content/70 mb-4">
            Upload a new photo. JPG, PNG, WebP allowed. Max 5MB.
          </p>
          <div className="flex gap-3 justify-center sm:justify-start">
            <label
              htmlFor="profileImageUpload"
              className="px-5 py-2 bg-primary text-primary-content text-sm rounded-xl hover:bg-secondary transition-colors cursor-pointer font-medium disabled:opacity-50"
              disabled={imageUploading}
            >
              {imageUploading ? "Uploading..." : "Change Photo"}
            </label>
            {currentImage && (
              <button
                type="button"
                onClick={removeProfileImage}
                className="px-5 py-2 border border-base-300 bg-base-100 text-base-content text-sm rounded-xl hover:bg-base-300 transition-colors font-medium disabled:opacity-50"
                disabled={imageUploading}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full border border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email - Disabled field */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2">
            Email
          </label>
          <input
            type="email"
            value={profile.email}
            className="w-full border border-base-300 rounded-xl px-4 py-3 bg-base-200 text-base-content/70 cursor-not-allowed"
            disabled
          />
          <p className="text-xs text-base-content/70 mt-1">Email is your primary ID and cannot be changed</p>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full border border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={profile.location}
            onChange={handleChange}
            className="w-full border border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            placeholder="Enter your city, country"
          />
        </div>

        {/* Vehicle Information */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-base-content mb-2">
            Vehicle Information
          </label>
          <div className="flex items-center gap-3">
            <Car className="text-primary" size={20} />
            <input
              type="text"
              name="vehicleInfo"
              value={profile.vehicleInfo}
              onChange={handleChange}
              className="w-full border border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              placeholder="e.g., Toyota Camry 2020, Honda Civic 2018, etc."
            />
          </div>
          <p className="text-xs text-base-content/70 mt-1">List your vehicles for better service recommendations</p>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-base-content mb-2">
          About Me
        </label>
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          rows={4}
          className="w-full border border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
          placeholder="Tell us about yourself and your automotive needs..."
        />
      </div>
    </div>
  );
}