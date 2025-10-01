"use client"

import React, { useState, useEffect } from 'react';
import { Star, Search, Filter, Shield, CheckCircle, XCircle, Clock, User, Store, MessageSquare, Calendar, Check, X, Eye, Download, Mail, Phone } from 'lucide-react';
import Swal from 'sweetalert2';

const Page = () => {
    const [totalReviews, setTotalReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [users, setUsers] = useState({});
    const [shops, setShops] = useState({});
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    // SweetAlert2 Functions
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [reviewsRes, usersRes, shopsRes] = await Promise.all([
                    fetch("/api/reviews"),
                    fetch("/api/users/dashboardUser"),
                    fetch("/api/shops")
                ]);

                const reviewsData = await reviewsRes.json();
                const usersData = await usersRes.json();
                const shopsData = await shopsRes.json();

                setTotalReviews(reviewsData || []);
                
                // Create lookup objects for users and shops
                const usersLookup = {};
                usersData.forEach(user => {
                    usersLookup[user._id] = user;
                });
                setUsers(usersLookup);

                const shopsLookup = {};
                shopsData.result?.forEach(shop => {
                    shopsLookup[shop._id] = shop;
                });
                setShops(shopsLookup);

            } catch (err) {
                console.error("Failed to fetch data:", err);
                showErrorAlert('Error', 'Failed to load reviews data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Get user data for a review
    const getUserData = (review) => {
        const user = users[review.userId];
        if (user) {
            return {
                name: user.name || 'Unknown User',
                email: user.email || 'No email',
                profileImage: user.profileImage || 'https://i.ibb.co.com/990my6Yq/avater.png',
                phone: user.phone || 'Not available'
            };
        }
        
        // Fallback to review data (if user data is embedded in review)
        return {
            name: review.userName || 'Unknown User',
            email: review.userEmail || 'No email',
            profileImage: review.userPhoto || 'https://i.ibb.co.com/990my6Yq/avater.png',
            phone: 'Not available'
        };
    };

    // Filter reviews based on search and filters
    const filteredReviews = totalReviews.filter(review => {
        const userData = getUserData(review);
        const shopData = shops[review.shopId];
        
        const matchesSearch = 
            review.feedback?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shopData?.shop?.shopName?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;

        return matchesSearch && matchesRating;
    });

    // Update review status
    const updateReviewStatus = async (reviewId, newStatus) => {
        const action = newStatus === 'approved' ? 'approve' : newStatus === 'rejected' ? 'reject' : 'set to pending';
        
        const result = await showConfirmDialog(
            `${action.charAt(0).toUpperCase() + action.slice(1)} Review`,
            `Are you sure you want to ${action} this review?`,
            `Yes, ${action.charAt(0).toUpperCase() + action.slice(1)}`
        );

        if (!result.isConfirmed) return;

        try {
            showLoadingAlert('Updating...', 'Please wait while we update the review status');
            
            const res = await fetch(`/api/reviews/${reviewId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                setTotalReviews(prevReviews =>
                    prevReviews.map(review =>
                        review._id === reviewId ? { ...review, status: newStatus } : review
                    )
                );
                Swal.close();
                showSuccessAlert('Success!', `Review has been ${action}d successfully`);
            } else {
                throw new Error('Failed to update review status');
            }
        } catch (error) {
            console.error('Failed to update review status:', error);
            Swal.close();
            showErrorAlert('Error', `Failed to ${action} review`);
        }
    };

    // Get status badge color
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

    // Render star rating
    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                ))}
                <span className="ml-1 text-sm font-medium text-gray-600">({rating}.0)</span>
            </div>
        );
    };

    const openDetailModal = (review) => {
        setSelectedReview(review);
        setDetailModalOpen(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Stats for the header - Updated to show star ratings
    const stats = {
        total: totalReviews.length,
        fiveStar: totalReviews.filter(review => review.rating === 5).length,
        fourStar: totalReviews.filter(review => review.rating === 4).length,
        threeStar: totalReviews.filter(review => review.rating === 3).length,
    };

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
            blue: {
                bg: "bg-blue-500/10",
                bgHover: "group-hover:bg-blue-500/20", 
                text: "text-blue-600"
            },
            purple: {
                bg: "bg-purple-500/10",
                bgHover: "group-hover:bg-purple-500/20",
                text: "text-purple-600"
            },
            yellow: {
                bg: "bg-yellow-500/10",
                bgHover: "group-hover:bg-yellow-500/20",
                text: "text-yellow-600"
            }
        };

        const classes = colorClasses[color] || colorClasses.orange;

        return (
            <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${classes.bg} ${classes.bgHover} transition-colors duration-300`}>
                        <Icon className={classes.text} size={24} />
                    </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
                <p className="text-gray-600 text-sm font-medium">{label}</p>
            </div>
        );
    };

    // Enhanced User & Shop cell in table
    const UserShopCell = ({ review }) => {
        const userData = getUserData(review);
        const shopData = shops[review.shopId];

        return (
            <td className="px-6 py-4">
                <div className="space-y-3">
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <img 
                            src={userData.profileImage} 
                            alt={userData.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {userData.name}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Mail size={12} />
                                <span className="truncate">{userData.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shop Info */}
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                        <Store size={16} className="text-green-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {shopData?.shop?.shopName || 'Unknown Shop'}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                                {shopData?.shop?.address?.city || 'Location not available'}
                            </p>
                        </div>
                    </div>
                </div>
            </td>
        );
    };

    // Enhanced Review Details cell
    const ReviewDetailsCell = ({ review }) => {
        const userData = getUserData(review);
        
        return (
            <td className="px-6 py-4">
                <div className="flex items-start gap-3">
                    <img 
                        src={userData.profileImage} 
                        alt={userData.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-orange-200"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                            {userData.name}
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                            {review.feedback || "No feedback provided"}
                        </p>
                        <button
                            onClick={() => openDetailModal(review)}
                            className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1 transition-colors duration-200 mt-1"
                        >
                            <Eye size={14} />
                            View details
                        </button>
                    </div>
                </div>
            </td>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen">
                <span className="loading loading-bars loading-xl text-orange-500"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 mx-auto">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Reviews Management</h1>
                <p className="text-gray-600 text-lg">Manage and moderate all customer reviews in the platform</p>
            </div>

            {/* Stats Overview - Updated to show star ratings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={MessageSquare} value={stats.total} label="Total Reviews" color="orange" />
                <StatCard icon={Star} value={stats.fiveStar} label="5 Star Reviews" color="yellow" />
                <StatCard icon={Star} value={stats.fourStar} label="4 Star Reviews" color="blue" />
                <StatCard icon={Star} value={stats.threeStar} label="3 Star Reviews" color="purple" />
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-xl">
                {/* Header with Search and Actions */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">All Reviews</h2>
                        <p className="text-gray-600">Manage review approvals and moderation</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search reviews, users, shops..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300 w-full lg:w-64"
                            />
                        </div>

                        {/* Filters - Only Rating Filter */}
                        <div className="flex gap-3">
                            <select
                                value={ratingFilter}
                                onChange={(e) => setRatingFilter(e.target.value)}
                                className="px-4 py-3 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300"
                            >
                                <option value="all">All Ratings</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>

                            <button className="flex items-center gap-2 px-4 py-3 bg-orange-50 text-orange-700 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200">
                                <Download size={16} />
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Table */}
                <div className="rounded-2xl border border-orange-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-orange-100">
                        <thead className="bg-orange-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                                    Review & User
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                                    User & Shop Details
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                                    Rating
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
                                        <p className="text-gray-500 mt-2">Loading reviews...</p>
                                    </td>
                                </tr>
                            ) : filteredReviews.length > 0 ? (
                                filteredReviews.map((review) => (
                                    <tr key={review._id} className="hover:bg-orange-50/30 transition-colors duration-200">
                                        <ReviewDetailsCell review={review} />
                                        <UserShopCell review={review} />
                                        <td className="px-6 py-4">
                                            {renderStars(review.rating)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-orange-500" />
                                                <span className="text-sm text-gray-700">
                                                    {formatDate(review.createdAt || Date.now())}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(review.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                {review.status === "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => updateReviewStatus(review._id, "approved")}
                                                            className="p-2 bg-green-500/10 text-green-600 rounded-xl border border-green-200 hover:bg-green-500/20 hover:scale-105 transition-all duration-200"
                                                            title="Approve"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => updateReviewStatus(review._id, "rejected")}
                                                            className="p-2 bg-red-500/10 text-red-600 rounded-xl border border-red-200 hover:bg-red-500/20 hover:scale-105 transition-all duration-200"
                                                            title="Reject"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                {(review.status === "approved" || review.status === "rejected") && (
                                                    <button
                                                        onClick={() => updateReviewStatus(review._id, "pending")}
                                                        className="p-2 bg-yellow-500/10 text-yellow-600 rounded-xl border border-yellow-200 hover:bg-yellow-500/20 hover:scale-105 transition-all duration-200"
                                                        title="Set Pending"
                                                    >
                                                        <Clock size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => openDetailModal(review)}
                                                    className="p-2 bg-orange-500/10 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-500/20 hover:scale-105 transition-all duration-200"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-12">
                                        <div className="flex flex-col items-center gap-3">
                                            <MessageSquare className="text-gray-300" size={48} />
                                            <p className="text-gray-500 text-lg">No reviews found</p>
                                            <p className="text-gray-400 text-sm">
                                                {searchTerm ? "Try adjusting your search terms" : "No reviews submitted yet"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Enhanced Detail Modal */}
            {detailModalOpen && selectedReview && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-4xl border border-orange-100 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Review Details</h2>
                            <button
                                onClick={() => setDetailModalOpen(false)}
                                className="p-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Header with User Info */}
                            <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                                <img 
                                    src={getUserData(selectedReview).profileImage} 
                                    alt={getUserData(selectedReview).name}
                                    className="w-16 h-16 rounded-xl object-cover border-2 border-white"
                                />
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {getUserData(selectedReview).name}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-sm text-gray-600">
                                            {getStatusBadge(selectedReview.status)}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Created: {formatDate(selectedReview.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Review Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Enhanced User Information */}
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                        <User size={18} />
                                        User Information
                                    </h5>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={getUserData(selectedReview).profileImage} 
                                                alt={getUserData(selectedReview).name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-blue-800">{getUserData(selectedReview).name}</p>
                                                <p className="text-sm text-blue-600">{getUserData(selectedReview).email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-blue-700">
                                            <Phone size={14} />
                                            <span>{getUserData(selectedReview).phone}</span>
                                        </div>
                                        <p className="text-sm text-blue-700"><strong>User ID:</strong> {selectedReview.userId}</p>
                                    </div>
                                </div>

                                {/* Shop Information */}
                                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                    <h5 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                                        <Store size={18} />
                                        Shop Information
                                    </h5>
                                    <div className="space-y-2">
                                        <p className="text-sm text-green-700"><strong>Shop Name:</strong> {shops[selectedReview.shopId]?.shop?.shopName || 'Unknown Shop'}</p>
                                        <p className="text-sm text-green-700"><strong>Owner:</strong> {shops[selectedReview.shopId]?.ownerName || 'Not available'}</p>
                                        <p className="text-sm text-green-700"><strong>Address:</strong> {
                                            shops[selectedReview.shopId]?.shop?.address ? 
                                            `${shops[selectedReview.shopId].shop.address.street || ''}, ${shops[selectedReview.shopId].shop.address.city || ''}, ${shops[selectedReview.shopId].shop.address.country || ''}` 
                                            : 'Not available'
                                        }</p>
                                        <p className="text-sm text-green-700"><strong>Shop ID:</strong> {selectedReview.shopId}</p>
                                    </div>
                                </div>

                                {/* Rating & Feedback */}
                                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                                    <h5 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                                        <Star size={18} />
                                        Rating & Feedback
                                    </h5>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            {renderStars(selectedReview.rating)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-purple-700 mb-1">Feedback:</p>
                                            <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border">
                                                {selectedReview.feedback || "No feedback provided"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Review Metadata */}
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Calendar size={18} />
                                        Review Metadata
                                    </h5>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-700"><strong>Status:</strong> <span className="font-semibold capitalize">{selectedReview.status}</span></p>
                                        <p className="text-sm text-gray-700"><strong>Created:</strong> {formatDate(selectedReview.createdAt)}</p>
                                        {selectedReview.updatedAt && selectedReview.updatedAt !== selectedReview.createdAt && (
                                            <p className="text-sm text-gray-700"><strong>Last Updated:</strong> {formatDate(selectedReview.updatedAt)}</p>
                                        )}
                                        <p className="text-sm text-gray-700"><strong>Review ID:</strong> {selectedReview._id}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setDetailModalOpen(false)}
                                    className="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border border-orange-200 hover:bg-orange-50 transition-all duration-300"
                                >
                                    Close
                                </button>
                                {selectedReview.status === "pending" && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setDetailModalOpen(false);
                                                updateReviewStatus(selectedReview._id, "approved");
                                            }}
                                            className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-green-600 hover:scale-105 shadow-lg hover:shadow-xl"
                                        >
                                            Approve Review
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDetailModalOpen(false);
                                                updateReviewStatus(selectedReview._id, "rejected");
                                            }}
                                            className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-red-600 hover:scale-105 shadow-lg hover:shadow-xl"
                                        >
                                            Reject Review
                                        </button>
                                    </>
                                )}
                                {(selectedReview.status === "approved" || selectedReview.status === "rejected") && (
                                    <button
                                        onClick={() => {
                                            setDetailModalOpen(false);
                                            updateReviewStatus(selectedReview._id, "pending");
                                        }}
                                        className="px-6 py-3 bg-yellow-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-yellow-600 hover:scale-105 shadow-lg hover:shadow-xl"
                                    >
                                        Set to Pending
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;