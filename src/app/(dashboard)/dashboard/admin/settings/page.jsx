"use client";
import React, { useState, useEffect } from "react";
import useUser from "@/hooks/useUser";
import { User, Shield, Globe, Lock, Save } from "lucide-react";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import PreferencesSettings from "./PreferencesSettings";

export default function AdminSettings() {
  const { user: loggedInUser, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState("profile");

  // State for all settings tabs
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
  // End of State for all settings tabs

  // Effect to load user data into state
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
      setPreferences({
        language: loggedInUser.preferences?.language || "en",
        timezone: loggedInUser.preferences?.timezone || "UTC",
        dateFormat: loggedInUser.preferences?.dateFormat || "MM/DD/YYYY",
        theme: loggedInUser.preferences?.theme || "light",
        emailNotifications: loggedInUser.preferences?.emailNotifications ?? true,
        pushNotifications: loggedInUser.preferences?.pushNotifications ?? false,
        smsNotifications: loggedInUser.preferences?.smsNotifications ?? false,
      });
      setPrivacy({
        profileVisibility: loggedInUser.privacy?.profileVisibility || "private",
        emailVisibility: loggedInUser.privacy?.emailVisibility || "private",
        activityStatus: loggedInUser.privacy?.activityStatus ?? true,
        dataSharing: loggedInUser.privacy?.dataSharing ?? false,
      });
    }
  }, [loggedInUser]);

  // Loading/No User UI
  if (userLoading || !loggedInUser) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
        <span className="loading loading-bars loading-xl text-orange-500"></span>
      </div>
    );
  }
  // End of Loading/No User UI

  // Handle Save (only for Profile tab in this example)
  const handleSave = async () => {
    // Only attempt to save the active tab's data
    let body = {};
    let endpoint = "";
    let successMessage = "";

    if (activeTab === "profile") {
      body = {
        email: profile.email,
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        jobTitle: profile.jobTitle,
        department: profile.department,
        bio: profile.bio,
        profileImage: profile.photoURL,
      };
      endpoint = "/api/users/dashboardUser"; // Assuming this handles PUT for profile
      successMessage = "Profile updated successfully!";
    } else if (activeTab === "preferences") {
      // You'll need a different endpoint and body for preferences
      body = preferences;
      endpoint = "/api/users/preferences";
      successMessage = "Preferences updated successfully!";
    } else {
      // Security is handled by its own internal form, so we'll skip the main save for it.
      alert("Please use the 'Change Password' button on the Security tab or switch to a different tab to save.");
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        console.log(`✅ Updated successfully:`, data);
        alert(successMessage);
      } else {
        alert(data.message || `Failed to update ${activeTab}`);
      }
    } catch (error) {
      console.error(`❌ Update error for ${activeTab}:`, error);
      alert("Something went wrong while updating");
    }
  };


  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Globe },
    // { id: "privacy", label: "Privacy", icon: Lock }, // You can add Privacy settings later
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-gray-50 mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-extrabold text-gray-800">Admin Settings</h1>
        <div className="text-sm text-gray-500 mt-2 sm:mt-0">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Settings Panel (Tabs + Content) */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 overflow-x-auto whitespace-nowrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 border-b-2 transition-colors duration-300 flex-shrink-0 ${activeTab === tab.id
                  ? "border-orange-500 text-orange-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-orange-600/70"
                  }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-8">
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
        </div>
      </div>

      {/* Save/Cancel Buttons */}
      <div className="flex justify-end gap-3 pt-4"> {/* Changed justify-between to justify-end */}
        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition duration-200 font-medium">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition duration-200 flex items-center gap-2 font-medium shadow-md shadow-orange-200"
        >
          <Save size={18} /> Save Changes
        </button>
      </div>
    </div>
  );
}