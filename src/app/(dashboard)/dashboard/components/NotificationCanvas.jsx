"use client";

import React from "react";
import { X, Bell } from "lucide-react";

const NotificationCanvas = ({ isOpen, title, onClose, children }) => {
  return (
    <>
      {/* Overlay with smooth transition */}
      <div 
        className={`fixed inset-0 z-[99] bg-black/20 backdrop-blur-sm transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Drawer Panel with smooth slide animation */}
      <div className={`
        fixed right-0 top-0 h-full w-126 bg-base-100 shadow-2xl border-l border-neutral/40 
        flex flex-col z-[100] transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header - Matching admin dashboard */}
        <div className="bg-gradient-to-br from-primary to-orange-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Bell size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-orange-100 text-sm mt-1">Your recent updates</p>
              </div>
            </div>
            <button
              className="p-2 rounded-xl hover:bg-white/20 transition-all duration-200 hover:scale-110"
              onClick={onClose}
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-base-200">
          {children}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-base-300 bg-base-100">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-base-200 text-base-content rounded-xl border border-base-300 hover:bg-base-300 transition-all duration-200 font-medium text-center hover:shadow-md"
          >
            Close Notifications
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationCanvas;