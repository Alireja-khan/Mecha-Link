"use client";
import React, { useState, useEffect } from "react";
import useUser from "@/hooks/useUser";
import { User, Shield, Globe, Lock, Save } from "lucide-react";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import PreferencesSettings from "./PreferencesSettings";
import PrivacySettings from "./PrivacySettings";

export default function AdminSettings() {
  const { user: loggedInUser, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    photoURL: "",
    jobTitle: "",
    department: "",
    bio: "",
  });

  const [security, setSecurity] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
    twoFactor: false,
    loginAlerts: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
  });

  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    theme: "light",
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "private",
    emailVisibility: "private",
    activityStatus: true,
    dataSharing: false,
  });

  useEffect(() => {
    if (loggedInUser) {
      setProfile({
        name: loggedInUser.name || "",
        email: loggedInUser.email || "",
        phone: loggedInUser.phone || "",
        location: loggedInUser.location || "",
        photoURL: loggedInUser.photoURL || "",
        jobTitle: loggedInUser.jobTitle || "",
        department: loggedInUser.department || "",
        bio: loggedInUser.bio || "",
      });
      setSecurity({
        password: "",
        newPassword: "",
        confirmPassword: "",
        twoFactor: loggedInUser.security?.twoFactor || false,
        loginAlerts: loggedInUser.security?.loginAlerts || false,
        sessionTimeout: loggedInUser.security?.sessionTimeout || 30,
        passwordExpiry: loggedInUser.security?.passwordExpiry || 90,
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

  const handleSave = async () => {
    try {
      const res = await fetch("/api/users/dashboardUser", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          name: profile.name,
          phone: profile.phone,
          location: profile.location,
          jobTitle: profile.jobTitle,
          department: profile.department,
          bio: profile.bio,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("✅ Updated successfully:", data);
        alert("Profile updated successfully!");
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("❌ Update error:", error);
      alert("Something went wrong while updating");
    }
  };


  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Globe },
    { id: "privacy", label: "Privacy", icon: Lock },
  ];

  return (
    <div className="p-8 space-y-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Settings</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow border border-gray-100">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === "profile" && (
            <ProfileSettings profile={profile} setProfile={setProfile} />
          )}
          {activeTab === "security" && (
            <SecuritySettings security={security} setSecurity={setSecurity} />
          )}
          {activeTab === "preferences" && (
            <PreferencesSettings
              preferences={preferences}
              setPreferences={setPreferences}
            />
          )}
          {activeTab === "privacy" && (
            <PrivacySettings privacy={privacy} setPrivacy={setPrivacy} />
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Save size={18} /> Save Changes
        </button>
      </div>
    </div>
  );
}
