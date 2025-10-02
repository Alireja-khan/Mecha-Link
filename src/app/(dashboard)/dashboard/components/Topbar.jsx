"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Users,
  Wrench,
  ClipboardList,
  Menu,
  LogOut,
  User,
} from "lucide-react";
import useUser from "@/hooks/useUser";
import NotificationWidget from "@/app/shared/NotificationWidget";

const transitionClasses = "transition duration-200 ease-in-out";

// ✅ User Dropdown Component
const UserDropdown = ({ loggedInUser, roleConfig }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    setDropdownOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative flex items-center gap-3 cursor-pointer py-1.5 pl-1.5 pr-1.5 md:pr-4 rounded-full hover:bg-gray-100 transition duration-150"
      onClick={() => setDropdownOpen((prev) => !prev)}
    >
      {loggedInUser && (
        <img
          src={
            loggedInUser.profileImage
              ? loggedInUser.profileImage
              : `https://ui-avatars.com/api/?name=${loggedInUser.name}&background=f97316&color=fff&bold=true`
          }
          alt={loggedInUser.name || "User Avatar"}
          className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-orange-500 object-cover flex-shrink-0"
        />
      )}

      {loggedInUser?.role && (
        <div className="hidden sm:flex flex-col text-left justify-center min-w-0">
          <span className="text-base font-semibold text-gray-900 truncate max-w-[90px] md:max-w-[140px]">
            {loggedInUser.name || "Unknown"}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-md border self-start ${roleConfig.badgeColor}`}
          >
            {loggedInUser.role.charAt(0).toUpperCase() +
              loggedInUser.role.slice(1)}
          </span>
        </div>
      )}

      {dropdownOpen && (
        <div
          className={`absolute right-0 top-16 w-56 bg-white shadow-xl rounded-lg border border-gray-100 p-3 z-30 transform opacity-100 scale-100 origin-top-right ${transitionClasses}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sm:hidden p-2 mb-2 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {loggedInUser.name || "Unknown"}
            </p>
            <span
              className={`text-xs font-medium px-2 py-0.5 mt-1 inline-block rounded-md border ${roleConfig.badgeColor}`}
            >
              {loggedInUser.role.charAt(0).toUpperCase() +
                loggedInUser.role.slice(1)}
            </span>
          </div>

          <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md">
            <User size={18} className="mr-2" />
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md mt-1"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

// ✅ Updated Topbar with increased size
const Topbar = ({ pageTitle = "Dashboard", setIsMobileOpen }) => {
  const { user: loggedInUser } = useUser();


  const getRoleStyles = (role) => {
    switch (role) {
      case "admin":
        return {
          badgeColor: "bg-red-100 text-red-600 border-red-400",
          actionText: "Manage Users",
          actionIcon: <Users size={18} />,
          btnBg: "bg-red-600 hover:bg-red-700 shadow-red-300/50",
        };
      case "mechanic":
        return {
          badgeColor: "bg-blue-100 text-blue-600 border-blue-400",
          actionText: "Service Requests",
          actionIcon: <Wrench size={18} />,
          btnBg: "bg-blue-600 hover:bg-blue-700 shadow-blue-300/50",
        };
      default:
        return {
          badgeColor: "bg-orange-100 text-orange-600 border-orange-400",
          actionText: "New Booking",
          actionIcon: <ClipboardList size={18} />,
          btnBg: "bg-orange-600 hover:bg-orange-700 shadow-orange-300/50",
        };
    }
  };

  const roleConfig = loggedInUser ? getRoleStyles(loggedInUser.role) : null;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 md:px-10 py-3 sm:py-2 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-4">
        {/* ✅ Hamburger Button */}
        <button
          className="p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-orange-600 transition duration-150 2xl:hidden"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu size={26} />
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 truncate">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-5">
        {/* Notification Widget */}
        {loggedInUser && <NotificationWidget loggedInUser={loggedInUser} />}

        {roleConfig && (
          <button
            className={`px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-white text-sm sm:text-base font-semibold transition flex items-center gap-2 shadow-md ${roleConfig.btnBg}`}
            title={roleConfig.actionText}
          >
            {roleConfig.actionIcon}
            <span className="hidden md:block">{roleConfig.actionText}</span>
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