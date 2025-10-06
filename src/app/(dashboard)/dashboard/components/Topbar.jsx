"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Users,
  Wrench,
  ClipboardList,
  Menu,
} from "lucide-react";
import useUser from "@/hooks/useUser";
import AdminNotifications from "./AdminNotifications";
import NotificationCanvas from "./NotificationCanvas";
import axios from "axios";
import ToggleTheme from "./ToggleTheme";
import Link from "next/link";

// ✅ User Dropdown Component
const UserDropdown = ({ loggedInUser, roleConfig }) => {
  const [dropdownOpen, setDropdownOpen] = useState(true);
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

// ✅ Topbar Component
const Topbar = ({ pageTitle = "Dashboard", setIsMobileOpen }) => {
  const { user: loggedInUser } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/api/notifications");
        if (res.data) {
          let filtered = res.data;
          if (loggedInUser?.role === "mechanic") {
            filtered = res.data.filter((n) =>
              ["serviceRequest", "coupon", "announcement"].includes(n.type)
            );
          } else if (loggedInUser?.role === "user") {
            filtered = res.data.filter((n) =>
              ["coupon", "announcement"].includes(n.type)
            );
          }
          setNotifications(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    if (loggedInUser) fetchNotifications();
  }, [loggedInUser]);

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleMarkAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read);
      for (const notif of unreadNotifications) {
        await axios.patch(`/api/notifications/${notif._id}`, { read: true });
      }
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  const getRoleStyles = (role) => {
    switch (role) {
      case "admin":
        return {
          badgeColor: "bg-red-500 text-white border-red-600",
          actionText: "Manage Users",
          actionIcon: <Users size={18} />,
          gradient: "from-red-500 to-red-600",
          Route: "/dashboard/admin/manageUsers",
        };
      case "mechanic":
        return {
          badgeColor: "bg-blue-500 text-white border-blue-600",
          actionText: "Service Requests",
          actionIcon: <Wrench size={18} />,
          gradient: "from-blue-500 to-blue-600",
        };
      default:
        return {
          badgeColor: "bg-orange-500 text-white border-orange-600",
          actionText: "New Booking",
          actionIcon: <ClipboardList size={18} />,
          gradient: "from-orange-500 to-orange-600",
        };
    }
  };

  const roleConfig = loggedInUser ? getRoleStyles(loggedInUser.role) : null;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Topbar Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-base-100/80 border-b border-neutral transition-all duration-300 w-full px-2">
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 w-full">
          {/* Left Section */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              className="p-2 rounded-xl text-base-content hover:bg-base-300 hover-lift transition-all duration-200 2xl:hidden flex-shrink-0"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu size={22} className="sm:w-6 sm:h-6" />
            </button>
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-base-content truncate flex-shrink min-w-0">
              {pageTitle}
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0 min-w-0 z-50">
            <AdminNotifications />
            <ToggleTheme />

            {/* Notification Button */}
            <div className="relative flex-shrink-0">
              <button
                title="Notifications"
                className="relative p-2 sm:p-2.5 rounded-xl text-base-content hover:bg-base-300 hover-lift transition-all duration-200"
                onClick={() => {
                  setShowCanvas(true);
                  handleMarkAsRead();
                }}
              >
                <Bell size={20} className="sm:w-[22px] sm:h-[22px]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-auto px-1.5 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Role Button */}
            {roleConfig && (
              <Link href={roleConfig.Route || "#"}>
                <button
                  className={`hidden sm:flex items-center gap-2 px-3 sm:px-4 py-3 rounded-xl text-white text-sm font-semibold bg-gradient-to-r ${roleConfig.gradient} hover-lift shadow-lg hover:shadow-xl transition-all duration-200 flex-shrink`}
                >
                  {roleConfig.actionIcon}
                  <span className="hidden md:inline">
                    {roleConfig.actionText}
                  </span>
                </button>
              </Link>
            )}

            {loggedInUser && (
              <UserDropdown
                loggedInUser={loggedInUser}
                roleConfig={roleConfig}
              />
            )}
          </div>
        </div>
      </header>

      {/* ✅ Fixed Notification Canvas (placed outside header for z-index isolation) */}
      <div className="fixed top-0 right-0 z-[100]">
        <NotificationCanvas
          isOpen={showCanvas}
          title="Notifications"
          onClose={() => setShowCanvas(false)}
        >
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-base-300 flex items-center justify-center mb-4 p-4">
                <Bell size={28} className="text-base-content/70" />
              </div>
              <p className="text-sm font-medium text-base-content mb-1">
                No notifications
              </p>
              <p className="text-xs text-base-content/60">
                You're all caught up!
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const createdAt = notif.createdAt
                ? new Date(notif.createdAt).toLocaleString()
                : "Date not available";

              return (
                <div
                  key={notif._id}
                  className="group relative flex flex-col gap-2 px-5 py-3 border-b border-neutral hover:bg-base-200 transition-all duration-150"
                >
                  {!notif.read && (
                    <div className="absolute top-6 left-2 w-2 h-2 rounded-full bg-primary" />
                  )}
                  <div className="flex justify-between items-start gap-3 min-w-0">
                    <p
                      className={`text-sm truncate ${!notif.read
                        ? "font-semibold text-base-content"
                        : "text-base-content/70"
                        }`}
                    >
                      {notif.message || "Notification"}
                    </p>
                    <button
                      className="opacity-0 group-hover:opacity-100 text-base-content/60 hover:text-red-500 text-xs font-bold transition-all duration-150"
                      onClick={() => handleDeleteNotification(notif._id)}
                    >
                      ✕
                    </button>
                  </div>
                  {notif.data && (
                    <p className="text-xs text-base-content/70 break-all">
                      {JSON.stringify(notif.data)}
                    </p>
                  )}
                  <p className="text-[11px] text-base-content/60 self-end">
                    {createdAt}
                  </p>
                </div>
              );
            })
          )}
        </NotificationCanvas>
      </div>
    </>
  );
};

export default Topbar;
