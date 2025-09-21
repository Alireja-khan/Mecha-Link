"use client";
import React from "react";

const DashboardOverview = () => {
  const profile = {
    name: "Abby Cooper",
    joined: "July 25, 2018",
    role: "Vehicle Owner",
    location: "Portland, Illinois, USA",
  };

  const connections = [
    { name: "Arlene Fox", role: "Mechanic", specialty: "Engine Repair" },
    { name: "Natasha Fox", role: "Mechanic", specialty: "Electrical" },
  ];

  const serviceRequests = [
    { date: "Aug 8, 2024", mechanic: "Arlene Fox", status: "Completed", cost: 120 },
    { date: "Sep 12, 2024", mechanic: "Natasha Fox", status: "In Progress", cost: 200 },
    { date: "Jan 4, 2025", mechanic: "Arlene Fox", status: "Pending", cost: 150 },
  ];

  const documents = [
    { title: "Invoice #001", date: "2024-06-01", type: "PDF", download: "⬇" },
    { title: "Service Report", date: "2024-07-15", type: "PDF", download: "⬇" },
    { title: "Warranty", date: "2024-08-10", type: "DOC", download: "⬇" },
  ];

  return (
    <div className="p-6 space-y-8 min-h-screen">
      {/* Welcome Banner */}
      <div className="bg-[#302f41]  rounded-2xl p-6 flex items-center justify-between text-white">
        <div>
          <h1 className="text-xl font-semibold">Welcome to MechaLink</h1>
          <p className="text-sm opacity-80">
            Connect with certified mechanics easily
          </p>
          <button className="mt-4 px-4 py-2 bg-white text-indigo-900 rounded-lg text-sm hover:bg-gray-200 transition">
            Explore Services
          </button>
        </div>
        <div className="hidden sm:block">
          {/* Placeholder Illustration */}
          <div className="w-32 h-32 bg-white/10 rounded-lg flex items-center justify-center">
            🛠️
          </div>
        </div>
      </div>

      {/* Profile & Connections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile */}
        <div className="bg-white shadow-sm rounded-2xl p-5 space-y-2">
          <h2 className="text-lg font-semibold mb-3">Your Profile</h2>
          <p><span className="font-medium">Name:</span> {profile.name}</p>
          <p><span className="font-medium">Joined:</span> {profile.joined}</p>
          <p><span className="font-medium">Role:</span> {profile.role}</p>
          <p><span className="font-medium">Location:</span> {profile.location}</p>
        </div>

        {/* Connections */}
        <div className="bg-white shadow-sm rounded-2xl p-5 col-span-2">
          <h2 className="text-lg font-semibold mb-3">Connections</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {connections.map((c, i) => (
              <div
                key={i}
                className="p-4 border rounded-xl hover:bg-gray-50 transition"
              >
                <p className="font-medium">{c.name}</p>
                <p className="text-sm ">Role: {c.role}</p>
                <p className="text-sm ">Specialty: {c.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Requests & Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service Requests */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-lg font-semibold mb-4">Service Requests</h2>
          <table className="w-full text-sm text-left">
            <thead className="border-b ">
              <tr>
                <th className="py-2">Date</th>
                <th className="py-2">Mechanic</th>
                <th className="py-2">Status</th>
                <th className="py-2">Cost</th>
              </tr>
            </thead>
            <tbody>
              {serviceRequests.map((req, idx) => (
                <tr
                  key={idx}
                  className="border-b last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="py-2">{req.date}</td>
                  <td className="py-2">{req.mechanic}</td>
                  <td className="py-2">{req.status}</td>
                  <td className="py-2 font-medium">${req.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Documents & Receipts</h2>
            <button className="text-sm text-indigo-600 hover:underline">
              + Upload
            </button>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="border-b ">
              <tr>
                <th className="py-2">Title</th>
                <th className="py-2">Date</th>
                <th className="py-2">Type</th>
                <th className="py-2">Download</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, idx) => (
                <tr
                  key={idx}
                  className="border-b last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="py-2">{doc.title}</td>
                  <td className="py-2">{doc.date}</td>
                  <td className="py-2">{doc.type}</td>
                  <td className="py-2 text-indigo-600 cursor-pointer">{doc.download}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
