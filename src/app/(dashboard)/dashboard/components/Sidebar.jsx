"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Settings,
  LogOut,
  Users,
  Wrench,
  Tag,
  Megaphone,
  List,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Star,
  MessageSquare,
  WrenchIcon,
  Store,
  LayoutDashboard,
} from "lucide-react";
import { FaGear } from "react-icons/fa6";
import useUser from "@/hooks/useUser";

const menuItem = (name, icon, href) => ({ name, icon, href });

const Sidebar = () => {
  const { user: loggedInUser, status } = useUser();
  const role = loggedInUser?.role || "user"; // fallback if not loaded yet
  const currentPath = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  if (status === "loading") {
    return (
      <aside className="w-64 border-r border-gray-100 bg-white shadow-xl flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </aside>
    );
  }

  // ✅ Build menus dynamically based on role
  const commonMenu = [
    menuItem("Dashboard", <LayoutDashboard size={20} />, `/dashboard/${role}`),
    menuItem("Profile", <User size={20} />, `/dashboard/${role}/profile`),
    menuItem("Settings", <Settings size={20} />, `/dashboard/${role}/settings`),
    menuItem("Reviews", <Star size={20} />, `/dashboard/${role}/reviews`),
    menuItem("Messages", <MessageSquare size={20} />, `/dashboard/${role}/messages`),
  ];

  const roleMenu = {
    admin: [
      menuItem("Manage Shops", <Wrench size={20} />, "/dashboard/admin/manageShops"),
      menuItem("Manage Users", <Users size={20} />, "/dashboard/admin/manageUsers"),
      menuItem("Service Requests", <Users size={20} />, "/dashboard/admin/serviceReq"),
      menuItem("Coupons", <Tag size={20} />, "/dashboard/admin/coupons"),
      menuItem("Announcements", <Megaphone size={20} />, "/dashboard/admin/announcements"),
    ],
    mechanic: [
      menuItem("Service Listings", <List size={20} />, "/dashboard/mechanic/listings"),
      menuItem("Requests", <ClipboardList size={20} />, "/dashboard/mechanic/requests"),
    ],
    user: [
      menuItem("Service Request", <WrenchIcon size={20} />, "/dashboard/user/addServiceRequest"),
      menuItem("Mechanic Shops", <Store size={20} />, "/dashboard/user/MechanicShop"),
    ],
  };

  const fullMenu = [...commonMenu, ...(roleMenu[role] || [])];

  return (
    <aside
      className={`flex flex-col border-r border-gray-100 bg-white shadow-xl transition-all duration-500 ease-in-out z-30
        ${isExpanded ? "w-64" : "w-[5.5rem]"}`}
    >
      {/* Logo */}
      <div
        className={`flex items-center p-5 border-b border-gray-100 transition-all duration-300 ${
          isExpanded ? "justify-start gap-3" : "justify-center"
        }`}
      >
        <Link href="/" className="flex items-center gap-2" title="MechaLink Home">
          <FaGear className="h-9 w-9 text-orange-600 spin-slow" />
          <h1
            className={`text-2xl font-extrabold whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden
            ${isExpanded ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
          >
            Mecha<span className="text-orange-500">Link</span>
          </h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {fullMenu.map((item) => {
          const isActive = currentPath === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center transition-all duration-200 p-3 rounded-xl relative overflow-hidden 
                ${isExpanded ? "justify-start gap-4" : "justify-center"} 
                ${
                  isActive
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-300/50 font-semibold"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium"
                }
              `}
              title={item.name}
            >
              <span className={`${isActive ? "text-white" : "text-current"}`}>
                {item.icon}
              </span>
              <span
                className={`whitespace-nowrap transition-all duration-300 delay-100 ease-in-out 
                ${isExpanded ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer buttons */}
      <div className="border-t border-gray-100 p-4 flex flex-col gap-2">
        {/* Collapse/Expand */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center transition-all duration-200 p-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-orange-600 font-medium relative overflow-hidden
            ${isExpanded ? "justify-start gap-4" : "justify-center"}`}
          title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          <span
            className={`whitespace-nowrap transition-all duration-300 delay-100 ease-in-out 
            ${isExpanded ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
          >
            Collapse
          </span>
        </button>

        {/* Logout */}
        <button
          className={`flex items-center transition-all duration-200 p-3 rounded-xl text-red-500 hover:bg-red-50 hover:shadow-sm font-medium relative overflow-hidden
            ${isExpanded ? "justify-start gap-4" : "justify-center"}`}
          title="Logout"
        >
          <LogOut size={20} />
          <span
            className={`whitespace-nowrap transition-all duration-300 delay-100 ease-in-out 
            ${isExpanded ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
