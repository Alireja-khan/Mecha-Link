"use client";

import React from "react";
import { Bell, Plus, Search, Users, Wrench, ClipboardList } from "lucide-react";
import useUser from "@/hooks/useUser";

const Topbar = ({ pageTitle = "Dashboard" }) => {
  const { user: loggedInUser } = useUser();

  const getRoleStyles = (role) => {
    switch (role) {
      case "admin":
        return {
          badgeColor: "bg-red-100 text-red-600 border-red-400",
          actionText: "Manage Users",
          actionIcon: <Users size={16} />,
          btnBg: "bg-red-600 hover:bg-red-700 shadow-red-300/50",
        };
      case "mechanic":
        return {
          badgeColor: "bg-blue-100 text-blue-600 border-blue-400",
          actionText: "Service Requests",
          actionIcon: <Wrench size={16} />,
          btnBg: "bg-blue-600 hover:bg-blue-700 shadow-blue-300/50",
        };
      default:
        return {
          badgeColor: "bg-orange-100 text-orange-600 border-orange-400",
          actionText: "New Booking",
          actionIcon: <ClipboardList size={16} />,
          btnBg: "bg-orange-600 hover:bg-orange-700 shadow-orange-300/50",
        };
    }
  };

  const roleConfig = loggedInUser ? getRoleStyles(loggedInUser.role) : null;

  return (
    <header className="w-full sticky top-0 z-20 flex items-center justify-between px-8 py-3.5 border-b border-gray-100 bg-white">
      <h1 className="text-2xl font-extrabold text-gray-800">{pageTitle}</h1>

      <div className="flex items-center gap-5">
        {/* Search Bar */}
        <div className="relative hidden lg:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search transactions, users, etc."
            className="w-80 px-4 py-2 pl-10 text-sm border border-gray-200 rounded-xl bg-gray-50 
                       focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            title="Notifications"
            className="p-3 rounded-full text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition duration-150"
          >
            <Bell size={20} />
          </button>

          {roleConfig && (
            <button
              className={`px-4 py-2 rounded-xl text-white text-sm font-semibold 
                       transition duration-150 flex items-center gap-1.5 shadow-md ${roleConfig.btnBg}`}
              title={roleConfig.actionText}
            >
              {roleConfig.actionIcon}{" "}
              <span className="hidden sm:block">{roleConfig.actionText}</span>
            </button>
          )}
        </div>

        <div className="w-px h-6 bg-gray-200 hidden sm:block" />

        {/* User Info */}
        <div className="flex items-center gap-2 cursor-pointer py-1 pl-1 pr-6 rounded-full hover:bg-gray-100 transition">
          {loggedInUser && (
            <img
              src={
                loggedInUser.profileImage
                  ? loggedInUser.profileImage
                  : `https://ui-avatars.com/api/?name=${
                      loggedInUser.role === "admin"
                        ? "Admin"
                        : loggedInUser.role === "mechanic"
                        ? "Mechanic"
                        : "User"
                    }&background=f97316&color=fff&bold=true`
              }
              alt={loggedInUser.name || "User Avatar"}
              className="w-10 h-10 rounded-full border-2 border-orange-500"
            />
          )}
          {loggedInUser?.role && (
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-semibold text-gray-900">
                {loggedInUser.name || "Unknown User"}
              </span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-md border ${roleConfig.badgeColor}`}
              >
                {loggedInUser.role.charAt(0).toUpperCase() +
                  loggedInUser.role.slice(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
