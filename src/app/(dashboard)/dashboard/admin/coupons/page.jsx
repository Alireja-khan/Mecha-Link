"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { Check, X, Trash, Plus } from "lucide-react";

const ManageCoupons = () => {
  const { user: loggedInUser, loading: userLoading } = useUser();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/coupons"); // your coupons API
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

  if (!loggedInUser || loggedInUser.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen w-screen text-gray-600">
        <p>Access denied. Admins only.</p>
      </div>
    );
  }

  const handleActivate = (id) => {
    console.log("Activate coupon", id);
    // call API PATCH /api/coupons/:id
  };

  const handleDeactivate = (id) => {
    console.log("Deactivate coupon", id);
    // call API PATCH /api/coupons/:id
  };

  const handleDelete = (id) => {
    console.log("Delete coupon", id);
    // call API DELETE /api/coupons/:id
  };

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.discount?.toString().includes(searchTerm)
  );

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case "active":
        return <span className={`${base} bg-green-100 text-green-800`}>Active</span>;
      case "inactive":
        return <span className={`${base} bg-red-100 text-red-800`}>Inactive</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-800`}>Unknown</span>;
    }
  };

  return (
    <div className="p-8 space-y-6 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Manage Coupons</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition">
          <Plus size={16} /> Add New Coupon
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search by code or discount..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-200 rounded-lg w-80"
        />
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiry Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usage Limit
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
                  Loading coupons...
                </td>
              </tr>
            ) : filteredCoupons.length > 0 ? (
              filteredCoupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{coupon.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{coupon.discount}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(coupon.expiryDate || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{coupon.usageLimit || "∞"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(coupon.status || "inactive")}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex justify-center gap-2">
                    {coupon.status !== "active" && (
                      <button
                        onClick={() => handleActivate(coupon._id)}
                        className="p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    {coupon.status === "active" && (
                      <button
                        onClick={() => handleDeactivate(coupon._id)}
                        className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
                      >
                        <X size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="p-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No coupons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCoupons;
