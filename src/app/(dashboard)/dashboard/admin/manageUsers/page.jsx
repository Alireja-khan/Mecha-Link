"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { Check, X, Edit } from "lucide-react";

const ManageUsers = () => {
  const { user: loggedInUser, loading: userLoading } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []); // API returns array
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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

  const handleActivate = async (id) => {
    console.log("Activate user:", id);
    // call API PATCH /api/users/:id to update status
  };

  const handleDeactivate = async (id) => {
    console.log("Deactivate user:", id);
    // call API PATCH /api/users/:id to update status
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case "active":
        return <span className={`${base} bg-green-100 text-green-800`}>Active</span>;
      case "inactive":
        return <span className={`${base} bg-red-100 text-red-800`}>Inactive</span>;
      case "pending":
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-800`}>Active</span>;
    }
  };

  return (
    <div className="p-8 space-y-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>

      {/* Search */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-200 rounded-lg w-64"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
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
                <td colSpan="6" className="text-center py-6">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{user.name || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.role || "Customer"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.status || "active")}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex justify-center gap-2">
                    {user.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleActivate(user._id)}
                          className="p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleDeactivate(user._id)}
                          className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                    <button className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition">
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
