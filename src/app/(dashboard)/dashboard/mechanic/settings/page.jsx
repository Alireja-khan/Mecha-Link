// app/(dashboard)/dashboard/mechanic/settings/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import useUser from "@/hooks/useUser";
import { User, Shield, Globe, Save, Store } from "lucide-react";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";

export default function MechanicSettings() {
  const { user: loggedInUser, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    phone: "",
    whatsapp: "",
    description: "",
    logo: "",
    mechanicCount: 0,
  });

  const [security, setSecurity] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
    twoFactor: false,
    loginAlerts: false,
  });

  // Fetch shop data
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        if (!loggedInUser?.email) return;

        const response = await fetch(`/api/shops?email=${loggedInUser.email}`);
        if (response.ok) {
          const data = await response.json();
          
          if (Array.isArray(data) && data.length > 0) {
            const shop = data[0];
            setShopData(shop);
            setProfile({
              shopName: shop.shop?.shopName || "",
              ownerName: shop.ownerName || loggedInUser.name || "",
              email: shop.contact?.email || shop.ownerEmail || loggedInUser.email || "",
              phone: shop.contact?.phone || "",
              whatsapp: shop.contact?.whatsapp || "",
              description: shop.shop?.details || "",
              logo: shop.shop?.logo || "",
              mechanicCount: shop.shop?.mechanicCount || 0,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (loggedInUser?.email) {
      fetchShopData();
    }
  }, [loggedInUser]);

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-base-200">
        <span className="loading loading-bars loading-xl text-primary"></span>
      </div>
    );
  }

  if (!loggedInUser) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-base-200">
        <div className="text-center">
          <p className="text-lg text-gray-600">Please log in to access settings</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!shopData?._id) {
      alert("Shop data not loaded properly");
      return;
    }

    let body = {};
    let endpoint = "";
    let successMessage = "";

    if (activeTab === "profile") {
      body = {
        shop: {
          shopName: profile.shopName,
          details: profile.description,
          mechanicCount: profile.mechanicCount,
          ...(profile.logo && { logo: profile.logo })
        },
        contact: {
          phone: profile.phone,
          whatsapp: profile.whatsapp,
          email: profile.email
        },
        ownerName: profile.ownerName
      };
      endpoint = `/api/shops/${shopData._id}`;
      successMessage = "Shop profile updated successfully!";
    } else {
      alert("Please use the 'Change Password' button on the Security tab");
      return;
    }

    try {
      const method = activeTab === "profile" ? "PATCH" : "PUT";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
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
    { id: "profile", label: "Shop Profile", icon: Store },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-base-200 mx-auto text-base-content min-h-screen">
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
            <ProfileSettings profile={profile} setProfile={setProfile} shopData={shopData} />
          )}
          {activeTab === "security" && (
            <SecuritySettings security={security} setSecurity={setSecurity} />
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