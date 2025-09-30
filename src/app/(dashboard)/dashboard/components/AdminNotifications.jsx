"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // replace with your socket server URL

export default function AdminNotifications({ onNewNotification }) {
  useEffect(() => {
    socket.on("serviceRequestNotification", (msg) => {
      console.log("New Service Request:", msg);
      if (onNewNotification) onNewNotification(msg);
    });

    return () => {
      socket.off("serviceRequestNotification");
    };
  }, [onNewNotification]);

  return null;
}
