"use client";

import React from "react";
import { X } from "lucide-react";

const NotificationCanvas = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/30" onClick={onClose} />

      {/* Canvas Panel */}
      <div className="w-96 bg-white h-full shadow-lg flex flex-col animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default NotificationCanvas;
