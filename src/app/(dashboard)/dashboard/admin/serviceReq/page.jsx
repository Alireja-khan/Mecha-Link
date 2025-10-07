"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import useUser from "@/hooks/useUser";
import { Check, X, Edit, Search, Filter, Download, Wrench, Clock, User, Mail, Calendar, AlertCircle, Eye, MapPin, Phone, MessageCircle, Trash2, Save, MessageSquare } from "lucide-react";
import Link from "next/link";
import Swal from 'sweetalert2';

// --- Utility Functions ---

// Utility function to format date for full display
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

// Utility function to format date for short display (mobile table)
const formatDateShort = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

// Utility function to get shop name
const getShopName = (shopId, shops) => {
  if (!shopId) return "Not assigned";
  const shop = shops.find(s => s._id === shopId);
  // Handle both old and new shop object structure
  return shop?.shop?.shopName || shop?.shopName || "Unknown shop";
};

// Utility function to get status badge (Refactored Colors)
const getStatusBadge = (status) => {
  const base = "px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap";
  switch (status) {
    case "pending":
      // Uses DaisyUI warning color
      return <span className={`${base} bg-warning/30 text-base-content dark:text-warning/80 border-warning/30`}>Pending</span>;
    case "in-progress":
      // Uses DaisyUI info color (Blue)
      return <span className={`${base} bg-info/10 text-info border-info/30`}>In Progress</span>;
    case "completed":
      // Uses DaisyUI success color (Green)
      return <span className={`${base} bg-success/10 text-success border-success/30`}>Completed</span>;
    case "cancelled":
      // Uses DaisyUI error color (Red)
      return <span className={`${base} bg-error/10 text-error border-error/30`}>Cancelled</span>;
    default:
      // Uses DaisyUI base color
      return <span className={`${base} bg-base-300 text-base-content/70 border-base-300`}>Unknown</span>;
  }
};

// --- Stat Card Component (Refactored Colors) ---

const StatCard = ({ icon: Icon, value, label, color = "primary" }) => {
  const colorClasses = {
    primary: { // Orange
      bg: "bg-primary/10",
      bgHover: "group-hover:bg-primary/20",
      text: "text-primary"
    },
    success: { // Green
      bg: "bg-success/10",
      bgHover: "group-hover:bg-success/20",
      text: "text-success" // Use success text for completed counts
    },
    error: { // Red
      bg: "bg-error/10",
      bgHover: "group-hover:bg-error/20",
      text: "text-error"
    },
    warning: { // Yellow
      bg: "bg-warning/20",
      bgHover: "group-hover:bg-warning/30",
      text: "text-warning" // Use warning text for pending counts
    },
    info: { // Blue
      bg: "bg-info/10",
      bgHover: "group-hover:bg-info/20",
      text: "text-info"
    }
  };

  const classes = colorClasses[color] || colorClasses.primary;

  return (
    <div className="bg-base-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-neutral shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-xl ${classes.bg} ${classes.bgHover} transition-colors duration-300`}>
          <Icon className={classes.text} size={20} />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-base-content mb-1">{value}</p>
      <p className="text-base-content/60 text-xs sm:text-sm font-medium">{label}</p>
    </div>
  );
};

// --- Memoized Modal Sub-Components (Refactored Colors) ---

const ModalContainer = React.memo(({ children, onClose, title, saving }) => {
  const modalRef = useRef(null);

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-4">
      <div
        ref={modalRef}
        className="bg-base-100 rounded-3xl p-6 sm:p-8 w-full max-w-lg md:max-w-4xl border border-neutral shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-base-content">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 bg-base-200 text-primary rounded-xl border border-neutral hover:bg-base-200/70 transition-colors duration-200"
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

// --- Main Component ---

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

  // SweetAlert2 Functions (color updates for DaisyUI theme)
  const swalOptions = {
    confirmButtonColor: 'var(--color-success)',
    background: 'var(--color-base-100,)',
    color: 'var(--color-base-content)',
    cancelButtonColor: 'var(--color-error)',
  };

  const showSuccessAlert = (title, message) => {
    Swal.fire({
      ...swalOptions,
      title: title,
      text: message,
      icon: 'success',
      iconColor: 'var(--color-success)'
    });
  };

  const showErrorAlert = (title, message) => {
    Swal.fire({
      ...swalOptions,
      title: title,
      text: message,
      icon: 'error',
      iconColor: 'var(--color-error)'
    });
  };

  const showConfirmDialog = (title, text, confirmButtonText = 'Yes, proceed') => {
    return Swal.fire({
      ...swalOptions,
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      iconColor: 'var(--color-warning)'
    });
  };

  const showLoadingAlert = (title, text) => {
    Swal.fire({
      ...swalOptions,
      title: title,
      text: text,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  // --- Data Fetching ---

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

  // --- Handlers ---

  const handleDeleteRequest = async (id) => {
    const requestToDelete = requests.find(r => r._id === id);
    const result = await showConfirmDialog(
      'Delete Service Request',
      `Are you sure you want to delete the request for "${requestToDelete?.deviceType || 'this device'}"? This action cannot be undone.`,
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
        setDetailModalOpen(false); // Close detail modal if open
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

    const result = await showConfirmDialog(
      'Confirm Update',
      'Are you sure you want to save these changes to the service request?',
      'Yes, Save Changes'
    );

    if (!result.isConfirmed) {
      setSaving(false);
      return;
    }

    try {
      showLoadingAlert('Saving...', 'Please wait while we update the service request');

      // Construct payload, ensuring nested objects are handled correctly
      const payload = {
        deviceType: editingRequest.deviceType,
        problemCategory: editingRequest.problemCategory,
        problemDescription: editingRequest.problemDescription,
        userEmail: editingRequest.userEmail,
        userPhone: editingRequest.userPhone,
        assignedShop: editingRequest.assignedShop || null,
        status: editingRequest.status,
        adminNotes: editingRequest.adminNotes,
        // The user object needs special handling to ensure it only updates mutable fields if necessary, or just sends the required info.
        // Assuming we only allow editing user name here, and other user info via email/phone fields:
        userName: editingRequest.user?.name,
        location: editingRequest.location,
        serviceDetails: editingRequest.serviceDetails
      };

      const response = await fetch(`/api/service-request/${editingRequest._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
        throw new Error(errorData.error || errorData.message || 'Failed to update service request');
      }

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
    // Deep copy the request to prevent accidental mutation of the original state
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

  // Memoized Input Handlers
  const handleInputChange = useCallback((field, value) => {
    setEditingRequest(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleNestedInputChange = useCallback((parent, field, value) => {
    setEditingRequest(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  }, []);

  // --- Component Sub-Definitions (Refactored Colors) ---

  // Request Header Component
  const RequestHeader = React.memo(({ request, isEditing = false }) => (
    <div className="flex items-start sm:items-center gap-4 p-4 bg-base-200 rounded-xl border border-neutral">
      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-content flex-shrink-0">
        <Wrench size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg sm:text-xl font-bold text-base-content truncate mb-1">
          {isEditing ? (
            <input
              type="text"
              value={request?.deviceType || ""}
              onChange={(e) => handleInputChange('deviceType', e.target.value)}
              className="bg-base-100 border border-neutral rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full text-base font-semibold text-base-content"
              placeholder="Device Type"
            />
          ) : (
            request.deviceType || "Service Request"
          )}
        </h3>
        <div className="flex items-center gap-4 flex-wrap">
          {getStatusBadge(request.status)}
          <span className="text-sm text-base-content/70 flex items-center gap-1">
            <Calendar size={14} className="text-base-content/50" />
            Requested: {formatDate(request.requestedDate || request.createdAt)}
          </span>
        </div>
      </div>
    </div>
  ));

  // Service Details Section
  const ServiceDetailsSection = React.memo(({ request, isEditing = false }) => (
    <div className="p-4 bg-info/10 rounded-xl border border-info/30">
      <h5 className="font-semibold text-base-content/90 mb-3">Service Details</h5>
      <div className="space-y-3 text-sm">
        <div>
          <label className="block font-medium text-base-content/80 mb-1">Device Type</label>
          {isEditing ? (
            <input
              type="text"
              value={request?.deviceType || ""}
              onChange={(e) => handleInputChange('deviceType', e.target.value)}
              className="w-full bg-base-100 border border-info/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-info text-base-content"
            />
          ) : (
            <p className="text-base-content/90">{request.deviceType || "Not specified"}</p>
          )}
        </div>

        <div>
          <label className="block font-medium text-base-content/80 mb-1">Problem Category</label>
          {isEditing ? (
            <input
              type="text"
              value={request?.problemCategory || ""}
              onChange={(e) => handleInputChange('problemCategory', e.target.value)}
              className="w-full bg-base-100 border border-info/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-info text-base-content"
            />
          ) : (
            <p className="text-base-content/90">{request.problemCategory || "Not specified"}</p>
          )}
        </div>

        <div>
          <label className="block font-medium text-base-content/80 mb-1">Problem Description</label>
          {isEditing ? (
            <textarea
              value={request?.problemDescription || ""}
              onChange={(e) => handleInputChange('problemDescription', e.target.value)}
              className="w-full bg-base-100 border border-info/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-info text-base-content"
              rows="3"
              placeholder="Describe the problem..."
            />
          ) : (
            <p className="text-base-content/90 whitespace-pre-wrap">{request.problemDescription || "Not provided"}</p>
          )}
        </div>

        {/* Conditional Urgency Field */}
        {(request.serviceDetails?.urgency || isEditing) && (
          <div>
            <label className="block font-medium text-base-content/80 mb-1">Urgency</label>
            {isEditing ? (
              <select
                value={request?.serviceDetails?.urgency || "low"}
                onChange={(e) => handleNestedInputChange('serviceDetails', 'urgency', e.target.value)}
                className="w-full bg-base-100 border border-info/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-info text-base-content"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="emergency">Emergency</option>
              </select>
            ) : (
              <p className="text-base-content/90 capitalize">{request.serviceDetails?.urgency || "Not specified"}</p>
            )}
          </div>
        )}
      </div>
    </div>
  ));

  // Customer Info Section
  const CustomerInfoSection = React.memo(({ request, isEditing = false }) => (
    <div className="p-4 bg-success/10 rounded-xl border border-success/30">
      <h5 className="font-semibold text-base-content mb-3">Customer Information</h5>
      <div className="space-y-3 text-sm">
        <div>
          <label className="block font-medium text-base-content/90 mb-1">Name</label>
          {isEditing ? (
            <input
              type="text"
              value={request?.user?.name || ""}
              onChange={(e) => handleNestedInputChange('user', 'name', e.target.value)}
              className="w-full bg-base-100 border border-success/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-success text-base-content"
            />
          ) : (
            <p className="text-base-content/90">{request.user?.name || "Not provided"}</p>
          )}
        </div>

        <div>
          <label className="block font-medium text-base-content/90 mb-1">Email</label>
          {isEditing ? (
            <input
              type="email"
              value={request?.userEmail || ""}
              onChange={(e) => handleInputChange('userEmail', e.target.value)}
              className="w-full bg-base-100 border border-base-content/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-success text-base-content"
            />
          ) : (
            <p className="text-base-content/90">{request.userEmail}</p>
          )}
        </div>

        <div>
          <label className="block font-medium text-base-content/90 mb-1">Phone</label>
          {isEditing ? (
            <input
              type="tel"
              value={request?.userPhone || ""}
              onChange={(e) => handleInputChange('userPhone', e.target.value)}
              className="w-full bg-base-100 border border-success/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-success text-base-content"
            />
          ) : (
            <p className="text-base-content/90">{request.userPhone || "Not provided"}</p>
          )}
        </div>

        {/* Conditional Location Field */}
        {(request.location?.address || isEditing) && (
          <div>
            <label className="block font-medium text-base-content/90 mb-1">Address</label>
            {isEditing ? (
              <input
                type="text"
                value={request?.location?.address || ""}
                onChange={(e) => handleNestedInputChange('location', 'address', e.target.value)}
                className="w-full bg-base-100 border border-success/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-success text-base-content"
                placeholder="Customer address..."
              />
            ) : (
              <p className="text-base-content/90">{request.location?.address || "Not provided"}</p>
            )}
          </div>
        )}
      </div>
    </div>
  ));

  // Assignment Info Section
  const AssignmentInfoSection = React.memo(({ request, isEditing = false }) => (
    <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/30">
      <h5 className="font-semibold text-base-content/90 mb-3">Assignment Information</h5>
      <div className="space-y-3 text-sm">
        <div>
          <label className="block font-medium text-base-content/80 mb-1">Assigned Shop</label>
          {isEditing ? (
            <select
              value={request?.assignedShop || ""}
              onChange={(e) => handleInputChange('assignedShop', e.target.value)}
              className="w-full bg-base-100 border border-secondary/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary text-base-content"
            >
              <option value="">Not assigned</option>
              {shops.map(shop => (
                <option key={shop._id} value={shop._id}>
                  {getShopName(shop._id, shops)}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-base-content/90">{request.assignedShop ? getShopName(request.assignedShop, shops) : "Not assigned"}</p>
          )}
        </div>

        <div>
          <label className="block font-medium text-base-content/80 mb-1">Status</label>
          {isEditing ? (
            <select
              value={request?.status || "pending"}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full bg-base-100 border border-secondary/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary text-base-content"
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
          <label className="block font-medium text-base-content/80 mb-1">Created</label>
          <p className="text-base-content/90">{formatDate(request.createdAt)}</p>
        </div>

        {request.updatedAt && (
          <div>
            <label className="block font-medium text-base-content/80 mb-1">Last Updated</label>
            <p className="text-base-content/90">{formatDate(request.updatedAt)}</p>
          </div>
        )}
      </div>
    </div>
  ));

  // Admin Notes Section
  const AdminNotesSection = React.memo(({ request, isEditing = false }) => (
    <div className="p-4 bg-warning/20 rounded-xl border border-warning/30 md:col-span-2">
      <h5 className="font-semibold text-base-content mb-3">Admin Notes</h5>
      {isEditing ? (
        <textarea
          value={request?.adminNotes || ""}
          onChange={(e) => handleInputChange('adminNotes', e.target.value)}
          className="w-full bg-base-100 border border-warning/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-warning text-base-content"
          rows="3"
          placeholder="Add internal notes for tracking or reference here..."
        />
      ) : (
        <p className="text-base-content/90 whitespace-pre-wrap">{request.adminNotes || "No admin notes"}</p>
      )}
    </div>
  ));

  // --- Mobile Card Component (Refactored Colors) ---
  const RequestMobileCard = ({ req }) => (
    <div className="bg-base-100 p-4 rounded-xl border border-neutral shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-3 mb-3 border-b border-base-300 pb-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-content font-bold text-sm flex-shrink-0">
          <Wrench size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base-content truncate">{req.deviceType || 'Service Request'}</p>
          <p className="text-xs text-base-content/70 truncate flex items-center gap-1">
            <User size={12} className="text-base-content/40" />
            {req.user?.name || req.userEmail}
          </p>
          <p className="text-xs text-base-content/70 truncate flex items-center gap-1">
            <Clock size={12} className="text-base-content/40" />
            {formatDateShort(req.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {getStatusBadge(req.status)}
          <span className="px-3 py-1 text-xs bg-base-200 text-primary rounded-lg border border-neutral">
            {req.problemCategory}
          </span>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => openEditModal(req)}
            className="p-1.5 bg-primary/10 text-primary rounded-lg border border-neutral hover:bg-primary/20 transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => openDetailModal(req)}
            className="p-1.5 bg-info/10 text-info rounded-lg border border-info/30 hover:bg-info/20 transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleDeleteRequest(req._id)}
            className="p-1.5 bg-error/10 text-error rounded-lg border border-error/30 hover:bg-error/20 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
  // ------------------------------------

  // --- Conditional Rendering ---

  if (loading || userLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-base-200">
        <span className="loading loading-bars loading-xl text-primary"></span>
      </div>
    );
  }

  if (!loggedInUser) {
    // Should typically redirect or show a login prompt in a real app
    return (
      <div className="flex items-center justify-center h-screen w-full bg-base-200">
        <p className="text-lg text-error">Access Denied. Please log in.</p>
      </div>
    );
  }

  // --- Data Filtering ---
  const filteredRequests = requests.filter(
    (r) =>
      r.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.deviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.problemCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats for the header
  const stats = {
    total: requests.length,
    pending: requests.filter(req => req.status === "pending").length,
    inProgress: requests.filter(req => req.status === "in-progress").length,
    completed: requests.filter(req => req.status === "completed").length,
  };

  // --- Main JSX Return ---

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6 mx-auto bg-base-200">
      {/* Header Section */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-1 sm:mb-2">Service Request Management</h1>
        <p className="text-base-content/60 text-sm sm:text-base lg:text-lg">Manage and track all service requests</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <StatCard icon={Wrench} value={stats.total} label="Total Requests" color="primary" />
        <StatCard icon={Clock} value={stats.pending} label="Pending" color="warning" />
        <StatCard icon={AlertCircle} value={stats.inProgress} label="In Progress" color="info" />
        <StatCard icon={Check} value={stats.completed} label="Completed" color="success" />
      </div>

      {/* Main Content */}
      <div className="bg-base-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-neutral shadow-xl">
        {/* Header with Search and Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-base-content mb-1">All Service Requests</h2>
            <p className="text-base-content/60 text-sm">Manage service requests and assign shops</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" size={18} />
              <input
                type="text"
                placeholder="Search by user, device, or problem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 sm:py-3 border border-neutral rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-neutral focus:outline-none transition-all duration-300 w-full text-sm text-base-content"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => showSuccessAlert('Coming Soon!', 'Filter functionality will be implemented soon.')}
                className="flex items-center gap-2 px-4 py-2.5 sm:py-3 bg-base-200 text-primary rounded-xl border border-neutral hover:bg-base-200/70 transition-colors duration-200 text-sm flex-1"
              >
                <Filter size={16} />
                Filter
              </button>
              <button
                onClick={() => showSuccessAlert('Coming Soon!', 'Export functionality will be implemented soon.')}
                className="flex items-center gap-2 px-4 py-2.5 sm:py-3 bg-base-200 text-primary rounded-xl border border-neutral hover:bg-base-200/70 transition-colors duration-200 text-sm flex-1"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Request Cards (Visible on screens < xl) */}
        <div className="block xl:hidden space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map(req => <RequestMobileCard key={req._id} req={req} />)
          ) : (
            <div className="text-center py-12">
              <MessageSquare size={48} className="mx-auto text-base-content/30" />
              <p className="text-base-content/70 mt-2">No service requests found</p>
              <p className="text-base-content/50 text-sm">
                {searchTerm ? "Try adjusting your search terms" : "No service requests yet"}
              </p>
            </div>
          )}
        </div>

        {/* Desktop Table (Visible on screens >= xl) */}
        <div className="hidden xl:block rounded-2xl border border-neutral overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral">
            <thead className="bg-base-300">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content uppercase tracking-wider whitespace-nowrap">Request Details</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content uppercase tracking-wider whitespace-nowrap">User Info</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content uppercase tracking-wider whitespace-nowrap">Problem</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content uppercase tracking-wider whitespace-nowrap">Shop</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content uppercase tracking-wider whitespace-nowrap">Requested</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-base-content uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-base-100 divide-y divide-neutral">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="flex justify-center">
                      <span className="loading loading-bars loading-lg text-primary"></span>
                    </div>
                    <p className="text-base-content/70 mt-2">Loading service requests...</p>
                  </td>
                </tr>
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-base-200/30 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-content font-bold text-sm flex-shrink-0">
                          <Wrench size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-base-content">{req.deviceType || "Other"}</p>
                          <button
                            onClick={() => openDetailModal(req)}
                            className="text-primary hover:text-secondary text-sm font-medium flex items-center gap-1 transition-colors duration-200 mt-1"
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
                          <Mail size={14} className="text-primary" />
                          <span className="text-sm text-base-content/70">{req.userEmail || "N/A"}</span>
                        </div>
                        {req.userPhone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-primary" />
                            <span className="text-sm text-base-content/70">{req.userPhone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-base-200 text-primary text-sm rounded-lg border border-neutral whitespace-nowrap">
                        {req.problemCategory || "Other"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-base-content/90">
                          {req.assignedShop ? getShopName(req.assignedShop, shops) : "Not assigned"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-primary" />
                        <span className="text-sm text-base-content/90 whitespace-nowrap">
                          {formatDateShort(req.requestedDate || req.createdAt)}
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
                          className="p-2 bg-primary/10 text-primary rounded-xl border border-neutral hover:bg-primary/20 hover:scale-105 transition-all duration-200"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDetailModal(req)}
                          className="p-2 bg-info/10 text-info rounded-xl border border-info/30 hover:bg-info/20 hover:scale-105 transition-all duration-200"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(req._id)}
                          className="p-2 bg-error/10 text-error rounded-xl border border-error/30 hover:bg-error/20 hover:scale-105 transition-all duration-200"
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
                      <Wrench className="text-base-content/30" size={48} />
                      <p className="text-base-content/70 text-lg">No service requests found</p>
                      <p className="text-base-content/50 text-sm">
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

      {/* View Detail Modal - REFACTORED */}
      {detailModalOpen && selectedRequest && (
        <ModalContainer onClose={closeModals} title="Service Request Details" saving={saving}>
          <div className="space-y-6">
            <RequestHeader request={selectedRequest} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ServiceDetailsSection request={selectedRequest} />
              <CustomerInfoSection request={selectedRequest} />
              <AssignmentInfoSection request={selectedRequest} />
              {/* AdminNotesSection takes full width on small screens, two columns on large */}
              <AdminNotesSection request={selectedRequest} className="md:col-span-2" />
            </div>

            <div className="flex justify-end gap-3 pt-4 flex-wrap">
              <button
                onClick={closeModals}
                className="px-6 py-3 bg-base-100 text-base-content/90 rounded-xl font-semibold border border-neutral hover:bg-base-200 transition-all duration-300 text-sm"
              >
                Close
              </button>
              <button
                onClick={() => openEditModal(selectedRequest)}
                className="px-6 py-3 bg-primary text-primary-content rounded-xl font-semibold transition-all duration-300 hover:bg-secondary hover:scale-105 shadow-lg hover:shadow-xl text-sm"
              >
                Edit Request
              </button>
              <button
                onClick={() => handleDeleteRequest(selectedRequest._id)}
                className="px-6 py-3 bg-error text-error-content rounded-xl font-semibold transition-all duration-300 hover:bg-error/80 hover:scale-105 shadow-lg hover:shadow-xl text-sm"
              >
                Delete Request
              </button>
            </div>
          </div>
        </ModalContainer>
      )}

      {/* Edit Modal - REFACTORED */}
      {editModalOpen && editingRequest && (
        <ModalContainer onClose={closeModals} title="Edit Service Request" saving={saving}>
          <div className="space-y-6">
            <RequestHeader request={editingRequest} isEditing={true} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ServiceDetailsSection request={editingRequest} isEditing={true} />
              <CustomerInfoSection request={editingRequest} isEditing={true} />
              <AssignmentInfoSection request={editingRequest} isEditing={true} />
              {/* AdminNotesSection takes full width on small screens, two columns on large */}
              <AdminNotesSection request={editingRequest} isEditing={true} className="md:col-span-2" />
            </div>

            <div className="flex justify-end gap-3 pt-4 flex-wrap">
              <button
                onClick={closeModals}
                disabled={saving}
                className="px-6 py-3 bg-base-100 text-base-content/90 rounded-xl font-semibold border border-neutral hover:bg-base-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="px-6 py-3 bg-primary text-primary-content rounded-xl font-semibold transition-all duration-300 hover:bg-secondary hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
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