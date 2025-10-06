"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Bell, CheckCircle, ClipboardList, Gift } from "lucide-react";
import AdminNotifications from "../(dashboard)/dashboard/components/AdminNotifications";
import NotificationCanvas from "../(dashboard)/dashboard/components/NotificationCanvas";
import axios from "axios";

const NotificationWidget = ({ loggedInUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [showCanvas, setShowCanvas] = useState(false);

  // Load notifications from loggedInUser object
 useEffect(() => {
  if (!loggedInUser) return;
  const uniqueNotifs = Array.from(
    new Map((loggedInUser.notifications || []).map(n => [n._id, n])).values()
  );
  setNotifications(uniqueNotifs);
}, [loggedInUser]);


  const handleNewNotification = (notif) => {
    if (!loggedInUser) return;

    // Only add if not already in state
    setNotifications((prev) => {
      const exists = prev.some((n) => n._id === notif._id);
if (exists) return prev;

      // Check if this notification is relevant for this user
      if (
        loggedInUser.role === "admin" ||
        loggedInUser.role === "mechanic" ||
        (loggedInUser.role === "user" &&
          notif.userEmail === loggedInUser.email) ||
        notif.userEmail === "all"
      ) {
        return [notif, ...prev];
      }
      return prev;
    });
  };

  const handleMarkAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      await axios.patch("/api/users", { email: loggedInUser.email });
    } catch (err) {
      console.error("❌ Failed to mark notifications as read:", err);
    }
  };

  const handleDeleteNotification = async (notifId) => {
    try {
      setNotifications((prev) => prev.filter((n) => n._id !== notifId));
      await axios.delete("/api/users", {
        params: { email: loggedInUser.email, notifId },
      });
    } catch (err) {
      console.error("❌ Failed to delete notification:", err);
    }
  };

  // Render bell normally
  const bellButton = (
    <button
      title="Notifications"
      className="p-3 rounded-full text-base-content bg-base-200 hover:bg-base-300 hover:text-primary transition duration-300 relative group"
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
  );

  // Canvas portal content
  const canvasPortal = typeof document !== "undefined" && createPortal(
    <NotificationCanvas
      isOpen={showCanvas}
      title={<span className="text-base-content font-bold">Notifications</span>}
      onClose={() => setShowCanvas(false)}
    >
      {notifications.length === 0 ? (
        <p className="p-4 text-sm text-gray-500">No new notifications</p>
      ) : (
        notifications.map((notif, idx) => {
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
              className="flex items-start gap-3 px-4 py-3 border-b border-neutral hover:bg-base-200 transition"
            >
              <div className="mt-1">{getIcon(notif.type)}</div>
              <div className="flex-1 flex flex-col">
                <p className="text-base font-semibold text-primary">
                  {notif.message || "New Notification"}
                </p>
                <p className="text-xs text-base-content/60">
                  {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ""}
                </p>
              </div>
              <button
                className="self-start text-base-content hover:text-error transition duration-200 text-sm font-bold"
                onClick={() => handleDeleteNotification(notif._id)}
              >
                ✕
              </button>
            </div>
          );
        })
      )}
    </NotificationCanvas>,
    document.body
  );

  return (
    <>
      <AdminNotifications onNewNotification={handleNewNotification} />

      <div className="relative">{bellButton}</div>

      {canvasPortal}
    </>
  );
};

export default NotificationWidget;
