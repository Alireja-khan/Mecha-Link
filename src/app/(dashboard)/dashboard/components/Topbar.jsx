"use client";

import React, { useState, useEffect } from "react";
import { Bell, Users, Wrench, ClipboardList } from "lucide-react";
import useUser from "@/hooks/useUser";
import AdminNotifications from "./AdminNotifications";
import NotificationCanvas from "./NotificationCanvas";
import axios from "axios";

const Topbar = ({ pageTitle = "Dashboard" }) => {
  const { user: loggedInUser } = useUser();

  const [notifications, setNotifications] = useState([]);
  const [showCanvas, setShowCanvas] = useState(false);

  // ✅ Load previous notifications on page load
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/api/notifications");
        if (res.data) {
          setNotifications(res.data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
  }, []);

  // ✅ Save new notification (local + DB)
  const handleNewNotification = async (msg) => {
    try {
      setNotifications((prev) => [msg, ...prev]); // Local state update
      await axios.post("/api/notifications", {
        userEmail: msg?.data?.userEmail || "system@mechalink.com",
        message: msg?.message || "New Notification",
        type: "serviceRequest",
        data: msg.data,
      });
    } catch (error) {
      console.error("❌ Failed to save notification:", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications?id=${id}`);
      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error("❌ Failed to delete notification:", error);
    }
  };

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
        {/* Socket listener (gets new notifications) */}
        <AdminNotifications onNewNotification={handleNewNotification} />

        {/* Notification Bell */}
        <div className="relative">
          <button
            title="Notifications"
            className="p-3 rounded-full text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition duration-150 relative group"
            onClick={() => setShowCanvas(true)}
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-1 -right-1 min-w-4 min-h-4 text-xs text-white bg-red-600 rounded-full flex justify-center items-center">
                {notifications.length}
              </span>
            )}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition">
              Notifications
            </span>
          </button>
        </div>

        {/* Role-Based Action Button */}
        {roleConfig && (
          <button
            className={`px-4 py-2 rounded-xl text-white text-sm font-semibold transition duration-150 flex items-center gap-1.5 shadow-md ${roleConfig.btnBg}`}
            title={roleConfig.actionText}
          >
            {roleConfig.actionIcon}
            <span className="hidden sm:block">{roleConfig.actionText}</span>
          </button>
        )}

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

      {/* ✅ Canvas for Notifications */}
      <NotificationCanvas
        isOpen={showCanvas}
        title="Notifications"
        onClose={() => setShowCanvas(false)}
      >
        {notifications.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">No new notifications</p>
        ) : (
          notifications.map((notif, idx) => {
            const service = notif?.data?.serviceDetails || {};
            const location = notif?.data?.location || {};
            const urgency = notif?.data?.serviceDetails?.urgency || "N/A";

            return (
              <div
                key={idx}
                className="flex justify-between items-start px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {service.problemTitle || "Untitled Service"}
                  </p>
                  <p className="text-xs text-gray-400 mb-1">
                    {new Date(notif.data.requestedDate).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-700">
                    👤 <span className="font-medium">{notif?.data?.userName}</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    ⚡ Urgency:{" "}
                    <span
                      className={`font-medium ${
                        urgency === "high"
                          ? "text-red-600"
                          : urgency === "medium"
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {urgency}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    📍 {location.address || "Location not provided"}
                  </p>
                </div>

                {/* ❌ Delete Button */}
                <button
                  className="text-gray-400 hover:text-red-600 text-sm font-bold"
                  onClick={() => handleDeleteNotification(notif._id)}
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </NotificationCanvas>
    </header>
  );
};

export default Topbar;
