import React from "react";
import { Bell, Settings, User } from "lucide-react";

const Topbar = ({ pageTitle = "Dashboard" }) => {
  return (
    <header className=" w-full flex items-center justify-between px-6  border-b border-gray-200">
      {/* Left side: Page title */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl p-6 font-semibold ">{pageTitle}</h1>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition">
          <Bell size={20} className="" />
        </button>

        {/* Settings */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition">
          <Settings size={20} className="" />
        </button>

        {/* User avatar */}
        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition">
          <User size={20} className="" />
          <span className=" hidden md:block">Admin</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
