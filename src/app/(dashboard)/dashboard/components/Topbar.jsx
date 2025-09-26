import React from "react";
import { Bell, Plus, Search } from "lucide-react";

const Topbar = ({ pageTitle = "Dashboard" }) => {
  return (
    <header className="w-full sticky top-0 z-20 flex items-center justify-between px-8 py-3.5 border-b border-gray-100 bg-white">

      <h1 className="text-2xl font-extrabold text-gray-800">
        {pageTitle}
      </h1>

      <div className="flex items-center gap-5">

        <div className="relative hidden lg:block">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions, users, etc."
            className="w-80 px-4 py-2 pl-10 text-sm border border-gray-200 rounded-xl bg-gray-50 
                       focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
          />
        </div>

        <div className="flex items-center gap-3">

          <button
            title="Notifications"
            className="p-3 rounded-full text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition duration-150"
          >
            <Bell size={20} />
          </button>

          <button
            className="px-4 py-2 rounded-xl bg-orange-600 text-white text-sm font-semibold 
                       hover:bg-orange-700 transition duration-150 shadow-md shadow-orange-300/50
                       flex items-center gap-1.5"
            title="Create New Booking"
          >
            <Plus size={16} /> <span className="hidden sm:block">New Booking</span>
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200 hidden sm:block" />

        <div className="flex items-center gap-2 cursor-pointer py-1 pl-1 pr-6 rounded-full hover:bg-gray-100 transition">
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=f97316&color=fff&bold=true"
            alt="User Avatar"
            className="w-10 h-10 rounded-full border-2 border-orange-500"
          />
          <div className="hidden md:flex flex-col text-left">
            <span className="text-sm font-semibold text-gray-900">Admin User</span>
            <span className="text-xs text-gray-500">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;