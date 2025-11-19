"use client";
import React, { useState } from "react";
import useUser from "@/hooks/useUser";
import { User, Shield } from "lucide-react";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";

export default function UserSettings() {
  const { user: loggedInUser, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState("profile");



  if (userLoading || !loggedInUser) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-base-200">
        <span className="loading loading-bars loading-xl text-primary"></span>
      </div>
    );
  }


  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-base-200 min-h-full mx-auto text-base-content">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-extrabold text-base-content">User Settings</h1>
        <div className="text-sm text-base-content/70 mt-2 sm:mt-0">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="bg-base-100 h-full rounded-2xl shadow-xl border border-neutral/40">

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
            <ProfileSettings />
          )}
          {activeTab === "security" && (
            <SecuritySettings />
          )}
        </div>
      </div>

    </div>
  );
}