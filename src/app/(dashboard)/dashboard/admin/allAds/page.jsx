"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Loader2,
  Trash2,
  MonitorSmartphone,
  XCircle,
  Eye,
  Calendar,
  DollarSign,
  Shield,
  Users,
  Store,
  Star,
  TrendingUp,
  FileText
} from "lucide-react";
import Swal from "sweetalert2";
import Loader from "@/app/(basic)/loading";

const AllAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Show SweetAlert2 toast
  const showToast = (icon, title) => {
    Swal.fire({
      toast: true,
      icon,
      title,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
  };

  // Fetch all ads
  const fetchAds = async () => {
    try {
      const res = await axios.get("/api/ads");
      setAds(res.data);
    } catch (err) {
      showToast("error", "Failed to load ads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // Update status
  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const res = await axios.patch(`/api/ads/${id}`, { status: newStatus });
      if (res.status === 200) {
        showToast("success", `Status updated to ${newStatus}`);
        fetchAds();
      }
    } catch (err) {
      showToast("error", "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete ad with SweetAlert2 confirmation
  const handleDelete = async (id) => {
    const ad = ads.find((ad) => ad._id === id);

    const result = await Swal.fire({
      title: "Are you sure?",
      html: `You are about to delete the ad: <strong>"${ad?.title}"</strong>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: "#1f2937",
      color: "#f9fafb",
      customClass: {
        popup: "border border-gray-600 shadow-xl rounded-2xl",
        title: "text-white font-bold",
        htmlContainer: "text-gray-300",
      },
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(id);
      const res = await axios.delete(`/api/ads/${id}`);
      if (res.status === 200) {
        showToast("success", "Ad deleted successfully!");
        setAds((prev) => prev.filter((ad) => ad._id !== id));

        await Swal.fire({
          title: "Deleted!",
          text: "The advertisement has been deleted.",
          icon: "success",
          confirmButtonColor: "#10b981",
          background: "#1f2937",
          color: "#f9fafb",
          customClass: {
            popup: "border border-gray-600 shadow-xl rounded-2xl",
            title: "text-white font-bold",
          },
        });
      }
    } catch (err) {
      showToast("error", "Failed to delete ad");

      await Swal.fire({
        title: "Error!",
        text: "Failed to delete the advertisement. Please try again.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "#1f2937",
        color: "#f9fafb",
        customClass: {
          popup: "border border-gray-600 shadow-xl rounded-2xl",
          title: "text-white font-bold",
        },
      });
    } finally {
      setDeletingId(null);
    }
  };

  // View ad details with fixed dark background
  const handleView = (ad) => {
    Swal.fire({
      title: `<h2 class="text-2xl font-bold text-white">${ad.title}</h2>`,
      html: `
      <div class="bg-gray-900 text-white rounded-xl p-6 space-y-6">
        <!-- Banner Image -->
        <div class="flex justify-center">
          <img 
            src="${ad.bannerImage}" 
            alt="${ad.title}" 
            class="w-full max-w-md h-48 object-cover rounded-xl border-2 border-gray-700 shadow-lg"
          />
        </div>
        
        <!-- Description -->
        <div class="bg-gray-800 rounded-lg p-4">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white">Description</h3>
          </div>
          <p class="text-gray-300 leading-relaxed">${ad.description}</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Status -->
          <div class="bg-gray-800 rounded-lg p-4">
          <span class="text-sm font-medium text-gray-400">Status</span>
            <div class="flex items-center gap-2 mb-2">
              <Shield class="w-4 h-4 ${
                ad.status === "approved"
                  ? "text-green-400"
                  : ad.status === "pending"
                  ? "text-yellow-400"
                  : "text-red-400"
              }" />
              </div>
            <div class="flex items-center justify-center">
              ${
                ad.status === "approved"
                  ? '<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30"><div class="w-2 h-2 rounded-full bg-green-400"></div>Approved</span>'
                  : ad.status === "pending"
                  ? '<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"><div class="w-2 h-2 rounded-full bg-yellow-400"></div>Pending</span>'
                  : '<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30"><div class="w-2 h-2 rounded-full bg-red-400"></div>Rejected</span>'
              }
            </div>
          </div>

          <!-- Payment -->
          <div class="bg-gray-800 rounded-lg p-4">
          <span class="text-sm font-medium text-gray-400">Payment</span>
            <div class="flex items-center gap-2 mb-2">
              <DollarSign class="w-4 h-4 ${
                ad.isPaid ? "text-green-400" : "text-gray-400"
              }" />
              </div>
            <div class="flex items-center justify-center">
              ${
                ad.isPaid
                  ? '<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30"><div class="w-2 h-2 rounded-full bg-green-400"></div>Paid</span>'
                  : '<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30"><div class="w-2 h-2 rounded-full bg-gray-400"></div>Unpaid</span>'
              }
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="bg-gray-800 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-400">Ad Information</h3>
          <div class="flex items-center gap-2 mb-3">
            <Calendar class="w-4 h-4 text-blue-400" />
            </div>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-500">Created:</span>
              <p class="text-gray-300 font-medium">${new Date(
                ad.createdAt || Date.now()
              ).toLocaleDateString()}</p>
            </div>
            <div>
              <span class="text-gray-500">Start Date & End Date:</span>
              <p class="text-gray-300 font-mono text-xs">${new Date(ad.startDate).toLocaleDateString("en-CA")} to ${new Date(ad.endDate).toLocaleDateString("en-CA")}</p>
            </div>
          </div>
        </div>
      </div>
    `,
      width: 600,
      background: "#111827",
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: "rounded-2xl border border-gray-700 shadow-2xl",
        closeButton: "text-gray-400 hover:text-white",
      },
    });
  };

  // Stats cards data matching dashboard style
  const adMetrics = [
    {
      id: 1,
      title: "Total Ads",
      value: loading ? "…" : ads.length,
      change: "+8%",
      trend: "up",
      icon: MonitorSmartphone,
      color: "orange",
    },
    {
      id: 2,
      title: "Approved",
      value: loading ? "…" : ads.filter((ad) => ad.status === "approved").length,
      change: "+12%",
      trend: "up",
      icon: Shield,
      color: "green",
    },
    {
      id: 3,
      title: "Pending",
      value: loading ? "…" : ads.filter((ad) => ad.status === "pending").length,
      change: "+5%",
      trend: "up",
      icon: FileText,
      color: "yellow",
    },
    {
      id: 4,
      title: "Rejected",
      value: loading ? "…" : ads.filter((ad) => ad.status === "rejected").length,
      change: "-3%",
      trend: "down",
      icon: XCircle,
      color: "red",
    },
  ];

  const colorMap = {
    orange: { bg: "bg-orange-500/15", hoverBg: "group-hover:bg-orange-500/25", text: "text-orange-500" },
    green: { bg: "bg-green-500/15", hoverBg: "group-hover:bg-green-500/25", text: "text-green-500" },
    yellow: { bg: "bg-yellow-500/15", hoverBg: "group-hover:bg-yellow-500/25", text: "text-yellow-500" },
    red: { bg: "bg-red-500/15", hoverBg: "group-hover:bg-red-500/25", text: "text-red-500" },
    blue: { bg: "bg-blue-500/15", hoverBg: "group-hover:bg-blue-500/25", text: "text-blue-500" },
    purple: { bg: "bg-purple-500/15", hoverBg: "group-hover:bg-purple-500/25", text: "text-purple-500" },
  };

  const StatCard = ({ icon: Icon, value, label, change, trend, color = "orange" }) => {
    const { bg, hoverBg, text } = colorMap[color] || colorMap.orange;

    return (
      <div className="bg-base-100 rounded-3xl p-6 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] group">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${bg} ${hoverBg} transition-colors duration-300`}>
            <Icon className={`${text}`} size={24} />
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-bold ${trend === "up" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}
          >
            {trend === "up" ? "↑" : "↓"} {change}
          </span>
        </div>
        <p className={`text-3xl font-bold ${text} mb-1`}>{value}</p>
        <p className="text-base-content/60 text-sm font-medium">{label}</p>
      </div>
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-base-200 space-y-8">
      {/* Header - Matching Dashboard Style */}
      <div className="bg-gradient-to-br from-primary to-orange-600 rounded-3xl p-6 md:p-10 text-white shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-2xl">
            <MonitorSmartphone size={32} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Advertisement Management</h1>
            <p className="text-orange-100 text-sm sm:text-lg mt-2">
              Manage and monitor all mechanic shop advertisements
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
            <TrendingUp size={16} />
            <span>Advertisement Analytics</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
            <Calendar size={16} />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid - Matching Dashboard Style */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {adMetrics.map((metric) => (
          <StatCard
            key={metric.id}
            icon={metric.icon}
            value={metric.value}
            label={metric.title}
            change={metric.change}
            trend={metric.trend}
            color={metric.color}
          />
        ))}
      </div>

      {/* Main Content Card - Matching Dashboard Style */}
      <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-base-content">All Advertisements</h2>
            <p className="text-base-content/60 mt-2">
              Manage, approve, or delete mechanic shop ads
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-primary badge-lg px-4 py-3">
              {ads.length} {ads.length === 1 ? "Ad" : "Ads"}
            </span>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            {/* Table Header */}
            <thead className="bg-base-200">
              <tr>
                <th className="w-12 text-center">#</th>
                <th>Banner</th>
                <th>Title & Shop</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Payment</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {ads.map((ad, index) => (
                <tr
                  key={ad._id}
                  className="hover:bg-base-300/50 transition-colors"
                >
                  <td className="text-center font-medium">{index + 1}</td>

                  {/* Banner Image */}
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-16 h-12">
                        <img
                          src={ad.bannerImage}
                          alt={ad.title}
                          className="object-cover cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => handleView(ad)}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Title & Shop */}
                  <td>
                    <div className="space-y-1">
                      <div
                        className="font-semibold max-w-xs truncate cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleView(ad)}
                      >
                        {ad.title}
                      </div>
                      {ad.shopName && (
                        <div className="text-xs text-base-content/60 flex items-center gap-1">
                          <Store className="w-3 h-3" />
                          {ad.shopName}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Duration */}
                  <td>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-base-content/40" />
                      <span className="text-base-content/70">
                        {ad.duration} days
                      </span>
                    </div>
                  </td>
                  

                  {/* Status */}
                  <td>
                    <div className="flex items-center gap-2">
                      <select
                        value={ad.status}
                        onChange={(e) =>
                          handleStatusChange(ad._id, e.target.value)
                        }
                        disabled={updatingId === ad._id}
                        className={`select select-sm select-bordered w-full max-w-xs ${
                          ad.status === "approved"
                            ? "select-success"
                            : ad.status === "rejected"
                            ? "select-error"
                            : "select-warning"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="expired">Expired</option>
                      </select>
                      {updatingId === ad._id && (
                        <Loader2 className="w-3 h-3 animate-spin text-base-content/40" />
                      )}
                    </div>
                  </td>

                  {/* Payment Status */}
                  <td>
                    <div className="flex items-center gap-2">
                      {ad.isPaid ? (
                        <div className="badge badge-success badge-lg gap-2 px-3 py-2">
                          <div className="w-2 h-2 rounded-full bg-current"></div>
                          Paid
                        </div>
                      ) : (
                        <div className="badge badge-ghost badge-lg gap-2 px-3 py-2 border border-base-300">
                          <div className="w-2 h-2 rounded-full bg-current"></div>
                          Unpaid
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleView(ad)}
                        className="btn btn-sm btn-ghost btn-square hover:bg-blue-500/20 hover:text-blue-500 transition-all duration-300 transform hover:scale-110"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(ad._id)}
                        disabled={deletingId === ad._id}
                        className="btn btn-sm btn-ghost btn-square text-error hover:bg-red-500/20 transition-all duration-300 transform hover:scale-110"
                        title="Delete Ad"
                      >
                        {deletingId === ad._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {ads.length === 0 && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <XCircle className="w-16 h-16 text-base-content/30" />
                <div>
                  <h3 className="text-lg font-semibold text-base-content/70 mb-2">
                    No advertisements found
                  </h3>
                  <p className="text-base-content/50 text-sm">
                    There are no ads to display at the moment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default AllAds;