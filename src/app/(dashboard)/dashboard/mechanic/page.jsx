"use client";
import React from "react";
import { Wrench, MapPin, Calendar, Users, FileText, Download, Upload } from "lucide-react";

const DashboardOverview = () => {
  const profile = {
    name: "Abby Cooper",
    joined: "July 25, 2018",
    role: "Vehicle Owner",
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
    let baseStyle = "text-xs font-medium px-2.5 py-0.5 rounded-full";
    switch (status) {
      case "Completed":
        // Using green for success status
        return <span className={`${baseStyle} bg-green-100 text-green-800`}>{status}</span>;
      case "In Progress":
        // Using orange-700/yellow-700 for in-progress status
        return <span className={`${baseStyle} bg-orange-100 text-orange-800`}>{status}</span>;
      case "Pending":
        // Using yellow for warning status
        return <span className={`${baseStyle} bg-yellow-100 text-yellow-800`}>{status}</span>;
      default:
        return <span className={`${baseStyle} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  return (
    <div className="p-8 space-y-8 min-h-screen bg-gray-50">

      {/* Welcome Banner: Primary Orange Theme */}
      <div className="bg-orange-600/90 rounded-2xl p-8 flex items-center justify-between text-white shadow-xl shadow-orange-300/50">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Abby Cooper!</h1>
          <p className="text-lg mt-1 opacity-90">
            Your hub to connect with certified mechanics easily.
          </p>
          <button
            className="mt-6 px-6 py-2.5 bg-white text-orange-700 rounded-xl text-base font-semibold 
                       hover:bg-gray-100 transition shadow-md"
          >
            Explore Services
          </button>
        </div>
        <div className="hidden sm:block">
          <Wrench size={72} className="text-white opacity-80" />
        </div>
      </div>

      {/* Profile & Connections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* User Profile Card: Orange Accent */}
        <div className="bg-white shadow-lg border border-gray-100 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-orange-100 pb-2">Your Profile</h2>

          <div className="flex items-center gap-3">
            <Users size={20} className="text-orange-500" />
            <p className="text-gray-700"><span className="font-semibold">Role:</span> {profile.role}</p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-orange-500" />
            <p className="text-gray-700"><span className="font-semibold">Joined:</span> {profile.joined}</p>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={20} className="text-orange-500" />
            <p className="text-gray-700"><span className="font-semibold">Location:</span> {profile.location}</p>
          </div>
        </div>

        {/* Connections Card: Orange Hover */}
        <div className="bg-white shadow-lg border border-gray-100 rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4 border-b border-orange-100 pb-2">
            <h2 className="text-xl font-bold text-gray-800">Your Connections ({connections.length})</h2>
            <button className="text-sm text-orange-600 font-medium hover:text-orange-800 transition">
              View All
            </button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {connections.map((c) => (
              <div
                key={c.id}
                className="p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-orange-50 transition duration-200"
              >
                <p className="font-bold text-gray-800">{c.name}</p>
                <p className="text-xs text-orange-600 font-semibold mt-0.5">{c.role}</p>
                <p className="text-sm text-gray-500 mt-2">Specialty: <span className="font-medium text-gray-600">{c.specialty}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Requests & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Service Requests Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-orange-100 pb-2">Recent Service Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 uppercase tracking-wider bg-orange-50/50">
                  <th className="py-3 px-2 font-semibold text-orange-800">Date</th>
                  <th className="py-3 px-2 font-semibold text-orange-800">Mechanic</th>
                  <th className="py-3 px-2 font-semibold text-orange-800">Status</th>
                  <th className="py-3 px-2 text-right font-semibold text-orange-800">Cost</th>
                </tr>
              </thead>
              <tbody>
                {serviceRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-orange-50 transition"
                  >
                    <td className="py-3 px-2">{req.date}</td>
                    <td className="py-3 px-2 font-medium text-gray-700">{req.mechanic}</td>
                    <td className="py-3 px-2">{getStatusBadge(req.status)}</td>
                    <td className="py-3 px-2 text-right font-bold text-gray-800">${req.cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4 border-b border-orange-100 pb-2">
            <h2 className="text-xl font-bold text-gray-800">Documents & Receipts</h2>
            <button className="flex items-center gap-1 text-sm text-orange-600 font-medium hover:text-orange-800 transition">
              <Upload size={16} /> Upload New
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 uppercase tracking-wider bg-orange-50/50">
                  <th className="py-3 px-2 font-semibold text-orange-800">Title</th>
                  <th className="py-3 px-2 font-semibold text-orange-800">Date</th>
                  <th className="py-3 px-2 font-semibold text-orange-800">Type</th>
                  <th className="py-3 px-2 font-semibold text-center text-orange-800">Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-orange-50 transition"
                  >
                    <td className="py-3 px-2 flex items-center gap-2">
                      {doc.icon}
                      <span className="font-medium text-gray-700">{doc.title}</span>
                    </td>
                    <td className="py-3 px-2">{doc.date}</td>
                    <td className="py-3 px-2"><span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-200 text-gray-700">{doc.type}</span></td>
                    <td className="py-3 px-2 text-center">
                      <a href={doc.url} className="text-orange-600 hover:text-orange-800 cursor-pointer p-1 rounded-full hover:bg-orange-100 transition" title="Download Document">
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
