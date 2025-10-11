// Sidebar.jsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User, Settings, LogOut, Users, Wrench, Tag, Megaphone,
  List, ClipboardList, Star, MessageSquare, WrenchIcon,
  Store, LayoutDashboard, X, PanelLeft, PanelRight,
  LucideBrainCircuit
} from "lucide-react";
import { FaGear } from "react-icons/fa6";
import useUser from "@/hooks/useUser";

const menuItem = (name, icon, href) => ({ name, icon, href });

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user: loggedInUser, status } = useUser();
  const role = loggedInUser?.role || "user";
  const currentPath = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Detect screen size (2xl breakpoint) → control collapse behavior
  useEffect(() => {
    const handleResize = () => {
      const large = window.matchMedia("(min-width: 1536px)").matches;
      setIsLargeScreen(large);
      if (!large) {
        setIsExpanded(true); // always expanded on smaller screens
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (status === "loading") {
    return (
      <aside className="w-64 border-r border-neutral bg-base-100 flex items-center justify-center">
        <p className="text-neutral-content">Loading...</p>
      </aside>
    );
  }

  const commonMenu = [
    menuItem("Dashboard", <LayoutDashboard size={20} />, `/dashboard/${role}`),
    menuItem("Profile", <User size={20} />, `/dashboard/${role}/profile`),
    menuItem("Settings", <Settings size={20} />, `/dashboard/${role}/settings`),
    menuItem("Reviews", <Star size={20} />, `/dashboard/${role}/reviews`),
    menuItem("Messages", <MessageSquare size={20} />, `/dashboard/${role}/messages`),
    menuItem("Ask AI", <LucideBrainCircuit size={20} />, "/dashboard/user/AskAI"),
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
      menuItem("Add Shop", <Store size={20} />, "/dashboard/mechanic/AddMechanicShop"),
    ],
    user: [
      menuItem("Service Request", <WrenchIcon size={20} />, "/dashboard/user/addServiceRequest"),
    ],
  };

  const fullMenu = [...commonMenu, ...(roleMenu[role] || [])];

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed top-0 inset-0 bg-black/40 backdrop-blur-sm z-40 2xl:hidden transition-opacity duration-300 ease-in-out 
          ${isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`flex flex-col border-r border-neutral bg-base-100 shadow-xl transition-all duration-300 ease-in-out z-50
          ${isExpanded ? "w-64" : "w-[5.5rem]"}
          ${isMobileOpen
            ? "fixed left-0 top-0 h-full"
            : "fixed -left-64 top-0 h-full"
          }
          2xl:flex 2xl:relative 2xl:h-auto 2xl:!left-auto`}
      >
        {/* Header */}
        <div
          className={`flex items-center p-5 border-b border-neutral transition-all duration-300 
            ${isExpanded ? "justify-start gap-3" : "justify-center"}`}
        >
          <Link href="/" className="flex items-center gap-2" title="MechaLink Home">
            {/* Logo Icon */}
            <FaGear className="h-9 w-9 text-primary" />
            <h1
              className={`text-2xl font-extrabold whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden
              text-base-content
              ${isExpanded ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}`}
            >
              Mecha<span className="text-primary">Link</span>
            </h1>
          </Link>

          {/* Collapse button only visible on 2xl+ */}
          {isLargeScreen && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`hidden 2xl:flex ml-3 items-center transition-all duration-300 p-1.5 rounded-full text-neutral-content bg-base-200 hover:bg-base-300 font-medium absolute ${isExpanded ? "left-[14.2rem]" : "left-[3.7rem]"}`}
              title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {isExpanded ? <PanelLeft size={20} /> : <PanelRight size={20} />}
            </button>
          )}

          {/* Mobile close button */}
          <button
            className="ml-auto 2xl:hidden text-base-content hover:text-primary"
            onClick={() => setIsMobileOpen(false)}
            title="Close Sidebar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {fullMenu.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center transition-all duration-200 p-3 rounded-xl relative overflow-hidden 
                  ${isExpanded ? "justify-start gap-4" : "justify-center"} 
                  ${isActive
                    ? "bg-primary text-primary-content shadow-lg shadow-primary/50 font-semibold"
                    : "text-base-content hover:bg-primary/10 hover:text-primary font-medium"
                  }
                `}
                title={item.name}
              >
                <span>{item.icon}</span>
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

        {/* Footer */}
        <div className="border-t border-neutral p-4 flex flex-col gap-2">
          <button
            className={`flex items-center transition-all duration-200 p-3 rounded-xl text-error hover:bg-error/10 hover:shadow-sm font-medium
              ${isExpanded ? "justify-start gap-4" : "justify-center"}`}
            title="Logout"
          >
            <LogOut size={20} />
            <span className={`${isExpanded ? "opacity-100" : "opacity-0 max-w-0"}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;