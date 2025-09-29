"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { Check, X, Edit, Search, Filter, Download, Wrench, Clock, User, Mail, Calendar, AlertCircle } from "lucide-react";

const ManageServiceRequests = () => {
  const { user: loggedInUser, loading: userLoading } = useUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/service-request");
        const data = await res.json();
        setRequests(data.result || []);
      } catch (err) {
        console.error("Failed to fetch service requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <span className="loading loading-bars loading-xl text-orange-500"></span>
      </div>
    );
  }

  if (!loggedInUser) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <span className="loading loading-bars loading-xl text-orange-500"></span>
      </div>
    );
  }

  const handleUpdateStatus = (id, status) => {
    console.log("Update request:", id, "to", status);
  };

  const filteredRequests = requests.filter(
    (r) =>
      r.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.deviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.problemCategory?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 text-xs font-semibold rounded-full border";
    switch (status) {
      case "pending":
        return <span className={`${base} bg-yellow-100 text-yellow-700 border-yellow-200`}>Pending</span>;
      case "in-progress":
        return <span className={`${base} bg-blue-100 text-blue-700 border-blue-200`}>In Progress</span>;
      case "completed":
        return <span className={`${base} bg-green-100 text-green-700 border-green-200`}>Completed</span>;
      case "cancelled":
        return <span className={`${base} bg-red-100 text-red-700 border-red-200`}>Cancelled</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-700 border-gray-200`}>Unknown</span>;
    }
  };

  // Stats for the header
  const stats = {
    total: requests.length,
    pending: requests.filter(req => req.status === "pending").length,
    inProgress: requests.filter(req => req.status === "in-progress").length,
    completed: requests.filter(req => req.status === "completed").length,
  };

  const StatCard = ({ icon: Icon, value, label, color = "orange" }) => (
    <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}-500/10 group-hover:bg-${color}-500/20 transition-colors duration-300`}>
          <Icon className={`text-${color}-600`} size={24} />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-gray-600 text-sm font-medium">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen p-6 mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Service Request Management</h1>
        <p className="text-gray-600 text-lg">Manage and track all service requests</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Wrench} value={stats.total} label="Total Requests" color="orange" />
        <StatCard icon={Clock} value={stats.pending} label="Pending" color="yellow" />
        <StatCard icon={AlertCircle} value={stats.inProgress} label="In Progress" color="blue" />
        <StatCard icon={Check} value={stats.completed} label="Completed" color="green" />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-xl">
        {/* Header with Search and Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All Service Requests</h2>
            <p className="text-gray-600">Manage request status and assignments</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by user, device, or problem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300 w-full lg:w-80"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-3 bg-orange-50 text-orange-700 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200">
                <Filter size={16} />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-orange-50 text-orange-700 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="rounded-2xl border border-orange-100 overflow-hidden">
          <table className="min-w-full divide-y divide-orange-100">
            <thead className="bg-orange-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                  Request Details
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                  User Info
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                  Problem
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                  Shop
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                  Requested
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-orange-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-orange-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="flex justify-center">
                      <span className="loading loading-bars loading-lg text-orange-500"></span>
                    </div>
                    <p className="text-gray-500 mt-2">Loading service requests...</p>
                  </td>
                </tr>
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-orange-50/30 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                          <Wrench size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{req.deviceType || "Other"}</p>
                          <p className="text-sm text-gray-500">Service Request</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-orange-500" />
                          <span className="text-sm text-gray-700">{req.userEmail || "N/A"}</span>
                        </div>
                        {req.userPhone && (
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-orange-500" />
                            <span className="text-sm text-gray-500">{req.userPhone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-lg border border-orange-200">
                        {req.problemCategory || "Other"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{req.shopName || "Not assigned"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-orange-500" />
                        <span className="text-sm text-gray-700">
                          {new Date(req.requestedDate || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(req.status || "pending")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {req.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(req._id, "in-progress")}
                              className="p-2 bg-blue-500/10 text-blue-600 rounded-xl border border-blue-200 hover:bg-blue-500/20 hover:scale-105 transition-all duration-200"
                              title="Start Progress"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req._id, "cancelled")}
                              className="p-2 bg-red-500/10 text-red-600 rounded-xl border border-red-200 hover:bg-red-500/20 hover:scale-105 transition-all duration-200"
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        {req.status === "in-progress" && (
                          <button
                            onClick={() => handleUpdateStatus(req._id, "completed")}
                            className="p-2 bg-green-500/10 text-green-600 rounded-xl border border-green-200 hover:bg-green-500/20 hover:scale-105 transition-all duration-200"
                            title="Mark Complete"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button 
                          className="p-2 bg-orange-500/10 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-500/20 hover:scale-105 transition-all duration-200"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <Wrench className="text-gray-300" size={48} />
                      <p className="text-gray-500 text-lg">No service requests found</p>
                      <p className="text-gray-400 text-sm">
                        {searchTerm ? "Try adjusting your search terms" : "No service requests yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageServiceRequests;