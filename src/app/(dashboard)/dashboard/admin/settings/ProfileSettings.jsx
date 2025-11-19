// components/ProfileSettings.jsx
import { useState } from "react";
import { uploadImageToImgbb } from "@/lib/uploadImgbb";
import { Camera, Loader2, User as UserIcon } from "lucide-react";
import useUser from "@/hooks/useUser";
import Swal from 'sweetalert2';

export default function ProfileSettings({ profile, setProfile }) {
  const [imageUploading, setImageUploading] = useState(false);
  const { user: loggedInUser } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // console.log(profile);
  // console.log(loggedInUser);


  const handleImageUpload = async (e) => {
  const image = e.target.files[0];
  if (!image) return;

  // Validate file type and size
  if (!image.type.startsWith('image/')) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid File',
      text: 'Please select a valid image file (JPEG, PNG, etc.)',
      confirmButtonColor: '#d33',
    });
    return;
  }

  if (image.size > 5 * 1024 * 1024) {
    Swal.fire({
      icon: 'error',
      title: 'File Too Large',
      text: 'Image size should be less than 5MB',
      confirmButtonColor: '#d33',
    });
    return;
  }

  // Show loading alert
  Swal.fire({
    title: 'Uploading Image...',
    text: 'Please wait while we upload your image',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  setImageUploading(true);
  try {
    const uploadedUrl = await uploadImageToImgbb(image);
    setProfile(prev => ({
      ...prev,
      photoURL: uploadedUrl
    }));
    
    // Close loading and show success
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Profile image uploaded successfully',
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error('Image upload failed:', error);
    Swal.fire({
      icon: 'error',
      title: 'Upload Failed',
      text: 'Failed to upload image. Please try again.',
      confirmButtonColor: '#d33',
    });
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
  // const initial = (loggedInUser?.name || 'A').charAt(0).toUpperCase(); // This variable is no longer used for display

  return (
    <div className="space-y-8">
      {/* Header text and border updated */}
      <h2 className="text-2xl font-bold text-base-content pb-2 border-b border-base-300">
        Personal Information
      </h2>

      {/* Profile Image Upload Container */}
      {/* Container BG: base-200, Border: base-300 */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 border border-base-300 rounded-xl bg-base-200">
        <div className="relative group flex-shrink-0">
          {/* Avatar Background: border-base-100, Gradient: from-primary to-secondary */}
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
          {/* Text colors updated */}
          <h3 className="font-bold text-lg text-base-content mb-1">Profile Photo</h3>
          <p className="text-sm text-base-content/70 mb-4">
            Upload a new photo. JPG, PNG, WebP allowed. Max 5MB.
          </p>
          <div className="flex gap-3 justify-center sm:justify-start">
            {/* Change Photo Button: Primary style */}
            <label
              htmlFor="profileImageUpload"
              className="px-5 py-2 bg-primary text-primary-content text-sm rounded-xl hover:bg-secondary transition-colors cursor-pointer font-medium disabled:opacity-50"
              disabled={imageUploading}
            >
              {imageUploading ? "Uploading..." : "Change Photo"}
            </label>
            {currentImage && (
              // Remove Button: Secondary style
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

      {/* Other Profile Fields */}
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
            // Input styling updated for theme compatibility
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
            // Disabled input styling updated
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

        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2">
            Job Title
          </label>
          <input
            type="text"
            name="jobTitle"
            value={profile.jobTitle}
            onChange={handleChange}
            className="w-full border border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            placeholder="e.g., Senior Developer"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2">
            Department
          </label>
          <input
            type="text"
            name="department"
            value={profile.department}
            onChange={handleChange}
            className="w-full border border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            placeholder="e.g., Engineering"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-base-content mb-2">
          Bio
        </label>
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          rows={4}
          className="w-full border border-base-300 bg-base-100 text-base-content rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
          placeholder="Tell us about yourself and your role..."
        />
      </div>
    </div>
  );
}