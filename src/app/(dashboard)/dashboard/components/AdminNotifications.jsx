"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // replace with your socket server URL

export default function AdminNotifications({ onNewNotification }) {
  useEffect(() => {
    // Service request notifications
    socket.on("serviceRequestNotification", (msg) => {
      console.log("New Service Request:", msg);
      if (onNewNotification) onNewNotification(msg);
    });

    // Mechanic shop notifications
    socket.on("mechanicShopNotification", (msg) => {
      console.log("New Mechanic Shop Added:", msg);
      if (onNewNotification) onNewNotification(msg);
    });

    // Announcement notifications
    socket.on("announcementNotification", (msg) => {
      console.log("New Announcement:", msg);
      if (onNewNotification) onNewNotification(msg);
    });

    // Coupon notifications
    socket.on("couponNotification", (msg) => {
      console.log("New Coupon:", msg);
      if (onNewNotification) onNewNotification(msg);
    });

    return () => {
      socket.off("serviceRequestNotification");
      socket.off("mechanicShopNotification");
      socket.off("announcementNotification");
      socket.off("couponNotification");
    };
  }, [onNewNotification]);

  return null;
}
