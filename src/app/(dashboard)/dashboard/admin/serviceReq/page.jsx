"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { Check, X, Edit } from "lucide-react";

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
        setRequests(data.result || []); // assuming API returns { result: [...] }
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

  if (!loggedInUser || loggedInUser.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen w-screen text-gray-600">
        <p>Access denied. Admins only.</p>
      </div>
    );
  }

  const handleUpdateStatus = (id, status) => {
    console.log("Update request:", id, "to", status);
    // implement PATCH API to update request status
  };

  const filteredRequests = requests.filter(
    (r) =>
      r.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.deviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.problemCategory?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case "pending":
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case "in-progress":
        return <span className={`${base} bg-blue-100 text-blue-800`}>In Progress</span>;
      case "completed":
        return <span className={`${base} bg-green-100 text-green-800`}>Completed</span>;
      case "cancelled":
        return <span className={`${base} bg-red-100 text-red-800`}>Cancelled</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-800`}>Unknown</span>;
    }
  };

  return (
    <div className="p-8 space-y-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">Manage Service Requests</h1>

      {/* Search */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search by user, device, or problem..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-200 rounded-lg w-80"
        />
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Device Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Problem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shop
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requested Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  Loading service requests...
                </td>
              </tr>
            ) : filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <tr key={req._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{req.userEmail || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{req.deviceType || "Other"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{req.problemCategory || "Other"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{req.shopName || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(req.requestedDate || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(req.status || "pending")}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex justify-center gap-2">
                    {req.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(req._id, "in-progress")}
                          className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req._id, "cancelled")}
                          className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                    {req.status === "in-progress" && (
                      <button
                        onClick={() => handleUpdateStatus(req._id, "completed")}
                        className="p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button className="p-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No service requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageServiceRequests;
