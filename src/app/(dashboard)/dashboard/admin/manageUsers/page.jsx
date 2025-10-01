"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { Check, X, Edit, Search, Filter, Download, Users, UserCheck, Mail, Calendar, Shield, Eye, Trash, Plus, Ban, UserCog } from "lucide-react";
import Swal from 'sweetalert2';

const ManageUsers = () => {
  const { user: loggedInUser, loading: userLoading } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "customer",
    status: "active",
    phone: "",
    location: ""
  });

  // SweetAlert2 Functions
  const showSuccessAlert = (title, message) => {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonColor: '#f97316',
      confirmButtonText: 'OK',
      background: '#fff',
      color: '#1f2937',
      iconColor: '#22c55e'
    });
  };

  const showErrorAlert = (title, message) => {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonColor: '#f97316',
      confirmButtonText: 'OK',
      background: '#fff',
      color: '#1f2937',
      iconColor: '#ef4444'
    });
  };

  const showConfirmDialog = (title, text, confirmButtonText = 'Yes, proceed') => {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#6b7280',
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancel',
      background: '#fff',
      color: '#1f2937',
      iconColor: '#eab308',
      reverseButtons: true
    });
  };

  const showLoadingAlert = (title, text) => {
    Swal.fire({
      title: title,
      text: text,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#fff',
      color: '#1f2937'
    });
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/dashboardUser");
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      showErrorAlert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleActivate = async (id) => {
    const result = await showConfirmDialog(
      'Activate User',
      'Are you sure you want to activate this user?',
      'Yes, Activate'
    );

    if (result.isConfirmed) {
      try {
        showLoadingAlert('Activating...', 'Please wait while we activate the user');
        
        const response = await fetch(`/api/users/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "active" }),
        });
        
        if (!response.ok) throw new Error('Failed to activate user');
        
        Swal.close();
        await fetchUsers();
        showSuccessAlert('Activated!', 'The user has been activated successfully');
      } catch (error) {
        console.error('Activation failed:', error);
        Swal.close();
        showErrorAlert('Error', 'Failed to activate user');
      }
    }
  };

  const handleDeactivate = async (id) => {
    const result = await showConfirmDialog(
      'Deactivate User',
      'Are you sure you want to deactivate this user? The user will not be able to access the platform.',
      'Yes, Deactivate'
    );

    if (result.isConfirmed) {
      try {
        showLoadingAlert('Deactivating...', 'Please wait while we deactivate the user');
        
        const response = await fetch(`/api/users/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "inactive" }),
        });
        
        if (!response.ok) throw new Error('Failed to deactivate user');
        
        Swal.close();
        await fetchUsers();
        showSuccessAlert('Deactivated!', 'The user has been deactivated successfully');
      } catch (error) {
        console.error('Deactivation failed:', error);
        Swal.close();
        showErrorAlert('Error', 'Failed to deactivate user');
      }
    }
  };

  const handleDelete = async (id) => {
    const user = users.find(u => u._id === id);
    const result = await showConfirmDialog(
      'Delete User',
      `You are about to delete the user "${user?.name}". This action cannot be undone.`,
      'Yes, delete it!'
    );

    if (result.isConfirmed) {
      try {
        showLoadingAlert('Deleting...', 'Please wait while we delete the user');
        
        const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error('Failed to delete user');
        
        Swal.close();
        await fetchUsers();
        showSuccessAlert('Deleted!', 'The user has been deleted successfully');
      } catch (error) {
        console.error('Deletion failed:', error);
        Swal.close();
        showErrorAlert('Error', 'Failed to delete user');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showErrorAlert('Validation Error', 'Please fill in name and email fields');
      return;
    }

    try {
      showLoadingAlert('Creating...', 'Please wait while we create the user');

      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create user');

      Swal.close();
      setModalOpen(false);
      setFormData({ name: "", email: "", role: "customer", status: "active", phone: "", location: "" });
      await fetchUsers();
      showSuccessAlert('Created!', 'User has been created successfully');
    } catch (error) {
      console.error('Form submission failed:', error);
      Swal.close();
      showErrorAlert('Error', 'Failed to create user');
    }
  };

  const openDetailModal = (user) => {
    setSelectedUser(user);
    setDetailModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "customer",
      status: user.status || "active",
      phone: user.phone || "",
      location: user.location || ""
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setFormData({ name: "", email: "", role: "customer", status: "active", phone: "", location: "" });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 text-xs font-semibold rounded-full border";
    switch (status) {
      case "active":
        return <span className={`${base} bg-green-100 text-green-700 border-green-200`}>Active</span>;
      case "inactive":
        return <span className={`${base} bg-red-100 text-red-700 border-red-200`}>Inactive</span>;
      case "pending":
        return <span className={`${base} bg-yellow-100 text-yellow-700 border-yellow-200`}>Pending</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-700 border-gray-200`}>Active</span>;
    }
  };

  // Stats for the header
  const stats = {
    total: users.length,
    active: users.filter(user => user.status === "active").length,
    pending: users.filter(user => user.status === "pending").length,
    inactive: users.filter(user => user.status === "inactive").length,
  };

  const StatCard = ({ icon: Icon, value, label, color = "orange" }) => {
    const colorClasses = {
      orange: {
        bg: "bg-orange-500/10",
        bgHover: "group-hover:bg-orange-500/20",
        text: "text-orange-600"
      },
      green: {
        bg: "bg-green-500/10", 
        bgHover: "group-hover:bg-green-500/20",
        text: "text-green-600"
      },
      red: {
        bg: "bg-red-500/10",
        bgHover: "group-hover:bg-red-500/20", 
        text: "text-red-600"
      },
      yellow: {
        bg: "bg-yellow-500/10",
        bgHover: "group-hover:bg-yellow-500/20",
        text: "text-yellow-600"
      }
    };

    const classes = colorClasses[color] || colorClasses.orange;

    return (
      <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${classes.bg} ${classes.bgHover} transition-colors duration-300`}>
            <Icon className={classes.text} size={24} />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-gray-600 text-sm font-medium">{label}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600 text-lg">Manage and monitor all platform users</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-3 px-6 py-4 bg-orange-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-orange-600 hover:scale-105 shadow-lg hover:shadow-xl mt-4 lg:mt-0"
        >
          <Plus size={20} />
          <span>Add New User</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Users} value={stats.total} label="Total Users" color="orange" />
        <StatCard icon={UserCheck} value={stats.active} label="Active Users" color="green" />
        <StatCard icon={Shield} value={stats.pending} label="Pending Approval" color="yellow" />
        <StatCard icon={Ban} value={stats.inactive} label="Inactive Users" color="red" />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-xl">
        {/* Header with Search and Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All Users</h2>
            <p className="text-gray-600">Manage user accounts and permissions</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300 w-full lg:w-64"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={() => showSuccessAlert('Coming Soon!', 'Filter functionality will be implemented soon.')}
                className="flex items-center gap-2 px-4 py-3 bg-orange-50 text-orange-700 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
              >
                <Filter size={16} />
                Filter
              </button>
              <button 
                onClick={() => showSuccessAlert('Coming Soon!', 'Export functionality will be implemented soon.')}
                className="flex items-center gap-2 px-4 py-3 bg-orange-50 text-orange-700 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl border border-orange-100 overflow-hidden">
          <table className="min-w-full divide-y divide-orange-100">
            <thead className="bg-orange-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                  Joined
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
                  <td colSpan="6" className="text-center py-12">
                    <div className="flex justify-center">
                      <span className="loading loading-bars loading-lg text-orange-500"></span>
                    </div>
                    <p className="text-gray-500 mt-2">Loading users...</p>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-orange-50/30 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                          {user.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.name || "N/A"}</p>
                          <button
                            onClick={() => openDetailModal(user)}
                            className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1 transition-colors duration-200 mt-1"
                          >
                            <Eye size={14} />
                            View details
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-orange-500" />
                          <span className="text-sm text-gray-700">{user.email || "N/A"}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-sm text-gray-500">{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-sm rounded-lg border capitalize ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700 border-purple-200' 
                          : user.role === 'mechanic'
                          ? 'bg-blue-100 text-blue-700 border-blue-200'
                          : 'bg-orange-100 text-orange-700 border-orange-200'
                      }`}>
                        {user.role || "customer"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-orange-500" />
                        <span className="text-sm text-gray-700">
                          {formatDate(user.createdAt || Date.now())}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status || "active")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {(user.status === "pending" || user.status === "inactive") && (
                          <button
                            onClick={() => handleActivate(user._id)}
                            className="p-2 bg-green-500/10 text-green-600 rounded-xl border border-green-200 hover:bg-green-500/20 hover:scale-105 transition-all duration-200"
                            title="Activate"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        {(user.status === "pending" || user.status === "active") && (
                          <button
                            onClick={() => handleDeactivate(user._id)}
                            className="p-2 bg-red-500/10 text-red-600 rounded-xl border border-red-200 hover:bg-red-500/20 hover:scale-105 transition-all duration-200"
                            title="Deactivate"
                          >
                            <X size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 bg-orange-500/10 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-500/20 hover:scale-105 transition-all duration-200"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDetailModal(user)}
                          className="p-2 bg-blue-500/10 text-blue-600 rounded-xl border border-blue-200 hover:bg-blue-500/20 hover:scale-105 transition-all duration-200"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 bg-red-500/10 text-red-600 rounded-xl border border-red-200 hover:bg-red-500/20 hover:scale-105 transition-all duration-200"
                          title="Delete"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="text-gray-300" size={48} />
                      <p className="text-gray-500 text-lg">No users found</p>
                      <p className="text-gray-400 text-sm">
                        {searchTerm ? "Try adjusting your search terms" : "No users registered yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl border border-orange-100 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedUser ? "Edit User" : "Add New User"}
              </h2>
              <button
                onClick={handleModalClose}
                className="p-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-4 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-4 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300"
                  >
                    <option value="customer">Customer</option>
                    <option value="mechanic">Mechanic</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-4 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-4 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-4 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300"
                    placeholder="Enter location"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border border-orange-200 hover:bg-orange-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-orange-600 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {selectedUser ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {detailModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl border border-orange-100 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {selectedUser.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedUser.name || "N/A"}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-600">
                      {getStatusBadge(selectedUser.status)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Joined: {formatDate(selectedUser.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h5 className="font-semibold text-blue-900 mb-2">Basic Information</h5>
                  <div className="space-y-2">
                    <p className="text-sm text-blue-700"><strong>Name:</strong> {selectedUser.name}</p>
                    <p className="text-sm text-blue-700"><strong>Email:</strong> {selectedUser.email}</p>
                    <p className="text-sm text-blue-700"><strong>Role:</strong> <span className="capitalize">{selectedUser.role}</span></p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <h5 className="font-semibold text-green-900 mb-2">Contact Information</h5>
                  <div className="space-y-2">
                    <p className="text-sm text-green-700"><strong>Phone:</strong> {selectedUser.phone || "Not provided"}</p>
                    <p className="text-sm text-green-700"><strong>Location:</strong> {selectedUser.location || "Not provided"}</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <h5 className="font-semibold text-purple-900 mb-2">Account Information</h5>
                  <div className="space-y-2">
                    <p className="text-sm text-purple-700"><strong>Status:</strong> <span className="capitalize">{selectedUser.status}</span></p>
                    <p className="text-sm text-purple-700"><strong>Created:</strong> {formatDate(selectedUser.createdAt)}</p>
                    {selectedUser.updatedAt && (
                      <p className="text-sm text-purple-700"><strong>Last Updated:</strong> {formatDate(selectedUser.updatedAt)}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border border-orange-200 hover:bg-orange-50 transition-all duration-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setDetailModalOpen(false);
                    openEditModal(selectedUser);
                  }}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-orange-600 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Edit User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;