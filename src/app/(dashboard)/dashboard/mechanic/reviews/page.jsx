"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
    Star, 
    Search, 
    Filter, 
    Download, 
    Eye, 
    Edit, 
    Trash2, 
    Calendar,
    User,
    MessageSquare,
    Shield,
    Crown,
    TrendingUp,
    TrendingDown,
    ChevronDown,
    ChevronUp,
    MessageCircle,
    Mail,
    Check,
    X
} from "lucide-react";
import Swal from "sweetalert2";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";

// --- Utility Components (same as MechanicRequestsPage) ---
const StatCard = ({ icon: Icon, value, label, color = "primary" }) => {
    const colorClasses = {
        primary: {
            bg: "bg-primary/10",
            bgHover: "group-hover:bg-primary/20",
            text: "text-primary"
        },
        success: {
            bg: "bg-success/10",
            bgHover: "group-hover:bg-success/20",
            text: "text-success"
        },
        error: {
            bg: "bg-error/10",
            bgHover: "group-hover:bg-error/20",
            text: "text-error"
        },
        warning: {
            bg: "bg-warning/10",
            bgHover: "group-hover:bg-warning/20",
            text: "text-warning"
        }
    };

    const classes = colorClasses[color] || colorClasses.primary;

    return (
        <div className="bg-base-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-neutral shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-xl ${classes.bg} ${classes.bgHover} transition-colors duration-300`}>
                    <Icon className={classes.text} size={20} />
                </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-base-content mb-1">{value}</p>
            <p className="text-base-content/70 text-xs sm:text-sm font-medium">{label}</p>
        </div>
    );
};

const MechanicShopReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [selectedReviews, setSelectedReviews] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        averageRating: 0,
        fiveStar: 0,
        oneStar: 0,
        responded: 0
    });
    const [editingReview, setEditingReview] = useState(null);
    const [responseText, setResponseText] = useState("");
    const [shopId, setShopId] = useState(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const { user: loggedInUser, loading: userLoading } = useUser();
    const router = useRouter();

    // Function to truncate text without line breaks
    const truncateText = (text, maxLength = 60) => {
        if (!text) return 'No feedback provided';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // Open detail modal
    const openDetailModal = (review) => {
        setSelectedReview(review);
        setDetailModalOpen(true);
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    // Fetch shop ID and reviews
    const fetchShopAndReviews = useCallback(async () => {
        try {
            setLoading(true);
            
            // First, get the shop data for the logged-in user
            const shopRes = await fetch('/api/shops?email=' + encodeURIComponent(loggedInUser?.email));
            if (shopRes.ok) {
                const shopData = await shopRes.json();
                if (Array.isArray(shopData) && shopData.length > 0) {
                    const shop = shopData[0];
                    setShopId(shop._id);
                    
                    // Fetch reviews for this shop
                    const reviewsRes = await fetch(`/api/reviews?shopId=${shop._id}`);
                    if (reviewsRes.ok) {
                        const reviewsData = await reviewsRes.json();
                        setReviews(reviewsData);
                        setFilteredReviews(reviewsData);
                        calculateStats(reviewsData);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to load reviews",
                confirmButtonColor: 'var(--color-error)',
                background: 'var(--color-base-100)',
                color: 'var(--color-base-content)'
            });
        } finally {
            setLoading(false);
        }
    }, [loggedInUser]);

    useEffect(() => {
        fetchShopAndReviews();
    }, [fetchShopAndReviews]);

    // Calculate statistics
    const calculateStats = (reviewsData) => {
        const total = reviewsData.length;
        const averageRating = total > 0 
            ? (reviewsData.reduce((sum, review) => sum + (review.rating || 0), 0) / total).toFixed(1)
            : 0;
        const fiveStar = reviewsData.filter(review => review.rating === 5).length;
        const oneStar = reviewsData.filter(review => review.rating === 1).length;
        const responded = reviewsData.filter(review => review.response).length;

        setStats({
            total,
            averageRating,
            fiveStar,
            oneStar,
            responded
        });
    };

    // Apply filters and search
    useEffect(() => {
        let filtered = [...reviews];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(review =>
                review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.feedback?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(review => review.status === statusFilter);
        }

        // Rating filter
        if (ratingFilter !== "all") {
            filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
        }

        // Date filter
        if (dateFilter !== "all") {
            const now = new Date();
            const filterDate = new Date();
            
            switch (dateFilter) {
                case "today":
                    filterDate.setHours(0, 0, 0, 0);
                    filtered = filtered.filter(review => 
                        new Date(review.createdAt) >= filterDate
                    );
                    break;
                case "week":
                    filterDate.setDate(now.getDate() - 7);
                    filtered = filtered.filter(review => 
                        new Date(review.createdAt) >= filterDate
                    );
                    break;
                case "month":
                    filterDate.setMonth(now.getMonth() - 1);
                    filtered = filtered.filter(review => 
                        new Date(review.createdAt) >= filterDate
                    );
                    break;
                default:
                    break;
            }
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case "oldest":
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case "highest":
                    return (b.rating || 0) - (a.rating || 0);
                case "lowest":
                    return (a.rating || 0) - (b.rating || 0);
                default:
                    return 0;
            }
        });

        setFilteredReviews(filtered);
    }, [reviews, searchTerm, statusFilter, ratingFilter, dateFilter, sortBy]);

    // Handle review actions
    const handleDeleteReview = async (reviewId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: 'var(--color-error)',
            cancelButtonColor: 'var(--color-primary)',
            confirmButtonText: "Yes, delete it!",
            background: 'var(--color-base-100)',
            color: 'var(--color-base-content)'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/reviews/${reviewId}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    setReviews(reviews.filter(review => review._id !== reviewId));
                    Swal.fire({
                        title: "Deleted!",
                        text: "Review has been deleted.",
                        icon: "success",
                        confirmButtonColor: 'var(--color-success)',
                        background: 'var(--color-base-100)',
                        color: 'var(--color-base-content)'
                    });
                } else {
                    throw new Error("Failed to delete review");
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: "Failed to delete review.",
                    confirmButtonColor: 'var(--color-error)',
                    background: 'var(--color-base-100)',
                    color: 'var(--color-base-content)'
                });
            }
        }
    };

    const handleRespond = async (reviewId) => {
        if (!responseText.trim()) {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Please enter a response.",
                confirmButtonColor: 'var(--color-error)',
                background: 'var(--color-base-100)',
                color: 'var(--color-base-content)'
            });
            return;
        }

        try {
            const response = await fetch(`/api/reviews/${reviewId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    response: responseText,
                    respondedAt: new Date().toISOString()
                })
            });

            if (response.ok) {
                setReviews(reviews.map(review =>
                    review._id === reviewId
                        ? { ...review, response: responseText, respondedAt: new Date().toISOString() }
                        : review
                ));
                setResponseText("");
                setEditingReview(null);
                Swal.fire({
                    title: "Success!",
                    text: "Response sent successfully.",
                    icon: "success",
                    confirmButtonColor: 'var(--color-success)',
                    background: 'var(--color-base-100)',
                    color: 'var(--color-base-content)'
                });
            } else {
                throw new Error("Failed to send response");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Failed to send response.",
                confirmButtonColor: 'var(--color-error)',
                background: 'var(--color-base-100)',
                color: 'var(--color-base-content)'
            });
        }
    };

    const handleStatusUpdate = async (reviewId, newStatus) => {
        try {
            const response = await fetch(`/api/reviews/${reviewId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                setReviews(reviews.map(review =>
                    review._id === reviewId
                        ? { ...review, status: newStatus }
                        : review
                ));
                Swal.fire({
                    title: "Updated!",
                    text: "Status updated successfully.",
                    icon: "success",
                    confirmButtonColor: 'var(--color-success)',
                    background: 'var(--color-base-100)',
                    color: 'var(--color-base-content)'
                });
            } else {
                throw new Error("Failed to update status");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Failed to update status.",
                confirmButtonColor: 'var(--color-error)',
                background: 'var(--color-base-100)',
                color: 'var(--color-base-content)'
            });
        }
    };

    // Export reviews
    const exportReviews = () => {
        const csvContent = [
            ["Customer", "Email", "Rating", "Feedback", "Status", "Response", "Date"],
            ...filteredReviews.map(review => [
                review.userName,
                review.userEmail,
                review.rating,
                `"${review.feedback?.replace(/"/g, '""')}"`,
                review.status,
                `"${review.response?.replace(/"/g, '""') || ''}"`,
                new Date(review.createdAt).toLocaleDateString()
            ])
        ].map(row => row.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `reviews-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // Render star rating
    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        className={`${
                            i < rating
                                ? "fill-warning text-warning"
                                : "text-base-content/30"
                        }`}
                    />
                ))}
                <span className="ml-1 text-sm font-medium text-base-content">
                    {rating}.0
                </span>
            </div>
        );
    };

    // Status badge component (consistent with MechanicRequestsPage)
    const getStatusBadge = (status) => {
        const base = "px-2 sm:px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap";
        switch (status) {
            case "completed":
                return <span className={`${base} bg-success/10 text-success border-success/30`}>Completed</span>;
            case "in-progress":
                return <span className={`${base} bg-primary/10 text-primary border-primary/30`}>In Progress</span>;
            case "pending":
                return <span className={`${base} bg-warning/10 text-warning border-warning/30`}>Pending</span>;
            case "rejected":
                return <span className={`${base} bg-error/10 text-error border-error/30`}>Rejected</span>;
            default:
                return <span className={`${base} bg-base-300 text-base-content/80 border-neutral/20`}>Unknown</span>;
        }
    };

    // Format date utility (consistent with MechanicRequestsPage)
    const formatDateShort = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    // Mobile Card Component (consistent design pattern)
    const ReviewMobileCard = ({ review }) => (
        <div className="bg-base-100 p-4 rounded-xl border border-neutral/50 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="flex items-start gap-3 mb-3 border-b border-neutral/50 pb-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-content font-bold text-sm flex-shrink-0">
                    {review.userName?.charAt(0) || "U"}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base-content truncate">{review.userName || 'Anonymous Customer'}</p>
                    <div className="mb-2">
                        {renderStars(review.rating)}
                    </div>
                    <p className="text-xs text-base-content/70 truncate flex items-center gap-1">
                        <Mail size={12} className="text-base-content/40" />
                        {review.userEmail || 'No email provided'}
                    </p>
                </div>
                <div className="flex-shrink-0">
                    {getStatusBadge(review.status)}
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <p className="text-sm text-base-content whitespace-nowrap overflow-hidden text-ellipsis">
                    {truncateText(review.feedback, 60)}
                </p>
                
                {review.response && (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mt-2">
                        <div className="flex items-center gap-2 mb-1">
                            <Shield size={12} className="text-primary" />
                            <span className="font-semibold text-primary text-xs">
                                Your Response
                            </span>
                        </div>
                        <p className="text-primary text-sm">
                            {review.response}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between pt-3 flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-base-content/60 flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDateShort(review.createdAt)}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => openDetailModal(review)}
                        className="px-3 py-2 bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors flex items-center gap-1 text-sm"
                        title="View Details"
                    >
                        <Eye size={14} />
                        View
                    </button>
                    {!review.response && (
                        <button
                            onClick={() => {
                                setEditingReview(review._id);
                                setResponseText("");
                            }}
                            className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors"
                            title="Respond"
                        >
                            <MessageCircle size={16} />
                        </button>
                    )}
                    <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="p-2 bg-error/10 text-error rounded-lg border border-error/20 hover:bg-error/20 transition-colors"
                        title="Delete Review"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Response Input for Mobile */}
            {editingReview === review._id && (
                <div className="mt-4 p-3 bg-base-200 rounded-lg border border-neutral/30">
                    <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Type your response here..."
                        rows="3"
                        className="w-full px-3 py-2 border border-neutral/50 rounded-lg bg-base-100 focus:bg-base-100 focus:border-primary/50 text-sm focus:outline-none text-base-content"
                    />
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={() => handleRespond(review._id)}
                            className="px-3 py-1.5 bg-primary text-primary-content rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-1"
                        >
                            <Check size={14} />
                            Send
                        </button>
                        <button
                            onClick={() => {
                                setEditingReview(null);
                                setResponseText("");
                            }}
                            className="px-3 py-1.5 border border-neutral/50 text-base-content rounded-lg hover:bg-base-300 transition-colors text-sm font-medium flex items-center gap-1"
                        >
                            <X size={14} />
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-full bg-base-100">
                <span className="loading loading-bars loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full p-3 sm:p-4 lg:p-6 mx-auto bg-base-200">
            {/* Header */}
            <div className="mb-4 sm:mb-6 lg:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-1 sm:mb-2">Customer Reviews</h1>
                <p className="text-base-content/70 text-sm sm:text-base lg:text-lg">
                    Manage and respond to customer feedback
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                <StatCard icon={MessageSquare} value={stats.total} label="Total Reviews" color="primary" />
                <StatCard icon={Star} value={stats.averageRating} label="Average Rating" color="warning" />
                <StatCard icon={TrendingUp} value={stats.fiveStar} label="5-Star Reviews" color="success" />
                <StatCard icon={TrendingDown} value={stats.oneStar} label="1-Star Reviews" color="error" />
                <StatCard icon={Shield} value={stats.responded} label="Responded" color="primary" />
            </div>

            {/* Main Content */}
            <div className="bg-base-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-neutral shadow-2xl">
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-3 w-full mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" size={18} />
                        <input
                            type="text"
                            placeholder="Search reviews, customers, or feedback..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 sm:py-3 border border-neutral rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-primary/50 w-full text-sm focus:outline-none text-base-content"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 border border-neutral rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-primary/50 text-sm focus:outline-none text-base-content"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="in-progress">In Progress</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 border border-neutral rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-primary/50 text-sm focus:outline-none text-base-content"
                        >
                            <option value="all">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>

                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 border border-neutral rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-primary/50 text-sm focus:outline-none text-base-content"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>

                        <button
                            onClick={exportReviews}
                            className="flex items-center gap-2 px-4 py-2.5 sm:py-3 border border-neutral rounded-xl bg-base-200/50 hover:bg-base-300 text-base-content transition-colors text-sm font-medium"
                        >
                            <Download size={16} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Mobile View */}
                <div className="block xl:hidden space-y-4">
                    {filteredReviews.length > 0 ? (
                        filteredReviews.map(review => (
                            <ReviewMobileCard key={review._id} review={review} />
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <MessageSquare size={48} className="mx-auto text-base-content/30" />
                            <p className="text-base-content/60 mt-4">No reviews found</p>
                        </div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden xl:block rounded-2xl border border-neutral overflow-x-auto">
                    {filteredReviews.length > 0 ? (
                        <table className="min-w-full divide-y divide-neutral">
                            <thead className="bg-base-300">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Customer & Rating</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Feedback</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Response</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Status</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-base-content">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-base-100 divide-y divide-neutral">
                                {filteredReviews.map((review) => (
                                    <tr key={review._id} className="hover:bg-base-200/50 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-content font-bold text-sm">
                                                    {review.userName?.charAt(0) || "U"}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-base-content">{review.userName || 'Anonymous'}</p>
                                                    <p className="text-sm text-base-content/70">{review.userEmail || 'No email'}</p>
                                                    <div className="mt-1">
                                                        {renderStars(review.rating)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-50">
                                                <p className="text-base-content text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                                                    {truncateText(review.feedback, 80)}
                                                </p>
                                                <button 
                                                    onClick={() => openDetailModal(review)} 
                                                    className="text-primary flex items-center gap-1 text-sm hover:text-secondary transition-colors mt-1"
                                                >
                                                    <Eye size={14} />View Full Review
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {review.response ? (
                                                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                                                    <p className="text-primary text-sm line-clamp-3">
                                                        {review.response}
                                                    </p>
                                                    <p className="text-primary/70 text-xs mt-1">
                                                        {formatDateShort(review.respondedAt)}
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-base-content/50 text-sm">No response yet</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-primary" />
                                                <span className="text-sm text-base-content">
                                                    {formatDateShort(review.createdAt)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(review.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => openDetailModal(review)}
                                                    className="px-3 py-2 bg-primary/10 text-primary rounded-xl border border-primary/20 hover:bg-primary/20 hover:scale-105 transition-all duration-200 flex items-center gap-1 text-sm"
                                                    title="View Details"
                                                >
                                                    <Eye size={14} />
                                                    View
                                                </button>
                                                {!review.response && (
                                                    <button
                                                        onClick={() => {
                                                            setEditingReview(review._id);
                                                            setResponseText("");
                                                        }}
                                                        className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/20 hover:bg-primary/20 hover:scale-105 transition-all duration-200"
                                                        title="Respond to Review"
                                                    >
                                                        <MessageCircle size={16} />
                                                    </button>
                                                )}
                                                <select
                                                    value={review.status}
                                                    onChange={(e) => handleStatusUpdate(review._id, e.target.value)}
                                                    className="px-2 py-1 border border-neutral/50 rounded-lg bg-base-200 text-sm focus:outline-none text-base-content focus:border-primary/50"
                                                    title="Update Status"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="in-progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                                <button
                                                    onClick={() => handleDeleteReview(review._id)}
                                                    className="p-2 bg-error/10 text-error rounded-xl border border-error/20 hover:bg-error/20 hover:scale-105 transition-all duration-200"
                                                    title="Delete Review"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                <MessageSquare className="text-base-content/30" size={48} />
                                <p className="text-base-content/60 text-lg">No reviews found</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Detail Modal */}
                {detailModalOpen && selectedReview && (
                    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-base-content/20 z-50 p-4">
                        <div className="bg-base-100 rounded-3xl p-8 w-full max-w-4xl border border-base-300 shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-base-content">Review Details</h2>
                                <button onClick={() => setDetailModalOpen(false)} className="p-2 bg-base-200 text-base-content rounded-xl border border-base-300 hover:bg-base-300 transition-colors"><X size={20} /></button>
                            </div>
                            <div className="space-y-6">
                                {/* User Info Header Card */}
                                <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-xl border border-primary/20">
                                    <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-primary-content font-bold text-xl">
                                        {selectedReview.userName?.charAt(0) || "U"}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-base-content">{selectedReview.userName || 'Anonymous Customer'}</h3>
                                        <div className="flex items-center gap-4 mt-1">
                                            {getStatusBadge(selectedReview.status)}
                                            <span className="text-sm text-base-content/70">Created: {formatDate(selectedReview.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* User Info Card */}
                                    <div className="p-4 bg-info/10 rounded-xl border border-info/20 text-base-content">
                                        <p className="font-semibold text-info mb-1">User Info</p>
                                        <div className='text-base-content/90'>
                                            <p><Mail size={14} className='inline mr-1 text-info' />{selectedReview.userEmail || 'No email provided'}</p>
                                            <p><User size={14} className='inline mr-1 text-info' />{selectedReview.userName || 'Anonymous Customer'}</p>
                                        </div>
                                    </div>
                                    {/* Rating & Feedback Card */}
                                    <div className="p-4 bg-accent/10 rounded-xl border border-accent/20 text-base-content">
                                        <p className="font-semibold text-accent mb-1 text-warning">Rating & Feedback</p>
                                        {renderStars(selectedReview.rating)}
                                        <p className='bg-base-200 text-base-content rounded-lg border-2 border-base-300 p-2 mt-2 whitespace-pre-wrap'>{selectedReview.feedback || 'No feedback provided'}</p>
                                    </div>
                                    {/* Response Card */}
                                    <div className="p-4 bg-success/10 rounded-xl border border-success/20 text-base-content">
                                        <p className="font-semibold text-success mb-1">Your Response</p>
                                        {selectedReview.response ? (
                                            <div>
                                                <p className='bg-base-200 text-base-content rounded-lg border-2 border-base-300 p-2 mt-2 whitespace-pre-wrap'>{selectedReview.response}</p>
                                                <p className="text-success/70 text-xs mt-1">Responded: {formatDate(selectedReview.respondedAt)}</p>
                                            </div>
                                        ) : (
                                            <p className="text-base-content/70">No response yet</p>
                                        )}
                                    </div>
                                    {/* Metadata Card */}
                                    <div className="p-4 bg-base-200 rounded-xl border border-base-300 text-base-content">
                                        <p className="font-semibold text-base-content/90 mb-1">Metadata</p>
                                        <p className='text-base-content/70'>Status: {selectedReview.status}</p>
                                        <p className='text-base-content/70'>Created: {formatDate(selectedReview.createdAt)}</p>
                                        <p className='text-base-content/70'>Rating: {selectedReview.rating}/5</p>
                                    </div>
                                </div>
                                {/* Modal Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <button onClick={() => setDetailModalOpen(false)} className="px-6 py-2 bg-base-100 border border-base-300 text-base-content rounded-xl hover:bg-base-200 transition-colors">Close</button>
                                    {!selectedReview.response && (
                                        <button 
                                            onClick={() => {
                                                setDetailModalOpen(false);
                                                setEditingReview(selectedReview._id);
                                                setResponseText("");
                                            }}
                                            className="px-6 py-3 bg-primary text-primary-content rounded-xl hover:bg-primary/80 transition-colors"
                                        >
                                            Respond to Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Response Modal for Desktop */}
                {editingReview && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-base-100 rounded-2xl p-6 max-w-md w-full border border-neutral shadow-2xl">
                            <h3 className="text-lg font-semibold text-base-content mb-4">Respond to Review</h3>
                            <textarea
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                placeholder="Type your response here..."
                                rows="4"
                                className="w-full px-3 py-2 border border-neutral rounded-lg bg-base-200 focus:bg-base-100 focus:border-primary/50 text-sm focus:outline-none text-base-content mb-4"
                            />
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => handleRespond(editingReview)}
                                    className="px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-1"
                                >
                                    <Check size={16} />
                                    Send Response
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingReview(null);
                                        setResponseText("");
                                    }}
                                    className="px-4 py-2 border border-neutral text-base-content rounded-lg hover:bg-base-300 transition-colors text-sm font-medium flex items-center gap-1"
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MechanicShopReviews;