"use client";

import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, ClipboardList, Gift } from "lucide-react";
import axios from "axios";
import AdminNotifications from "../(dashboard)/dashboard/components/AdminNotifications";
import NotificationCanvas from "../(dashboard)/dashboard/components/NotificationCanvas";

const NotificationWidget = ({ loggedInUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [showCanvas, setShowCanvas] = useState(false);

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!loggedInUser) return;
      try {
        const res = await axios.get("/api/notifications");
        if (!res.data) return;

        let filtered = res.data;

        if (loggedInUser.role === "admin") {
          filtered = res.data;
        } else if (loggedInUser.role === "mechanic") {
          filtered = res.data.filter((n) =>
            ["serviceRequest", "coupon", "announcement"].includes(n.type)
          );
        } else if (loggedInUser.role === "user") {
          filtered = res.data.filter((n) => {
            if (["coupon", "announcement"].includes(n.type)) return true;
            if (n.type === "assignment" && n.userEmail === loggedInUser.email)
              return true;
            return false;
          });
        }

        setNotifications(filtered);
      } catch (err) {
        console.error("❌ Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
  }, [loggedInUser]);

  // Handle real-time notifications from socket
  const handleNewNotification = (msg) => {
    if (!loggedInUser) return;

    if (loggedInUser.role === "admin") {
      setNotifications((prev) => [msg, ...prev]);
    } else if (loggedInUser.role === "mechanic") {
      if (["serviceRequest", "coupon", "announcement"].includes(msg.type)) {
        setNotifications((prev) => [msg, ...prev]);
      }
    } else if (loggedInUser.role === "user") {
      if (msg.type === "assignment" && msg.userEmail === loggedInUser.email) {
        setNotifications((prev) => [msg, ...prev]);
      } else if (["coupon", "announcement"].includes(msg.type)) {
        setNotifications((prev) => [msg, ...prev]);
      }
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("❌ Failed to delete notification:", err);
    }
  };

  const handleMarkAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read);
      for (const notif of unreadNotifications) {
        await axios.patch(`/api/notifications/${notif._id}`);
      }
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("❌ Failed to mark notifications as read:", err);
    }
  };

  return (
    <>
      {/* Socket listener */}
      <AdminNotifications onNewNotification={handleNewNotification} />

      {/* Bell Icon */}
      <div className="relative">
        <button
          title="Notifications"
          className="p-3 rounded-full text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition duration-150 relative group"
          onClick={() => {
            setShowCanvas(true);
            handleMarkAsRead();
          }}
        >
          <Bell size={20} />
          {notifications.some((n) => !n.read) && (
            <span className="absolute top-1 -right-1 min-w-4 min-h-4 text-xs text-white bg-red-600 rounded-full flex justify-center items-center">
              {notifications.filter((n) => !n.read).length}
            </span>
          )}
        </button>
      </div>

      {/* Notification Canvas */}
      <NotificationCanvas
        isOpen={showCanvas}
        title="Notifications"
        onClose={() => setShowCanvas(false)}
      >
        {notifications.length === 0 ? (
  <p className="p-4 text-sm text-gray-500">No new notifications</p>
) : (
  notifications.map((notif, idx) => {
    // choose icon based on type
    const getIcon = (type) => {
      switch (type) {
        case "assignment":
          return <CheckCircle className="text-green-500" size={20} />;
        case "coupon":
          return <Gift className="text-purple-500" size={20} />;
        case "announcement":
          return <ClipboardList className="text-blue-500" size={20} />;
        default:
          return <Bell className="text-gray-400" size={20} />;
      }
    };

    return (
      <div
        key={idx}
        className="flex items-start gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition"
      >
        {/* Icon on left */}
        <div className="mt-1">{getIcon(notif.type)}</div>

        {/* Message & timestamp */}
        <div className="flex-1 flex flex-col">
          <p className="text-base font-semibold text-primary">
            {notif.message || "New Notification"}
          </p>
          <p className="text-xs text-gray-400">
            {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ""}
          </p>
        </div>

        {/* Delete button */}
        <button
          className="self-start text-gray-400 hover:text-red-600 text-sm font-bold"
          onClick={() => handleDeleteNotification(notif._id)}
        >
          ✕
        </button>
      </div>
    );
  })
)}
      </NotificationCanvas>
    </>
  );
};

export default NotificationWidget;
