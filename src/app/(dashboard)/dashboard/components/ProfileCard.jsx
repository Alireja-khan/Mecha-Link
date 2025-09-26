"use client";
import React from "react";

export default function MechaLinkProfileDashboard() {
  // User Profile
  const profile = {
    name: "Rahim Khan",
    joined: "March 12, 2020",
    role: "Vehicle Owner",
    location: "Dhaka, Bangladesh",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
    status: "Active",
  };

  // Vehicles Owned
  const vehicles = [
    { name: "Toyota Corolla 2018", plate: "DHA-1234", lastService: "Jul 15, 2025" },
    { name: "Honda Civic 2020", plate: "DHA-5678", lastService: "Sep 10, 2025" },
  ];

  // Mechanics Connected
  const connections = [
    { name: "Arif Hossain", role: "Mechanic", specialty: "Engine Repair" },
    { name: "Sajid Alam", role: "Mechanic", specialty: "Electrical" },
    { name: "Tanvir Rahman", role: "Mechanic", specialty: "Body Work" },
  ];

  // Service Requests
  const serviceRequests = [
    { date: "Aug 8, 2025", vehicle: "Toyota Corolla 2018", mechanic: "Arif Hossain", status: "Completed", cost: 120 },
    { date: "Sep 12, 2025", vehicle: "Honda Civic 2020", mechanic: "Sajid Alam", status: "In Progress", cost: 200 },
    { date: "Oct 5, 2025", vehicle: "Toyota Corolla 2018", mechanic: "Tanvir Rahman", status: "Pending", cost: 150 },
    { date: "Oct 8, 2025", vehicle: "Honda Civic 2020", mechanic: "Arif Hossain", status: "Pending", cost: 100 },
  ];

  // Documents & Receipts
  const documents = [
    { title: "Invoice #1021", date: "2025-07-01", type: "PDF", download: "⬇" },
    { title: "Vehicle Insurance", date: "2025-06-15", type: "PDF", download: "⬇" },
    { title: "Service Report - Corolla", date: "2025-07-20", type: "DOC", download: "⬇" },
    { title: "Warranty Honda Civic", date: "2025-06-10", type: "PDF", download: "⬇" },
  ];

  // Dashboard Stats
  const stats = [
    { label: "Vehicles Owned", value: vehicles.length },
    { label: "Total Service Requests", value: serviceRequests.length },
    { label: "Pending Requests", value: serviceRequests.filter(r => r.status === "Pending").length },
    { label: "Mechanics Connected", value: connections.length },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#302f41] text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Welcome, {profile.name}</h1>
          <p className="text-sm opacity-80 mt-1">
            Track your vehicles, service requests, and connect with trusted mechanics
          </p>
          <button className="mt-4 px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-lg text-sm transition">
            Book a Service
          </button>
        </div>
        <div className="hidden md:block w-32 h-32 bg-white/10 rounded-lg flex items-center justify-center text-3xl">
          🚗
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold ">{stat.value}</p>
            <p className="text-sm ">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Profile & Connections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white shadow-sm rounded-2xl p-5 space-y-4">
          <div className="flex flex-col items-center">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
            <h2 className="font-semibold text-lg">{profile.name}</h2>
            <p className="text-sm ">{profile.role}</p>
            <span className="mt-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              {profile.status}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Joined:</span> {profile.joined}</p>
            <p><span className="font-medium">Location:</span> {profile.location}</p>
          </div>

          <button className="mt-4 w-full border hover:bg-gray-100 py-2 rounded-lg transition">
            Edit Profile
          </button>
        </div>

        {/* Connections */}
        <div className="bg-white shadow-sm rounded-2xl p-5 col-span-2">
          <h2 className="text-lg font-semibold mb-3">Your Mechanics</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {connections.map((c, idx) => (
              <div
                key={idx}
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

      {/* Vehicles & Service Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicles */}
        <div className="bg-white shadow-sm rounded-2xl p-5">
          <h2 className="text-lg font-semibold mb-4">Your Vehicles</h2>
          <ul className="space-y-3">
            {vehicles.map((v, idx) => (
              <li key={idx} className="p-3 border rounded-lg hover:bg-gray-50 transition">
                <p className="font-medium">{v.name}</p>
                <p className="text-sm ">Plate: {v.plate}</p>
                <p className="text-sm ">Last Service: {v.lastService}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Service Requests */}
        <div className="bg-white shadow-sm rounded-2xl p-5">
          <h2 className="text-lg font-semibold mb-4">Service Requests</h2>
          <table className="w-full text-sm text-left">
            <thead className="border-b ">
              <tr>
                <th className="py-2">Date</th>
                <th className="py-2">Vehicle</th>
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
                  <td className="py-2">{req.vehicle}</td>
                  <td className="py-2">{req.mechanic}</td>
                  <td className="py-2">{req.status}</td>
                  <td className="py-2 font-medium">${req.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white shadow-sm rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Documents & Receipts</h2>
          <button className="text-sm text-indigo-600 hover:underline">+ Upload</button>
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
  );
}
