"use client";

import React, {useState, useEffect} from "react";
import {Bell, CheckCircle, ClipboardList, Gift} from "lucide-react";
import AdminNotifications from "../(dashboard)/dashboard/components/AdminNotifications";
import NotificationCanvas from "../(dashboard)/dashboard/components/NotificationCanvas";
import axios from "axios";

const NotificationWidget = ({loggedInUser}) => {
  const [notifications, setNotifications] = useState([]);
  const [showCanvas, setShowCanvas] = useState(false);

  // Load notifications from loggedInUser object
  useEffect(() => {
    if (!loggedInUser) return;
    setNotifications(loggedInUser.notifications || []);
  }, [loggedInUser]);

  // Handle real-time notifications from socket
  const handleNewNotification = (notif) => {
    if (!loggedInUser) return;

    // Push new notification to local state if relevant
    if (
      loggedInUser.role === "admin" ||
      loggedInUser.role === "mechanic" ||
      (loggedInUser.role === "user" && notif.userEmail === loggedInUser.email)
    ) {
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  // Mark all notifications as read
  const handleMarkAsRead = async () => {
    try {
      // Update local state
      setNotifications((prev) => prev.map((n) => ({...n, read: true})));

      // Update backend
      await axios.patch("/api/users", {email: loggedInUser.email});
    } catch (err) {
      console.error("❌ Failed to mark notifications as read:", err);
    }
  };

  // Delete a notification
  const handleDeleteNotification = async (notifId) => {
    try {
      setNotifications((prev) => prev.filter((n) => n._id !== notifId));

      await axios.delete("/api/users", {
        params: {email: loggedInUser.email, notifId},
      });
    } catch (err) {
      console.error("❌ Failed to delete notification:", err);
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
                <div className="mt-1">{getIcon(notif.type)}</div>

                <div className="flex-1 flex flex-col">
                  <p className="text-base font-semibold text-primary">
                    {notif.message || "New Notification"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {notif.createdAt
                      ? new Date(notif.createdAt).toLocaleString()
                      : ""}
                  </p>
                </div>

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
