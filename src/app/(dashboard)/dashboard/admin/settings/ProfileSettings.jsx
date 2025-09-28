import React from "react";
import { Camera } from "lucide-react";

export default function ProfileSettings({ profile, setProfile }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200">
          {profile.photoURL ? (
            <img
              src={profile.photoURL}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
              {profile.name?.charAt(0)}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition">
            <Camera size={18} /> Change Photo
          </button>
          <p className="text-sm text-gray-500">JPG, PNG or GIF. Max 5MB.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {["name", "email", "phone", "location", "jobTitle"].map((field) => (
          <div key={field} className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              name={field}
              value={profile[field]}
              onChange={handleChange}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        ))}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-2">
            Department
          </label>
          <select
            name="department"
            value={profile.department}
            onChange={handleChange}
            className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Department</option>
            <option value="engineering">Engineering</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="support">Support</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-2">Bio</label>
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          rows={4}
          className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tell us about yourself..."
        />
      </div>
    </div>
  );
}
