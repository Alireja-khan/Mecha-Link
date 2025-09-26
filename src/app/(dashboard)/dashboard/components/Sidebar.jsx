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

const menuItem = (name, icon, href) => ({ name, icon, href });

const commonMenu = [
  menuItem("Dashboard", <LayoutDashboard size={20} />, "/dashboard"),
  menuItem("Profile", <User size={20} />, "/dashboard/user/profile"),
  menuItem("Settings", <Settings size={20} />, "/dashboard/user/settings"),
  menuItem("Bookings", <Calendar size={20} />, "/dashboard/user/bookings"),
  menuItem("Reviews", <Star size={20} />, "/dashboard/user/reviews"),
  menuItem("Messages", <MessageSquare size={20} />, "/dashboard/user/messages"),
];

const roleMenu = {
  admin: [
    menuItem("Manage Mechanics", <Wrench size={20} />, "/dashboard/admin/mechanics"),
    menuItem("Manage Users", <Users size={20} />, "/dashboard/admin/users"),
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

const Sidebar = ({ role = "user" }) => {
  const currentPath = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  const fullMenu = [...commonMenu, ...(roleMenu[role] || [])];

  return (
    <aside
      className={`flex flex-col border-r border-gray-100 bg-white shadow-xl transition-all duration-500 ease-in-out z-30
        ${isExpanded ? "w-64" : "w-[5.5rem]"}`}
    >
      <div
        className={`flex items-center p-5 border-b border-gray-100 transition-all duration-300 ${isExpanded ? "justify-start gap-3" : "justify-center"
          }`}
      >
<<<<<<< HEAD
        {collapsed ? (
          <Link href={"/"}>ML</Link>
        ) : (
          <>
            <Link href={"/"}>
              <Image
                width={95}
                height={95}
                alt="MechaLink logo"
                src={"/logo.png"}
              />
            </Link>
          </>
        )}
        
      </div>
      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {[...commonMenu, ...roleMenu[role]].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition"
=======
        <Link href="/" className="flex items-center gap-2" title="MechaLink Home">
          <FaGear className="h-9 w-9 text-orange-600 spin-slow" />
          <h1
            className={`text-2xl font-extrabold whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden
            ${isExpanded ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
>>>>>>> dc3f7be04d656e203df6022e45bdb81491e3f524
          >
            Mecha<span className="text-orange-500">Link</span>
          </h1>
        </Link>
      </div>

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
                ${isActive
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

      <div className="border-t border-gray-100 p-4 flex flex-col gap-2">
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