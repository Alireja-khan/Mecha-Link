// AdminSettings.jsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import useUser from "@/hooks/useUser";
import { User, Shield, Globe, Save } from "lucide-react";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import Swal from "sweetalert2";
// or include the CDN in your HTML
// import PreferencesSettings from "./PreferencesSettings";

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

  // Refs to store initial form states for each tab
  const initialProfileRef = useRef(null);
  const initialSecurityRef = useRef(null);
  // const initialPreferencesRef = useRef(null);

  // const [preferences, setPreferences] = useState({
  //   language: "en",
  //   timezone: "UTC",
  //   dateFormat: "MM/DD/YYYY",
  //   theme: "light",
  //   emailNotifications: true,
  //   pushNotifications: false,
  //   smsNotifications: false,
  // });

  // const [privacy, setPrivacy] = useState({
  //   profileVisibility: "private",
  //   emailVisibility: "private",
  //   activityStatus: true,
  //   dataSharing: false,
  // });

  useEffect(() => {
    if (loggedInUser) {
      const profileData = {
        name: loggedInUser.name || "",
        email: loggedInUser.email || "",
        phone: loggedInUser.phone || "",
        location: loggedInUser.location || "",
        photoURL: loggedInUser.photoURL || "",
        jobTitle: loggedInUser.jobTitle || "",
        department: loggedInUser.department || "",
        bio: loggedInUser.bio || "",
      };
      
      const securityData = {
        password: "",
        newPassword: "",
        confirmPassword: "",
        twoFactor: loggedInUser.security?.twoFactor || false,
        loginAlerts: loggedInUser.security?.loginAlerts || false,
        sessionTimeout: loggedInUser.security?.sessionTimeout || 30,
        passwordExpiry: loggedInUser.security?.passwordExpiry || 90,
      };

      setProfile(profileData);
      setSecurity(securityData);
      
      // Store initial states
      initialProfileRef.current = profileData;
      initialSecurityRef.current = securityData;
      // setPreferences({
      //   language: loggedInUser.preferences?.language || "en",
      //   timezone: loggedInUser.preferences?.timezone || "UTC",
      //   dateFormat: loggedInUser.preferences?.dateFormat || "MM/DD/YYYY",
      //   theme: loggedInUser.preferences?.theme || "light",
      //   emailNotifications:
      //     loggedInUser.preferences?.emailNotifications ?? true,
      //   pushNotifications: loggedInUser.preferences?.pushNotifications ?? false,
      //   smsNotifications: loggedInUser.preferences?.smsNotifications ?? false,
      // });
      // setPrivacy({
      //   profileVisibility: loggedInUser.privacy?.profileVisibility || "private",
      //   emailVisibility: loggedInUser.privacy?.emailVisibility || "private",
      //   activityStatus: loggedInUser.privacy?.activityStatus ?? true,
      //   dataSharing: loggedInUser.privacy?.dataSharing ?? false,
      // });
    }
  }, [loggedInUser]);

  // Update initial states when tab changes (optional - if you want to track changes per tab session)
  useEffect(() => {
    if (activeTab === "profile" && profile.name && !initialProfileRef.current) {
      initialProfileRef.current = { ...profile };
    }
    if (activeTab === "security" && security.sessionTimeout && !initialSecurityRef.current) {
      initialSecurityRef.current = { ...security };
    }
  }, [activeTab, profile, security]);

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
      jobTitle: profile.jobTitle,
      department: profile.department,
      bio: profile.bio,
      profileImage: profile.photoURL,
    };
    endpoint = "/api/users/dashboardUser";
    successMessage = "Profile updated successfully!";
  } else if (activeTab === "preferences") {
    body = preferences;
    endpoint = "/api/users/preferences";
    successMessage = "Preferences updated successfully!";
  } else {
    Swal.fire({
      icon: "info",
      title: "Action Required",
      text: 'Please use the "Change Password" button on the Security tab or switch to a different tab to save.',
      confirmButtonColor: "#3085d6",
    });
    return;
  }

  try {
    const res = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    
    // FIXED: Move the res.ok check inside the try block
    if (res.ok) {
      // Update initial refs after successful save
      if (activeTab === "profile") {
        initialProfileRef.current = { ...profile };
      } else if (activeTab === "security") {
        initialSecurityRef.current = { ...security };
      }
      
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: successMessage,
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: data.message || `Failed to update ${activeTab}`,
        confirmButtonColor: "#d33",
      });
    }
  } catch (error) {
    console.error(`❌ Update error for ${activeTab}:`, error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong while updating",
      confirmButtonColor: "#d33",
    });
  }
};

  const handleCancel = () => {
    Swal.fire({
      title: 'Discard Changes?',
      text: "Are you sure you want to discard your changes?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, discard changes!',
      cancelButtonText: 'Continue editing'
    }).then((result) => {
      if (result.isConfirmed) {
        // Reset to initial state based on active tab
        if (activeTab === "profile" && initialProfileRef.current) {
          setProfile({ ...initialProfileRef.current });
        } else if (activeTab === "security" && initialSecurityRef.current) {
          setSecurity({ ...initialSecurityRef.current });
        }
        
        Swal.fire({
          title: 'Changes Discarded!',
          text: 'Your changes have been discarded.',
          timer: 500,
          showConfirmButton: false
        });
      }
    });
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    // { id: "preferences", label: "Preferences", icon: Globe },
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-base-200 mx-auto text-base-content">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-extrabold text-base-content">
          Admin Settings
        </h1>
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
                  ${
                    activeTab === tab.id
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
          {/* {activeTab === "preferences" && (
            <PreferencesSettings
              preferences={preferences}
              setPreferences={setPreferences}
            />
          )} */}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
        onClick={handleCancel}
         className="px-6 py-3 border border-base-300 text-base-content rounded-xl hover:bg-base-300 transition duration-200 font-medium">
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