"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Search,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Store,
  MessageSquare,
  Calendar,
  Check,
  X,
  Eye,
  Download,
  Mail,
  Phone,
  Trash,
} from "lucide-react";
import Swal from "sweetalert2";

const Page = () => {
  const [totalReviews, setTotalReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [users, setUsers] = useState({});
  const [shops, setShops] = useState({});
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // --- Swal Alert Functions Updated for DaisyUI/Theme Colors ---

  const showSuccessAlert = (title, message) => {
    Swal.fire({
      title,
      text: message,
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const showErrorAlert = (title, message) => {
    Swal.fire({
      title,
      text: message,
      icon: "error",
      confirmButtonText: "OK",
    });
  };

  const showConfirmDialog = (
    title,
    text,
    confirmButtonText = "Yes, proceed"
  ) => {
    return Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
  };

  const showLoadingAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  };

  // --- End of Swal Alert Functions ---

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reviewsRes, usersRes, shopsRes] = await Promise.all([
          fetch("/api/reviews"),
          fetch("/api/users/dashboardUser"),
          fetch("/api/shops"),
        ]);

        const reviewsData = await reviewsRes.json();
        const usersData = await usersRes.json();
        const shopsData = await shopsRes.json();

        console.log(reviewsData, usersData, shopsData);

        setTotalReviews(reviewsData || []);

        const usersLookup = {};
        usersData.forEach((user) => {
          usersLookup[user._id] = user;
        });
        setUsers(usersLookup);

        const shopsLookup = {};
        shopsData.result?.forEach((shop) => {
          shopsLookup[shop._id] = shop;
        });
        setShops(shopsLookup);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        showErrorAlert("Error", "Failed to load reviews data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getUserData = (review) => {
    const user = users[review.userId];
    if (user) {
      return {
        name: user.name || "Unknown User",
        email: user.email || "No email",
        profileImage:
          user.profileImage || "https://i.ibb.co/990my6Yq/avater.png",
        phone: user.phone || "Not available",
      };
    }
    return {
      name: review.userName || "Unknown User",
      email: review.userEmail || "No email",
      profileImage: review.userPhoto || "https://i.ibb.co/990my6Yq/avater.png",
      phone: "Not available",
    };
  };

  const deleteReview = async (id) => {
  const result = await showConfirmDialog(
    "Delete Review",
    "Are you sure you want to delete this review? This action cannot be undone.",
    "Yes, Delete"
  );

  if (!result.isConfirmed) return;

  try {
    showLoadingAlert('Deleting...', 'Please wait while we delete the review');

    const res = await fetch(`/api/reviews/${id}`, {
      method: 'DELETE',
    });

    const data = await res.json();
    
    if (res.ok) {
      // Remove the review from the state
      setTotalReviews(prevReviews => 
        prevReviews.filter(review => review._id !== id)
      );
      
      // Close the detail modal if the deleted review is open
      if (selectedReview?._id === id) {
        setDetailModalOpen(false);
        setSelectedReview(null);
      }
      
      Swal.close();
      showSuccessAlert('Deleted!', 'Review has been deleted successfully');
    } else {
      throw new Error(data.error || 'Failed to delete review');
    }
  } catch (error) {
    console.error('Delete review error:', error);
    Swal.close();
    showErrorAlert('Error', error.message || 'Failed to delete review');
  }
};

  const filteredReviews = totalReviews.filter((review) => {
    const userData = getUserData(review);
    const shopData = shops[review.shopId];

    const matchesSearch =
      review.feedback?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shopData?.shop?.shopName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesRating =
      ratingFilter === "all" || review.rating.toString() === ratingFilter;

    return matchesSearch && matchesRating;
  });

  // const updateReviewStatus = async (reviewId, newStatus) => {
  //     const action = newStatus === 'approved' ? 'approve' : newStatus === 'rejected' ? 'reject' : 'set to pending';

  //     const result = await showConfirmDialog(
  //         `${action.charAt(0).toUpperCase() + action.slice(1)} Review`,
  //         `Are you sure you want to ${action} this review?`,
  //         `Yes, ${action.charAt(0).toUpperCase() + action.slice(1)}`
  //     );

  //     if (!result.isConfirmed) return;

  //     try {
  //         showLoadingAlert('Updating...', 'Please wait while we update the review status');

  //         const res = await fetch(`/api/reviews/${reviewId}`, {
  //             method: 'PATCH',
  //             headers: {
  //                 'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({ status: newStatus }),
  //         });

  //         if (res.ok) {
  //             setTotalReviews(prevReviews =>
  //                 prevReviews.map(review =>
  //                     review._id === reviewId ? { ...review, status: newStatus } : review
  //                 )
  //             );
  //             Swal.close();
  //             showSuccessAlert('Success!', `Review has been ${action}d successfully`);
  //             if (selectedReview?._id === reviewId) {
  //                 setSelectedReview(prev => ({ ...prev, status: newStatus }));
  //             }
  //         } else {
  //             throw new Error('Failed to update review status');
  //         }
  //     } catch (error) {
  //         console.error('Failed to update review status:', error);
  //         Swal.close();
  //         showErrorAlert('Error', `Failed to ${action} review`);
  //     }
  // };

  // const getStatusBadge = (status) => {
  //     const base = "px-2 sm:px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap";
  //     switch (status) {
  //         case "c":
  //             // DaisyUI success colors
  //             return <span className={`${base} bg-success/20 text-success border-success/40`}>Approved</span>;
  //         case "pending":
  //             // DaisyUI warning colors
  //             return <span className={`${base} bg-warning/20 text-warning border-warning/40`}>Pending</span>;
  //         case "rejected":
  //             // DaisyUI error colors
  //             return <span className={`${base} bg-error/20 text-error border-error/40`}>Rejected</span>;
  //         default:
  //             // DaisyUI neutral colors
  //             return <span className={`${base} bg-base-300/50 text-base-content border-neutral/40`}>Unknown</span>;
  //     }
  // };

  const renderStars = (rating) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          // Use a fixed yellow for rating stars (often desired regardless of theme)
          className={
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-base-300"
          }
        />
      ))}
      <span className="ml-1 text-sm font-medium text-base-content/70">
        ({rating}.0)
      </span>
    </div>
  );

  const openDetailModal = (review) => {
    setSelectedReview(review);
    setDetailModalOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stats = {
    total: totalReviews.length,
    fiveStar: totalReviews.filter((r) => r.rating === 5).length,
    fourStar: totalReviews.filter((r) => r.rating === 4).length,
    threeStar: totalReviews.filter((r) => r.rating === 3).length,
  };

  const StatCard = ({ icon: Icon, value, label, color = "primary" }) => {
    const colorClasses = {
      primary: {
        bg: "bg-primary/10",
        bgHover: "group-hover:bg-primary/20",
        text: "text-primary",
        border: "border-primary/20",
      },
      green: {
        bg: "bg-success/10",
        bgHover: "group-hover:bg-success/20",
        text: "text-success",
        border: "border-success/20",
      },
      blue: {
        bg: "bg-info/10",
        bgHover: "group-hover:bg-info/20",
        text: "text-info",
        border: "border-info/20",
      },
      purple: {
        bg: "bg-accent/10",
        bgHover: "group-hover:bg-accent/20",
        text: "text-accent",
        border: "border-accent/20",
      },
      yellow: {
        bg: "bg-warning/10",
        bgHover: "group-hover:bg-warning/20",
        text: "text-warning",
        border: "border-warning/20",
      },
    };
    const classes = colorClasses[color] || colorClasses.primary;

    return (
      <div
        className={`bg-base-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${classes.border} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group`}
      >
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

  const ReviewMobileCard = ({ review }) => {
    const userData = getUserData(review);
    const shopData = shops[review.shopId];
    return (
      <div className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-lg hover:shadow-xl transition-all duration-200">
        <div className="flex items-start gap-3 mb-3">
          <img
            src={userData.profileImage}
            alt={userData.name}
            className="w-12 h-12 rounded-lg object-cover border-2 border-primary/40 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base-content truncate">
              {userData.name}
            </p>
            <p className="text-xs text-base-content/70 truncate">
              {userData.email}
            </p>
            <div className="mt-1">{renderStars(review.rating)}</div>
          </div>
        </div>
        {/* Shop info container uses a success background for visibility */}
        <div className="bg-success/10 rounded-lg p-3 mb-3 border border-success/20">
          <div className="flex items-center gap-2 mb-1">
            <Store size={14} className="text-success flex-shrink-0" />
            <p className="text-sm font-semibold text-base-content truncate">
              {shopData?.shop?.shopName || "Unknown Shop"}
            </p>
          </div>
          <p className="text-xs text-base-content/70 ml-6 truncate">
            {shopData?.shop?.address?.city || "Location not available"}
          </p>
        </div>
        <p className="text-sm text-base-content/90 mb-3 line-clamp-2">
          {review.feedback || "No feedback provided"}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-base-300 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* {getStatusBadge(review.status)} */}
            <span className="text-xs text-base-content/60">
              {formatDateShort(review.createdAt || Date.now())}
            </span>
          </div>
          <div className="flex gap-2">
            {/* {review.status === "pending" && (
                                <>
                                    <button
                                        onClick={() => updateReviewStatus(review._id, "approved")}
                                        className="p-2 bg-success/10 text-success rounded-lg border border-success/30 hover:bg-success/20 transition-colors"
                                        title="Approve"
                                    >
                                        <Check size={14} />
                                    </button>
                                    <button
                                        onClick={() => updateReviewStatus(review._id, "rejected")}
                                        className="p-2 bg-error/10 text-error rounded-lg border border-error/30 hover:bg-error/20 transition-colors"
                                        title="Reject"
                                    >
                                        <X size={14} />
                                    </button>
                                </>
                            )}
                            {(review.status === "approved" || review.status === "rejected") && (
                                <button
                                    onClick={() => updateReviewStatus(review._id, "pending")}
                                    className="p-2 bg-warning/10 text-warning rounded-lg border border-warning/30 hover:bg-warning/20 transition-colors"
                                    title="Set Pending"
                                >
                                    <Clock size={14} />
                                </button>
                            )} */}
            <button
              onClick={() => openDetailModal(review)}
              className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/30 hover:bg-primary/20 transition-colors"
              title="View Details"
            >
              <Eye size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading)
    return (
      // Loading uses primary color and base background
      <div className="flex items-center justify-center h-screen w-full bg-base-200">
        <span className="loading loading-bars loading-xl text-primary"></span>
      </div>
    );

  return (
    // Main container uses base-200 background
    <div className="min-h-screen w-full p-3 sm:p-4 lg:p-6 mx-auto bg-base-200">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-1 sm:mb-2">
          Reviews Management
        </h1>
        <p className="text-base-content/70 text-sm sm:text-base lg:text-lg">
          Manage and moderate all customer reviews in the platform
        </p>
      </div>

      {/* Stat Cards - Colors updated to use DaisyUI semantic colors */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <StatCard
          icon={MessageSquare}
          value={stats.total}
          label="Total Reviews"
          color="primary"
        />
        <StatCard
          icon={Star}
          value={stats.fiveStar}
          label="5 Star Reviews"
          color="yellow"
        />{" "}
        {/* warning */}
        <StatCard
          icon={Star}
          value={stats.fourStar}
          label="4 Star Reviews"
          color="blue"
        />{" "}
        {/* info */}
        <StatCard
          icon={Star}
          value={stats.threeStar}
          label="3 Star Reviews"
          color="purple"
        />{" "}
        {/* accent */}
      </div>

      {/* Main Content Card - uses base-100 background */}
      <div className="bg-base-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-base-300 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3 w-full mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60"
              size={18}
            />
            <input
              type="text"
              placeholder="Search reviews, users, shops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // Input styling updated
              className="pl-10 pr-4 py-2.5 sm:py-3 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary w-full text-sm text-base-content"
            />
          </div>
          {/* Rating Filter Select */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            // Select styling updated
            className="px-3 sm:px-4 py-2.5 sm:py-3 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-base-content"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        {/* Mobile View */}
        <div className="block xl:hidden space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((r) => (
              <ReviewMobileCard key={r._id} review={r} />
            ))
          ) : (
            <div className="text-center py-12">
              <MessageSquare
                size={48}
                className="mx-auto text-base-content/30"
              />
              <p className="text-base-content/70">No reviews</p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden xl:block rounded-2xl border border-base-300 overflow-x-auto">
          <table className="min-w-full divide-y divide-base-300">
            <thead className="bg-base-300">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">
                  Review & User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">
                  Shop Details
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">
                  Created
                </th>
                {/* <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Status</th> */}
                <th className="px-6 py-4 text-center text-sm font-semibold text-base-content">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-base-100 divide-y divide-base-300">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => {
                  const userData = getUserData(review);
                  const shopData = shops[review.shopId];
                  return (
                    <tr
                      key={review._id}
                      className="hover:bg-base-200 transition-colors"
                    >
                      <td className="px-6 py-4 flex items-start gap-3">
                        <img
                          src={userData.profileImage}
                          className="w-12 h-12 rounded-xl border-2 border-primary/40"
                        />
                        <div>
                          <p className="text-sm font-semibold text-base-content">
                            {userData.name}
                          </p>
                          <p className="text-sm text-base-content/90">
                            {(review.feedback?.length > 50
                              ? review.feedback.substring(0, 50) + "..."
                              : review.feedback) || "No feedback"}
                          </p>
                          <button
                            onClick={() => {
                              setSelectedReview(review);
                              setDetailModalOpen(true);
                            }}
                            className="text-primary flex items-center gap-1 text-sm hover:text-secondary transition-colors"
                          >
                            <Eye size={14} />
                            View
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 space-y-2">
                        {/* Shop info card uses primary/secondary background */}
                        <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl border border-primary/20 w-50">
                          <Store size={30} className="text-success" />
                          <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate w-40 line-clamp-2 text-base-content">
                              {shopData?.shop?.shopName || "Unknown Shop"}
                            </p>
                            <p className="text-xs text-base-content/70 truncate w-40">
                              {shopData?.shop?.address?.city || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {renderStars(review.rating)}
                      </td>
                      <td className="px-6 py-4 text-base-content/90">
                        {formatDate(review.createdAt)}
                      </td>
                      {/* <td className="px-6 py-4">{getStatusBadge(review.status)}</td> */}
                      <td className="px-6 py-4 flex justify-center gap-2">
                        <button
                          onClick={()=>deleteReview(review._id)}
                          className="p-1.5 bg-error/10 text-error rounded-lg border border-error/30 hover:bg-error/20 transition-colors"
                          title="Delete"
                        >
                          <Trash size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedReview(review);
                            setDetailModalOpen(true);
                          }}
                          className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/30 hover:bg-primary/20 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <MessageSquare
                      size={48}
                      className="mx-auto text-base-content/30"
                    />
                    <p className="text-base-content/70">No reviews found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Detail Modal */}
        {detailModalOpen && selectedReview && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-base-content/20 z-50 p-4">
            <div className="bg-base-100 rounded-3xl p-8 w-full max-w-4xl border border-base-300 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-base-content">
                  Review Details
                </h2>
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="p-2 bg-base-200 text-base-content rounded-xl border border-base-300 hover:bg-base-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-6">
                {/* User Info Header Card */}
                <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-xl border border-primary/20">
                  <img
                    src={getUserData(selectedReview).profileImage}
                    className="w-16 h-16 rounded-xl border-2 border-base-100"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-base-content">
                      {getUserData(selectedReview).name}
                    </h3>
                    {/* <div className="flex items-center gap-4 mt-1">{getStatusBadge(selectedReview.status)}<span className="text-sm text-base-content/70">Created: {formatDate(selectedReview.createdAt)}</span></div> */}
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* User Info Card (Info Color) */}
                  <div className="p-4 bg-info/10 rounded-xl border border-info/20 text-base-content">
                    <p className="font-semibold text-info mb-1">User Info</p>
                    <div className="text-base-content/90">
                      <p>
                        <Mail size={14} className="inline mr-1 text-info" />
                        {getUserData(selectedReview).email}
                      </p>
                      <p>
                        <Phone size={14} className="inline mr-1 text-info" />
                        {getUserData(selectedReview).phone}
                      </p>
                    </div>
                  </div>
                  {/* Shop Info Card (Success Color) */}
                  <div className="p-4 bg-success/10 rounded-xl border border-success/20 text-base-content">
                    <p className="font-semibold text-success mb-1">Shop Info</p>
                    <p className="text-base-content/90">
                      <Store size={14} className="inline mr-1 text-success" />
                      {shops[selectedReview.shopId]?.shop?.shopName ||
                        "Unknown Shop"}
                    </p>
                  </div>
                  {/* Rating & Feedback Card (Accent Color) */}
                  <div className="p-4 bg-accent/10 rounded-xl border border-accent/20 text-base-content">
                    <p className="font-semibold text-accent mb-1 ">
                      Rating & Feedback
                    </p>
                    {renderStars(selectedReview.rating)}
                    <p className="bg-base-200 text-base-content rounded-lg border-2 border-base-300 p-2 mt-2">
                      {selectedReview.feedback || "No feedback"}
                    </p>
                  </div>
                  {/* Metadata Card (Neutral Color) */}
                  <div className="p-4 bg-base-200 rounded-xl border border-base-300 text-base-content">
                    <p className="font-semibold text-base-content/90 mb-1">
                      Metadata
                    </p>
                    <p className="text-base-content/70">
                      Status: {selectedReview.status}
                    </p>
                    <p className="text-base-content/70">
                      Created: {formatDate(selectedReview.createdAt)}
                    </p>
                  </div>
                </div>
                {/* Modal Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setDetailModalOpen(false)}
                    className="px-6 py-2 bg-base-100 border border-base-300 text-base-content rounded-xl hover:bg-base-200 transition-colors"
                  >
                    Close
                  </button>
                  {selectedReview.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateReviewStatus(selectedReview._id, "approved")
                        }
                        className="px-6 py-3 bg-success text-success-content rounded-xl hover:bg-success/80 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          updateReviewStatus(selectedReview._id, "rejected")
                        }
                        className="px-6 py-3 bg-error text-error-content rounded-xl hover:bg-error/80 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {(selectedReview.status === "approved" ||
                    selectedReview.status === "rejected") && (
                    <button
                      onClick={() =>
                        updateReviewStatus(selectedReview._id, "pending")
                      }
                      className="px-6 py-3 bg-warning text-warning-content rounded-xl hover:bg-warning/80 transition-colors"
                    >
                      Set Pending
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
