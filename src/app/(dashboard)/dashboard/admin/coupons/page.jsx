"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { Check, X, Trash, Plus, Search, Filter, Download, Tag, Calendar, Users, Percent, Crown } from "lucide-react";

const ManageCoupons = () => {
  const { user: loggedInUser, loading: userLoading } = useUser();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/coupons");
        const data = await res.json();
        setCoupons(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch coupons:", err);
      } finally {
        setLoading(false);
      }
    };

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

  const handleActivate = (id) => {
    console.log("Activate coupon", id);
  };

  const handleDeactivate = (id) => {
    console.log("Deactivate coupon", id);
  };

  const handleDelete = (id) => {
    console.log("Delete coupon", id);
  };

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.discount?.toString().includes(searchTerm)
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

  // Stats for the header
  const stats = {
    total: coupons.length,
    active: coupons.filter(coupon => coupon.status === "active").length,
    expired: coupons.filter(coupon => new Date(coupon.expiryDate) < new Date()).length,
    unlimited: coupons.filter(coupon => !coupon.usageLimit).length,
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Coupon Management</h1>
          <p className="text-gray-600 text-lg">Manage discount coupons and promotions</p>
        </div>
        <button className="flex items-center gap-3 px-6 py-4 bg-orange-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-orange-600 hover:scale-105 shadow-lg hover:shadow-xl mt-4 lg:mt-0">
          <Plus size={20} />
          <span>Add New Coupon</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Tag} value={stats.total} label="Total Coupons" color="orange" />
        <StatCard icon={Check} value={stats.active} label="Active Coupons" color="green" />
        <StatCard icon={Calendar} value={stats.expired} label="Expired Coupons" color="red" />
        <StatCard icon={Crown} value={stats.unlimited} label="Unlimited Use" color="purple" />
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
                placeholder="Search by code or discount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300 w-full lg:w-80"
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
                          <p className="text-sm text-gray-500">Discount Code</p>
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
                        <span className="text-sm text-gray-700">
                          {new Date(coupon.expiryDate || Date.now()).toLocaleDateString()}
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
                          onClick={() => handleDelete(coupon._id)}
                          className="p-2 bg-orange-500/10 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-500/20 hover:scale-105 transition-all duration-200"
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
    </div>
  );
};

export default ManageCoupons;