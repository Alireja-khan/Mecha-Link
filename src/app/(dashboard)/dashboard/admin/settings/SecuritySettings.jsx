"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2"; // ✅ import swal
import { toast } from "react-hot-toast"; // assuming you have this

export default function SecuritySettings({ security, setSecurity }) {
  const [showPassword, setShowPassword] = useState({
    password: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecurity((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (type === "number" ? parseInt(value) : value), // Parse number values
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ New & Confirm password mismatch
    if (security.newPassword !== security.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "New password and confirm password do not match",
      });
      return;
    }

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: security.password,
          newPassword: security.newPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Password changed successfully",
        });
        // Reset password fields after successful change
        setSecurity((prev) => ({ ...prev, password: "", newPassword: "", confirmPassword: "" }));
      } else {
        // ❌ Wrong current password or backend error
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Current password is incorrect",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Please try again later",
      });
    }
  };

  return (
    <div className="space-y-8">

      {/* Password Section with form */}
      <form onSubmit={handleSubmit} className="space-y-6 p-6 border border-gray-200 rounded-xl bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Change Password
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["password", "newPassword", "confirmPassword"].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2 capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <div className="relative">
                <input
                  type={showPassword[field] ? "text" : "password"}
                  name={field}
                  value={security[field]}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full outline-none transition"
                  placeholder={field === 'password' ? 'Current Password' : 'New Password'}
                  required={field !== 'password'} // Only require new/confirm for form submission
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      [field]: !prev[field],
                    }))
                  }
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword[field] ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition font-medium shadow-md shadow-orange-200"
          >
            Change Password
          </button>
        </div>
      </form>

      {/* Security Preferences */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 pb-2 border-b border-gray-200">
          Security Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: "twoFactor",
              label: "Two-Factor Authentication",
              desc: "Require a second code for login for an extra layer of security.",
            },
            {
              name: "loginAlerts",
              label: "Login Alerts",
              desc: "Get notified via email when your account is logged into from a new device.",
            },
          ].map((item) => (
            <label
              key={item.name}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-orange-50/50 cursor-pointer transition"
            >
              <div>
                <div className="font-semibold text-gray-800">{item.label}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
              <input
                type="checkbox"
                name={item.name}
                checked={security[item.name]}
                onChange={handleChange}
                className="w-5 h-5 accent-orange-500 focus:ring-orange-500/50 ml-4"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Session Settings */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 pb-2 border-b border-gray-200">
          Session & Password Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: "sessionTimeout",
              label: "Session Timeout (minutes)",
              min: 5,
              max: 120,
              desc: "Automatically log out after this many minutes of inactivity.",
            },
            {
              name: "passwordExpiry",
              label: "Password Expiry (days)",
              min: 30,
              max: 365,
              desc: "Require a password change after this period for enhanced security.",
            },
          ].map((item) => (
            <div key={item.name} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                {item.label}
              </label>
              <input
                type="number"
                name={item.name}
                value={security[item.name]}
                onChange={handleChange}
                min={item.min}
                max={item.max}
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              />
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}