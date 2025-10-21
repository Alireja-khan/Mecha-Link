"use client";
import {useEffect, useState} from "react";
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
      const res = await axios.patch(`/api/ads/${id}`, {status: newStatus});
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

        // Show success confirmation
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

      // Show error dialog
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
              <span class="text-gray-500">ID:</span>
              <p class="text-gray-300 font-mono text-xs">${ad._id}</p>
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

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <MonitorSmartphone className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-base-content">
              All Advertisements
            </h2>
            <p className="text-sm text-base-content/70 mt-1">
              Manage, approve, or delete mechanic shop ads
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="badge badge-primary badge-lg">
            {ads.length} {ads.length === 1 ? "Ad" : "Ads"}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <MonitorSmartphone className="w-6 h-6" />
            </div>
            <div className="stat-title">Total Ads</div>
            <div className="stat-value text-primary">{ads.length}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-success">
              <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-success"></div>
              </div>
            </div>
            <div className="stat-title">Approved</div>
            <div className="stat-value text-success">
              {ads.filter((ad) => ad.status === "approved").length}
            </div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-warning">
              <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-warning"></div>
              </div>
            </div>
            <div className="stat-title">Pending</div>
            <div className="stat-value text-warning">
              {ads.filter((ad) => ad.status === "pending").length}
            </div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-error">
              <div className="w-6 h-6 rounded-full bg-error/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-error"></div>
              </div>
            </div>
            <div className="stat-title">Rejected</div>
            <div className="stat-value text-error">
              {ads.filter((ad) => ad.status === "rejected").length}
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="card shadow-lg border border-base-300">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              {/* Table Header */}
              <thead className="bg-base-200">
                <tr>
                  <th className="w-12 text-center">#</th>
                  <th>Banner</th>
                  <th>Title</th>
                  <th>Description</th>
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

                    {/* Title */}
                    <td>
                      <div
                        className="font-semibold max-w-xs truncate cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleView(ad)}
                      >
                        {ad.title}
                      </div>
                    </td>

                    {/* Description */}
                    <td>
                      <div
                        className="max-w-xs truncate text-base-content/70 cursor-pointer hover:text-base-content transition-colors"
                        onClick={() => handleView(ad)}
                      >
                        {ad.description}
                      </div>
                    </td>
                    {/* Duration */}
                    <td>
                      <div
                        className="max-w-xs truncate text-base-content/70 cursor-pointer hover:text-base-content transition-colors"
                        onClick={() => handleView(ad)}
                      >
                        {ad.duration} days
                      </div>
                    </td>

                    {/* Status */}
                    <td>
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
                      </select>
                      {updatingId === ad._id && (
                        <Loader2 className="w-3 h-3 animate-spin mt-1 ml-1" />
                      )}
                    </td>

                    {/* Payment Status */}
                    <td>
                      <div className="flex items-center gap-2">
                        {ad.isPaid ? (
                          <div className="badge badge-success badge-lg gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                            Paid
                          </div>
                        ) : (
                          <div className="badge badge-ghost badge-lg gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
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
                          className="btn btn-sm btn-ghost btn-square tooltip hover:bg-blue-500/20 hover:text-blue-500 transition-colors"
                          data-tip="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(ad._id)}
                          disabled={deletingId === ad._id}
                          className="btn btn-sm btn-ghost btn-square text-error tooltip hover:bg-red-500/20 transition-colors"
                          data-tip="Delete Ad"
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
    </div>
  );
};

export default AllAds;
