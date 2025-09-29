// components/ProfileSettings.jsx
import { useState } from "react";
import { uploadImageToImgbb } from "@/lib/uploadImgbb";
import { Camera, Loader2 } from "lucide-react";
import useUser from "@/hooks/useUser";

export default function ProfileSettings({ profile, setProfile }) {
  const [imageUploading, setImageUploading] = useState(false);
  const { user: loggedInUser } = useUser();


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

  return (
    <div className="space-y-6">
      {/* Profile Image Upload */}
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600">
            {loggedInUser.profileImage ? (
              <img
                src={loggedInUser.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold">
                {loggedInUser.name?.charAt(0) || 'A'}
              </div>
            )}
          </div>

          {/* Upload Overlay */}
          <label
            htmlFor="profileImageUpload"
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            {imageUploading ? (
              <Loader2 className="text-white animate-spin" size={20} />
            ) : (
              <Camera className="text-white" size={20} />
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

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">Profile Photo</h3>
          <p className="text-sm text-gray-600 mb-3">
            Upload a new photo. JPG, PNG, WebP allowed. Max 5MB.
          </p>
          <div className="flex gap-3">
            <label
              htmlFor="profileImageUpload"
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
              disabled={imageUploading}
            >
              {imageUploading ? "Uploading..." : "Change Photo"}
            </label>
            {profile.photoURL && (
              <button
                type="button"
                onClick={removeProfileImage}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                disabled={imageUploading}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Other Profile Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={profile.email}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-500"
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Enter your location"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title
          </label>
          <input
            type="text"
            value={profile.jobTitle}
            onChange={(e) => setProfile(prev => ({ ...prev, jobTitle: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Enter your job title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <input
            type="text"
            value={profile.department}
            onChange={(e) => setProfile(prev => ({ ...prev, department: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Enter your department"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Tell us about yourself..."
        />
      </div>
    </div>
  );
}