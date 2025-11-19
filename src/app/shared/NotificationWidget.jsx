"use client";

import React, {useState, useEffect} from "react";
import {createPortal} from "react-dom";
import {
  Bell,
  CheckCircle,
  ClipboardList,
  Gift,
  Trash2,
  Eye,
  Archive,
} from "lucide-react";
import AdminNotifications from "../(dashboard)/dashboard/components/AdminNotifications";
import NotificationCanvas from "../(dashboard)/dashboard/components/NotificationCanvas";
import axios from "axios";

const NotificationWidget = ({loggedInUser}) => {
  const [notifications, setNotifications] = useState([]);
  const [showCanvas, setShowCanvas] = useState(false);

  // Load notifications from loggedInUser object
  useEffect(() => {
    if (!loggedInUser) return;
    const uniqueNotifs = Array.from(
      new Map(
        (loggedInUser.notifications || []).map((n) => [n._id, n])
      ).values()
    );
    setNotifications(uniqueNotifs);
  }, [loggedInUser]);

  const handleNewNotification = (notif) => {
    if (!loggedInUser) return;

    setNotifications((prev) => {
      const exists = prev.some((n) => n._id === notif._id);
      if (exists) return prev;

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

  const handleMarkAsRead = async (notifId = null) => {
    try {
      if (notifId) {
        // Mark single notification as read
        setNotifications((prev) =>
          prev.map((n) => (n._id === notifId ? {...n, read: true} : n))
        );
      } else {
        // Mark all as read
        setNotifications((prev) => prev.map((n) => ({...n, read: true})));
      }
      await axios.patch("/api/users", {email: loggedInUser.email, notifId});
    } catch (err) {
      console.error("❌ Failed to mark notifications as read:", err);
    }
  };

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
  const handleClearAll = async () => {
    try {
      setNotifications([]);
      await axios.put("/api/users", {
        email: loggedInUser.email,
      });
    } catch (err) {
      console.error("❌ Failed to clear all notifications:", err);
    }
  };

  const getNotificationIcon = (type) => {
    const iconProps = {size: 20};
    switch (type) {
      case "assignment":
        return <CheckCircle className="text-green-500" {...iconProps} />;
      case "coupon":
        return <Gift className="text-purple-500" {...iconProps} />;
      case "announcement":
        return <ClipboardList className="text-blue-500" {...iconProps} />;
      default:
        return <Bell className="text-orange-500" {...iconProps} />;
    }
  };

  const getNotificationBadge = (type) => {
    switch (type) {
      case "assignment":
        return "bg-green-500/20 text-green-600 border-green-500/30";
      case "coupon":
        return "bg-purple-500/20 text-purple-600 border-purple-500/30";
      case "announcement":
        return "bg-blue-500/20 text-blue-600 border-blue-500/30";
      default:
        return "bg-orange-500/20 text-orange-600 border-orange-500/30";
    }
  };

  // Bell button with smooth interaction
  const bellButton = (
    <button
      title="Notifications"
      className="relative p-3 rounded-2xl bg-base-100 border border-neutral/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
      onClick={() => setShowCanvas(true)}
    >
      <Bell
        size={22}
        className="text-base-content group-hover:text-primary transition-colors duration-300"
      />

      {/* Notification badge with smooth appearance */}
      {notifications.some((n) => !n.read) && (
        <span className="absolute -top-1 -right-1 min-w-5 min-h-5 text-xs font-bold text-white bg-red-500 rounded-full flex justify-center items-center shadow-lg transition-all duration-300 animate-pulse">
          {notifications.filter((n) => !n.read).length}
        </span>
      )}
    </button>
  );

  // Canvas portal content
  const canvasPortal =
    typeof document !== "undefined" &&
    createPortal(
      <NotificationCanvas
        isOpen={showCanvas}
        title="Notifications"
        onClose={() => setShowCanvas(false)}
      >
        {/* Notifications Header Actions */}
        <div className="p-4 bg-base-100 border-b border-base-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-base-content">
                {notifications.length}{" "}
                {notifications.length === 1 ? "notification" : "notifications"}
              </span>
              {notifications.some((n) => !n.read) && (
                <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full font-bold transition-all duration-300">
                  {notifications.filter((n) => !n.read).length} new
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                {notifications.some((n) => !n.read) && (
                  <button
                    onClick={() => handleMarkAsRead()}
                    className="flex items-center gap-1 px-3 py-1 text-xs text-primary bg-primary/10 rounded-xl border border-primary/20 hover:bg-primary/20 transition-all duration-200"
                  >
                    <Eye size={14} />
                    Mark All Read
                  </button>
                )}
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1 px-3 py-1 text-xs text-error bg-error/10 rounded-xl border border-error/20 hover:bg-error/20 transition-all duration-200"
                >
                  <Trash2 size={14} />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2 p-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 transition-all duration-300">
              <Bell
                className="mx-auto text-base-content/30 mb-3 transition-transform duration-300"
                size={48}
              />
              <p className="text-base-content/60 font-medium transition-colors duration-300">
                No notifications
              </p>
              <p className="text-sm text-base-content/40 mt-1 transition-colors duration-300">
                You're all caught up!
              </p>
            </div>
          ) : (
            notifications.map((notif, idx) => (
              <div
                key={notif._id || idx}
                className={`group p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                  notif.read
                    ? "bg-base-100 border-base-300"
                    : "bg-primary/5 border-primary/20 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`p-2 rounded-xl transition-all duration-300 ${getNotificationBadge(
                      notif.type
                    )} border`}
                  >
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p
                          className={`font-semibold text-sm leading-tight transition-colors duration-300 ${
                            notif.read ? "text-base-content" : "text-primary"
                          }`}
                        >
                          {notif.message || "New Notification"}
                        </p>
                        <p className="text-xs text-base-content/60 mt-1 transition-colors duration-300">
                          {notif.createdAt
                            ? new Date(notif.createdAt).toLocaleString()
                            : "Just now"}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {!notif.read && (
                          <button
                            title="Mark as read"
                            onClick={() => handleMarkAsRead(notif._id)}
                            className="p-1 rounded-lg hover:bg-base-200 transition-all duration-200 hover:scale-110"
                          >
                            <Eye size={14} className="text-base-content/60" />
                          </button>
                        )}
                        <button
                          title="Delete"
                          onClick={() => handleDeleteNotification(notif._id)}
                          className="p-1 rounded-lg hover:bg-error/20 transition-all duration-200 hover:scale-110"
                        >
                          <Trash2 size={14} className="text-error" />
                        </button>
                      </div>
                    </div>

                    {/* Type Badge */}
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full capitalize transition-all duration-300 ${getNotificationBadge(
                          notif.type
                        )}`}
                      >
                        {notif.type || "general"}
                      </span>
                      {!notif.read && (
                        <span className="px-2 py-1 bg-primary text-primary-content text-xs rounded-full font-bold transition-all duration-300">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
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
