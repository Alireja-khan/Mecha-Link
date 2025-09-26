"use client";
import React from "react";
import { Wrench, MapPin, Calendar, Users, FileText, Download, Upload, Car, Bell } from "lucide-react";

export default function MechaLinkProfileDashboard() {
  // --- Data ---
  const profile = {
    name: "Rahim Khan",
    joined: "March 12, 2020",
    role: "Vehicle Owner",
    location: "Dhaka, Bangladesh",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
    status: "Active",
  };

  const vehicles = [
    { name: "Toyota Corolla 2018", plate: "DHA-1234", lastService: "Jul 15, 2025" },
    { name: "Honda Civic 2020", plate: "DHA-5678", lastService: "Sep 10, 2025" },
  ];

  const connections = [
    { name: "Arif Hossain", role: "Mechanic", specialty: "Engine Repair" },
    { name: "Sajid Alam", role: "Mechanic", specialty: "Electrical" },
    { name: "Tanvir Rahman", role: "Mechanic", specialty: "Body Work" },
  ];

  const serviceRequests = [
    { date: "Aug 8, 2025", vehicle: "Toyota Corolla 2018", mechanic: "Arif Hossain", status: "Completed", cost: 120.00 },
    { date: "Sep 12, 2025", vehicle: "Honda Civic 2020", mechanic: "Sajid Alam", status: "In Progress", cost: 200.00 },
    { date: "Oct 5, 2025", vehicle: "Toyota Corolla 2018", mechanic: "Tanvir Rahman", status: "Pending", cost: 150.00 },
    { date: "Oct 8, 2025", vehicle: "Honda Civic 2020", mechanic: "Arif Hossain", status: "Pending", cost: 100.00 },
  ];

  const documents = [
    { title: "Invoice #1021", date: "2025-07-01", type: "PDF", icon: <FileText size={16} />, url: "#" }, // Increased icon size
    { title: "Vehicle Insurance", date: "2025-06-15", type: "PDF", icon: <FileText size={16} />, url: "#" },
    { title: "Service Report - Corolla", date: "2025-07-20", type: "DOC", icon: <FileText size={16} />, url: "#" },
    { title: "Warranty Honda Civic", date: "2025-06-10", type: "PDF", icon: <FileText size={16} />, url: "#" },
  ];

  const stats = [
    { label: "Vehicles Owned", value: vehicles.length, icon: <Car size={24} /> }, // Increased icon size
    { label: "Total Service Requests", value: serviceRequests.length, icon: <Wrench size={24} /> },
    { label: "Pending Requests", value: serviceRequests.filter(r => r.status === "Pending").length, icon: <Bell size={24} /> },
    { label: "Mechanics Connected", value: connections.length, icon: <Users size={24} /> },
  ];

  // --- Helper Function ---
  const getStatusBadge = (status) => {
    // Increased padding and kept text readable
    let baseStyle = "text-sm font-medium px-3 py-1 rounded-full";
    switch (status) {
      case "Completed":
        return <span className={`${baseStyle} bg-green-100 text-green-800`}>{status}</span>;
      case "In Progress":
        return <span className={`${baseStyle} bg-orange-100 text-orange-800`}>{status}</span>;
      case "Pending":
        return <span className={`${baseStyle} bg-yellow-100 text-yellow-800`}>{status}</span>;
      default:
        return <span className={`${baseStyle} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  // --- Render ---
  return (
    // Slightly increased overall padding and gap
    <div className="min-h-screen p-8 bg-gray-50 space-y-8">

      {/* Welcome Banner: Comfortable Size */}
      <div className="bg-orange-600/90 text-white rounded-xl p-8 flex flex-col md:flex-row items-center justify-between shadow-xl shadow-orange-300/50">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {profile.name}!</h1> {/* Increased font size */}
          <p className="text-base opacity-90 mt-1">
            Track your vehicles, service requests, and connect with trusted mechanics
          </p>
          <button
            className="mt-4 px-5 py-2.5 bg-white text-orange-700 font-semibold hover:bg-gray-100 rounded-lg text-base transition shadow-md" // Increased padding and font size
          >
            Book a Service
          </button>
        </div>
        <div className="hidden md:block">
          {/* Increased icon size */}
          <Wrench size={64} className="text-white opacity-80" />
        </div>
      </div>

      {/* Stats: Readable Font Sizes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6"> {/* Increased gap */}
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-5 text-center border-b-2 border-orange-500"> {/* Increased padding */}
            <div className="flex items-center justify-center gap-2 mb-1 text-orange-600">
              {stat.icon}
              <p className="text-3xl font-bold">{stat.value}</p> {/* Increased font size */}
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p> {/* Increased font size */}
          </div>
        ))}
      </div>

      {/* Profile & Connections: Increased Gap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profile Card: Readable Sizes */}
        <div className="bg-white shadow-lg border border-gray-100 rounded-xl p-6 space-y-4"> {/* Increased padding and spacing */}
          <div className="flex flex-col items-center">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-orange-500" // Increased avatar size
            />
            <h2 className="font-semibold text-lg">{profile.name}</h2> {/* Increased font size */}
            <p className="text-sm text-gray-500">{profile.role}</p>
            <span className="mt-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"> {/* Increased font/padding */}
              {profile.status}
            </span>
          </div>

          <div className="space-y-2 text-base border-t border-orange-100 pt-4"> {/* Increased font size and spacing */}
            <p className="flex items-center gap-2"><Calendar size={16} className="text-orange-500" /> <span className="font-medium">Joined:</span> {profile.joined}</p>
            <p className="flex items-center gap-2"><MapPin size={16} className="text-orange-500" /> <span className="font-medium">Location:</span> {profile.location}</p>
          </div>

          <button className="mt-4 w-full border border-orange-500 text-orange-600 hover:bg-orange-50 py-2 rounded-lg text-base transition"> {/* Increased padding and font size */}
            Edit Profile
          </button>
        </div>

        {/* Connections: Readable Sizes */}
        <div className="bg-white shadow-lg border border-gray-100 rounded-xl p-6 lg:col-span-2"> {/* Increased padding */}
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-orange-100 pb-2">Your Mechanics</h2> {/* Increased font size and spacing */}
          <div className="grid sm:grid-cols-3 gap-4"> {/* Increased gap */}
            {connections.map((c, idx) => (
              <div
                key={idx}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-orange-50 transition"
              > {/* Increased padding */}
                <p className="font-semibold text-base">{c.name}</p> {/* Increased font size */}
                <p className="text-sm text-orange-600 font-medium mt-0.5">{c.role}</p>
                <p className="text-sm text-gray-500 mt-1">Specialty: <span className="font-medium text-gray-600">{c.specialty}</span></p> {/* Increased font size */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vehicles & Service Requests: Increased Gap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicles: Readable Sizes */}
        <div className="bg-white shadow-lg border border-gray-100 rounded-xl p-6"> {/* Increased padding */}
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-orange-100 pb-2">Your Vehicles</h2> {/* Increased font size and spacing */}
          <ul className="space-y-3">
            {vehicles.map((v, idx) => (
              <li key={idx} className="p-3 border border-gray-200 rounded-lg hover:bg-orange-50 transition">
                <div className="flex items-center gap-2 text-orange-600">
                  <Car size={18} /> {/* Increased icon size */}
                  <p className="font-semibold text-base text-gray-800">{v.name}</p> {/* Increased font size */}
                </div>
                <p className="text-sm ml-6 text-gray-500">Plate: <span className="font-medium">{v.plate}</span></p> {/* Increased font size */}
                <p className="text-sm ml-6 text-gray-500">Last Service: <span className="font-medium">{v.lastService}</span></p> {/* Increased font size */}
              </li>
            ))}
          </ul>
        </div>

        {/* Service Requests: Readable Sizes */}
        <div className="bg-white shadow-lg border border-gray-100 rounded-xl p-6"> {/* Increased padding */}
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-orange-100 pb-2">Service Requests</h2> {/* Increased font size and spacing */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left"> {/* Increased base font size */}
              <thead>
                <tr className="text-gray-500 uppercase tracking-wider bg-orange-50/50">
                  <th className="py-3 px-3 font-semibold text-orange-800">Date</th>
                  <th className="py-3 px-3 font-semibold text-orange-800">Vehicle</th>
                  <th className="py-3 px-3 font-semibold text-orange-800">Status</th>
                  <th className="py-3 px-3 text-right font-semibold text-orange-800">Cost</th>
                </tr>
              </thead>
              <tbody>
                {serviceRequests.map((req, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 last:border-0 hover:bg-orange-50 transition"
                  >
                    <td className="py-2.5 px-3">{req.date}</td> {/* Increased padding */}
                    <td className="py-2.5 px-3 text-gray-700">{req.vehicle}</td>
                    <td className="py-2.5 px-3">{getStatusBadge(req.status)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-gray-800">${req.cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Documents: Readable Sizes */}
      <div className="bg-white shadow-lg border border-gray-100 rounded-xl p-6"> {/* Increased padding */}
        <div className="flex items-center justify-between mb-4 border-b border-orange-100 pb-2"> {/* Increased spacing */}
          <h2 className="text-xl font-bold text-gray-800">Documents & Receipts</h2> {/* Increased font size */}
          <button className="flex items-center gap-1 text-sm text-orange-600 font-medium hover:text-orange-800 transition"> {/* Increased font size */}
            <Upload size={16} /> Upload
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left"> {/* Increased base font size */}
            <thead>
              <tr className="text-gray-500 uppercase tracking-wider bg-orange-50/50">
                <th className="py-3 px-3 font-semibold text-orange-800">Title</th>
                <th className="py-3 px-3 font-semibold text-orange-800">Date</th>
                <th className="py-3 px-3 font-semibold text-orange-800">Type</th>
                <th className="py-3 px-3 font-semibold text-center text-orange-800">Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 last:border-0 hover:bg-orange-50 transition"
                >
                  <td className="py-2.5 px-3 flex items-center gap-2"> {/* Increased padding */}
                    {doc.icon}
                    <span className="font-medium text-gray-700">{doc.title}</span>
                  </td>
                  <td className="py-2.5 px-3">{doc.date}</td>
                  <td className="py-2.5 px-3"><span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-200 text-gray-700">{doc.type}</span></td>
                  <td className="py-2.5 px-3 text-center">
                    <a href={doc.url} className="text-orange-600 hover:text-orange-800 cursor-pointer p-1 rounded-full hover:bg-orange-100 transition" title="Download Document">
                      <Download size={18} /> {/* Increased icon size */}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}