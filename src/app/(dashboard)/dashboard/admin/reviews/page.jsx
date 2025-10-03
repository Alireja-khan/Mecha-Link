"use client";

import React, { useState, useEffect } from 'react';
import {
    Star, Search, Shield, CheckCircle, XCircle, Clock, User, Store,
    MessageSquare, Calendar, Check, X, Eye, Download, Mail, Phone
} from 'lucide-react';
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

    const showSuccessAlert = (title, message) => {
        Swal.fire({
            title,
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
            title,
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
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f97316',
            cancelButtonColor: '#6b7280',
            confirmButtonText,
            cancelButtonText: 'Cancel',
            background: '#fff',
            color: '#1f2937',
            iconColor: '#eab308',
            reverseButtons: true
        });
    };

    const showLoadingAlert = (title, text) => {
        Swal.fire({
            title,
            text,
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
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

    const getUserData = (review) => {
        const user = users[review.userId];
        if (user) {
            return {
                name: user.name || 'Unknown User',
                email: user.email || 'No email',
                profileImage: user.profileImage || 'https://i.ibb.co/990my6Yq/avater.png',
                phone: user.phone || 'Not available'
            };
        }
        return {
            name: review.userName || 'Unknown User',
            email: review.userEmail || 'No email',
            profileImage: review.userPhoto || 'https://i.ibb.co/990my6Yq/avater.png',
            phone: 'Not available'
        };
    };

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
                if (selectedReview?._id === reviewId) {
                    setSelectedReview(prev => ({ ...prev, status: newStatus }));
                }
            } else {
                throw new Error('Failed to update review status');
            }
        } catch (error) {
            console.error('Failed to update review status:', error);
            Swal.close();
            showErrorAlert('Error', `Failed to ${action} review`);
        }
    };

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

    const renderStars = (rating) => (
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

    const openDetailModal = (review) => {
        setSelectedReview(review);
        setDetailModalOpen(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const formatDateShort = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const stats = {
        total: totalReviews.length,
        fiveStar: totalReviews.filter(r => r.rating === 5).length,
        fourStar: totalReviews.filter(r => r.rating === 4).length,
        threeStar: totalReviews.filter(r => r.rating === 3).length,
    };

    const StatCard = ({ icon: Icon, value, label, color = "orange" }) => {
        const colorClasses = {
            orange: { bg: "bg-orange-500/10", bgHover: "group-hover:bg-orange-500/20", text: "text-orange-600" },
            green: { bg: "bg-green-500/10", bgHover: "group-hover:bg-green-500/20", text: "text-green-600" },
            blue: { bg: "bg-blue-500/10", bgHover: "group-hover:bg-blue-500/20", text: "text-blue-600" },
            purple: { bg: "bg-purple-500/10", bgHover: "group-hover:bg-purple-500/20", text: "text-purple-600" },
            yellow: { bg: "bg-yellow-500/10", bgHover: "group-hover:bg-yellow-500/20", text: "text-yellow-600" }
        };
        const classes = colorClasses[color] || colorClasses.orange;

        return (
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
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

    const ReviewMobileCard = ({ review }) => {
        const userData = getUserData(review);
        const shopData = shops[review.shopId];
        return (
            <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-3 mb-3">
                    <img
                        src={userData.profileImage}
                        alt={userData.name}
                        className="w-12 h-12 rounded-lg object-cover border-2 border-orange-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{userData.name}</p>
                        <p className="text-xs text-gray-600 truncate">{userData.email}</p>
                        <div className="mt-1">{renderStars(review.rating)}</div>
                    </div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Store size={14} className="text-green-600 flex-shrink-0" />
                        <p className="text-sm font-semibold text-gray-900 truncate">{shopData?.shop?.shopName || 'Unknown Shop'}</p>
                    </div>
                    <p className="text-xs text-gray-600 ml-6 truncate">{shopData?.shop?.address?.city || 'Location not available'}</p>
                </div>
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{review.feedback || "No feedback provided"}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(review.status)}
                        <span className="text-xs text-gray-500">{formatDateShort(review.createdAt || Date.now())}</span>
                    </div>
                    <div className="flex gap-2">
                        {review.status === "pending" && (
                            <>
                                <button
                                    onClick={() => updateReviewStatus(review._id, "approved")}
                                    className="p-2 bg-green-500/10 text-green-600 rounded-lg border border-green-200 hover:bg-green-500/20 transition-colors"
                                    title="Approve"
                                >
                                    <Check size={14} />
                                </button>
                                <button
                                    onClick={() => updateReviewStatus(review._id, "rejected")}
                                    className="p-2 bg-red-500/10 text-red-600 rounded-lg border border-red-200 hover:bg-red-500/20 transition-colors"
                                    title="Reject"
                                >
                                    <X size={14} />
                                </button>
                            </>
                        )}
                        {(review.status === "approved" || review.status === "rejected") && (
                            <button
                                onClick={() => updateReviewStatus(review._id, "pending")}
                                className="p-2 bg-yellow-500/10 text-yellow-600 rounded-lg border border-yellow-200 hover:bg-yellow-500/20 transition-colors"
                                title="Set Pending"
                            >
                                <Clock size={14} />
                            </button>
                        )}
                        <button
                            onClick={() => openDetailModal(review)}
                            className="p-2 bg-orange-500/10 text-orange-600 rounded-lg border border-orange-200 hover:bg-orange-500/20 transition-colors"
                            title="View Details"
                        >
                            <Eye size={14} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen w-full">
            <span className="loading loading-bars loading-xl text-orange-500"></span>
        </div>
    );

    return (
        <div className="min-h-screen w-full p-3 sm:p-4 lg:p-6 mx-auto">
            <div className="mb-4 sm:mb-6 lg:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Reviews Management</h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Manage and moderate all customer reviews in the platform</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                <StatCard icon={MessageSquare} value={stats.total} label="Total Reviews" color="orange" />
                <StatCard icon={Star} value={stats.fiveStar} label="5 Star Reviews" color="yellow" />
                <StatCard icon={Star} value={stats.fourStar} label="4 Star Reviews" color="blue" />
                <StatCard icon={Star} value={stats.threeStar} label="3 Star Reviews" color="purple" />
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-orange-100 shadow-xl">
                <div className="flex flex-col sm:flex-row gap-3 w-full mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search reviews, users, shops..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 sm:py-3 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 w-full text-sm"
                        />
                    </div>
                    <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="px-3 sm:px-4 py-2.5 sm:py-3 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 text-sm"
                    >
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>

                <div className="block xl:hidden space-y-4">
                    {filteredReviews.length > 0 ? filteredReviews.map(r => <ReviewMobileCard key={r._id} review={r} />) : <div className="text-center py-12"><MessageSquare size={48} className="mx-auto text-gray-300" /><p className="text-gray-500">No reviews</p></div>}
                </div>

                <div className="hidden xl:block rounded-2xl border border-orange-100 overflow-x-auto">
                    <table className="min-w-full divide-y divide-orange-100">
                        <thead className="bg-orange-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">Review & User</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">Shop Details</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">Rating</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">Created</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-orange-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-orange-100">
                            {filteredReviews.length > 0 ? filteredReviews.map(review => {
                                const userData = getUserData(review); const shopData = shops[review.shopId];
                                return (
                                    <tr key={review._id} className="hover:bg-orange-50/30 transition-colors">
                                        <td className="px-6 py-4 flex items-start gap-3">
                                            <img src={userData.profileImage} className="w-12 h-12 rounded-xl border-2 border-orange-200" />
                                            <div>
                                                <p className="text-sm font-semibold">{userData.name}</p>
                                                <p className="text-sm text-gray-700">
                                                    {(review.feedback?.length > 50
                                                        ? review.feedback.substring(0, 50) + '...'
                                                        : review.feedback) || 'No feedback'}
                                                </p>
                                                <button onClick={() => { setSelectedReview(review); setDetailModalOpen(true) }} className="text-orange-500 flex items-center gap-1 text-sm"><Eye size={14} />View</button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 space-y-2">
                                            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-200 w-50">
                                                <Store size={30} className="text-green-600" />
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-semibold truncate w-40 line-clamp-2">{shopData?.shop?.shopName || 'Unknown Shop'}</p>
                                                    <p className="text-xs text-gray-600 truncate w-40">{shopData?.shop?.address?.city || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{renderStars(review.rating)}</td>
                                        <td className="px-6 py-4">{formatDate(review.createdAt)}</td>
                                        <td className="px-6 py-4">{getStatusBadge(review.status)}</td>
                                        <td className="px-6 py-4 flex justify-center gap-2">
                                            {review.status === "pending" && <>
                                                <button onClick={() => updateReviewStatus(review._id, "approved")} className="p-2 bg-green-500/10 text-green-600 rounded-xl border border-green-200"><Check size={16} /></button>
                                                <button onClick={() => updateReviewStatus(review._id, "rejected")} className="p-2 bg-red-500/10 text-red-600 rounded-xl border border-red-200"><X size={16} /></button>
                                            </>}
                                            {(review.status === "approved" || review.status === "rejected") && <button onClick={() => updateReviewStatus(review._id, "pending")} className="p-2 bg-yellow-500/10 text-yellow-600 rounded-xl border border-yellow-200"><Clock size={16} /></button>}
                                            <button onClick={() => { setSelectedReview(review); setDetailModalOpen(true) }} className="p-2 bg-orange-500/10 text-orange-600 rounded-xl border border-orange-200"><Eye size={16} /></button>
                                        </td>
                                    </tr>
                                );
                            }) : <tr><td colSpan={6} className="text-center py-12"><MessageSquare size={48} className="mx-auto text-gray-300" /><p className="text-gray-500">No reviews found</p></td></tr>}
                        </tbody>
                    </table>
                </div>

                {detailModalOpen && selectedReview && (
                    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-4">
                        <div className="bg-white rounded-3xl p-8 w-full max-w-4xl border border-orange-100 shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Review Details</h2>
                                <button onClick={() => setDetailModalOpen(false)} className="p-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-200"><X size={20} /></button>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                                    <img src={getUserData(selectedReview).profileImage} className="w-16 h-16 rounded-xl border-2 border-white" />
                                    <div>
                                        <h3 className="text-xl font-bold">{getUserData(selectedReview).name}</h3>
                                        <div className="flex items-center gap-4 mt-1">{getStatusBadge(selectedReview.status)}<span className="text-sm text-gray-500">Created: {formatDate(selectedReview.createdAt)}</span></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                        <p className="font-semibold text-blue-900 mb-1">User Info</p>
                                        <p>{getUserData(selectedReview).email}</p>
                                        <p>{getUserData(selectedReview).phone}</p>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                        <p className="font-semibold text-green-900 mb-1">Shop Info</p>
                                        <p>{shops[selectedReview.shopId]?.shop?.shopName || 'Unknown Shop'}</p>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                                        <p className="font-semibold text-purple-900 mb-1">Rating & Feedback</p>
                                        {renderStars(selectedReview.rating)}
                                        <p className='bg-white rounded-lg border-2 border-gray-200 p-2 mt-1'>{selectedReview.feedback || 'No feedback'}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <p className="font-semibold text-gray-900 mb-1">Metadata</p>
                                        <p>Status: {selectedReview.status}</p>
                                        <p>Created: {formatDate(selectedReview.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button onClick={() => setDetailModalOpen(false)} className="px-6 py-2 bg-white border border-gray-200 rounded-xl hover:bg-orange-50">Close</button>
                                    {selectedReview.status === "pending" && <>
                                        <button onClick={() => updateReviewStatus(selectedReview._id, "approved")} className="px-6 py-3 bg-green-500 text-white rounded-xl">Approve</button>
                                        <button onClick={() => updateReviewStatus(selectedReview._id, "rejected")} className="px-6 py-3 bg-red-500 text-white rounded-xl">Reject</button>
                                    </>}
                                    {(selectedReview.status === "approved" || selectedReview.status === "rejected") && <button onClick={() => updateReviewStatus(selectedReview._id, "pending")} className="px-6 py-3 bg-yellow-500 text-white rounded-xl">Set Pending</button>}
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