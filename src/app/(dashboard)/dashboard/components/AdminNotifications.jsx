"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://mechalink-socket-server-production.up.railway.app", { transports: ["websocket"] });

export default function AdminNotifications({ onNewNotification }) {
  useEffect(() => {
    // Service request notifications
    socket.on("serviceRequestNotification", (msg) => {
      if (onNewNotification) onNewNotification(msg);
    });

    // Mechanic shop notifications
    socket.on("mechanicShopNotification", (msg) => {
      if (onNewNotification) onNewNotification(msg);
    });

    // Announcement notifications
    socket.on("announcementNotification", (msg) => {
      if (onNewNotification) onNewNotification(msg);
    });

    // Coupon notifications
    socket.on("couponNotification", (msg) => {
      if (onNewNotification) onNewNotification(msg);
    });

    // Assignment notifications (when a shop is assigned to a service request)
    socket.on("assignmentNotification", (msg) => {
      if (onNewNotification) onNewNotification(msg);
    });

    return () => {
      socket.off("serviceRequestNotification");
      socket.off("mechanicShopNotification");
      socket.off("announcementNotification");
      socket.off("couponNotification");
      socket.off("assignmentNotification");
    };
  }, [onNewNotification]);

  return null;
}
