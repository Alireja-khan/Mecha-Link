"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { Check, X, Edit, Search, Filter, Download, Users, Shield, Store, Clock, User, Mail, MapPin } from "lucide-react";

const ManageShops = () => {
    const { user: loggedInUser, loading: userLoading } = useUser();
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchShops = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/shops");
                const data = await res.json();
                setShops(data.result || []); // assuming API returns { result: [...] }
            } catch (err) {
                console.error("Failed to fetch shops:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchShops();
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

    const handleApprove = async (id) => {
        // call your API to approve the shop
        console.log("Approve shop id:", id);
        // Optionally, update the local state
    };

    const handleReject = async (id) => {
        console.log("Reject shop id:", id);
        // Optionally, update the local state
    };

    const filteredShops = shops.filter((shop) =>
        shop.shop?.shopName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status) => {
        const base = "px-3 py-1 text-xs font-semibold rounded-full border";
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

    const StatCard = ({ icon: Icon, value, label, color = "orange" }) => (
        <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${color}-500/10 group-hover:bg-${color}-500/20 transition-colors duration-300`}>
                    <Icon className={`text-${color}-600`} size={24} />
                </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-gray-600 text-sm font-medium">{label}</p>
        </div>
    );

    return (
        <div className="min-h-screen p-6 mx-auto">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Shop Management</h1>
                <p className="text-gray-600 text-lg">Manage and monitor all registered shops in the platform</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={Store} value={stats.total} label="Total Shops" color="orange" />
                <StatCard icon={Clock} value={stats.pending} label="Pending Approval" color="yellow" />
                <StatCard icon={Check} value={stats.approved} label="Approved Shops" color="green" />
                <StatCard icon={X} value={stats.rejected} label="Rejected Shops" color="red" />
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-xl">
                {/* Header with Search and Actions */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">All Shops</h2>
                        <p className="text-gray-600">Manage shop registrations and approvals</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search shops..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300 w-full lg:w-64"
                            />
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-3 bg-orange-50 text-orange-700 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200">
                                <Filter size={16} />
                                Filter
                            </button>
                            <button className="flex items-center gap-2 px-4 py-3 bg-orange-50 text-orange-700 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200">
                                <Download size={16} />
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Shops Table */}
                <div className="rounded-2xl border border-orange-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-orange-100">
                        <thead className="bg-orange-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                                    Shop Details
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                                    Owner Info
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                                    Categories
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                                    Created
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
                                        <p className="text-gray-500 mt-2">Loading shops...</p>
                                    </td>
                                </tr>
                            ) : filteredShops.length > 0 ? (
                                filteredShops.map((shop) => (
                                    <tr key={shop._id} className="hover:bg-orange-50/30 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                                                    {shop.shop?.shopName?.charAt(0) || "S"}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{shop.shop?.shopName || "N/A"}</p>
                                                    <p className="text-sm text-gray-500">{shop.shop?.contact?.businessEmail || "No email"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <User size={14} className="text-orange-500" />
                                                    <span className="text-sm text-gray-700">{shop.shop?.ownerName || "N/A"}</span>
                                                </div>
                                                {shop.shop?.contact?.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <Mail size={14} className="text-orange-500" />
                                                        <span className="text-sm text-gray-500">{shop.shop.contact.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {Array.isArray(shop.shop?.categories) ? (
                                                    shop.shop.categories.slice(0, 2).map((cat, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-lg border border-orange-200"
                                                        >
                                                            {cat}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500 text-sm">No categories</span>
                                                )}
                                                {Array.isArray(shop.shop?.categories) && shop.shop.categories.length > 2 && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                                                        +{shop.shop.categories.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-orange-500" />
                                                <span className="text-sm text-gray-700">
                                                    {new Date(shop.shop?.createdAt || Date.now()).toLocaleDateString()}
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
                                                            onClick={() => handleReject(shop._id)}
                                                            className="p-2 bg-red-500/10 text-red-600 rounded-xl border border-red-200 hover:bg-red-500/20 hover:scale-105 transition-all duration-200"
                                                            title="Reject"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                <button 
                                                    className="p-2 bg-orange-500/10 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-500/20 hover:scale-105 transition-all duration-200"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
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
                                            <p className="text-gray-400 text-sm">
                                                {searchTerm ? "Try adjusting your search terms" : "No shops registered yet"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageShops;