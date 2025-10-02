"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import useUser from "@/hooks/useUser";
import { Check, X, Edit, Search, Filter, Download, Wrench, Clock, User, Mail, Calendar, AlertCircle, Eye, MapPin, Phone, MessageCircle, Trash2, Save } from "lucide-react";
import Link from "next/link";
import Swal from 'sweetalert2';

const ManageServiceRequests = () => {
  const { user: loggedInUser, loading: userLoading } = useUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);
  const [shops, setShops] = useState([]);
  const [saving, setSaving] = useState(false);

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

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/service-request");
      if (!res.ok) throw new Error('Failed to fetch service requests');
      const data = await res.json();
      setRequests(data.result || []);
    } catch (err) {
      console.error("Failed to fetch service requests:", err);
      showErrorAlert('Error', 'Failed to load service requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchShops = async () => {
    try {
      const res = await fetch("/api/shops?admin=true");
      if (res.ok) {
        const data = await res.json();
        setShops(data.result || []);
      }
    } catch (err) {
      console.error("Failed to fetch shops:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchShops();
  }, []);

  const handleDeleteRequest = async (id) => {
    const result = await showConfirmDialog(
      'Delete Service Request',
      'Are you sure you want to delete this service request? This action cannot be undone.',
      'Yes, Delete'
    );

    if (result.isConfirmed) {
      try {
        showLoadingAlert('Deleting...', 'Please wait while we delete the service request');

        const response = await fetch(`/api/service-request/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete service request');
        }

        Swal.close();
        await fetchRequests();
        showSuccessAlert('Deleted!', 'Service request has been deleted successfully');
      } catch (error) {
        console.error('Delete failed:', error);
        Swal.close();
        showErrorAlert('Error', error.message || 'Failed to delete service request');
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!editingRequest) return;

    setSaving(true);
    try {
      showLoadingAlert('Saving...', 'Please wait while we update the service request');

      console.log('Sending update for request:', editingRequest._id);
      
      const payload = {
        deviceType: editingRequest.deviceType,
        problemCategory: editingRequest.problemCategory,
        problemDescription: editingRequest.problemDescription,
        userEmail: editingRequest.userEmail,
        userPhone: editingRequest.userPhone,
        assignedShop: editingRequest.assignedShop,
        status: editingRequest.status,
        adminNotes: editingRequest.adminNotes,
        userName: editingRequest.user?.name,
        location: editingRequest.location,
        serviceDetails: editingRequest.serviceDetails
      };

      console.log('Update payload:', payload);

      const response = await fetch(`/api/service-request/${editingRequest._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
        throw new Error(errorData.error || errorData.message || 'Failed to update service request');
      }

      const result = await response.json();
      console.log('Update successful:', result);

      Swal.close();
      await fetchRequests();
      setEditModalOpen(false);
      setEditingRequest(null);
      setDetailModalOpen(false);
      setSelectedRequest(null);
      showSuccessAlert('Updated!', 'Service request has been updated successfully');
    } catch (error) {
      console.error('Update failed:', error);
      Swal.close();
      showErrorAlert('Error', error.message || 'Failed to update service request');
    } finally {
      setSaving(false);
    }
  };

  const openDetailModal = (request) => {
    setSelectedRequest(request);
    setDetailModalOpen(true);
  };

  const openEditModal = (request) => {
    setEditingRequest(JSON.parse(JSON.stringify(request)));
    setEditModalOpen(true);
    setDetailModalOpen(false);
  };

  const closeModals = () => {
    setDetailModalOpen(false);
    setEditModalOpen(false);
    setSelectedRequest(null);
    setEditingRequest(null);
  };

  // FIXED: Use useCallback to prevent function recreation
  const handleInputChange = useCallback((field, value) => {
    setEditingRequest(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // FIXED: Use useCallback for nested updates too
  const handleNestedInputChange = useCallback((parent, field, value) => {
    setEditingRequest(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
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

  const filteredRequests = requests.filter(
    (r) =>
      r.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.deviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.problemCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
      },
      blue: {
        bg: "bg-blue-500/10",
        bgHover: "group-hover:bg-blue-500/20",
        text: "text-blue-600"
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

  const getShopName = (shopId) => {
    if (!shopId) return "Not assigned";
    const shop = shops.find(s => s._id === shopId);
    return shop?.shop?.shopName || shop?.shopName || "Unknown shop";
  };

  // FIXED: Modal Container with stable reference
  const ModalContainer = React.memo(({ children, onClose, title, isEditing = false }) => {
    const modalRef = useRef(null);

    return (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-4">
        <div 
          ref={modalRef}
          className="bg-white rounded-3xl p-8 w-full max-w-4xl border border-orange-100 shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
              disabled={saving}
            >
              <X size={20} />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  });

  // FIXED: Request Header Component with memo
  const RequestHeader = React.memo(({ request, isEditing = false }) => (
    <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white">
        <Wrench size={20} />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900">
          {isEditing ? (
            <input
              type="text"
              value={editingRequest?.deviceType || ""}
              onChange={(e) => handleInputChange('deviceType', e.target.value)}
              className="bg-white border border-orange-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
              placeholder="Device Type"
            />
          ) : (
            request.deviceType || "Service Request"
          )}
        </h3>
        <div className="flex items-center gap-4 mt-1">
          {getStatusBadge(request.status)}
          <span className="text-sm text-gray-500">
            Requested: {formatDate(request.requestedDate || request.createdAt)}
          </span>
        </div>
      </div>
    </div>
  ));

  // FIXED: Service Details Section with memo and stable props
  const ServiceDetailsSection = React.memo(({ request, isEditing = false }) => (
    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
      <h5 className="font-semibold text-blue-900 mb-3">Service Details</h5>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">Device Type</label>
          {isEditing ? (
            <input
              type="text"
              value={editingRequest?.deviceType || ""}
              onChange={(e) => handleInputChange('deviceType', e.target.value)}
              className="w-full bg-white border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-blue-700">{request.deviceType || "Not specified"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">Problem Category</label>
          {isEditing ? (
            <input
              type="text"
              value={editingRequest?.problemCategory || ""}
              onChange={(e) => handleInputChange('problemCategory', e.target.value)}
              className="w-full bg-white border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-blue-700">{request.problemCategory || "Not specified"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">Problem Description</label>
          {isEditing ? (
            <textarea
              value={editingRequest?.problemDescription || ""}
              onChange={(e) => handleInputChange('problemDescription', e.target.value)}
              className="w-full bg-white border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Describe the problem..."
            />
          ) : (
            <p className="text-blue-700">{request.problemDescription || "Not provided"}</p>
          )}
        </div>

        {(request.serviceDetails?.urgency || isEditing) && (
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Urgency</label>
            {isEditing ? (
              <select
                value={editingRequest?.serviceDetails?.urgency || "low"}
                onChange={(e) => handleNestedInputChange('serviceDetails', 'urgency', e.target.value)}
                className="w-full bg-white border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="emergency">Emergency</option>
              </select>
            ) : (
              <p className="text-blue-700 capitalize">{request.serviceDetails?.urgency || "Not specified"}</p>
            )}
          </div>
        )}
      </div>
    </div>
  ));

  // FIXED: Customer Info Section with memo
  const CustomerInfoSection = React.memo(({ request, isEditing = false }) => (
    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
      <h5 className="font-semibold text-green-900 mb-3">Customer Information</h5>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">Name</label>
          {isEditing ? (
            <input
              type="text"
              value={editingRequest?.user?.name || ""}
              onChange={(e) => handleNestedInputChange('user', 'name', e.target.value)}
              className="w-full bg-white border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          ) : (
            <p className="text-green-700">{request.user?.name || "Not provided"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">Email</label>
          {isEditing ? (
            <input
              type="email"
              value={editingRequest?.userEmail || ""}
              onChange={(e) => handleInputChange('userEmail', e.target.value)}
              className="w-full bg-white border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          ) : (
            <p className="text-green-700">{request.userEmail}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">Phone</label>
          {isEditing ? (
            <input
              type="tel"
              value={editingRequest?.userPhone || ""}
              onChange={(e) => handleInputChange('userPhone', e.target.value)}
              className="w-full bg-white border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          ) : (
            <p className="text-green-700">{request.userPhone || "Not provided"}</p>
          )}
        </div>

        {(request.location?.address || isEditing) && (
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">Address</label>
            {isEditing ? (
              <input
                type="text"
                value={editingRequest?.location?.address || ""}
                onChange={(e) => handleNestedInputChange('location', 'address', e.target.value)}
                className="w-full bg-white border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Customer address..."
              />
            ) : (
              <p className="text-green-700">{request.location?.address || "Not provided"}</p>
            )}
          </div>
        )}
      </div>
    </div>
  ));

  // FIXED: Assignment Info Section with memo
  const AssignmentInfoSection = React.memo(({ request, isEditing = false }) => (
    <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
      <h5 className="font-semibold text-purple-900 mb-3">Assignment Information</h5>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">Assigned Shop</label>
          {isEditing ? (
            <select
              value={editingRequest?.assignedShop || ""}
              onChange={(e) => handleInputChange('assignedShop', e.target.value)}
              className="w-full bg-white border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Not assigned</option>
              {shops.map(shop => (
                <option key={shop._id} value={shop._id}>
                  {shop.shop?.shopName || shop.shopName || "Unknown Shop"}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-purple-700">{request.assignedShop ? getShopName(request.assignedShop) : "Not assigned"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">Status</label>
          {isEditing ? (
            <select
              value={editingRequest?.status || "pending"}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full bg-white border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          ) : (
            <div className="capitalize">{getStatusBadge(request.status)}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">Created</label>
          <p className="text-purple-700">{formatDate(request.createdAt)}</p>
        </div>

        {request.updatedAt && (
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">Last Updated</label>
            <p className="text-purple-700">{formatDate(request.updatedAt)}</p>
          </div>
        )}
      </div>
    </div>
  ));

  // FIXED: Admin Notes Section with memo
  const AdminNotesSection = React.memo(({ request, isEditing = false }) => (
    (request.adminNotes || isEditing) && (
      <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
        <h5 className="font-semibold text-yellow-900 mb-3">Admin Notes</h5>
        {isEditing ? (
          <textarea
            value={editingRequest?.adminNotes || ""}
            onChange={(e) => handleInputChange('adminNotes', e.target.value)}
            className="w-full bg-white border border-yellow-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            rows="3"
            placeholder="Add admin notes here..."
          />
        ) : (
          <p className="text-yellow-700">{request.adminNotes || "No admin notes"}</p>
        )}
      </div>
    )
  ));

  return (
    <div className="min-h-screen p-6">
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
            <p className="text-gray-600">Manage service requests</p>
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
                          <button
                            onClick={() => openDetailModal(req)}
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
                          <span className="text-sm text-gray-500">{req.userEmail || "N/A"}</span>
                        </div>
                        {req.userPhone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-orange-500" />
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
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-700">
                          {req.assignedShop ? getShopName(req.assignedShop) : "Not assigned"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-orange-500" />
                        <span className="text-sm text-gray-700">
                          {formatDate(req.requestedDate || req.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(req.status || "pending")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(req)}
                          className="p-2 bg-orange-500/10 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-500/20 hover:scale-105 transition-all duration-200"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDetailModal(req)}
                          className="p-2 bg-blue-500/10 text-blue-600 rounded-xl border border-blue-200 hover:bg-blue-500/20 hover:scale-105 transition-all duration-200"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(req._id)}
                          className="p-2 bg-red-500/10 text-red-600 rounded-xl border border-red-200 hover:bg-red-500/20 hover:scale-105 transition-all duration-200"
                          title="Delete"
                        >
                          <Trash2 size={16} />
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

      {/* View Detail Modal */}
      {detailModalOpen && selectedRequest && (
        <ModalContainer onClose={closeModals} title="Service Request Details">
          <div className="space-y-6">
            <RequestHeader request={selectedRequest} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ServiceDetailsSection request={selectedRequest} />
              <CustomerInfoSection request={selectedRequest} />
              <AssignmentInfoSection request={selectedRequest} />
              <AdminNotesSection request={selectedRequest} />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={closeModals}
                className="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border border-orange-200 hover:bg-orange-50 transition-all duration-300"
              >
                Close
              </button>
              <button
                onClick={() => openEditModal(selectedRequest)}
                className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-orange-600 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Edit Request
              </button>
              <button
                onClick={() => handleDeleteRequest(selectedRequest._id)}
                className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-red-600 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Delete Request
              </button>
            </div>
          </div>
        </ModalContainer>
      )}

      {/* Edit Modal */}
      {editModalOpen && editingRequest && (
        <ModalContainer onClose={closeModals} title="Edit Service Request">
          <div className="space-y-6">
            <RequestHeader request={editingRequest} isEditing={true} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ServiceDetailsSection request={editingRequest} isEditing={true} />
              <CustomerInfoSection request={editingRequest} isEditing={true} />
              <AssignmentInfoSection request={editingRequest} isEditing={true} />
              <AdminNotesSection request={editingRequest} isEditing={true} />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={closeModals}
                disabled={saving}
                className="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border border-orange-200 hover:bg-orange-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-orange-600 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </ModalContainer>
      )}
    </div>
  );
};

export default ManageServiceRequests;