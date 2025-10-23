"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import useUser from "@/hooks/useUser";

export default function MyShopPage() {
  const { user, loading: userLoading } = useUser();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!userLoading && user?.email) {
      const fetchShop = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/shops?email=${user.email}`);
          if (!res.ok) throw new Error("Failed to fetch shop data");
          const data = await res.json();
          setShop(data);
        } catch (err) {
          console.error(err);
          setError(err.message || "Something went wrong");
        } finally {
          setLoading(false);
        }
      };
      fetchShop();
      console.log(shop);
    }
  }, [user, userLoading]);

  // 🌀 Loading skeleton
  if (userLoading || loading) {
    return (
      <div className="mx-auto p-6">
        <div className="animate-pulse space-y-6 bg-white rounded-2xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="h-24 w-24 bg-gray-200 rounded-xl"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // ❌ Error or no shop
  if (error)
    return (
      <div className="text-center mt-10 text-red-600">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );

  if (!shop)
    return (
      <div className="text-center mt-10 text-gray-600">
        No shop found for this account.
      </div>
    );

  return (
    <div className="mx-auto p-6 container">
      {/* SHOP CARD */}
      <div className="">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Image
            src={shop.shop?.logo || "/default-shop.jpg"}
            alt={shop.shop?.shopName || "Shop"}
            width={550}
            height={500}
            className="rounded-xl object-cover border"
          />
          <div>
            <h2 className="text-2xl font-semibold">{shop.shop?.shopName}</h2>
            <p className="text-gray-600">
              {shop.shop?.address?.city}, {shop.shop?.address?.country}
            </p>
            <p className="mt-2 text-gray-800">
              <span className="font-medium">Owner:</span>{" "}
              {shop.shop.ownerName}
            </p>
            <div className="mt-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  shop.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : shop.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {shop.status}
              </span>
            </div>
          </div>
        </div>

        {shop.rejectionReason && (
          <p className="mt-4 text-red-600 text-sm">
            <span className="font-semibold">Rejection Reason:</span>{" "}
            {shop.rejectionReason}
          </p>
        )}

        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-medium mb-2">Description</h3>
          <p className="text-gray-700">
            {shop.shop?.details || "No description available."}
          </p>
        </div>
      </div>

      {/* 🔀 TABS */}
      <div className="mt-8">
        <div className="flex gap-3 overflow-x-auto">
          {["overview", "products", "analytics", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        <div className="mt-6">
          {activeTab === "overview" && (
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-2">Shop Overview</h3>
              <p className="text-gray-600">
                Welcome back, {shop.shop.ownerName}! Here’s a quick look at your shop’s performance.
              </p>
            </div>
          )}

          {activeTab === "products" && (
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-4">Products</h3>
              {shop.products && shop.products.length > 0 ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {shop.products.map((prod) => (
                    <div
                      key={prod.id}
                      className="border rounded-xl p-3 hover:shadow-md transition"
                    >
                      <Image
                        src={prod.image || "/placeholder.png"}
                        alt={prod.name}
                        width={200}
                        height={150}
                        className="rounded-lg object-cover"
                      />
                      <h4 className="font-medium mt-2">{prod.name}</h4>
                      <p className="text-gray-600">${prod.price}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No products available.</p>
              )}
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-gray-500">
                Coming soon: Sales reports, customer insights, and more.
              </p>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white rounded-xl shadow p-5">
              <h3 className="text-lg font-semibold mb-2">Settings</h3>
              <p className="text-gray-600 mb-4">
                Manage your shop details and preferences.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Edit Shop Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
