import React from "react";
import { Bell, Plus } from "lucide-react";

const Topbar = ({ pageTitle = "Dashboard" }) => {
  return (
    <header className="w-full flex items-center justify-between px-6 py-3 pb-4 border-b border-gray-200 bg-white">
      {/* Left: Title + Breadcrumb (simple for now) */}
      <h1 className="text-xl font-semibold">{pageTitle}</h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search..."
          className="hidden md:block px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Notification */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition">
          <Bell size={20} />
        </button>

        {/* Quick Action */}
        <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition flex items-center gap-1">
          <Plus size={16} /> <span className="hidden sm:block">New Booking</span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition">
          <img
            src="https://ui-avatars.com/api/?name=Admin"
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
          <span className="hidden md:block text-sm font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
