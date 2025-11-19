"use client";

import React, {useEffect, useState} from "react";
import useUser from "@/hooks/useUser";
import {
  Check,
  X,
  Search,
  Filter,
  Download,
  Store,
  Clock,
  User,
  Mail,
  MapPin,
  Eye,
  Ban,
  MessageSquare,
  Trash2,
  Edit,
  ArrowRight,
} from "lucide-react";
import Swal from "sweetalert2";

// --- Utility Functions & Components ---

const StatCard = ({icon: Icon, value, label, color = "primary"}) => {
  const colorClasses = {
    primary: {
      bg: "bg-primary/10",
      bgHover: "group-hover:bg-primary/20",
      text: "text-primary",
    },
    success: {
      bg: "bg-success/10",
      bgHover: "group-hover:bg-success/20",
      text: "text-success",
    },
    error: {
      bg: "bg-error/10",
      bgHover: "group-hover:bg-error/20",
      text: "text-error",
    },
    warning: {
      bg: "bg-warning/10",
      bgHover: "group-hover:bg-warning/20",
      text: "text-warning",
    },
  };

  const classes = colorClasses[color] || colorClasses.primary;

  return (
    <div className="bg-base-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-neutral shadow-xl hover:shadow-2xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div
          className={`p-2 sm:p-3 rounded-xl ${classes.bg} ${classes.bgHover} transition-colors duration-300`}
        >
          <Icon className={classes.text} size={20} />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-base-content mb-1">
        {value}
      </p>
      <p className="text-base-content/70 text-xs sm:text-sm font-medium">
        {label}
      </p>
    </div>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateShort = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// --- Main Component ---

const ManageShops = () => {
  const {user: loggedInUser, loading: userLoading} = useUser();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState( 10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [shopToAction, setShopToAction] = useState(null);
  const [actionData, setActionData] = useState({
    latitude: "",
    longitude: "",
    status: "pending",
    rejectionReason: "", // Now included in state for conditional input
  });
 

  // SweetAlert2 Configuration
  const swalOptions = {
    confirmButtonColor: "var(--color-success)",
    background: "var(--color-base-100,)",
    color: "var(--color-base-content)",
    cancelButtonColor: "var(--color-error)",
  };

  const showSuccessAlert = (title, message) => {
    Swal.fire({
      ...swalOptions,
      title: title,
      text: message,
      icon: "success",
      iconColor: "var(--color-success)",
    });
  };

  const showErrorAlert = (title, message) => {
    Swal.fire({
      ...swalOptions,
      title: title,
      text: message,
      icon: "error",
      iconColor: "var(--color-error)",
    });
  };

  const showConfirmDialog = (
    title,
    text,
    confirmButtonText = "Yes, proceed"
  ) => {
    return Swal.fire({
      ...swalOptions,
      title: title,
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: "Cancel",
      reverseButtons: true,
      iconColor: "var(--color-warning)",
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




// Reset page only on search or status change
useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, statusFilter]);
  // --- Data Fetching with API Pagination ---
  const fetchShops = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        admin: "true",
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
        status: statusFilter,
      });
      const res = await fetch(`/api/shops?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch shops");
      const data = await res.json();
      setShops(data.result || []);
      setTotalPages(data.pagination.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch shops:", err);
      showErrorAlert("Error", "Failed to load shops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops(currentPage);
  }, [currentPage, searchTerm, itemsPerPage, statusFilter]);

  useEffect(() => setCurrentPage(1), [searchTerm, statusFilter]);

  const getVisiblePages = (totalPages, currentPage) => {
    if (totalPages <= 7)
      return Array.from({length: totalPages}, (_, i) => i + 1);

    const pages = new Set();

    pages.add(1);
    pages.add(totalPages);

    for (let i = -range; i <= range; i++) {
      const pageNum = currentPage + i;
      if (pageNum > 1 && pageNum < totalPages) pages.add(pageNum);
    }

    const sortedPages = Array.from(pages).sort((a, b) => a - b);
    const result = [];
    let lastPage = 0;

    for (const page of sortedPages) {
      if (page > lastPage + 1) result.push("...");
      result.push(page);
      lastPage = page;
    }

    return result;
  };

  const visiblePages = getVisiblePages(totalPages, currentPage);

  // --- Action Handlers & Modals ---

  const openActionModal = (shop) => {
    setShopToAction(shop);
    setActionData({
      latitude: shop.shop?.location?.latitude || "",
      longitude: shop.shop?.location?.longitude || "",
      status: shop.status || "pending",
      rejectionReason: shop.rejectionReason || "",
    });
    setActionModalOpen(true);
  };

  const handleActionSubmit = async () => {
    // Validate required fields - only require location when approving
    if (
      actionData.status === "approved" &&
      (!actionData.latitude || !actionData.longitude)
    ) {
      showErrorAlert(
        "Validation Error",
        "Please provide both latitude and longitude for approval"
      );
      return;
    }

    // Validate numeric values only if provided
    let lat, lng;
    if (actionData.latitude && actionData.longitude) {
      lat = parseFloat(actionData.latitude);
      lng = parseFloat(actionData.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        showErrorAlert(
          "Validation Error",
          "Latitude and longitude must be valid numbers"
        );
        return;
      }

      if (lat < -90 || lat > 90) {
        showErrorAlert(
          "Validation Error",
          "Latitude must be between -90 and 90"
        );
        return;
      }

      if (lng < -180 || lng > 180) {
        showErrorAlert(
          "Validation Error",
          "Longitude must be between -180 and 180"
        );
        return;
      }
    }

    const result = await showConfirmDialog(
      "Update Shop Status",
      `Are you sure you want to update this shop status to ${
        actionData.status
      }${actionData.status === "approved" ? " and set the location" : ""}?`,
      "Yes, Update"
    );

    if (result.isConfirmed) {
      try {
        showLoadingAlert("Updating...", "Please wait while we update the shop");

        const updateData = {
          status: actionData.status,
        };

        // Only include location data if coordinates are provided
        if (actionData.latitude && actionData.longitude) {
          updateData.location = {
            latitude: lat,
            longitude: lng,
          };
        }

        // Add rejection reason for rejected status
        if (actionData.status === "rejected") {
          updateData.rejectionReason = "Status updated via admin panel";
        }

        const response = await fetch(`/api/shops/${shopToAction._id}/status`, {
          method: "PATCH",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(updateData),
        });

        if (!response.ok) throw new Error("Failed to update shop");

        Swal.close();
        setActionModalOpen(false);
        setActionData({latitude: "", longitude: "", status: "pending"});
        setShopToAction(null);

        // Update the selected shop status if the detail modal is open
        if (selectedShop?._id === shopToAction._id) {
          setSelectedShop((prev) => ({
            ...prev,
            status: actionData.status,
            shop: {
              ...prev.shop,
              location:
                actionData.latitude && actionData.longitude
                  ? {
                      latitude: lat,
                      longitude: lng,
                    }
                  : prev.shop?.location,
            },
          }));
        }

        await fetchShops();
        showSuccessAlert(
          "Updated!",
          `Shop has been ${actionData.status} successfully`
        );
      } catch (error) {
        console.error("Update failed:", error);
        Swal.close();
        showErrorAlert("Error", "Failed to update shop");
      }
    }
  };

  const handleDeleteShop = async (shop) => {
    const result = await showConfirmDialog(
      "Delete Shop",
      `Are you sure you want to delete "${shop.shop?.shopName}"? This action cannot be undone.`,
      "Yes, Delete"
    );

    if (result.isConfirmed) {
      try {
        showLoadingAlert("Deleting...", "Please wait while we delete the shop");

        const response = await fetch(`/api/shops/${shop._id}`, {
          method: "DELETE",
          headers: {"Content-Type": "application/json"},
        });

        if (!response.ok) throw new Error("Failed to delete shop");

        Swal.close();

        if (selectedShop?._id === shop._id) {
          setDetailModalOpen(false);
          setSelectedShop(null);
        }
        if (shopToAction?._id === shop._id) {
          setActionModalOpen(false);
          setShopToAction(null);
        }

        await fetchShops();
        showSuccessAlert("Deleted!", "Shop has been deleted successfully");
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.close();
        showErrorAlert("Error", "Failed to delete shop");
      }
    }
  };

  const openDetailModal = (shop) => {
    setSelectedShop(shop);
    setDetailModalOpen(true);
  };

  

  // --- Filtering & Utility ---

  const filteredShops = shops.filter((shop) => {
    const shopDetails = shop.shop || {};

    const matchesSearch =
      shopDetails.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shopDetails.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shopDetails.ownerEmail
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shop.rejectionReason?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || shop.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const base =
      "px-2 sm:px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap";
    switch (status) {
      case "approved":
        return (
          <span
            className={`${base} bg-success/10 text-success border-success/30`}
          >
            Approved
          </span>
        );
      case "pending":
        return (
          <span
            className={`${base} bg-warning/10 text-warning border-warning/30`}
          >
            Pending
          </span>
        );
      case "rejected":
        return (
          <span className={`${base} bg-error/10 text-error border-error/30`}>
            Rejected
          </span>
        );
      default:
        return (
          <span
            className={`${base} bg-base-300 text-base-content/80 border-neutral/20`}
          >
            Unknown
          </span>
        );
    }
  };

  const stats = {
    total: shops.length,
    pending: shops.filter((shop) => shop.status === "pending").length,
    approved: shops.filter((shop) => shop.status === "approved").length,
    rejected: shops.filter((shop) => shop.status === "rejected").length,
  };

  // --- Mobile Card Component ---
  const ShopMobileCard = ({shop}) => {
    const shopDetails = shop.shop || {};
    const address = shopDetails.address || {};
    return (
      <div className="bg-base-100 p-4 rounded-xl border border-neutral/50 shadow-lg hover:shadow-xl transition-all duration-200">
        <div className="flex items-start gap-3 mb-3 border-b border-neutral/50 pb-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-content font-bold text-sm flex-shrink-0">
            {shopDetails.shopName?.charAt(0) || "S"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base-content truncate">
              {shopDetails.shopName || "Unknown Shop"}
            </p>
            <p className="text-xs text-base-content/70 truncate flex items-center gap-1">
              <User size={12} className="text-base-content/40" />
              {shopDetails.ownerName || "Unknown Owner"}
            </p>
            <p className="text-xs text-base-content/70 truncate flex items-center gap-1">
              <MapPin size={12} className="text-base-content/40" />
              {address.city || "Location N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge(shop.status)}
            <span className="text-xs text-base-content/60 flex items-center gap-1">
              <Clock size={12} />
              {formatDateShort(shop.createdAt)}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openActionModal(shop)}
              className="p-2 bg-green-500/10 text-green-600 rounded-lg border border-green-200 hover:bg-green-500/20 transition-colors"
              title={
                shop.status === "approved"
                  ? "Edit Status & Location"
                  : "Update Status & Location"
              }
            >
              {shop.status === "approved" ? (
                <Edit size={16} />
              ) : (
                <Check size={16} />
              )}
            </button>
            <button
              onClick={() => openDetailModal(shop)}
              className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/30 hover:bg-primary/20 transition-colors"
              title="View Details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => handleDeleteShop(shop)}
              className="p-2 bg-error/10 text-error rounded-lg border border-error/30 hover:bg-error/20 transition-colors"
              title="Delete Shop"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading || userLoading)
    return (
      <div className="flex items-center justify-center h-screen w-full bg-base-100">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="min-h-screen w-full p-3 sm:p-4 lg:p-6 mx-auto bg-base-200">
      {/* Header and Stats (Previous part) */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-1 sm:mb-2">
          Shop Management
        </h1>
        <p className="text-base-content/70 text-sm sm:text-base lg:text-lg">
          Manage and monitor all registered vendor shops in the platform
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <StatCard
          icon={Store}
          value={stats.total}
          label="Total Shops"
          color="primary"
        />
        <StatCard
          icon={Clock}
          value={stats.pending}
          label="Pending Approval"
          color="warning"
        />
        <StatCard
          icon={Check}
          value={stats.approved}
          label="Approved Shops"
          color="success"
        />
        <StatCard
          icon={Ban}
          value={stats.rejected}
          label="Rejected Shops"
          color="error"
        />
      </div>

      {/* Main Content (Table/Cards) (Previous part) */}
      <div className="bg-base-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-neutral shadow-2xl">
        <div className="flex flex-col md:flex-row gap-3 w-full mb-6">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40"
              size={18}
            />
            <input
              type="text"
              placeholder="Search shops, owners, cities, or rejection reasons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 sm:py-3 border border-neutral rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-primary/50 w-full text-sm focus:outline-none text-base-content"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 sm:px-4 py-2.5 sm:py-3 border border-neutral rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-primary/50 text-sm focus:outline-none text-base-content"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="block xl:hidden space-y-4">
          {filteredShops.length > 0 ? (
            filteredShops.map((s) => <ShopMobileCard key={s._id} shop={s} />)
          ) : (
            <div className="text-center py-12">
              <MessageSquare
                size={48}
                className="mx-auto text-base-content/30"
              />
              <p className="text-base-content/60">No shops found</p>
            </div>
          )}
        </div>

        <div className="hidden xl:block rounded-2xl border border-neutral overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral">
            <thead className="bg-base-300">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">
                  Shop Details
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">
                  Owner Info
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">
                  Categories
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-base-content">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-base-100 divide-y divide-neutral">
              {filteredShops.length > 0 ? (
                filteredShops.map((shop) => (
                  <tr
                    key={shop._id}
                    className="hover:bg-base-200/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-content font-bold text-sm">
                          {shop.shop?.shopName?.charAt(0) || "S"}
                        </div>
                        <div>
                          <p className="font-semibold text-base-content">
                            {shop.shop?.shopName || "N/A"}
                          </p>
                          <button
                            onClick={() => openDetailModal(shop)}
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
                          <User size={14} className="text-primary" />
                          <span className="text-sm text-base-content">
                            {shop.shop?.ownerName || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-primary" />
                          <span className="text-sm text-base-content/70">
                            {shop.shop?.ownerEmail || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(shop.shop?.categories) ? (
                          shop.shop.categories.slice(0, 2).map((cat, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-primary/10 text-primary border border-primary/30 text-xs rounded-lg whitespace-nowrap"
                            >
                              {cat}
                            </span>
                          ))
                        ) : (
                          <span className="text-base-content/70 text-sm">
                            N/A
                          </span>
                        )}
                        {Array.isArray(shop.shop?.categories) &&
                          shop.shop.categories.length > 2 && (
                            <span className="px-2 py-1 bg-base-300 text-base-content/80 text-xs rounded-lg whitespace-nowrap">
                              +{shop.shop.categories.length - 2}
                            </span>
                          )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-primary" />
                        <span className="text-sm text-base-content whitespace-nowrap">
                          {formatDateShort(shop.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(shop.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openActionModal(shop)}
                          className="p-2 bg-green-500/10 text-green-600 rounded-xl border border-green-200 hover:bg-green-500/20 hover:scale-105 transition-all duration-200"
                          title={
                            shop.status === "approved"
                              ? "Edit Status & Location"
                              : "Update Status & Location"
                          }
                        >
                          {shop.status === "approved" ? (
                            <Edit size={16} />
                          ) : (
                            <Check size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => openDetailModal(shop)}
                          className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/30 hover:bg-primary/20 hover:scale-105 transition-all duration-200"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteShop(shop)}
                          className="p-2 bg-error/10 text-error rounded-xl border border-error/30 hover:bg-error/20 hover:scale-105 transition-all duration-200"
                          title="Delete Shop"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <Store className="text-base-content/30" size={48} />
                      <p className="text-base-content/60 text-lg">
                        No shops found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          {/* Items per page selector */}
          <div className="flex items-center gap-3">
            <label className="text-base-content/70 font-medium">
              Show per page:
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-4 py-2 bg-base-100 rounded-lg border border-neutral"
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Page buttons */}
          <div className="flex flex-wrap justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-xl bg-base-100 hover:bg-base-200 disabled:opacity-50"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>

            {visiblePages.map((p, idx) =>
              p === "..." ? (
                <span key={idx} className="px-3 py-2">
                  {p}
                </span>
              ) : (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(p)}
                  className={`px-4 py-2 rounded-xl border transition-all ${
                    p === currentPage
                      ? "bg-primary text-white border-primary"
                      : "bg-base-100 border-neutral hover:bg-base-200"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-xl bg-base-100 hover:bg-base-200 disabled:opacity-50"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Shop Detail Modal (Completed) */}
      {detailModalOpen && selectedShop && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-base-content/10 z-50 p-4">
          <div className="bg-base-100 rounded-3xl p-6 sm:p-8 w-full max-w-4xl border border-neutral shadow-2xl max-h-[90vh] overflow-y-auto relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-base-content">
                Shop Details
              </h2>

              {/* Fixed X button replaced with absolute */}
              <button
                onClick={() => setDetailModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-base-200 text-base-content rounded-xl border border-neutral hover:bg-base-300 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-primary/10 rounded-xl border border-primary/30">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-content font-bold text-lg flex-shrink-0">
                  {selectedShop.shop?.shopName?.charAt(0) || "S"}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-base-content">
                    {selectedShop.shop?.shopName || "N/A"}
                  </h3>
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span className="text-sm text-base-content/70">
                      {getStatusBadge(selectedShop.status)}
                    </span>
                    <span className="text-sm text-base-content/60">
                      Created: {formatDate(selectedShop.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-4 bg-info/10 rounded-xl border border-info/30">
                  <h5 className="font-semibold text-info mb-2">
                    Shop Information
                  </h5>
                  <div className="space-y-2 text-sm text-base-content">
                    <p>
                      <strong>Name:</strong> {selectedShop.shop?.shopName}
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {selectedShop.shop?.details || "No description"}
                    </p>
                    <p>
                      <strong>Categories:</strong>{" "}
                      {Array.isArray(selectedShop.shop?.categories)
                        ? selectedShop.shop.categories.join(", ")
                        : "No categories"}
                    </p>
                    <p>
                      <strong>Mechanics:</strong>{" "}
                      {selectedShop.shop?.mechanicCount || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-success/10 rounded-xl border border-success/30">
                  <h5 className="font-semibold text-success mb-2">
                    Owner Information
                  </h5>
                  <div className="space-y-2 text-sm text-base-content">
                    <p>
                      <strong>Name:</strong>{" "}
                      {selectedShop.shop?.ownerName || "N/A"}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {selectedShop.shop?.ownerEmail || "N/A"}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {selectedShop.shop?.contact?.phone || "Not provided"}
                    </p>
                    <p>
                      <strong>Business Email:</strong>{" "}
                      {selectedShop.shop?.contact?.businessEmail ||
                        "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/30">
                  <h5 className="font-semibold text-secondary mb-2">
                    Location
                  </h5>
                  <div className="space-y-2 text-sm text-base-content">
                    <p>
                      <strong>Street:</strong>{" "}
                      {selectedShop.shop?.address?.street || "Not provided"}
                    </p>
                    <p>
                      <strong>City:</strong>{" "}
                      {selectedShop.shop?.address?.city || "Not provided"}
                    </p>
                    <p>
                      <strong>Country:</strong>{" "}
                      {selectedShop.shop?.address?.country || "Not provided"}
                    </p>
                    <p>
                      <strong>Postal Code:</strong>{" "}
                      {selectedShop.shop?.address?.postalCode || "Not provided"}
                    </p>
                    {selectedShop.shop?.location && (
                      <>
                        <p>
                          <strong>Latitude:</strong>{" "}
                          {selectedShop.shop.location.latitude || "Not set"}
                        </p>
                        <p>
                          <strong>Longitude:</strong>{" "}
                          {selectedShop.shop.location.longitude || "Not set"}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-base-200 rounded-xl border border-neutral">
                  <h5 className="font-semibold text-base-content mb-2">
                    Status Information
                  </h5>
                  <div className="space-y-2 text-sm text-base-content/90">
                    <p>Status: {getStatusBadge(selectedShop.status)}</p>
                    {selectedShop.status === "rejected" &&
                      selectedShop.rejectionReason && (
                        <p className="text-error border-t border-error/30 pt-2">
                          <strong>Reason:</strong>{" "}
                          {selectedShop.rejectionReason}
                        </p>
                      )}
                    {selectedShop.approvedAt && (
                      <p className="text-success">
                        Approved on: {formatDate(selectedShop.approvedAt)}
                      </p>
                    )}
                    <p className="text-base-content/60">
                      ID:{" "}
                      <span className="text-xs break-all">
                        {selectedShop._id}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {selectedShop.shop?.vehicleTypes && (
                <div className="p-4 bg-accent/10 rounded-xl border border-accent/30">
                  <h5 className="font-semibold text-base-content mb-3">
                    Services Offered
                  </h5>
                  <div className="grid grid-cols-1 gap-4 ">
                    {Object.entries(selectedShop.shop.vehicleTypes).map(
                      ([vehicleType, categories]) => (
                        <div
                          key={vehicleType}
                          className="border border-neutral rounded-lg p-3 bg-base-100"
                        >
                          <h6 className="font-bold text-base text-primary mb-2 border-b pb-1">
                            {vehicleType}
                          </h6>
                          <div className="space-y-2">
                            {Object.entries(categories).map(
                              ([category, services]) => (
                                <div key={category}>
                                  <p className="text-sm font-semibold text-base-content">
                                    {category}:
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {services.map((service, index) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-base-300/40 text-base-content/80 text-xs rounded border border-neutral/20"
                                      >
                                        {service}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 flex-wrap">
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="px-6 py-3 bg-base-100 text-base-content rounded-xl font-semibold border border-neutral hover:bg-base-200 transition-all duration-300"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDeleteShop(selectedShop)}
                  className="px-6 py-3 bg-error text-error-content rounded-xl font-semibold transition-all duration-300 hover:bg-error/90 hover:scale-[1.02] shadow-xl"
                >
                  Delete Shop
                </button>
                <button
                  onClick={() => {
                    setDetailModalOpen(false);
                    openActionModal(selectedShop);
                  }}
                  className="px-6 py-3 bg-success text-success-content rounded-xl font-semibold transition-all duration-300 hover:bg-success/90 hover:scale-[1.02] shadow-xl"
                >
                  Update Status & Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal for Status & Location Update */}
      {actionModalOpen && shopToAction && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-orange-100 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {shopToAction.status === "approved"
                  ? "Edit Shop"
                  : "Update Shop"}
              </h2>
              <button
                onClick={() => {
                  setActionModalOpen(false);
                  setActionData({
                    latitude: "",
                    longitude: "",
                    status: "pending",
                  });
                  setShopToAction(null);
                }}
                className="p-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 text-sm sm:text-base">
                {shopToAction.status === "approved"
                  ? "Edit status and location for"
                  : "Update status and location for"}{" "}
                <strong>{shopToAction.shop?.shopName}</strong>:
              </p>

              {/* Status Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={actionData.status}
                  onChange={(e) =>
                    setActionData((prev) => ({...prev, status: e.target.value}))
                  }
                  className="w-full p-3 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Conditional Location Fields */}
              {actionData.status === "approved" && (
                <>
                  {/* Latitude Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter latitude (e.g., 40.7128)"
                      value={actionData.latitude}
                      onChange={(e) =>
                        setActionData((prev) => ({
                          ...prev,
                          latitude: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300 text-sm"
                      required={actionData.status === "approved"}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Must be between -90 and 90
                    </p>
                  </div>

                  {/* Longitude Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter longitude (e.g., -74.0060)"
                      value={actionData.longitude}
                      onChange={(e) =>
                        setActionData((prev) => ({
                          ...prev,
                          longitude: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300 text-sm"
                      required={actionData.status === "approved"}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Must be between -180 and 180
                    </p>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 flex-wrap">
                <button
                  onClick={() => {
                    setActionModalOpen(false);
                    setActionData({
                      latitude: "",
                      longitude: "",
                      status: "pending",
                    });
                    setShopToAction(null);
                  }}
                  className="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border border-orange-200 hover:bg-orange-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleActionSubmit}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-green-600 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {shopToAction.status === "approved"
                    ? "Save Changes"
                    : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageShops;
