"use client";

import React, { useEffect, useState, useMemo } from "react";
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
    TrendingUp,
    TrendingDown,
    MessageCircle,
    Mail,
    Check,
    X,
    Loader2
} from "lucide-react";
import Swal from "sweetalert2";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import Loader from "@/app/(basic)/loading"; 

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

// NEW COMPONENT: Isolated state for the response textarea
const ResponseInputArea = ({ reviewId, initialText, isEditMode, onSend, onCancel }) => {
    const [localResponseText, setLocalResponseText] = useState(initialText || "");

    useEffect(() => {
        // Reset local state when the component is mounted for a different review ID
        setLocalResponseText(initialText || "");
    }, [initialText, reviewId]);

    const handleSend = () => {
        onSend(reviewId, localResponseText);
    };

    return (
        <div className="mt-4 p-3 bg-base-200 rounded-lg border border-neutral/30">
            <textarea
                value={localResponseText}
                onChange={(e) => setLocalResponseText(e.target.value)}
                placeholder={isEditMode ? "Edit your response here..." : "Type your professional response here..."}
                rows="5"
                className="w-full px-3 py-2 border border-neutral/50 rounded-lg bg-base-100 focus:bg-base-100 focus:border-primary/50 text-sm focus:outline-none text-base-content"
            />
            <div className="flex gap-2 mt-3 justify-end">
                <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-primary text-primary-content rounded-xl hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-1"
                >
                    <Check size={16} />
                    {isEditMode ? 'Update Response' : 'Send Response'}
                </button>
                <button
                    onClick={onCancel}
                    className="px-4 py-2 border border-neutral/50 text-base-content rounded-xl hover:bg-base-300 transition-colors text-sm font-medium flex items-center gap-1"
                >
                    <X size={16} />
                    Cancel
                </button>
            </div>
        </div>
    );
};

const MechanicShopReviews = () => {
    const [reviews, setReviews] = useState([]); 
    const [allReviews, setAllReviews] = useState([]); 
    
    const [shopLoading, setShopLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    
    const [shopData, setShopData] = useState(null);

    const [filteredReviews, setFilteredReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [stats, setStats] = useState({
        total: 0,
        averageRating: 0,
        fiveStar: 0,
        oneStar: 0,
        responded: 0
    });
    const [editingReview, setEditingReview] = useState(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    const { user: loggedInUser, loading: userLoading } = useUser();
    const router = useRouter();

    const calculateStats = (reviewsData) => {
        const total = reviewsData.length;
        const totalRatings = reviewsData.reduce((sum, review) => sum + (parseFloat(review.rating) || 0), 0);
        
        const averageRating = total > 0 
            ? (totalRatings / total).toFixed(1)
            : 0;
        const fiveStar = reviewsData.filter(review => parseFloat(review.rating) === 5).length;
        const oneStar = reviewsData.filter(review => parseFloat(review.rating) === 1).length;
        const responded = reviewsData.filter(review => review.response).length;

        setStats({
            total,
            averageRating,
            fiveStar,
            oneStar,
            responded
        });
    };
    
    const truncateText = (text, maxLength = 60) => {
        if (!text) return 'No feedback provided';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const openDetailModal = (review, startEditing = false) => {
        setSelectedReview(review);
        
        if (startEditing || !review.response) {
            setEditingReview(review._id);
        } else {
            setEditingReview(null);
        }

        setDetailModalOpen(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const formatDateShort = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const base = "px-2 sm:px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap";
        switch (status) {
            case "completed":
                return <span className={`${base} bg-success/10 text-success border-success/30`}>Responded</span>;
            case "pending":
                return <span className={`${base} bg-warning/10 text-warning border-warning/30`}>Pending Response</span>;
            case "in-progress": 
                return <span className={`${base} bg-primary/10 text-primary border-primary/30`}>In Progress</span>;
            case "rejected": 
                return <span className={`${base} bg-error/10 text-error border-error/30`}>Rejected</span>;
            default:
                return <span className={`${base} bg-base-300 text-base-content/80 border-neutral/20`}>{status || 'N/A'}</span>;
        }
    };

    const renderStars = (rating, size = 16) => {
        const numericRating = parseFloat(rating) || 0;
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={size}
                        className={`${
                            i < numericRating
                                ? "fill-warning text-warning"
                                : "text-base-content/30"
                        }`}
                    />
                ))}
                <span className="ml-1 text-sm font-medium text-base-content">
                    {numericRating.toFixed(1)}
                </span>
            </div>
        );
    };
    
    useEffect(() => {
        const fetchShopData = async () => {
            if (!loggedInUser?.email) return;

            setShopLoading(true);
            try {
                const shopRes = await fetch(`/api/shops?email=${loggedInUser.email}`);
                let data = null;
                if (shopRes.ok) {
                    data = await shopRes.json();
                    if (Array.isArray(data) && data.length > 0) data = data[0];
                }
                setShopData(data);
            } catch (err) {
                console.error("Error fetching shop:", err);
                Swal.fire({
                    icon: "error",
                    title: "Shop Error",
                    text: "Failed to load shop data.",
                    confirmButtonColor: 'var(--color-error)',
                    background: 'var(--color-base-100)',
                    color: 'var(--color-base-content)'
                });
                setShopData(null);
            } finally {
                setShopLoading(false);
            }
        };
        
        if (!userLoading && loggedInUser) {
            fetchShopData();
        }
    }, [loggedInUser, userLoading]);

    useEffect(() => {
        const fetchReviews = async () => {
            setReviewsLoading(true);
            try {
                const reviewsRes = await fetch("/api/reviews"); 
                let data = [];
                if (reviewsRes.ok) data = await reviewsRes.json();
                setAllReviews(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching reviews:", err);
                Swal.fire({
                    icon: "error",
                    title: "Reviews Error",
                    text: "Failed to load all reviews.",
                    confirmButtonColor: 'var(--color-error)',
                    background: 'var(--color-base-100)',
                    color: 'var(--color-base-content)'
                });
                setAllReviews([]);
            } finally {
                setReviewsLoading(false);
            }
        };
        fetchReviews();
    }, []);
    
    const shopReviews = useMemo(() => {
        const shopId = shopData?._id;
        if (!shopId || allReviews.length === 0) {
            calculateStats([]);
            return [];
        }
        
        const filtered = allReviews.filter(
            (review) => review.shopId?.toString() === shopId.toString()
        );
        
        setReviews(filtered);
        calculateStats(filtered);

        return filtered;
    }, [allReviews, shopData]);

    useEffect(() => {
        let filtered = [...reviews];

        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(review =>
                review.userName?.toLowerCase().includes(lowerCaseSearch) ||
                review.feedback?.toLowerCase().includes(lowerCaseSearch) ||
                review.userEmail?.toLowerCase().includes(lowerCaseSearch)
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(review => 
                (statusFilter === "completed" && review.response) ||
                (statusFilter === "pending" && !review.response) ||
                (statusFilter !== "completed" && statusFilter !== "pending" && review.status === statusFilter)
            );
        }

        if (ratingFilter !== "all") {
            filtered = filtered.filter(review => parseFloat(review.rating) === parseInt(ratingFilter));
        }

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

        filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            const ratingA = parseFloat(a.rating) || 0;
            const ratingB = parseFloat(b.rating) || 0;
            
            switch (sortBy) {
                case "newest":
                    return dateB - dateA;
                case "oldest":
                    return dateA - dateB;
                case "highest":
                    return ratingB - ratingA;
                case "lowest":
                    return ratingA - ratingB;
                default:
                    return 0;
            }
        });

        setFilteredReviews(filtered);
    }, [reviews, searchTerm, statusFilter, ratingFilter, dateFilter, sortBy]);

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
                    setAllReviews(prev => prev.filter(review => review._id !== reviewId));
                    setDetailModalOpen(false); 

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

    // Updated signature to receive responseText from ResponseInputArea
    const handleRespond = async (reviewId, responseTextToSend) => {
        if (!responseTextToSend.trim()) {
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
                    response: responseTextToSend,
                    respondedAt: new Date().toISOString()
                })
            });

            if (response.ok) {
                const updatedReviewResponse = { 
                    ...allReviews.find(r => r._id === reviewId), 
                    response: responseTextToSend, 
                    respondedAt: new Date().toISOString() 
                };

                setAllReviews(prev => prev.map(review =>
                    review._id === reviewId ? updatedReviewResponse : review
                ));
                
                if (selectedReview?._id === reviewId) {
                    setSelectedReview(updatedReviewResponse);
                }

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
                    {review.response ? getStatusBadge("completed") : getStatusBadge("pending")}
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
                        <p className="text-primary text-sm line-clamp-2">
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
                            onClick={() => setEditingReview(review._id)}
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

            {editingReview === review._id && (
                <ResponseInputArea
                    key={review._id} 
                    reviewId={review._id}
                    initialText={review.response}
                    isEditMode={!!review.response}
                    onSend={handleRespond}
                    onCancel={() => setEditingReview(null)}
                />
            )}
        </div>
    );

    const ReviewDetailModal = () => {
        if (!selectedReview) return null;

        const review = selectedReview;
        const isEditing = editingReview === review._id;
        const isResponded = !!review.response;

        return (
            <div 
                className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-content/50 backdrop-blur-sm transition-opacity duration-300 ${
                    detailModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setDetailModalOpen(false)}
            >
                <div 
                    className="bg-base-100 rounded-2xl w-full max-w-lg lg:max-w-3xl p-6 sm:p-8 shadow-3xl transform transition-transform duration-300 scale-100 overflow-y-auto max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-start border-b border-neutral/50 pb-4 mb-4">
                        <h2 className="text-2xl font-bold text-base-content flex items-center gap-3">
                            <MessageSquare size={24} className="text-primary" />
                            Review Details
                        </h2>
                        <button
                            onClick={() => setDetailModalOpen(false)}
                            className="p-2 rounded-full text-base-content/60 hover:bg-base-200 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-4 border-b border-neutral/50">
                        <div>
                            <p className="text-sm font-medium text-base-content/70 flex items-center gap-2 mb-1">
                                <User size={16} /> Customer Name
                            </p>
                            <p className="text-base font-semibold text-base-content">{review.userName || 'Anonymous'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-base-content/70 flex items-center gap-2 mb-1">
                                <Mail size={16} /> Email
                            </p>
                            <p className="text-base font-semibold text-base-content truncate">{review.userEmail || 'No email provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-base-content/70 flex items-center gap-2 mb-1">
                                <Star size={16} /> Rating
                            </p>
                            {renderStars(review.rating, 20)}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-base-content/70 flex items-center gap-2 mb-1">
                                <Calendar size={16} /> Date
                            </p>
                            <p className="text-base font-semibold text-base-content">{formatDate(review.createdAt)}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-lg font-bold text-base-content mb-2 flex items-center gap-2">
                            <MessageCircle size={20} className="text-primary" /> Customer Feedback
                        </p>
                        <div className="bg-base-200 p-4 rounded-lg text-base-content leading-relaxed border border-neutral/50">
                            {review.feedback || 'No detailed feedback provided.'}
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-lg font-bold text-base-content mb-2 flex items-center gap-2">
                            <Shield size={20} className="text-primary" /> Your Shop Response
                        </p>
                        
                        {isEditing ? (
                            <ResponseInputArea
                                key={review._id} 
                                reviewId={review._id}
                                initialText={review.response}
                                isEditMode={isResponded}
                                onSend={handleRespond}
                                onCancel={() => setEditingReview(null)}
                            />
                        ) : isResponded ? (
                            <div className="bg-primary/10 p-4 rounded-lg text-primary leading-relaxed border border-primary/20">
                                <p className="text-sm font-medium mb-1 flex items-center gap-2">
                                    <Check size={14} /> Responded on {formatDateShort(review.respondedAt)}
                                </p>
                                <p>{review.response}</p>
                                <button
                                    onClick={() => setEditingReview(review._id)}
                                    className="mt-3 px-3 py-1.5 bg-primary text-primary-content rounded-lg hover:bg-primary/90 transition-colors text-xs font-medium flex items-center gap-1"
                                >
                                    <Edit size={14} />
                                    Edit Response
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-start">
                                <button
                                    onClick={() => setEditingReview(review._id)}
                                    className="px-4 py-2 bg-primary text-primary-content rounded-xl hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-1"
                                >
                                    <MessageCircle size={16} />
                                    Write Response
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-neutral/50">
                        <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-error text-error-content rounded-xl hover:bg-error/90 transition-colors font-medium"
                        >
                            <Trash2 size={18} />
                            Delete Review
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (userLoading || shopLoading || reviewsLoading) {
        return <Loader />;
    }
    
    if (!loggedInUser) {
        return (
            <div className="flex items-center justify-center h-screen w-full bg-base-100 text-error">
                <p>Access Denied. Please log in as a mechanic.</p>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen w-full p-3 sm:p-4 lg:p-6 mx-auto bg-base-200">
            <div className="mb-4 sm:mb-6 lg:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-1 sm:mb-2">Customer Reviews</h1>
                <p className="text-base-content/70 text-sm sm:text-base lg:text-lg">
                    Manage and respond to customer feedback for your shop.
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                <StatCard icon={MessageSquare} value={stats.total} label="Total Reviews" color="primary" />
                <StatCard icon={Star} value={stats.averageRating} label="Average Rating" color="warning" />
                <StatCard icon={TrendingUp} value={stats.fiveStar} label="5-Star Reviews" color="success" />
                <StatCard icon={TrendingDown} value={stats.oneStar} label="1-Star Reviews" color="error" />
                <StatCard icon={Shield} value={stats.responded} label="Responded" color="primary" />
            </div>

            <div className="bg-base-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-neutral shadow-2xl">
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
                            <option value="pending">Pending Response</option>
                            <option value="completed">Responded</option>
                            <option value="in-progress">In Progress</option>
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
                        
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 border border-neutral rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-primary/50 text-sm focus:outline-none text-base-content"
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="highest">Highest Rating</option>
                            <option value="lowest">Lowest Rating</option>
                        </select>
                    </div>
                </div>

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
                                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-content font-bold text-sm flex-shrink-0">
                                                    {review.userName?.charAt(0) || "U"}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-base-content">{review.userName || 'Anonymous'}</p>
                                                    <p className="text-sm text-base-content/70">{review.userEmail || 'No email'}</p>
                                                </div>
                                            </div>
                                            <div className="mt-2">{renderStars(review.rating)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-base-content max-w-xs whitespace-normal">
                                            <p className="line-clamp-2">{truncateText(review.feedback, 100)}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-base-content max-w-xs whitespace-normal">
                                            {review.response ? (
                                                <div className="bg-primary/10 p-2 rounded-lg line-clamp-2 text-primary">
                                                    {truncateText(review.response, 100)}
                                                </div>
                                            ) : (
                                                <span className="text-base-content/50 italic">No response yet</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-base-content/80">
                                            {formatDateShort(review.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {review.response ? getStatusBadge("completed") : getStatusBadge("pending")}
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <div className="flex gap-2 justify-center">
                                                <button
                                                    onClick={() => openDetailModal(review)}
                                                    className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {!review.response && (
                                                    <button
                                                        onClick={() => openDetailModal(review, true)}
                                                        className="p-2 bg-warning/10 text-warning rounded-lg hover:bg-warning/20 transition-colors"
                                                        title="Respond"
                                                    >
                                                        <MessageCircle size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteReview(review._id)}
                                                    className="p-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors"
                                                    title="Delete Review"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-12">
                            <MessageSquare size={64} className="mx-auto text-base-content/30" />
                            <p className="text-base-content/60 mt-4 text-lg">No reviews found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
            
            <ReviewDetailModal />
        </div>
    );
};

export default MechanicShopReviews;