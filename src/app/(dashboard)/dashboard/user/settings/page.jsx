"use client";
import React, { useState, useEffect } from "react";
import useUser from "@/hooks/useUser";
import { User, Shield, Globe, Save, Car, Bell } from "lucide-react";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import PreferencesSettings from "./PreferencesSettings";

export default function UserSettings() {
  const { user: loggedInUser, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    photoURL: "",
    bio: "",
    vehicleInfo: "",
  });

  const [security, setSecurity] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
    twoFactor: false,
    loginAlerts: false,
  });

  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    theme: "light",
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    serviceReminders: true,
    promotionalEmails: false,
  });

  useEffect(() => {
    if (loggedInUser) {
      setProfile({
        name: loggedInUser.name || "",
        email: loggedInUser.email || "",
        phone: loggedInUser.phone || "",
        location: loggedInUser.location || "",
        photoURL: loggedInUser.photoURL || "",
        bio: loggedInUser.bio || "",
        vehicleInfo: loggedInUser.vehicleInfo || "",
      });
      setSecurity({
        password: "",
        newPassword: "",
        confirmPassword: "",
        twoFactor: loggedInUser.security?.twoFactor || false,
        loginAlerts: loggedInUser.security?.loginAlerts || false,
      });
      setPreferences({
        language: loggedInUser.preferences?.language || "en",
        timezone: loggedInUser.preferences?.timezone || "UTC",
        dateFormat: loggedInUser.preferences?.dateFormat || "MM/DD/YYYY",
        theme: loggedInUser.preferences?.theme || "light",
        emailNotifications: loggedInUser.preferences?.emailNotifications ?? true,
        pushNotifications: loggedInUser.preferences?.pushNotifications ?? false,
        smsNotifications: loggedInUser.preferences?.smsNotifications ?? false,
        serviceReminders: loggedInUser.preferences?.serviceReminders ?? true,
        promotionalEmails: loggedInUser.preferences?.promotionalEmails ?? false,
      });
    }
  }, [loggedInUser]);

  if (userLoading || !loggedInUser) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-base-200">
        <span className="loading loading-bars loading-xl text-primary"></span>
      </div>
    );
  }

  const handleSave = async () => {
    let body = {};
    let endpoint = "";
    let successMessage = "";

    if (activeTab === "profile") {
      body = {
        email: profile.email,
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
        profileImage: profile.photoURL,
        vehicleInfo: profile.vehicleInfo,
      };
      endpoint = "/api/users/dashboardUser";
      successMessage = "Profile updated successfully!";
    } else if (activeTab === "preferences") {
      body = preferences;
      endpoint = "/api/users/preferences";
      successMessage = "Preferences updated successfully!";
    } else {
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
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-base-200 mx-auto text-base-content">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-extrabold text-base-content">User Settings</h1>
        <div className="text-sm text-base-content/70 mt-2 sm:mt-0">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="bg-base-100 rounded-2xl shadow-xl border border-neutral/40">

        <div className="flex border-b border-base-300 overflow-x-auto whitespace-nowrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 border-b-2 transition-colors duration-300 flex-shrink-0 
                  ${activeTab === tab.id
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-base-content/70 hover:text-primary/80"
                  }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

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

      <div className="flex justify-end gap-3 pt-4">
        <button className="px-6 py-3 border border-base-300 text-base-content rounded-xl hover:bg-base-300 transition duration-200 font-medium">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-primary text-primary-content rounded-xl hover:bg-secondary transition duration-200 flex items-center gap-2 font-medium shadow-md shadow-primary/30"
        >
          <Save size={18} /> Save Changes
        </button>
      </div>
    </div>
  );
}