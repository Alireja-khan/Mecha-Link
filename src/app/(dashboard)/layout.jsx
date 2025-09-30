"use client";

import Sidebar from "./dashboard/components/Sidebar";
import Topbar from "./dashboard/components/Topbar";
import useUser from "@/hooks/useUser";

export default function DashboardLayout({ children }) {
  const { user: loggedInUser, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <span className="loading loading-bars loading-xl text-orange-500"></span>
      </div>
    );
  }

  if (!loggedInUser) {
    // optional redirect logic here
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <span className="loading loading-bars loading-xl text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar className="sticky top-0" />
      <div className="flex-1 flex flex-col">
        <Topbar className="sticky top-0 z-10 shadow-sm" />
        <div className="flex-1 flex flex-col overflow-auto bg-gray-50">
          <main className="flex-1 flex flex-col">{children}</main>
        </div>
      </div>
    </div>
  );
}
