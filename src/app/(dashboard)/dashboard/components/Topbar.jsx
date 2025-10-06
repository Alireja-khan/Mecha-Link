"use client";


import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Wrench,
  ClipboardList,
  Menu,
} from "lucide-react";
import useUser from "@/hooks/useUser";
import NotificationWidget from "@/app/shared/NotificationWidget";
import ToggleTheme from "../../../shared/ToggleTheme";


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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoleBadgeStyles = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-500 text-white border-red-600";
      case "mechanic":
        return "bg-blue-500 text-white border-blue-600";
      default:
        return "bg-orange-500 text-white border-orange-600";
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="relative flex items-center gap-2 sm:gap-3 cursor-pointer px-1.5 py-1.5 xl:px-2 xl:py-2 rounded-full hover-lift transition-all duration-200 flex-shrink"
      onClick={() => setDropdownOpen((prev) => !prev)}
    >
      {loggedInUser && (
        <div className="relative flex-shrink-0">
          <img
            src={
              loggedInUser.profileImage
                ? loggedInUser.profileImage
                : `https://ui-avatars.com/api/?name=${loggedInUser.name}&background=f97316&color=fff&bold=true`
            }
            alt={loggedInUser.name || "User Avatar"}
            className="aspect-square rounded-full object-cover border-2 border-primary transition-all duration-200 w-10 h-10"
          />
        </div>
      )}

      {loggedInUser?.role && (
        <div className="hidden lg:flex flex-col text-left justify-center min-w-0">
          <span className="text-sm font-semibold truncate text-base-content">
            {loggedInUser.name || "Unknown"}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-md self-start ${getRoleBadgeStyles(
              loggedInUser.role
            )}`}
          >
            {loggedInUser.role.charAt(0).toUpperCase() +
              loggedInUser.role.slice(1)}
          </span>
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
    <header className="sticky top-0 z-15 flex items-center justify-between px-4 sm:px-8 md:px-10 py-3 sm:py-2.5 border-b border-neutral bg-base-100">
      <div className="flex items-center gap-4">
        {/* ✅ Hamburger Button */}
        <button
          className="p-1 rounded-lg text-base-content hover:bg-base-200 hover:text-primary transition duration-150 2xl:hidden"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu size={26} />
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-base-content truncate">
          {pageTitle}
        </h1>
      </div>



      <div className="flex items-center gap-5">
        <ToggleTheme />
        {/* Notification Widget */}
        {loggedInUser && <NotificationWidget loggedInUser={loggedInUser} />}


        {roleConfig && (
          <button
            className={`hidden md:flex px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-white text-sm sm:text-base font-semibold transition items-center gap-2 shadow-md ${roleConfig.btnBg}`}
            title={roleConfig.actionText}
          >
            {roleConfig.actionIcon}
            <span className="hidden md:block">{roleConfig.actionText}</span>
          </button>
        )}


        {loggedInUser && (
          <UserDropdown
            loggedInUser={loggedInUser}
            roleConfig={roleConfig}
          />
        )}
      </div>
    </header>
  );
};


export default Topbar;

