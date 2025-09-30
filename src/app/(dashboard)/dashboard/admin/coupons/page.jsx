"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { Check, X, Trash, Plus, Search, Filter, Download, Tag, Calendar, Users, Percent, Crown, Edit, Eye, Ban } from "lucide-react";
import Swal from 'sweetalert2';

const ManageCoupons = () => {
  const { user: loggedInUser, loading: userLoading } = useUser();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    expiryDate: "",
    usageLimit: "",
    status: "active"
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

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/coupons");
      if (!res.ok) throw new Error('Failed to fetch coupons');
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
      showErrorAlert('Error', 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
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

  const handleActivate = async (id) => {
    try {
      showLoadingAlert('Activating...', 'Please wait while we activate the coupon');
      
      const response = await fetch(`/api/coupons/${id}/activate`, { method: "PATCH" });
      if (!response.ok) throw new Error('Failed to activate');
      
      Swal.close();
      await fetchCoupons();
      showSuccessAlert('Activated!', 'The coupon has been activated successfully');
    } catch (error) {
      console.error('Activation failed:', error);
      Swal.close();
      showErrorAlert('Error', 'Failed to activate coupon');
    }
  };

  const handleDeactivate = async (id) => {
    try {
      showLoadingAlert('Deactivating...', 'Please wait while we deactivate the coupon');
      
      const response = await fetch(`/api/coupons/${id}/deactivate`, { method: "PATCH" });
      if (!response.ok) throw new Error('Failed to deactivate');
      
      Swal.close();
      await fetchCoupons();
      showSuccessAlert('Deactivated!', 'The coupon has been deactivated successfully');
    } catch (error) {
      console.error('Deactivation failed:', error);
      Swal.close();
      showErrorAlert('Error', 'Failed to deactivate coupon');
    }
  };

  const handleDelete = async (id) => {
    const coupon = coupons.find(c => c._id === id);
    const result = await showConfirmDialog(
      'Are you sure?',
      `You are about to delete the coupon "${coupon?.code}". This action cannot be undone.`,
      'Yes, delete it!'
    );

    if (result.isConfirmed) {
      try {
        showLoadingAlert('Deleting...', 'Please wait while we delete the coupon');
        
        const response = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error('Failed to delete');
        
        Swal.close();
        await fetchCoupons();
        showSuccessAlert('Deleted!', 'The coupon has been deleted successfully');
      } catch (error) {
        console.error('Deletion failed:', error);
        Swal.close();
        showErrorAlert('Error', 'Failed to delete coupon');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discount || !formData.expiryDate) {
      showErrorAlert('Validation Error', 'Please fill in code, discount and expiry date fields');
      return;
    }

    try {
      showLoadingAlert(
        editingCoupon ? 'Updating...' : 'Creating...',
        editingCoupon ? 'Please wait while we update the coupon' : 'Please wait while we create the coupon'
      );

      if (editingCoupon) {
        const response = await fetch(`/api/coupons/${editingCoupon._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to update');
      } else {
        const response = await fetch(`/api/coupons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to create');
      }

      Swal.close();
      setModalOpen(false);
      setEditingCoupon(null);
      setFormData({ code: "", discount: "", expiryDate: "", usageLimit: "", status: "active" });
      await fetchCoupons();
      
      showSuccessAlert(
        editingCoupon ? 'Updated!' : 'Created!',
        editingCoupon ? 'Coupon has been updated successfully' : 'Coupon has been created successfully'
      );
    } catch (error) {
      console.error('Form submission failed:', error);
      Swal.close();
      showErrorAlert(
        'Error',
        editingCoupon ? 'Failed to update coupon' : 'Failed to create coupon'
      );
    }
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount: coupon.discount.toString(),
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : "",
      usageLimit: coupon.usageLimit ? coupon.usageLimit.toString() : "",
      status: coupon.status
    });
    setModalOpen(true);
  };

  const openDetailModal = (coupon) => {
    setSelectedCoupon(coupon);
    setDetailModalOpen(true);
  };

  const handleModalClose = () => {
    if (formData.code || formData.discount || formData.expiryDate) {
      showConfirmDialog(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to close?',
        'Yes, close'
      ).then((result) => {
        if (result.isConfirmed) {
          setModalOpen(false);
          setEditingCoupon(null);
          setFormData({ code: "", discount: "", expiryDate: "", usageLimit: "", status: "active" });
        }
      });
    } else {
      setModalOpen(false);
      setEditingCoupon(null);
      setFormData({ code: "", discount: "", expiryDate: "", usageLimit: "", status: "active" });
    }
  };

  // Search only by coupon code
  const filteredCoupons = coupons.filter(
    (c) => c.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 text-xs font-semibold rounded-full border";
    switch (status) {
      case "active":
        return <span className={`${base} bg-green-100 text-green-700 border-green-200`}>Active</span>;
      case "inactive":
        return <span className={`${base} bg-red-100 text-red-700 border-red-200`}>Inactive</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-700 border-gray-200`}>Unknown</span>;
    }
  };

  // Stats for the header - Added inactive count
  const stats = {
    total: coupons.length,
    active: coupons.filter(coupon => coupon.status === "active").length,
    inactive: coupons.filter(coupon => coupon.status === "inactive").length,
    expired: coupons.filter(coupon => new Date(coupon.expiryDate) < new Date()).length,
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
      purple: {
        bg: "bg-purple-500/10",
        bgHover: "group-hover:bg-purple-500/20",
        text: "text-purple-600"
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Coupon Management</h1>
          <p className="text-gray-600 text-lg">Manage discount coupons and promotions</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-3 px-6 py-4 bg-orange-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-orange-600 hover:scale-105 shadow-lg hover:shadow-xl mt-4 lg:mt-0"
        >
          <Plus size={20} />
          <span>Add New Coupon</span>
        </button>
      </div>

      {/* Stats Overview - Updated with Inactive Coupons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Tag} value={stats.total} label="Total Coupons" color="orange" />
        <StatCard icon={Check} value={stats.active} label="Active Coupons" color="green" />
        <StatCard icon={Ban} value={stats.inactive} label="Inactive Coupons" color="blue" />
        <StatCard icon={Calendar} value={stats.expired} label="Expired Coupons" color="red" />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-xl">
        {/* Header with Search and Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All Coupons</h2>
            <p className="text-gray-600">Manage coupon status and details</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by code..."
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

        {/* Coupons Table */}
        <div className="rounded-2xl border border-orange-100 overflow-hidden">
          <table className="min-w-full divide-y divide-orange-100">
            <thead className="bg-orange-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                  Coupon Details
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                  Usage Limit
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
                    <p className="text-gray-500 mt-2">Loading coupons...</p>
                  </td>
                </tr>
              ) : filteredCoupons.length > 0 ? (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-orange-50/30 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                          <Tag size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{coupon.code}</p>
                          <button
                            onClick={() => openDetailModal(coupon)}
                            className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1 transition-colors duration-200 mt-1"
                          >
                            <Eye size={14} />
                            View details
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Percent size={16} className="text-orange-500" />
                        <span className="text-lg font-bold text-gray-900">{coupon.discount}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-orange-500" />
                        <span className={`text-sm ${isExpired(coupon.expiryDate) ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                          {formatDate(coupon.expiryDate)}
                          {isExpired(coupon.expiryDate) && ' (Expired)'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-orange-500" />
                        <span className="text-sm text-gray-700">
                          {coupon.usageLimit || "∞"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(coupon.status || "inactive")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {coupon.status !== "active" && (
                          <button
                            onClick={() => handleActivate(coupon._id)}
                            className="p-2 bg-green-500/10 text-green-600 rounded-xl border border-green-200 hover:bg-green-500/20 hover:scale-105 transition-all duration-200"
                            title="Activate"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        {coupon.status === "active" && (
                          <button
                            onClick={() => handleDeactivate(coupon._id)}
                            className="p-2 bg-red-500/10 text-red-600 rounded-xl border border-red-200 hover:bg-red-500/20 hover:scale-105 transition-all duration-200"
                            title="Deactivate"
                          >
                            <X size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(coupon)}
                          className="p-2 bg-orange-500/10 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-500/20 hover:scale-105 transition-all duration-200"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
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
                      <Tag className="text-gray-300" size={48} />
                      <p className="text-gray-500 text-lg">No coupons found</p>
                      <p className="text-gray-400 text-sm">
                        {searchTerm ? "Try adjusting your search terms" : "No coupons created yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl border border-orange-100 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
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
                  <label className="block text-gray-700 font-medium mb-3">Coupon Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full p-4 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300"
                    placeholder="e.g., SUMMER25"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Discount (%) *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full p-4 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300"
                    placeholder="e.g., 25"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Expiry Date *</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full p-4 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full p-4 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300"
                    placeholder="Leave empty for unlimited"
                  />
                  <p className="text-sm text-gray-500 mt-2">Leave empty for unlimited usage</p>
                </div>
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
                </select>
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
                  {editingCoupon ? "Update Coupon" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {detailModalOpen && selectedCoupon && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl border border-orange-100 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Coupon Details</h2>
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
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white">
                  <Tag size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedCoupon.code}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-600">
                      {getStatusBadge(selectedCoupon.status)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Created: {formatDate(selectedCoupon.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coupon Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h5 className="font-semibold text-blue-900 mb-2">Discount Information</h5>
                  <div className="flex items-center gap-2 mb-2">
                    <Percent size={16} className="text-blue-600" />
                    <span className="text-2xl font-bold text-blue-700">{selectedCoupon.discount}% OFF</span>
                  </div>
                  <p className="text-sm text-blue-600">Applies to eligible services</p>
                </div>

                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <h5 className="font-semibold text-green-900 mb-2">Usage Information</h5>
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={16} className="text-green-600" />
                    <span className="text-lg font-semibold text-green-700">
                      {selectedCoupon.usageLimit || "Unlimited"} uses
                    </span>
                  </div>
                  <p className="text-sm text-green-600">
                    {selectedCoupon.usageLimit ? 'Limited usage coupon' : 'Unlimited usage coupon'}
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <h5 className="font-semibold text-purple-900 mb-2">Validity Period</h5>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={16} className="text-purple-600" />
                    <span className={`text-lg font-semibold ${isExpired(selectedCoupon.expiryDate) ? 'text-red-600' : 'text-purple-700'}`}>
                      {formatDate(selectedCoupon.expiryDate)}
                    </span>
                  </div>
                  <p className={`text-sm ${isExpired(selectedCoupon.expiryDate) ? 'text-red-600 font-semibold' : 'text-purple-600'}`}>
                    {isExpired(selectedCoupon.expiryDate) ? 'This coupon has expired' : 'Valid until expiry date'}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-2">Status Information</h5>
                  <p className="text-sm text-gray-700 mb-2">
                    This coupon is currently <span className="font-semibold">{selectedCoupon.status}</span> and 
                    {selectedCoupon.status === 'active' ? ' can be used by customers.' : ' is not available for use.'}
                  </p>
                  {selectedCoupon.updatedAt && (
                    <p className="text-xs text-gray-500">
                      Last updated: {formatDate(selectedCoupon.updatedAt)}
                    </p>
                  )}
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
                    openEditModal(selectedCoupon);
                  }}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-orange-600 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Edit Coupon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoupons;