"use client";

import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import useUser from "@/hooks/useUser";

export default function SecuritySettings() {
  const { user: loggedInUser } = useUser();
  const [showPassword, setShowPassword] = useState({
    password: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [security, setSecurity] = useState({
    password: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (loggedInUser) {
      setSecurity({
        password: "",
        newPassword: "",
        confirmPassword: ""
      });
    }
  }, [loggedInUser]);

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
        setSecurity((prev) => ({ ...prev, password: "", newPassword: "", confirmPassword: "" }));
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
      {/* Password Section with form */}
      <form onSubmit={handleSubmit} className="space-y-6 p-6 border border-base-300 rounded-xl bg-base-200">
        <h2 className="text-xl font-bold text-base-content border-b border-base-300 pb-2 mb-4">
          Change Password
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["password", "newPassword", "confirmPassword"].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-sm font-medium text-base-content mb-2 capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <div className="relative">
                <input
                  type={showPassword[field] ? "text" : "password"}
                  name={field}
                  value={security[field]}
                  onChange={handleChange}
                  className="p-3 border border-base-300 bg-base-100 text-base-content rounded-xl focus:ring-2 focus:ring-primary focus:border-primary w-full outline-none transition"
                  placeholder={field === 'password' ? 'Current Password' : 'New Password'}
                  required={field !== 'password'}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      [field]: !prev[field],
                    }))
                  }
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content p-1 transition-colors"
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
            className="px-6 py-3 bg-primary text-primary-content rounded-xl hover:bg-secondary transition font-medium shadow-md shadow-primary/30"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
}