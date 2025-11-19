// app/(dashboard)/dashboard/mechanic/settings/SecuritySettings.jsx
"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Shield, Bell } from "lucide-react";
import Swal from "sweetalert2";

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

    if (security.newPassword !== security.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "New password and confirm password do not match",
      });
      return;
    }

    if (security.newPassword.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Password must be at least 6 characters long",
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
        setSecurity((prev) => ({ 
          ...prev, 
          password: "", 
          newPassword: "", 
          confirmPassword: "" 
        }));
      } else {
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
      {/* Password Change Section */}
      <form onSubmit={handleSubmit} className="space-y-6 p-6 border border-base-300 rounded-xl bg-base-200">
        <h2 className="text-xl font-bold text-base-content border-b border-base-300 pb-2 mb-4">
          Change Password
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              field: "password",
              label: "Current Password",
              placeholder: "Enter current password"
            },
            {
              field: "newPassword",
              label: "New Password",
              placeholder: "Enter new password"
            },
            {
              field: "confirmPassword",
              label: "Confirm Password",
              placeholder: "Confirm new password"
            },
          ].map((item) => (
            <div key={item.field} className="flex flex-col">
              <label className="text-sm font-medium text-base-content mb-2">
                {item.label}
              </label>
              <div className="relative">
                <input
                  type={showPassword[item.field] ? "text" : "password"}
                  name={item.field}
                  value={security[item.field]}
                  onChange={handleChange}
                  className="p-3 border border-base-300 bg-base-100 text-base-content rounded-xl focus:ring-2 focus:ring-primary focus:border-primary w-full outline-none transition pr-12"
                  placeholder={item.placeholder}
                  required={item.field !== 'password'}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      [item.field]: !prev[item.field],
                    }))
                  }
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content p-1 transition-colors"
                >
                  {showPassword[item.field] ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
          <p className="text-warning text-sm">
            <strong>Note:</strong> Password must be at least 6 characters long. 
            Use a combination of letters, numbers, and symbols for better security.
          </p>
        </div>
        
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-primary-content rounded-xl hover:bg-secondary transition font-medium shadow-md shadow-primary/30"
          >
            Change Password
          </button>
        </div>
      </form>

      {/* Security Features */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-base-content pb-2 border-b border-base-300">
          Security Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: "twoFactor",
              label: "Two-Factor Authentication",
              desc: "Add an extra layer of security to your account with 2FA.",
              icon: Shield,
            },
            {
              name: "loginAlerts",
              label: "Login Alerts",
              desc: "Get notified when someone logs into your account from a new device.",
              icon: Bell,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <label
                key={item.name}
                className="flex items-start justify-between p-4 border border-base-300 bg-base-100 rounded-xl hover:bg-base-200 cursor-pointer transition"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg mt-1">
                    <Icon className="text-primary" size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-base-content">{item.label}</div>
                    <div className="text-sm text-base-content/70 mt-1">{item.desc}</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  name={item.name}
                  checked={security[item.name]}
                  onChange={handleChange}
                  className="w-5 h-5 accent-primary focus:ring-primary/50 ml-4 mt-2"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Account Security Tips */}
      <div className="bg-base-200 border border-base-300 rounded-xl p-6">
        <h3 className="text-lg font-bold text-base-content mb-4">
          Security Tips for Your Shop Account
        </h3>
        <ul className="space-y-2 text-sm text-base-content/70">
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <span>Use a strong, unique password that you don't use elsewhere</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <span>Enable two-factor authentication for added security</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <span>Never share your login credentials with anyone</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <span>Log out from shared computers and devices</span>
          </li>
        </ul>
      </div>
    </div>
  );
}