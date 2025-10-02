"use client";

import React from "react";
import { Users, Wrench, ClipboardList } from "lucide-react";
import useUser from "@/hooks/useUser";
import NotificationWidget from "@/app/shared/NotificationWidget";

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
        {/* Notification Widget */}
        {loggedInUser && <NotificationWidget loggedInUser={loggedInUser} />}

        {/* Role-Based Action */}
        {roleConfig && (
          <button
            className={`px-4 py-2 rounded-xl text-white text-sm font-semibold transition duration-150 flex items-center gap-1.5 shadow-md ${roleConfig.btnBg}`}
            title={roleConfig.actionText}
          >
            {roleConfig.actionIcon}
            <span className="hidden sm:block">{roleConfig.actionText}</span>
          </button>
        )}

        {/* User Info */}
        {loggedInUser && (
          <div className="flex items-center gap-2 cursor-pointer py-1 pl-1 pr-6 rounded-full hover:bg-gray-100 transition">
            <img
              src={
                loggedInUser.profileImage
                  ? loggedInUser.profileImage
                  : `https://ui-avatars.com/api/?name=${loggedInUser.name}&background=f97316&color=fff&bold=true`
              }
              alt={loggedInUser.name || "User Avatar"}
              className="w-10 h-10 rounded-full border-2 border-orange-500"
            />
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
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
