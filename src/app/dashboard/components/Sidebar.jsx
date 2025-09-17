"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  User,
  CreditCard,
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
} from "lucide-react";
import Image from "next/image";

const Sidebar = ({ role = "user" }) => {
  const [collapsed, setCollapsed] = useState(false);

  // Common menu
  const commonMenu = [
    { name: "Overview", icon: <Home size={20} />, href: "/dashboard" },
    { name: "Profile", icon: <User size={20} />, href: "/dashboard/user/profile" },
    { name: "Settings", icon: <Settings size={20} />, href: "/dashboard/user/settings" },
    { name: "Bookings", icon: <Calendar size={20} />, href: "/dashboard/user/bookings" },
    { name: "Reviews", icon: <Star size={20} />, href: "/dashboard/user/reviews" },
    { name: "Messages", icon: <MessageSquare size={20} />, href: "/dashboard/user/messages" },
  ];

  // Role-based
  const roleMenu = {
    admin: [
      { name: "Manage Mechanics", icon: <Wrench size={20} />, href: "/dashboard/admin/mechanics" },
      { name: "Manage Users", icon: <Users size={20} />, href: "/dashboard/admin/users" },
      { name: "Coupons", icon: <Tag size={20} />, href: "/dashboard/admin/coupons" },
      { name: "Announcements", icon: <Megaphone size={20} />, href: "/dashboard/admin/announcements" },
    ],
    mechanic: [
      { name: "Service Listings", icon: <List size={20} />, href: "/dashboard/mechanic/listings" },
      { name: "Requests", icon: <ClipboardList size={20} />, href: "/dashboard/mechanic/requests" },
    ],
    user: [],
  };

  return (
    <aside
      className={`h-screen border-r border-gray-200 flex flex-col shadow-lg transition-all duration-300 
        ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Logo */}
      <div
        className={`p-6 border-b border-gray-200 flex items-center ${
          collapsed ? "justify-center" : "gap-2"
        }`}
      >
        <Link href={"/"}>
          {collapsed ? (
            <span className="text-xl font-bold">ML</span>
          ) : (
            <Image width={120} height={40} alt="MechaLink logo" src={"/logo.png"} />
          )}
        </Link>
        {!collapsed && <span className="text-xl font-bold">MechaLink</span>}
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {[...commonMenu, ...roleMenu[role]].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Collapse button + Logout */}
      <div className="border-t border-gray-200 p-4 flex flex-col gap-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span>Collapse</span>}
        </button>

        <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-red-600 hover:text-white transition">
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
