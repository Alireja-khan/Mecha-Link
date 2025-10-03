"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import {
  Check, X, Trash, Plus, Search, Filter, Download,
  Tag, Calendar, Users, Percent, Edit, Eye, Ban, Clock, MessageSquare
} from "lucide-react";
import Swal from 'sweetalert2';

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
    blue: {
      bg: "bg-blue-500/10",
      bgHover: "group-hover:bg-blue-500/20",
      text: "text-blue-600"
    }
  };

  const classes = colorClasses[color] || colorClasses.orange;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-xl ${classes.bg} ${classes.bgHover} transition-colors duration-300`}>
          <Icon className={classes.text} size={20} />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-gray-600 text-xs sm:text-sm font-medium">{label}</p>
    </div>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDateShort = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

const isExpired = (expiryDate) => {
  return new Date(expiryDate) < new Date();
};


const ManageCoupons = () => {
  const { user: loggedInUser, loading: userLoading } = useUser();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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

  const handleUpdateStatus = async (id, newStatus) => {
    const action = newStatus === 'active' ? 'Activate' : 'Deactivate';
    try {
      showLoadingAlert(`${action}ing...`, `Please wait while we ${action.toLowerCase()} the coupon`);

      const response = await fetch(`/api/coupons/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error(`Failed to ${action.toLowerCase()}`);

      Swal.close();
      await fetchCoupons();
      showSuccessAlert(`${action}d!`, `The coupon has been ${action.toLowerCase()}d successfully`);
    } catch (error) {
      console.error(`${action} failed:`, error);
      Swal.close();
      showErrorAlert('Error', `Failed to ${action.toLowerCase()} coupon`);
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

      let response;
      if (editingCoupon) {
        response = await fetch(`/api/coupons/${editingCoupon._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to update');
      } else {
        response = await fetch(`/api/coupons`, {
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

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    const expiryDateFormatted = coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : "";

    setFormData({
      code: coupon.code,
      discount: coupon.discount.toString(),
      expiryDate: expiryDateFormatted,
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
    setModalOpen(false);
    setEditingCoupon(null);
    setFormData({ code: "", discount: "", expiryDate: "", usageLimit: "", status: "active" });
  };

  const getStatusBadge = (status) => {
    const base = "px-2 sm:px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap";
    switch (status) {
      case "active":
        return <span className={`${base} bg-green-100 text-green-700 border-green-200`}>Active</span>;
      case "inactive":
        return <span className={`${base} bg-red-100 text-red-700 border-red-200`}>Inactive</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-700 border-gray-200`}>Unknown</span>;
    }
  };

  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch = c.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: coupons.length,
    active: coupons.filter(coupon => coupon.status === "active").length,
    inactive: coupons.filter(coupon => coupon.status === "inactive").length,
    expired: coupons.filter(coupon => isExpired(coupon.expiryDate)).length,
  };

  const CouponMobileCard = ({ coupon }) => {
    const expired = isExpired(coupon.expiryDate);
    return (
      <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-start gap-3 mb-3 border-b border-gray-100 pb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            <Tag size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{coupon.code || 'N/A'}</p>
            <p className="text-xs text-orange-600 truncate flex items-center gap-1"><Percent size={12} className="text-orange-400" />{coupon.discount}% Discount</p>
            <p className={`text-xs truncate flex items-center gap-1 ${expired ? 'text-red-600' : 'text-gray-600'}`}>
              <Calendar size={12} className={expired ? 'text-red-400' : 'text-gray-400'} />
              {formatDateShort(coupon.expiryDate)} {expired && '(Expired)'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge(coupon.status)}
            <span className="text-xs text-gray-500 flex items-center gap-1"><Users size={12} />{coupon.usageLimit > 0 ? `${coupon.usageLimit} uses` : "Unlimited"}</span>
          </div>
          <div className="flex gap-2">
            {coupon.status === "inactive" && (
              <button
                onClick={() => handleUpdateStatus(coupon._id, "active")}
                className="p-2 bg-green-500/10 text-green-600 rounded-lg border border-green-200 hover:bg-green-500/20 transition-colors"
                title="Activate"
              >
                <Check size={16} />
              </button>
            )}
            {coupon.status === "active" && (
              <button
                onClick={() => handleUpdateStatus(coupon._id, "inactive")}
                className="p-2 bg-red-500/10 text-red-600 rounded-lg border border-red-200 hover:bg-red-500/20 transition-colors"
                title="Deactivate"
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={() => openEditModal(coupon)}
              className="p-2 bg-orange-500/10 text-orange-600 rounded-lg border border-orange-200 hover:bg-orange-500/20 transition-colors"
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDelete(coupon._id)}
              className="p-2 bg-red-500/10 text-red-600 rounded-lg border border-red-200 hover:bg-red-500/20 transition-colors"
              title="Delete"
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading || userLoading) return (
    <div className="flex items-center justify-center h-screen w-full">
      <span className="loading loading-bars loading-xl text-orange-500"></span>
    </div>
  );

  return (
    <div className="min-h-screen w-full p-3 sm:p-4 lg:p-6 mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Coupon Management</h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Manage discount coupons and promotions</p>
        </div>
        <button
          onClick={() => { setEditingCoupon(null); setFormData({ code: "", discount: "", expiryDate: "", usageLimit: "", status: "active" }); setModalOpen(true); }}
          className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 lg:py-4 bg-orange-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-orange-600 hover:scale-[1.02] shadow-lg hover:shadow-xl mt-4 lg:mt-0 text-sm sm:text-base"
        >
          <Plus size={20} />
          <span>Add New Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <StatCard icon={Tag} value={stats.total} label="Total Coupons" color="orange" />
        <StatCard icon={Check} value={stats.active} label="Active Coupons" color="green" />
        <StatCard icon={Ban} value={stats.inactive} label="Inactive Coupons" color="blue" />
        <StatCard icon={Calendar} value={stats.expired} label="Expired Coupons" color="red" />
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-orange-100 shadow-xl">
        <div className="flex flex-col md:flex-row gap-3 w-full mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 sm:py-3 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 w-full text-sm focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 sm:px-4 py-2.5 sm:py-3 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 text-sm focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={() => showSuccessAlert('Coming Soon!', 'Download functionality will be implemented soon.')}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-orange-50 text-orange-700 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200 text-sm justify-center"
            title="Export Data"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        <div className="block xl:hidden space-y-4">
          {filteredCoupons.length > 0 ? filteredCoupons.map(c => <CouponMobileCard key={c._id} coupon={c} />) : <div className="text-center py-12"><MessageSquare size={48} className="mx-auto text-gray-300" /><p className="text-gray-500">No coupons found</p></div>}
        </div>

        <div className="hidden xl:block rounded-2xl border border-orange-100 overflow-x-auto">
          <table className="min-w-full divide-y divide-orange-100">
            <thead className="bg-orange-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">Coupon Code</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">Discount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">Expiry Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">Usage Limit</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-orange-900">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-orange-100">
              {filteredCoupons.length > 0 ? (
                filteredCoupons.map((coupon) => {
                  const expired = isExpired(coupon.expiryDate);
                  return (
                    <tr key={coupon._id} className="hover:bg-orange-50/30 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            <Tag size={16} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{coupon.code}</p>
                            <button
                              onClick={() => openDetailModal(coupon)}
                              className="text-orange-500 hover:text-orange-600 text-xs font-medium flex items-center gap-1 transition-colors duration-200 mt-1"
                            >
                              <Eye size={12} />
                              View details
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Percent size={14} className="text-orange-500 flex-shrink-0" />
                          <span className="text-sm sm:text-lg font-bold text-gray-900">{coupon.discount}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-orange-500 flex-shrink-0" />
                          <span className={`text-sm ${expired ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                            {formatDate(coupon.expiryDate)}
                            {expired && ' (Expired)'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-orange-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            {coupon.usageLimit && coupon.usageLimit > 0 ? coupon.usageLimit : "Unlimited"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(coupon.status || "inactive")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                          {coupon.status !== "active" && (
                            <button
                              onClick={() => handleUpdateStatus(coupon._id, "active")}
                              className="p-2 bg-green-500/10 text-green-600 rounded-xl border border-green-200 hover:bg-green-500/20 hover:scale-105 transition-all duration-200"
                              title="Activate"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          {coupon.status === "active" && (
                            <button
                              onClick={() => handleUpdateStatus(coupon._id, "inactive")}
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <Tag className="text-gray-300" size={48} />
                      <p className="text-gray-500 text-lg">No coupons found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl border border-orange-100 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
              </h2>
              <button
                onClick={handleModalClose}
                className="p-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 sm:mb-3 text-sm">Coupon Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full p-3 sm:p-4 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300 text-sm"
                    placeholder="e.g., SUMMER25"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 sm:mb-3 text-sm">Discount (%) *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full p-3 sm:p-4 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300 text-sm"
                    placeholder="e.g., 25"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 sm:mb-3 text-sm">Expiry Date *</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full p-3 sm:p-4 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 sm:mb-3 text-sm">Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full p-3 sm:p-4 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300 text-sm"
                    placeholder="Leave empty for unlimited"
                  />
                  <p className="text-xs text-gray-500 mt-2">Leave empty for unlimited usage</p>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2 sm:mb-3 text-sm">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-3 sm:p-4 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-gray-700 rounded-xl font-semibold border border-orange-200 hover:bg-orange-50 transition-all duration-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-orange-600 hover:scale-[1.02] shadow-lg hover:shadow-xl text-sm"
                >
                  {editingCoupon ? "Update Coupon" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {detailModalOpen && selectedCoupon && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-4xl border border-orange-100 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Coupon Details</h2>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  <Tag size={20} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{selectedCoupon.code}</h3>
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span className="text-sm text-gray-600">
                      {getStatusBadge(selectedCoupon.status)}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      Created: {formatDate(selectedCoupon.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h5 className="font-semibold text-blue-900 mb-2">Discount Information</h5>
                  <div className="space-y-2 text-sm">
                    <p className="text-blue-700 flex items-center gap-2">
                      <Percent size={16} /><strong>Percentage:</strong> <span className="text-lg font-bold">{selectedCoupon.discount}% OFF</span>
                    </p>
                    <p className="text-blue-700"><strong>Minimum Purchase:</strong> N/A (Field not in schema)</p>
                    <p className="text-blue-700"><strong>Applicable Products:</strong> All (Placeholder)</p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <h5 className="font-semibold text-green-900 mb-2">Usage Information</h5>
                  <div className="space-y-2 text-sm">
                    <p className="text-green-700 flex items-center gap-2">
                      <Users size={16} /><strong>Usage Limit:</strong> {selectedCoupon.usageLimit && selectedCoupon.usageLimit > 0 ? selectedCoupon.usageLimit : "Unlimited"}
                    </p>
                    <p className="text-green-700"><strong>Times Used:</strong> N/A (Placeholder)</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <h5 className="font-semibold text-purple-900 mb-2">Validity Period</h5>
                  <div className="space-y-2 text-sm">
                    <p className="text-purple-700 flex items-center gap-2">
                      <Calendar size={16} /><strong>Expiry Date:</strong> <span className={`${isExpired(selectedCoupon.expiryDate) ? 'text-red-600 font-semibold' : 'text-purple-700'}`}>{formatDate(selectedCoupon.expiryDate)}</span>
                    </p>
                    <p className="text-purple-700">
                      <strong>Status:</strong> {isExpired(selectedCoupon.expiryDate) ? <span className="text-red-600 font-semibold">Expired</span> : <span className="text-purple-700">Valid</span>}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-2">Management Status</h5>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700"><strong>Current Status:</strong> {getStatusBadge(selectedCoupon.status)}</p>
                    <p className="text-gray-700"><strong>Last Updated:</strong> {selectedCoupon.updatedAt ? formatDate(selectedCoupon.updatedAt) : 'N/A'}</p>
                    <p className="text-gray-600 italic mt-2">
                      {selectedCoupon.status === 'active' ? 'Coupon is live and available for use.' : 'Coupon is currently deactivated.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-gray-700 rounded-xl font-semibold border border-orange-200 hover:bg-orange-50 transition-all duration-300 text-sm"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setDetailModalOpen(false);
                    openEditModal(selectedCoupon);
                  }}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-orange-600 shadow-lg text-sm"
                >
                  <Edit size={16} className="inline mr-2" />Edit Coupon
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