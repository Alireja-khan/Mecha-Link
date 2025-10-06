"use client";

import React from "react";
import { X } from "lucide-react";

const NotificationCanvas = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed w-full h-full inset-0 z-[100] flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/30 backdrop-blur-md" onClick={onClose} />

      {/* Canvas Panel */}
      <div className="w-96 bg-base-100 h-full shadow-lg flex flex-col animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            className="p-2 rounded-full hover:bg-base-200"
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
