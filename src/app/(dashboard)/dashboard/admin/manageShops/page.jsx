"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { Check, X, Edit } from "lucide-react";

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
        const base = "px-3 py-1 text-xs font-semibold rounded-full";
        switch (status) {
            case "approved":
                return <span className={`${base} bg-green-100 text-green-800`}>Approved</span>;
            case "pending":
                return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
            case "rejected":
                return <span className={`${base} bg-red-100 text-red-800`}>Rejected</span>;
            default:
                return <span className={`${base} bg-gray-100 text-gray-800`}>Unknown</span>;
        }
    };

    return (
        <div className="p-8 space-y-6 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800">Manage Shops</h1>

            {/* Search */}
            <div className="flex justify-end">
                <input
                    type="text"
                    placeholder="Search shops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-200 rounded-lg w-64"
                />
            </div>

            {/* Shops Table */}
            <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Shop Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Owner
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Categories
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created At
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
                                    Loading shops...
                                </td>
                            </tr>
                        ) : filteredShops.length > 0 ? (
                            filteredShops.map((shop) => (
                                <tr key={shop._id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                                        {shop.shop?.shopName || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                        {shop.shop?.ownerName || shop.shop?.contact?.businessEmail || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                        {Array.isArray(shop.shop?.categories)
                                            ? shop.shop.categories.join(", ")
                                            : shop.shop?.categories || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                        {new Date(shop.shop?.createdAt || Date.now()).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(shop.status)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap flex justify-center gap-2">
                                        {shop.status === "pending" && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(shop._id)}
                                                    className="p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(shop._id)}
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
                                    No shops found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageShops;
