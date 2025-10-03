"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { Check, X, Search, Filter, Download, Store, Clock, User, Mail, MapPin, Eye, Ban, MessageSquare } from "lucide-react";
import Swal from 'sweetalert2';

// Utility component (for the header stats)
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

// Utility function to format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
};


const ManageShops = () => {
    const { user: loggedInUser, loading: userLoading } = useUser();
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedShop, setSelectedShop] = useState(null);
    const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
    const [shopToReject, setShopToReject] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");

    // SweetAlert2 Functions (unchanged)
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

    const fetchShops = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/shops?admin=true");
            if (!res.ok) throw new Error('Failed to fetch shops');
            const data = await res.json();
            setShops(data.result || []);
        } catch (err) {
            console.error("Failed to fetch shops:", err);
            showErrorAlert('Error', 'Failed to load shops');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShops();
    }, []);

    const handleApprove = async (id) => {
        const result = await showConfirmDialog(
            'Approve Shop',
            'Are you sure you want to approve this shop? This will make it visible to users.',
            'Yes, Approve'
        );

        if (result.isConfirmed) {
            try {
                showLoadingAlert('Approving...', 'Please wait while we approve the shop');

                const response = await fetch(`/api/shops/${id}/status`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "approved" }),
                });

                if (!response.ok) throw new Error('Failed to approve shop');

                Swal.close();
                await fetchShops();
                showSuccessAlert('Approved!', 'The shop has been approved successfully');
                if (selectedShop?._id === id) setSelectedShop(prev => ({ ...prev, status: "approved" }));
            } catch (error) {
                console.error('Approval failed:', error);
                Swal.close();
                showErrorAlert('Error', 'Failed to approve shop');
            }
        }
    };

    const handleReject = (shop) => {
        setShopToReject(shop);
        setRejectionReason(""); // Reset reason
        setRejectionModalOpen(true);
    };

    const confirmRejection = async () => {
        if (!rejectionReason.trim()) {
            showErrorAlert('Validation Error', 'Please provide a reason for rejection');
            return;
        }

        try {
            showLoadingAlert('Rejecting...', 'Please wait while we reject the shop');

            const response = await fetch(`/api/shops/${shopToReject._id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "rejected",
                    rejectionReason: rejectionReason.trim()
                }),
            });

            if (!response.ok) throw new Error('Failed to reject shop');

            Swal.close();
            setRejectionModalOpen(false);
            setRejectionReason("");

            // Update the selected shop status if the modal is open
            if (selectedShop?._id === shopToReject._id) {
                setSelectedShop(prev => ({ ...prev, status: "rejected", rejectionReason: rejectionReason.trim() }));
            }

            setShopToReject(null);
            await fetchShops();
            showSuccessAlert('Rejected!', 'The shop has been rejected successfully');
        } catch (error) {
            console.error('Rejection failed:', error);
            Swal.close();
            showErrorAlert('Error', 'Failed to reject shop');
        }
    };

    const openDetailModal = (shop) => {
        setSelectedShop(shop);
        setDetailModalOpen(true);
    };

    // --- Data Filtering ---
    const filteredShops = shops.filter((shop) => {
        const shopDetails = shop.shop || {};

        const matchesSearch =
            shopDetails.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shopDetails.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shopDetails.ownerEmail?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || shop.status === statusFilter;

        return matchesSearch && matchesStatus;
    });
    // ----------------------


    const getStatusBadge = (status) => {
        const base = "px-2 sm:px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap";
        switch (status) {
            case "approved":
                return <span className={`${base} bg-green-100 text-green-700 border-green-200`}>Approved</span>;
            case "pending":
                return <span className={`${base} bg-yellow-100 text-yellow-700 border-yellow-200`}>Pending</span>;
            case "rejected":
                return <span className={`${base} bg-red-100 text-red-700 border-red-200`}>Rejected</span>;
            default:
                return <span className={`${base} bg-gray-100 text-gray-700 border-gray-200`}>Unknown</span>;
        }
    };

    // Stats for the header
    const stats = {
        total: shops.length,
        pending: shops.filter(shop => shop.status === "pending").length,
        approved: shops.filter(shop => shop.status === "approved").length,
        rejected: shops.filter(shop => shop.status === "rejected").length,
    };

    // --- Mobile Shop Card Component ---
    const ShopMobileCard = ({ shop }) => {
        const shopDetails = shop.shop || {};
        const address = shopDetails.address || {};
        return (
            <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-3 mb-3 border-b border-gray-100 pb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {shopDetails.shopName?.charAt(0) || "S"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{shopDetails.shopName || 'Unknown Shop'}</p>
                        <p className="text-xs text-gray-600 truncate flex items-center gap-1"><User size={12} className="text-gray-400" />{shopDetails.ownerName || 'Unknown Owner'}</p>
                        <p className="text-xs text-gray-600 truncate flex items-center gap-1"><MapPin size={12} className="text-gray-400" />{address.city || 'Location N/A'}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(shop.status)}
                        <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} />{formatDateShort(shop.createdAt)}</span>
                    </div>
                    <div className="flex gap-2">
                        {shop.status === "pending" && (
                            <>
                                <button
                                    onClick={() => handleApprove(shop._id)}
                                    className="p-2 bg-green-500/10 text-green-600 rounded-lg border border-green-200 hover:bg-green-500/20 transition-colors"
                                    title="Approve"
                                >
                                    <Check size={16} />
                                </button>
                                <button
                                    onClick={() => handleReject(shop)}
                                    className="p-2 bg-red-500/10 text-red-600 rounded-lg border border-red-200 hover:bg-red-500/20 transition-colors"
                                    title="Reject"
                                >
                                    <X size={16} />
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => openDetailModal(shop)}
                            className="p-2 bg-orange-500/10 text-orange-600 rounded-lg border border-orange-200 hover:bg-orange-500/20 transition-colors"
                            title="View Details"
                        >
                            <Eye size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    // ------------------------------------

    if (loading || userLoading) return (
        <div className="flex items-center justify-center h-screen w-full">
            <span className="loading loading-bars loading-xl text-orange-500"></span>
        </div>
    );

    return (
        <div className="min-h-screen w-full p-3 sm:p-4 lg:p-6 mx-auto">
            {/* Header Section */}
            <div className="mb-4 sm:mb-6 lg:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Shop Management</h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Manage and monitor all registered vendor shops in the platform</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                <StatCard icon={Store} value={stats.total} label="Total Shops" color="orange" />
                <StatCard icon={Clock} value={stats.pending} label="Pending Approval" color="yellow" />
                <StatCard icon={Check} value={stats.approved} label="Approved Shops" color="green" />
                <StatCard icon={Ban} value={stats.rejected} label="Rejected Shops" color="red" />
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-orange-100 shadow-xl">
                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-3 w-full mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search shops, owners, cities..."
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
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* Mobile Shop Cards (Visible on screens < xl) */}
                <div className="block xl:hidden space-y-4">
                    {filteredShops.length > 0 ? filteredShops.map(s => <ShopMobileCard key={s._id} shop={s} />) : <div className="text-center py-12"><MessageSquare size={48} className="mx-auto text-gray-300" /><p className="text-gray-500">No shops found</p></div>}
                </div>

                {/* Desktop Table (Visible on screens >= xl) */}
                <div className="hidden xl:block rounded-2xl border border-orange-100 overflow-x-auto">
                    <table className="min-w-full divide-y divide-orange-100">
                        <thead className="bg-orange-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">Shop Details</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">Owner Info</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">Categories</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">Created</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-orange-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-orange-100">
                            {filteredShops.length > 0 ? (
                                filteredShops.map((shop) => (
                                    <tr key={shop._id} className="hover:bg-orange-50/30 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                                                    {shop.shop?.shopName?.charAt(0) || "S"}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{shop.shop?.shopName || "N/A"}</p>
                                                    <button
                                                        onClick={() => openDetailModal(shop)}
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
                                                    <User size={14} className="text-orange-500" />
                                                    <span className="text-sm text-gray-700">{shop.shop?.ownerName || "N/A"}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} className="text-orange-500" />
                                                    <span className="text-sm text-gray-500">{shop.shop?.ownerEmail || "N/A"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {Array.isArray(shop.shop?.categories) ? (
                                                    shop.shop.categories.slice(0, 2).map((cat, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-lg border border-orange-200 whitespace-nowrap"
                                                        >
                                                            {cat}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500 text-sm">N/A</span>
                                                )}
                                                {Array.isArray(shop.shop?.categories) && shop.shop.categories.length > 2 && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg whitespace-nowrap">
                                                        +{shop.shop.categories.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-orange-500" />
                                                <span className="text-sm text-gray-700 whitespace-nowrap">
                                                    {formatDateShort(shop.createdAt)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(shop.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                {shop.status === "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(shop._id)}
                                                            className="p-2 bg-green-500/10 text-green-600 rounded-xl border border-green-200 hover:bg-green-500/20 hover:scale-105 transition-all duration-200"
                                                            title="Approve"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(shop)}
                                                            className="p-2 bg-red-500/10 text-red-600 rounded-xl border border-red-200 hover:bg-red-500/20 hover:scale-105 transition-all duration-200"
                                                            title="Reject"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                {(shop.status === "approved" || shop.status === "rejected") && (
                                                    <button
                                                        onClick={() => openDetailModal(shop)}
                                                        className="p-2 bg-orange-500/10 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-500/20 hover:scale-105 transition-all duration-200"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-12">
                                        <div className="flex flex-col items-center gap-3">
                                            <Store className="text-gray-300" size={48} />
                                            <p className="text-gray-500 text-lg">No shops found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Shop Detail Modal */}
            {detailModalOpen && selectedShop && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-4xl border border-orange-100 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Shop Details</h2>
                            <button
                                onClick={() => setDetailModalOpen(false)}
                                className="p-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                    {selectedShop.shop?.shopName?.charAt(0) || "S"}
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{selectedShop.shop?.shopName || "N/A"}</h3>
                                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1">
                                        <span className="text-sm text-gray-600">
                                            {getStatusBadge(selectedShop.status)}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Created: {formatDate(selectedShop.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Shop Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                {/* Shop Information */}
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <h5 className="font-semibold text-blue-900 mb-2">Shop Information</h5>
                                    <div className="space-y-2 text-sm">
                                        <p className="text-blue-700"><strong>Name:</strong> {selectedShop.shop?.shopName}</p>
                                        <p className="text-blue-700"><strong>Description:</strong> {selectedShop.shop?.details || "No description"}</p>
                                        <p className="text-blue-700"><strong>Categories:</strong> {Array.isArray(selectedShop.shop?.categories) ? selectedShop.shop.categories.join(", ") : "No categories"}</p>
                                        <p className="text-blue-700"><strong>Mechanics:</strong> {selectedShop.shop?.mechanicCount || "Not specified"}</p>
                                    </div>
                                </div>

                                {/* Owner Information */}
                                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                    <h5 className="font-semibold text-green-900 mb-2">Owner Information</h5>
                                    <div className="space-y-2 text-sm">
                                        <p className="text-green-700"><strong>Name:</strong> {selectedShop.shop?.ownerName || "N/A"}</p>
                                        <p className="text-green-700"><strong>Email:</strong> {selectedShop.shop?.ownerEmail || "N/A"}</p>
                                        <p className="text-green-700"><strong>Phone:</strong> {selectedShop.shop?.contact?.phone || "Not provided"}</p>
                                        <p className="text-green-700"><strong>Business Email:</strong> {selectedShop.shop?.contact?.businessEmail || "Not provided"}</p>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                                    <h5 className="font-semibold text-purple-900 mb-2">Location</h5>
                                    <div className="space-y-2 text-sm">
                                        <p className="text-purple-700"><strong>Street:</strong> {selectedShop.shop?.address?.street || "Not provided"}</p>
                                        <p className="text-purple-700"><strong>City:</strong> {selectedShop.shop?.address?.city || "Not provided"}</p>
                                        <p className="text-purple-700"><strong>Country:</strong> {selectedShop.shop?.address?.country || "Not provided"}</p>
                                        <p className="text-purple-700"><strong>Postal Code:</strong> {selectedShop.shop?.address?.postalCode || "Not provided"}</p>
                                    </div>
                                </div>

                                {/* Status Information */}
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <h5 className="font-semibold text-gray-900 mb-2">Status Information</h5>
                                    <div className="space-y-2 text-sm">
                                        <p className="text-gray-700">This shop is currently <span className="font-semibold">{selectedShop.status}</span>.</p>
                                        {selectedShop.status === 'rejected' && selectedShop.rejectionReason && (
                                            <p className="text-red-600"><strong>Reason:</strong> {selectedShop.rejectionReason}</p>
                                        )}
                                        {selectedShop.approvedAt && (
                                            <p className="text-gray-500">Approved on: {formatDate(selectedShop.approvedAt)}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Services Offered (Full Width) */}
                            {selectedShop.shop?.vehicleTypes && (
                                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                                    <h5 className="font-semibold text-orange-900 mb-3">Services Offered</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(selectedShop.shop.vehicleTypes).map(([vehicleType, categories]) => (
                                            <div key={vehicleType} className="border border-orange-200 rounded-lg p-3 bg-white">
                                                <h6 className="font-bold text-base text-orange-700 mb-2 border-b pb-1">{vehicleType}</h6>
                                                <div className="space-y-2">
                                                    {Object.entries(categories).map(([category, services]) => (
                                                        <div key={category}>
                                                            <p className="text-sm font-semibold text-gray-800">{category}:</p>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {services.map((service, index) => (
                                                                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">
                                                                        {service}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4 flex-wrap">
                                <button
                                    onClick={() => setDetailModalOpen(false)}
                                    className="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border border-orange-200 hover:bg-orange-50 transition-all duration-300"
                                >
                                    Close
                                </button>
                                {selectedShop.status === "pending" && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setDetailModalOpen(false);
                                                handleApprove(selectedShop._id);
                                            }}
                                            className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-green-600 hover:scale-105 shadow-lg hover:shadow-xl"
                                        >
                                            Approve Shop
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDetailModalOpen(false);
                                                handleReject(selectedShop);
                                            }}
                                            className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-red-600 hover:scale-105 shadow-lg hover:shadow-xl"
                                        >
                                            Reject Shop
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Reason Modal */}
            {rejectionModalOpen && shopToReject && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-orange-100 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Reject Shop</h2>
                            <button
                                onClick={() => {
                                    setRejectionModalOpen(false);
                                    setRejectionReason("");
                                    setShopToReject(null);
                                }}
                                className="p-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-gray-700 text-sm sm:text-base">
                                Please provide a reason for rejecting <strong>{shopToReject.shop?.shopName}</strong>:
                            </p>

                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Enter rejection reason..."
                                className="w-full p-4 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300 resize-none text-sm"
                                rows={4}
                                required
                            ></textarea>

                            <div className="flex justify-end gap-3 pt-4 flex-wrap">
                                <button
                                    onClick={() => {
                                        setRejectionModalOpen(false);
                                        setRejectionReason("");
                                        setShopToReject(null);
                                    }}
                                    className="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border border-orange-200 hover:bg-orange-50 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmRejection}
                                    className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-red-600 hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    Confirm Rejection
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