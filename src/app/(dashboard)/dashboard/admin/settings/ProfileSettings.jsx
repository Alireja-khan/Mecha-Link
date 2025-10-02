// components/ProfileSettings.jsx
import { useState } from "react";
import { uploadImageToImgbb } from "@/lib/uploadImgbb";
import { Camera, Loader2, User as UserIcon } from "lucide-react"; // Import UserIcon
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

    // Validate file type and size
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
      // NOTE: Using profile.photoURL for display after upload, 
      // but loggedInUser.profileImage for initial display if photoURL is not yet set.
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
  const initial = (loggedInUser?.name || 'A').charAt(0).toUpperCase();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 pb-2 border-b border-gray-200">
        Personal Information
      </h2>

      {/* Profile Image Upload */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
        <div className="relative group flex-shrink-0">
          <div className="w-36 h-36 rounded-xl border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            {currentImage ? (
              <img
                src={currentImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="text-white w-1/2 h-1/2" />
            )}
          </div>

          {/* Upload Overlay */}
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
          <h3 className="font-bold text-lg text-gray-900 mb-1">Profile Photo</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload a new photo. JPG, PNG, WebP allowed. Max 5MB.
          </p>
          <div className="flex gap-3 justify-center sm:justify-start">
            <label
              htmlFor="profileImageUpload"
              className="px-5 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors cursor-pointer font-medium disabled:opacity-50"
              disabled={imageUploading}
            >
              {imageUploading ? "Uploading..." : "Change Photo"}
            </label>
            {currentImage && (
              <button
                type="button"
                onClick={removeProfileImage}
                className="px-5 py-2 border border-gray-300 bg-white text-gray-700 text-sm rounded-xl hover:bg-gray-100 transition-colors font-medium"
                disabled={imageUploading}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Other Profile Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={profile.email}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 text-gray-500 cursor-not-allowed"
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">Email is your primary ID and cannot be changed</p>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={profile.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
            placeholder="Enter your city, country"
          />
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title
          </label>
          <input
            type="text"
            name="jobTitle"
            value={profile.jobTitle}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
            placeholder="e.g., Senior Developer"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <input
            type="text"
            name="department"
            value={profile.department}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
            placeholder="e.g., Engineering"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
          placeholder="Tell us about yourself and your role..."
        />
      </div>
    </div>
  );
}