"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import {
  Check, X, Trash, Plus, Search, Filter, Download,
  Tag, Calendar, Users, Percent, Edit, Eye, Ban, Clock, MessageSquare
} from "lucide-react";
import Swal from 'sweetalert2';

// --- Utility Components ---

const StatCard = ({ icon: Icon, value, label, color = "primary" }) => {
  // Use DaisyUI color-based classes
  const colorClasses = {
    primary: {
      bg: "bg-primary/10",
      bgHover: "group-hover:bg-primary/20",
      text: "text-primary"
    },
    success: {
      bg: "bg-success/10",
      bgHover: "group-hover:bg-success/20",
      text: "text-success"
    },
    error: {
      bg: "bg-error/10",
      bgHover: "group-hover:bg-error/20",
      text: "text-error"
    },
    info: {
      bg: "bg-info/10",
      bgHover: "group-hover:bg-info/20",
      text: "text-info"
    }
  };

  // Map requested colors to DaisyUI context
  const mappedColor = {
    orange: 'primary',
    green: 'success',
    red: 'error',
    blue: 'info',
  }[color] || 'primary';

  const classes = colorClasses[mappedColor];

  return (
    // Corrected background for StatCard to bg-base-100 for contrast against bg-base-200 page background
    <div className="bg-base-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-xl ${classes.bg} ${classes.bgHover} transition-colors duration-300`}>
          <Icon className={classes.text} size={20} />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-base-content mb-1">{value}</p>
      <p className="text-base-content/70 text-xs sm:text-sm font-medium">{label}</p>
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
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
};

const getStatusBadge = (status) => {
  const base = "px-2 sm:px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap";
  switch (status) {
    case "active":
      return <span className={`${base} bg-success/10 text-success border-success/30`}>Active</span>;
    case "inactive":
      return <span className={`${base} bg-error/10 text-error border-error/30`}>Inactive</span>;
    default:
      return <span className={`${base} bg-base-300/50 text-base-content/70 border-base-300`}>Unknown</span>;
  }
};

// --- Main Component ---

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

  // --- Swal Utility Functions (Updated to use CSS variables for theme) ---

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

  // --- API/Data Logic (Kept the same) ---

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
      <div className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-start gap-3 mb-3 border-b border-base-300 pb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/80 to-primary rounded-lg flex items-center justify-center text-primary-content font-bold text-sm flex-shrink-0">
            <Tag size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base-content truncate">{coupon.code || 'N/A'}</p>
            {/* Fixed hardcoded text-orange-400 to text-primary */}
            <p className="text-xs text-primary truncate flex items-center gap-1"><Percent size={12} className="text-primary" />{coupon.discount}% Discount</p>
            <p className={`text-xs truncate flex items-center gap-1 ${expired ? 'text-error' : 'text-base-content/80'}`}>
              <Calendar size={12} className={expired ? 'text-error' : 'text-base-content/60'} />
              {formatDateShort(coupon.expiryDate)} {expired && '(Expired)'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge(coupon.status)}
            <span className="text-xs text-base-content/80 flex items-center gap-1"><Users size={12} />{coupon.usageLimit > 0 ? `${coupon.usageLimit} uses` : "Unlimited"}</span>
          </div>
          <div className="flex gap-2">
            {coupon.status === "inactive" && (
              <button
                onClick={() => handleUpdateStatus(coupon._id, "active")}
                className="p-2 bg-success/10 text-success rounded-lg border border-success/30 hover:bg-success/20 transition-colors"
                title="Activate"
              >
                <Check size={16} />
              </button>
            )}
            {coupon.status === "active" && (
              <button
                onClick={() => handleUpdateStatus(coupon._id, "inactive")}
                className="p-2 bg-error/10 text-error rounded-lg border border-error/30 hover:bg-error/20 transition-colors"
                title="Deactivate"
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={() => openEditModal(coupon)}
              className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/30 hover:bg-primary/20 transition-colors"
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDelete(coupon._id)}
              className="p-2 bg-error/10 text-error rounded-lg border border-error/30 hover:bg-error/20 transition-colors"
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
    // Fixed hardcoded text-orange-500 to text-primary
    <div className="flex items-center justify-center h-screen w-full bg-base-200">
      <span className="loading loading-bars loading-xl text-primary"></span>
    </div>
  );

  return (
    // Fixed page background to bg-base-200
    <div className="min-h-screen w-full p-3 sm:p-4 lg:p-6 mx-auto bg-base-200">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-1 sm:mb-2">Coupon Management</h1>
          <p className="text-base-content/70 text-sm sm:text-base lg:text-lg">Manage discount coupons and promotions</p>
        </div>
        <button
          onClick={() => { setEditingCoupon(null); setFormData({ code: "", discount: "", expiryDate: "", usageLimit: "", status: "active" }); setModalOpen(true); }}
          className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 lg:py-4 bg-primary text-primary-content rounded-xl font-semibold transition-all duration-300 hover:bg-secondary hover:scale-[1.02] shadow-lg hover:shadow-xl mt-4 lg:mt-0 text-sm sm:text-base"
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

      {/* Fixed main content card background to bg-base-100 for contrast */}
      <div className="bg-base-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-base-300 shadow-xl">
        <div className="flex flex-col md:flex-row gap-3 w-full mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={18} />
            {/* Input background changed to bg-base-200 for better contrast on bg-base-100 card */}
            <input
              type="text"
              placeholder="Search by code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 sm:py-3 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary/50 w-full text-sm text-base-content focus:outline-none"
            />
          </div>
          {/* Select background changed to bg-base-200 for better contrast on bg-base-100 card */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 sm:px-4 py-2.5 sm:py-3 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary/50 text-sm text-base-content focus:outline-none w-full md:w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={() => showSuccessAlert('Coming Soon!', 'Download functionality will be implemented soon.')}
            // Button background changed to bg-base-200 for contrast on bg-base-100 card
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-base-200 text-primary rounded-xl border border-base-300 hover:bg-base-300/50 transition-colors duration-200 text-sm justify-center w-full md:w-auto"
            title="Export Data"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        <div className="block xl:hidden space-y-4">
          {filteredCoupons.length > 0 ? filteredCoupons.map(c => <CouponMobileCard key={c._id} coupon={c} />) : <div className="text-center py-12"><MessageSquare size={48} className="mx-auto text-base-content/30" /><p className="text-base-content/70">No coupons found</p></div>}
        </div>

        <div className="hidden xl:block rounded-2xl border border-base-300 overflow-x-auto">
          <table className="min-w-full divide-y divide-base-300">
            {/* Table header background changed to bg-base-200 for contrast */}
            <thead className="bg-base-300">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Coupon Code</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Discount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Expiry Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Usage Limit</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-base-content">Actions</th>
              </tr>
            </thead>
            {/* Table body background changed to bg-base-100 for contrast */}
            <tbody className="bg-base-100 divide-y divide-base-300">
              {filteredCoupons.length > 0 ? (
                filteredCoupons.map((coupon) => {
                  const expired = isExpired(coupon.expiryDate);
                  return (
                    <tr key={coupon._id} className="hover:bg-base-200 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-content font-bold text-sm flex-shrink-0">
                            <Tag size={16} />
                          </div>
                          <div>
                            <p className="font-semibold text-base-content text-sm">{coupon.code}</p>
                            <button
                              onClick={() => openDetailModal(coupon)}
                              className="text-primary hover:text-secondary text-xs font-medium flex items-center gap-1 transition-colors duration-200 mt-1"
                            >
                              <Eye size={12} />
                              View details
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Percent size={14} className="text-primary flex-shrink-0" />
                          <span className="text-sm sm:text-lg font-bold text-base-content">{coupon.discount}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-primary flex-shrink-0" />
                          <span className={`text-sm ${expired ? 'text-error font-semibold' : 'text-base-content/80'}`}>
                            {formatDate(coupon.expiryDate)}
                            {expired && ' (Expired)'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-primary flex-shrink-0" />
                          <span className="text-sm text-base-content/80">
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
                              className="p-2 bg-success/10 text-success rounded-xl border border-success/30 hover:bg-success/20 hover:scale-105 transition-all duration-200"
                              title="Activate"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          {coupon.status === "active" && (
                            <button
                              onClick={() => handleUpdateStatus(coupon._id, "inactive")}
                              className="p-2 bg-error/10 text-error rounded-xl border border-error/30 hover:bg-error/20 hover:scale-105 transition-all duration-200"
                              title="Deactivate"
                            >
                              <X size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => openEditModal(coupon)}
                            className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/30 hover:bg-primary/20 hover:scale-105 transition-all duration-200"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon._id)}
                            className="p-2 bg-error/10 text-error rounded-xl border border-error/30 hover:bg-error/20 hover:scale-105 transition-all duration-200"
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
                      <Tag className="text-base-content/30" size={48} />
                      <p className="text-base-content/70 text-lg">No coupons found</p>
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
          <div className="bg-base-100 rounded-3xl p-6 sm:p-8 w-full max-w-2xl border border-base-300 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-base-content">
                {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
              </h2>
              <button
                onClick={handleModalClose}
                className="p-2 bg-base-300/50 text-base-content rounded-xl border border-base-300 hover:bg-base-300 transition-colors duration-200"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-base-content/90 font-medium mb-2 sm:mb-3 text-sm">Coupon Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full p-3 sm:p-4 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary/50 focus:outline-none transition-all duration-300 text-sm text-base-content"
                    placeholder="e.g., SUMMER25"
                    required
                  />
                </div>
                <div>
                  <label className="block text-base-content/90 font-medium mb-2 sm:mb-3 text-sm">Discount (%) *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full p-3 sm:p-4 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary/50 focus:outline-none transition-all duration-300 text-sm text-base-content"
                    placeholder="e.g., 25"
                    required
                  />
                </div>
                <div>
                  <label className="block text-base-content/90 font-medium mb-2 sm:mb-3 text-sm">Expiry Date *</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full p-3 sm:p-4 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary/50 focus:outline-none transition-all duration-300 text-sm text-base-content"
                    required
                  />
                </div>
                <div>
                  <label className="block text-base-content/90 font-medium mb-2 sm:mb-3 text-sm">Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full p-3 sm:p-4 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary/50 focus:outline-none transition-all duration-300 text-sm text-base-content"
                    placeholder="Leave empty for unlimited"
                  />
                  <p className="text-xs text-base-content/60 mt-2">Leave empty for unlimited usage</p>
                </div>
              </div>
              <div>
                <label className="block text-base-content/90 font-medium mb-2 sm:mb-3 text-sm">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-3 sm:p-4 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary/50 focus:outline-none transition-all duration-300 text-sm text-base-content"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-base-200 text-base-content rounded-xl font-semibold border border-base-300 hover:bg-base-300 transition-all duration-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-content rounded-xl font-semibold transition-all duration-300 hover:bg-secondary hover:scale-[1.02] shadow-lg hover:shadow-xl text-sm"
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
          <div className="bg-base-100 rounded-3xl p-6 sm:p-8 w-full max-w-4xl border border-base-300 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-base-content">Coupon Details</h2>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-2 bg-base-300/50 text-base-content rounded-xl border border-base-300 hover:bg-base-300 transition-colors duration-200"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-primary/10 rounded-xl border border-primary/30">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-content font-bold text-lg flex-shrink-0">
                  <Tag size={20} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-base-content">{selectedCoupon.code}</h3>
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span className="text-sm text-base-content/80">
                      {getStatusBadge(selectedCoupon.status)}
                    </span>
                    <span className="text-sm text-base-content/60 flex items-center gap-1">
                      <Clock size={12} />
                      Created: {formatDate(selectedCoupon.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-4 bg-info/10 rounded-xl border border-info/30">
                  {/* Fixed h5 text color to info-content */}
                  <h5 className="font-semibold text-info mb-2">Discount Information</h5>
                  <div className="space-y-2 text-sm">
                    {/* Used text-info for icon/span color, info-content for surrounding text */}
                    <p className="text-base-content/90 flex items-center gap-2">
                      <Percent size={16} className='text-info' /><strong>Percentage:</strong> <span className="text-lg font-bold text-info">{selectedCoupon.discount}% OFF</span>
                    </p>
                    <p className="text-base-content/90"><strong>Minimum Purchase:</strong> N/A (Field not in schema)</p>
                    <p className="text-base-content/90"><strong>Applicable Products:</strong> All (Placeholder)</p>
                  </div>
                </div>

                <div className="p-4 bg-success/10 rounded-xl border border-success/30">
                  {/* Fixed h5 text color to success-content */}
                  <h5 className="font-semibold text-success mb-2">Usage Information</h5>
                  <div className="space-y-2 text-sm">
                    <p className="text-base-content/90 flex items-center gap-2">
                      <Users size={16} className='text-success' /><strong>Usage Limit:</strong> {selectedCoupon.usageLimit && selectedCoupon.usageLimit > 0 ? selectedCoupon.usageLimit : "Unlimited"}
                    </p>
                    <p className="text-base-content/90"><strong>Times Used:</strong> N/A (Placeholder)</p>
                  </div>
                </div>

                {/* Changed to bg-info/10 for better visual grouping with Discount Info */}
                <div className="p-4 bg-info/10 rounded-xl border border-info/30">
                  <h5 className="font-semibold text-info mb-2">Validity Period</h5>
                  <div className="space-y-2 text-sm">
                    <p className="text-base-content/90 flex items-center gap-2">
                      <Calendar size={16} className='text-primary' /><strong>Expiry Date:</strong> <span className={`${isExpired(selectedCoupon.expiryDate) ? 'text-error font-semibold' : 'text-base-content/90'}`}>{formatDate(selectedCoupon.expiryDate)}</span>
                    </p>
                    <p className="text-base-content/90">
                      <strong>Status:</strong> {isExpired(selectedCoupon.expiryDate) ? <span className="text-error font-semibold">Expired</span> : <span className="text-success font-semibold">Valid</span>}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-base-200 rounded-xl border border-base-300">
                  <h5 className="font-semibold text-base-content mb-2">Management Status</h5>
                  <div className="space-y-2 text-sm">
                    <p className="text-base-content/90 flex items-center gap-2"><strong>Current Status:</strong> {getStatusBadge(selectedCoupon.status)}</p>
                    <p className="text-base-content/90"><strong>Last Updated:</strong> {selectedCoupon.updatedAt ? formatDate(selectedCoupon.updatedAt) : 'N/A'}</p>
                    <p className="text-base-content/70 italic mt-2">
                      {selectedCoupon.status === 'active' ? 'Coupon is live and available for use.' : 'Coupon is currently deactivated.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setDetailModalOpen(false)}
                  // Changed button background to bg-base-200 for better contrast on base-100 modal
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-base-200 text-base-content rounded-xl font-semibold border border-base-300 hover:bg-base-300 transition-all duration-300 text-sm"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setDetailModalOpen(false);
                    openEditModal(selectedCoupon);
                  }}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-content rounded-xl font-semibold transition-all duration-300 hover:bg-secondary shadow-lg text-sm"
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