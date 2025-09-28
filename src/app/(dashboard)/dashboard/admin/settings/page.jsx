"use client";

import React, { useState } from "react";
import useUser from "@/hooks/useUser";
import { Lock, Key, Mail, Phone, MapPin, User, Check, Bell, Save, Camera } from "lucide-react";

const AdminSettings = () => {
  const { user: loggedInUser, loading: userLoading } = useUser();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    photoURL: "",
  });
  const [security, setSecurity] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
    twoFactor: false,
    loginAlerts: false,
  });

  // Populate dynamic data
  React.useEffect(() => {
    if (loggedInUser) {
      setProfile({
        name: loggedInUser.name || "",
        email: loggedInUser.email || "",
        phone: loggedInUser.phone || "",
        location: loggedInUser.location || "",
        photoURL: loggedInUser.photoURL || "",
      });
      setSecurity({
        password: "",
        newPassword: "",
        confirmPassword: "",
        twoFactor: loggedInUser.security?.twoFactor || false,
        loginAlerts: loggedInUser.security?.loginAlerts || false,
      });
    }
  }, [loggedInUser]);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <span className="loading loading-bars loading-xl text-orange-500"></span>
      </div>
    );
  }

  if (!loggedInUser || loggedInUser.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen w-screen text-gray-600">
        <p>Access denied. Admins only.</p>
      </div>
    );
  }

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setSecurity((prev) => ({ ...prev, [name]: checked }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    // Call API to save profile & security settings
    console.log("Profile Data:", profile);
    console.log("Security Data:", security);
  };

  return (
    <div className="p-8 space-y-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">Admin Settings</h1>

      {/* Profile Settings */}
      <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 space-y-4">
        <h2 className="font-bold text-gray-800 mb-4">Profile Settings</h2>
        <div className="flex items-center gap-6">
          {/* Profile Image */}
          <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200">
            {profile.photoURL ? (
              <img src={profile.photoURL} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition">
            <Camera size={18} /> Change Photo
          </button>
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              className="mt-1 p-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              className="mt-1 p-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Phone</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleProfileChange}
              className="mt-1 p-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Location</label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleProfileChange}
              className="mt-1 p-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 space-y-4">
        <h2 className="font-bold text-gray-800 mb-4">Security & Password</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Current Password</label>
            <input
              type="password"
              name="password"
              value={security.password}
              onChange={handleProfileChange}
              className="mt-1 p-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={security.newPassword}
              onChange={handleProfileChange}
              className="mt-1 p-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={security.confirmPassword}
              onChange={handleProfileChange}
              className="mt-1 p-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="twoFactor"
              checked={security.twoFactor}
              onChange={handleProfileChange}
              className="accent-blue-600"
            />
            Two-Factor Authentication
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="loginAlerts"
              checked={security.loginAlerts}
              onChange={handleProfileChange}
              className="accent-blue-600"
            />
            Login Alerts
          </label>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 space-y-4">
        <h2 className="font-bold text-gray-800 mb-4">Notifications</h2>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-blue-600" />
          Email Notifications
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-blue-600" />
          SMS Notifications
        </label>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Save size={18} /> Save Changes
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
