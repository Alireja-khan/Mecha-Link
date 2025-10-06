// DashboardOverview.jsx
"use client";
import React from "react";
import { Wrench, MapPin, Calendar, Users, FileText, Download, Upload } from "lucide-react";
import useUser from "@/hooks/useUser";

const DashboardOverview = () => {
  const { user: loggedInUser } = useUser();

  const profile = {
    name: loggedInUser?.name || "Unknown User",
    joined: loggedInUser?.createdAt ? new Date(loggedInUser.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A",
    role: loggedInUser?.role || "user",
    location: "Portland, Illinois, USA",
  };

  const connections = [
    { id: 1, name: "Arlene Fox", role: "Mechanic", specialty: "Engine Repair" },
    { id: 2, name: "Natasha Fox", role: "Mechanic", specialty: "Electrical Systems" },
    { id: 3, name: "Ben Caroll", role: "Certified Technician", specialty: "Brakes & Suspension" },
  ];

  const serviceRequests = [
    { id: 101, date: "Aug 8, 2024", mechanic: "Arlene Fox", status: "Completed", cost: 120.00 },
    { id: 102, date: "Sep 12, 2024", mechanic: "Natasha Fox", status: "In Progress", cost: 200.00 },
    { id: 103, date: "Jan 4, 2025", mechanic: "Arlene Fox", status: "Pending", cost: 150.00 },
  ];

  const documents = [
    { id: 201, title: "Invoice #001", date: "2024-06-01", type: "PDF", icon: <FileText size={16} />, url: "#" },
    { id: 202, title: "Service Report Q3", date: "2024-07-15", type: "PDF", icon: <FileText size={16} />, url: "#" },
    { id: 203, title: "Vehicle Warranty", date: "2024-08-10", type: "DOC", icon: <FileText size={16} />, url: "#" },
  ];

  // Helper function for status badge styling
  const getStatusBadge = (status) => {
    let baseStyle = "text-xs font-medium px-2.5 py-0.5 rounded-full transition duration-200";
    switch (status) {
      case "Completed":
        // Using DaisyUI success color (green)
        return <span className={`${baseStyle} bg-success/40 text-success`}>{status}</span>;
      case "In Progress":
        // Using DaisyUI warning color (yellow/orange)
        return <span className={`${baseStyle} bg-warning/20 text-warning`}>{status}</span>;
      case "Pending":
        // Using DaisyUI info color (blue, often used for pending actions)
        return <span className={`${baseStyle} bg-info/20 text-info`}>{status}</span>;
      default:
        // Using DaisyUI neutral color
        return <span className={`${baseStyle} bg-neutral/20 text-neutral-content`}>{status}</span>;
    }
  };

  return (
    // Main container uses a slightly darker background (base-200) for contrast against the cards
    <div className="p-8 space-y-8 min-h-screen bg-base-200 text-base-content transition duration-300">

      {/* Welcome Banner: Primary Orange Theme */}
      <div className="bg-primary rounded-2xl p-8 flex items-center justify-between text-primary-content shadow-xl shadow-primary/50 transition duration-300">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {loggedInUser?.name || "Unknown User"}!</h1>
          <p className="text-lg mt-1 opacity-90">
            Your hub to connect with certified mechanics easily.
          </p>
          <button
            // Button uses base-100 background and primary text color
            className="mt-6 px-6 py-2.5 bg-base-100/90 text-primary rounded-xl text-base font-semibold 
                       hover:bg-base-200 transition duration-200 shadow-md"
          >
            Explore Services
          </button>
        </div>
        <div className="hidden sm:block">
          <Wrench size={72} className="text-primary-content opacity-80" />
        </div>
      </div>

      {/* Profile & Connections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* User Profile Card: Base-100 with Accent */}
        <div className="bg-base-100 shadow-lg border border-neutral rounded-2xl p-6 space-y-4 transition duration-300">
          <h2 className="text-xl font-bold text-base-content mb-3 border-b border-primary/20 pb-2">Your Profile</h2>

          <div className="flex items-center gap-3">
            <Users size={20} className="text-primary" />
            <p className="text-base-content"><span className="font-semibold">Role:</span> {profile.role}</p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-primary" />
            <p className="text-base-content"><span className="font-semibold">Joined:</span> {profile.joined}</p>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={20} className="text-primary" />
            <p className="text-base-content"><span className="font-semibold">Location:</span> {profile.location}</p>
          </div>
        </div>

        {/* Connections Card: Base-100 with Primary Hover */}
        <div className="bg-base-100 shadow-lg border border-neutral rounded-2xl p-6 lg:col-span-2 transition duration-300">
          <div className="flex items-center justify-between mb-4 border-b border-primary/20 pb-2">
            <h2 className="text-xl font-bold text-base-content">Your Connections ({connections.length})</h2>
            <button className="text-sm text-primary font-medium hover:text-secondary transition duration-200">
              View All
            </button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {connections.map((c) => (
              <div
                key={c.id}
                // Subtle background (base-200) with primary hover (primary/10)
                className="p-4 border border-neutral rounded-xl bg-base-200 hover:bg-primary/10 transition duration-200"
              >
                <p className="font-bold text-base-content">{c.name}</p>
                <p className="text-xs text-primary font-semibold mt-0.5">{c.role}</p>
                <p className="text-sm text-neutral-content mt-2">Specialty: <span className="font-medium text-base-content">{c.specialty}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Requests & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Service Requests Table */}
        <div className="bg-base-100 rounded-2xl shadow-lg border border-neutral p-6 transition duration-300">
          <h2 className="text-xl font-bold text-base-content mb-4 border-b border-primary/20 pb-2">Recent Service Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                {/* Table Header uses a subtle primary background (primary/10) */}
                <tr className="text-neutral-content uppercase tracking-wider bg-primary/10">
                  <th className="py-3 px-2 font-semibold text-primary">Date</th>
                  <th className="py-3 px-2 font-semibold text-primary">Mechanic</th>
                  <th className="py-3 px-2 font-semibold text-primary">Status</th>
                  <th className="py-3 px-2 text-right font-semibold text-primary">Cost</th>
                </tr>
              </thead>
              <tbody>
                {serviceRequests.map((req) => (
                  <tr
                    key={req.id}
                    // Row separator (neutral) with primary hover (primary/5)
                    className="border-b border-neutral/50 last:border-0 hover:bg-primary/5 transition duration-150"
                  >
                    <td className="py-3 px-2 text-base-content">{req.date}</td>
                    <td className="py-3 px-2 font-medium text-base-content">{req.mechanic}</td>
                    <td className="py-3 px-2">{getStatusBadge(req.status)}</td>
                    <td className="py-3 px-2 text-right font-bold text-base-content">${req.cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-base-100 rounded-2xl shadow-lg border border-neutral p-6 transition duration-300">
          <div className="flex items-center justify-between mb-4 border-b border-primary/20 pb-2">
            <h2 className="text-xl font-bold text-base-content">Documents & Receipts</h2>
            <button className="flex items-center gap-1 text-sm text-primary font-medium hover:text-secondary transition duration-200">
              <Upload size={16} /> Upload New
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                {/* Table Header uses a subtle primary background (primary/10) */}
                <tr className="text-neutral-content uppercase tracking-wider bg-primary/10">
                  <th className="py-3 px-2 font-semibold text-primary">Title</th>
                  <th className="py-3 px-2 font-semibold text-primary">Date</th>
                  <th className="py-3 px-2 font-semibold text-primary">Type</th>
                  <th className="py-3 px-2 font-semibold text-center text-primary">Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    // Row separator (neutral) with primary hover (primary/5)
                    className="border-b border-neutral/50 last:border-0 hover:bg-primary/5 transition duration-150"
                  >
                    <td className="py-3 px-2 flex items-center gap-2">
                      <span className="text-primary">{doc.icon}</span>
                      <span className="font-medium text-base-content">{doc.title}</span>
                    </td>
                    <td className="py-3 px-2 text-base-content">{doc.date}</td>
                    <td className="py-3 px-2"><span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-base-300/30 text-base-content">{doc.type}</span></td>
                    <td className="py-3 px-2 text-center">
                      <a href={doc.url} className="text-primary hover:text-secondary cursor-pointer p-1 rounded-full hover:bg-primary/10 transition duration-150" title="Download Document">
                        <Download size={18} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;