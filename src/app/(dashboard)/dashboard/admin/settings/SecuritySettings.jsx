"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2"; // ✅ import swal
import { toast } from "react-hot-toast";

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
      [name]: type === "checkbox" ? checked : value,
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
        setSecurity({ password: "", newPassword: "", confirmPassword: "" });
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
    <div className="space-y-6">
      {/* Password Section with form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["password", "newPassword", "confirmPassword"].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-2 capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <div className="relative">
                <input
                  type={showPassword[field] ? "text" : "password"}
                  name={field}
                  value={security[field]}
                  onChange={handleChange}
                  className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary w-full"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      [field]: !prev[field],
                    }))
                  }
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
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
          <button
            type="submit"
            className="max-w-sm px-2 py-1 bg-primary text-white rounded-lg font-semibold text-xl cursor-pointer mt-[28px]"
          >
            Change Password
          </button>
        </div>
      </form>

      {/* Security Preferences */}

      {/* <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Security Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: "twoFactor",
              label: "Two-Factor Authentication",
              desc: "Extra layer of security",
            },
            {
              name: "loginAlerts",
              label: "Login Alerts",
              desc: "Get notified of new sign-ins",
            },
          ].map((item) => (
            <label
              key={item.name}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                name={item.name}
                checked={security[item.name]}
                onChange={handleChange}
                className="accent-blue-600"
              />
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div> */}

      {/* Session Settings */}

      {/* <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Session Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: "sessionTimeout",
              label: "Session Timeout (minutes)",
              min: 5,
              max: 120,
            },
            {
              name: "passwordExpiry",
              label: "Password Expiry (days)",
              min: 30,
              max: 365,
            },
          ].map((item) => (
            <div key={item.name} className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-2">
                {item.label}
              </label>
              <input
                type="number"
                name={item.name}
                value={security[item.name]}
                onChange={handleChange}
                min={item.min}
                max={item.max}
                className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div> */}

    </div>
  );
}
