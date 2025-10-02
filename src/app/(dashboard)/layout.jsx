"use client";
import { useState } from "react";
import Sidebar from "./dashboard/components/Sidebar";
import Topbar from "./dashboard/components/Topbar";
import useUser from "@/hooks/useUser";

export default function DashboardLayout({ children }) {
  const { user: loggedInUser, loading } = useUser();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (loading || !loggedInUser) {
    return <div className="flex items-center justify-center h-screen w-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar setIsMobileOpen={setIsMobileOpen} />
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
