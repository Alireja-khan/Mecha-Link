"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import {
    MapPin, Phone, Mail, Clock, Users, Star, Shield, CheckCircle,
    Wrench, Car, Settings, Edit3, Share2, PhoneCall, MessageCircle,
    Calendar, Award, FileText, BarChart3, Eye, Download, Filter,
    Building, Navigation, Globe, Facebook, Instagram, Twitter,
    ChevronRight, Crown, BadgeCheck, Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";

const MechanicProfile = ({ shopId }) => {
    const { user: loggedInUser, loading: userLoading } = useUser();
    const [shopData, setShopData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const router = useRouter();

    // Fetch shop data
    useEffect(() => {
        const fetchShopData = async () => {
            try {
                setLoading(true);
                if (!loggedInUser?.email) {
                    console.log("No user email available");
                    return;
                }
                const response = await fetch(`/api/shops?email=${loggedInUser.email}`);

                if (response.ok) {
                    const data = await response.json();

                    // Handle array response
                    if (Array.isArray(data) && data.length > 0) {
                        const shop = data[0];
                        setShopData(shop);
                        // Fetch reviews after getting shop data
                        await fetchShopReviews(shop._id);
                    } else {
                        setShopData(data);
                        if (data?._id) {
                            await fetchShopReviews(data._id);
                        }
                    }
                } else {
                    console.error("Failed to fetch shop data");
                }
            } catch (error) {
                console.error("Error fetching shop data:", error);
            } finally {
                setLoading(false);
            }
        };

        // Fetch reviews for the shop
        const fetchShopReviews = async (shopId) => {
            try {
                setReviewsLoading(true);
                console.log("Fetching reviews for shop ID:", shopId);

                const response = await fetch('/api/reviews');
                if (response.ok) {
                    const allReviews = await response.json();
                    console.log("All reviews received:", allReviews);

                    // Filter reviews for this specific shop
                    const shopReviews = allReviews.filter(review => {
                        // Check multiple possible fields where shop ID might be stored
                        const matchesShopId = review.shopId === shopId.toString();
                        const matchesServiceId = review.serviceId === shopId.toString();
                        const matchesShopObjectId = review.shopId === shopId;

                        console.log(`Review ${review._id}:`, {
                            reviewShopId: review.shopId,
                            reviewServiceId: review.serviceId,
                            shopId,
                            matchesShopId,
                            matchesServiceId,
                            matchesShopObjectId
                        });

                        return matchesShopId || matchesServiceId || matchesShopObjectId;
                    });

                    setReviews(shopReviews);
                } else {
                    console.error("Failed to fetch reviews");
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setReviewsLoading(false);
            }
        };

        // Only fetch if loggedInUser exists and has email
        if (loggedInUser?.email) {
            fetchShopData();
        }
    }, [loggedInUser]);


    // Loading and Auth Check
    if (userLoading) {
        return (
            <div className="flex items-center justify-center h-full w-full bg-base-200">
                <span className="loading loading-bars loading-xl text-orange-500"></span>
            </div>
        );
    }

    if (!loggedInUser) {
        return (
            <div className="flex items-center justify-center h-full w-full bg-base-200">
                <span className="loading loading-bars loading-xl text-orange-500"></span>
            </div>
        );
    }

    // Loading state for shop data
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-200">
                <div className="text-center">
                    <span className="loading loading-bars loading-xl text-primary mb-4"></span>
                    <p className="text-base-content">Loading shop profile...</p>
                </div>
            </div>
        );
    }

    // Handle case where no shop data is found
    if (!shopData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-200">
                <div className="text-center p-8 max-w-md">
                    <Building className="mx-auto text-base-content/40 mb-4" size={64} />
                    <h2 className="text-2xl font-bold text-base-content mb-4">No Shop Found</h2>
                    <p className="text-base-content/70 mb-6">
                        We couldn't find a shop associated with your account.
                        Would you like to create one?
                    </p>
                    <button className="btn btn-primary gap-2">
                        <Wrench size={20} />
                        Create Your Shop
                    </button>
                </div>
            </div>
        );
    }

    // Safe data processing with null checks
    const processedShopData = {
        // Basic Info
        name: shopData?.shop?.shopName || "Unnamed Shop",
        ownerName: shopData?.ownerName || loggedInUser?.name || "Shop Owner",
        email: shopData?.contact?.email || shopData?.ownerEmail || loggedInUser?.email || "Not provided",
        phone: shopData?.shop?.contact?.phone || "Not provided",
        whatsapp: shopData?.contact?.whatsapp,

        // Location
        address: {
            street: shopData?.shop?.address?.street || "Address not provided",
            city: shopData?.shop?.address?.city || "City not provided",
            district: shopData?.shop?.address?.district || "District not provided",
            division: shopData?.shop?.address?.division || "Division not provided",
            country: shopData?.shop?.address?.country || "Country not provided",
            postalCode: shopData?.shop?.address?.postalCode || "N/A",
            mapUrl: shopData?.shop?.address?.mapUrl || "#",
            coordinates: shopData?.location || null
        },

        // Business Details
        description: shopData?.shop?.details || "Professional automotive repair services",
        mechanicCount: shopData?.shop?.mechanicCount || 0,
        workingHours: {
            open: shopData?.shop.workingHours?.open || "09:00",
            close: shopData?.shop.workingHours?.close || "18:00",
            weekend: shopData?.shop.workingHours?.weekend || "Sunday"
        },

        // Services
        categories: shopData?.shop.categories || [],
        services: shopData?.shop.vehicleTypes || {},

        // Certifications & Social
        certifications: shopData?.certifications || [],
        socialLinks: shopData?.socialLinks || {},

        // Status & Metrics
        status: shopData?.status || "pending",
        joinedDate: shopData?.createdAt ? new Date(shopData.createdAt).toLocaleDateString() : "N/A",
        approvedDate: shopData?.approvedAt ? new Date(shopData.approvedAt).toLocaleDateString() : null,
        logo: shopData?.shop.logo,

        // Performance Metrics
        metrics: {
            totalServices: Object.values(shopData?.vehicleTypes || {}).reduce((total, category) =>
                total + Object.values(category || {}).flat().length, 0
            ),
            yearsExperience: shopData?.createdAt ?
                Math.max(1, new Date().getFullYear() - new Date(shopData.createdAt).getFullYear()) : 1,
            customerSatisfaction: Math.floor(Math.random() * 20) + 80,
            repeatClients: Math.floor(Math.random() * 100) + 50
        }
    };

    const paymentInfo = shopData.paymentInfo;

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + (parseFloat(review.rating) || 0), 0) / reviews.length).toFixed(1)
        : "0.0";

    // Stat Card Component
    const StatCard = ({ icon: Icon, value, label, trend, color = "primary" }) => {
        const colorClasses = {
            primary: { bg: "bg-primary/10", hoverBg: "group-hover:bg-primary/20", text: "text-primary" },
            secondary: { bg: "bg-secondary/10", hoverBg: "group-hover:bg-secondary/20", text: "text-secondary" },
            success: { bg: "bg-success/10", hoverBg: "group-hover:bg-success/20", text: "text-success" },
            warning: { bg: "bg-warning/10", hoverBg: "group-hover:bg-warning/20", text: "text-warning" },
            error: { bg: "bg-error/10", hoverBg: "group-hover:bg-error/20", text: "text-error" },
        };

        const selectedColor = colorClasses[color] || colorClasses.primary;

        return (
            <div className="bg-base-100 rounded-2xl p-6 border border-neutral/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${selectedColor.bg} ${selectedColor.hoverBg} transition-colors duration-300`}>
                        <Icon className={selectedColor.text} size={24} />
                    </div>
                    {trend && (
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${trend > 0 ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                        </span>
                    )}
                </div>
                <p className="text-3xl font-bold text-base-content mb-1">{value}</p>
                <p className="text-base-content/70 text-sm font-medium">{label}</p>
            </div>
        );
    };

    // Service Category Component
    const ServiceCategory = ({ category, services }) => (
        <div className="bg-base-200 rounded-xl p-6 border border-base-300">
            <h4 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
                <Wrench className="text-primary" size={20} />
                {category}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(services).map(([serviceType, serviceList]) => (
                    <div key={serviceType} className="space-y-2">
                        <h5 className="font-semibold text-base-content text-sm">{serviceType}</h5>
                        <div className="space-y-1">
                            {(serviceList || []).map((service, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-base-content/80">
                                    <CheckCircle className="text-success" size={14} />
                                    {service}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Action Button Component
    const ActionButton = ({ icon: Icon, label, variant = "primary", onClick }) => (
        <button
            onClick={onClick}
            className={`
                flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold w-full transition-all duration-300 hover:scale-[1.01] text-center
                ${variant === 'primary'
                    ? 'bg-primary text-primary-content hover:bg-primary/90 shadow-lg hover:shadow-xl'
                    : 'bg-base-200 text-base-content border border-base-300 hover:border-primary hover:bg-base-300'
                }
            `}
        >
            <Icon size={20} />
            <span>{label}</span>
        </button>
    );

    const handlePayment = async () => {
        const res = await fetch("/api/ssl/init", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ownerName: processedShopData.ownerName,
                shopName: processedShopData.name,
                email: processedShopData.email,
                phone: processedShopData.phone,
                category: processedShopData.categories[0],
                amount: 1000,
                shopID: shopData._id
            }),
        });

        const data = await res.json();

        if (data.GatewayPageURL) {
            router.push(data.GatewayPageURL);
        } else {
            alert("Failed to initialize payment!");
        }
    };

    return (
        <div className="min-h-screen bg-base-200 mx-auto text-base-content">
            <div className="p-4 md:p-6 lg:p-8 mx-auto">

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                    {/* Main Profile Card */}
                    <div className="lg:col-span-2 bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral/40 shadow-xl">
                        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8">

                            {/* Shop Logo/Image */}
                            <div className="w-56 h-56 md:w-48 md:h-48 lg:w-80 lg:h-80 rounded-2xl border-4 border-base-100 shadow-2xl overflow-hidden bg-gradient-to-br from-primary to-secondary flex-shrink-0">
                                {processedShopData.logo ? (
                                    <img
                                        src={processedShopData.logo}
                                        alt={processedShopData.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-content text-4xl md:text-6xl font-bold">
                                        {processedShopData.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Shop Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 mb-3 md:mb-4">
                                    <h1 className="text-3xl md:text-4xl font-bold text-base-content">
                                        {processedShopData.name}
                                    </h1>
                                    {processedShopData.status === "approved" && (
                                        <BadgeCheck className="text-info" size={24} />
                                    )}
                                </div>

                                {/* Rating and Status Badge */}
                                <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                                        <Star className="text-warning" size={18} fill="currentColor" />
                                        <span className="font-semibold text-primary">
                                            {averageRating} ({reviews.length} reviews)
                                        </span>
                                    </div>
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm ${processedShopData.status === "approved"
                                        ? "bg-success/10 text-success border-success/20"
                                        : processedShopData.status === "pending"
                                            ? "bg-warning/10 text-warning border-warning/20"
                                            : "bg-error/10 text-error border-error/20"
                                        }`}>
                                        {processedShopData.status.charAt(0).toUpperCase() + processedShopData.status.slice(1)}
                                    </div>
                                </div>

                                <p className="text-base-content/80 text-base md:text-lg mb-4 md:mb-6 leading-relaxed max-w-full lg:max-w-2xl">
                                    {processedShopData.description}
                                </p>

                                {/* Metadata Badges */}
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    <div className="flex items-center gap-2 bg-base-200 px-3 py-1 md:px-4 md:py-2 rounded-xl border border-base-300 text-sm md:text-base transition-colors duration-200 hover:bg-base-300">
                                        <Users className="text-primary" size={16} />
                                        <span className="text-base-content font-medium">
                                            {processedShopData.mechanicCount} Mechanics
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-base-200 px-3 py-1 md:px-4 md:py-2 rounded-xl border border-base-300 text-sm md:text-base transition-colors duration-200 hover:bg-base-300">
                                        <Building className="text-primary" size={16} />
                                        <span className="text-base-content font-medium">
                                            {processedShopData.address.city}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-base-200 px-3 py-1 md:px-4 md:py-2 rounded-xl border border-base-300 text-sm md:text-base transition-colors duration-200 hover:bg-base-300">
                                        <Calendar className="text-primary" size={16} />
                                        <span className="text-base-content font-medium">
                                            Since {processedShopData.joinedDate}
                                        </span>
                                    </div>
                                </div>


                            </div>
                        </div>
                        {/* Certifications */}
                        {processedShopData.certifications.length > 0 && (
                            <div className="bg-base-100 rounded-3xl p-6 mt-5 border border-neutral/40">
                                <h2 className="text-xl font-bold text-base-content mb-4">Certifications</h2>
                                <div className="flex flex-wrap gap-2">
                                    {processedShopData.certifications.map((cert, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-success/10 text-success text-xs md:text-sm rounded-xl border border-success/20 font-medium transition-colors duration-300 hover:bg-success/20 cursor-pointer"
                                        >
                                            {cert}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Payment Section */}
                        <div className="space-y-4">
                            
                               

                                    <div className="bg-base-100 rounded-3xl p-6 border border-neutral/40 shadow-lg relative overflow-hidden">
                                        {/* Status Dot Indicator */}
                                        <div className={`absolute top-4 left-4 w-10 h-3 rounded-full ${!paymentInfo? 'bg-error animate-pulse'
                                            :  'bg-success'
                                            }`}></div>

                                        <div className="text-center">
                                            {/* Before Payment */}
                                            {!paymentInfo ? (
                                                <>
                                                    <div className="flex items-center justify-center gap-3 mb-4">
                                                        <Shield className="text-warning" size={24} />
                                                        <span className="text-base-content/70 font-medium">Payment Required</span>
                                                    </div>
                                                    <button onClick={handlePayment} title="Pay 1000 per shop" className="btn btn-primary btn-lg gap-3 w-full max-w-xs mx-auto hover:scale-105 transition-transform duration-300">
                                                        <span>Pay 1000</span>
                                                        <ChevronRight size={18} />
                                                    </button>
                                                    <p className="text-base-content/50 text-sm mt-3">
                                                        Complete payment to activate your shop listing
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex items-center justify-center gap-3 mb-4">
                                                        <CheckCircle className="text-success" size={24} />
                                                        <span className="text-success font-semibold">Payment Completed</span>
                                                    </div>
                                                    <div className="bg-success/10 text-success px-4 py-3 rounded-xl border border-success/20">
                                                        <p className="font-medium">Thank you for your payment!</p>
                                                        <p className="text-sm mt-1">Your shop is now active and visible to customers.</p>
                                                    </div>
                                                </>
                                            ) }
                                        </div>
                                    </div>

                               

                                    <div className="bg-base-100 rounded-3xl p-6 border border-neutral/40 shadow-lg">
                                        <h3 className="text-xl font-semibold text-base-content mb-6 flex items-center gap-2">
                                            <FileText className="text-primary" size={20} />
                                            Invoice Details
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center py-2 border-b border-base-300">
                                                <span className="text-base-content/70 font-medium">Transaction ID:</span>
                                                <span className="text-base-content font-mono text-sm">{paymentInfo?.tran_id || "..."}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-base-300">
                                                <span className="text-base-content/70 font-medium">Bank Transaction ID:</span>
                                                <span className="text-base-content font-mono text-sm">{paymentInfo?.bank_tran_id || "..."}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-base-300">
                                                <span className="text-base-content/70 font-medium">Payment Method:</span>
                                                <span className="text-base-content font-medium flex items-center gap-2">
                                                    {paymentInfo?.card_type || "..."}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-base-300">
                                                <span className="text-base-content/70 font-medium">Amount:</span>
                                                <span className="text-success font-bold text-lg">৳{paymentInfo?.amount || "..."}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-base-content/70 font-medium">Status:</span>
                                                <span className={`badge badge-lg font-semibold ${paymentInfo?.paymentStatus === 'paid'
                                                    ? 'badge-success'
                                                    : paymentInfo?.paymentStatus === 'failed'
                                                        ? 'badge-error'
                                                        : 'badge-warning'
                                                    }`}>
                                                    {paymentInfo?.paymentStatus === 'paid'
                                                        ? 'PAID'
                                                        : paymentInfo?.paymentStatus === 'failed'
                                                            ? 'FAILED'
                                                            : 'PENDING'
                                                    }
                                                </span>
                                            </div>

                                            {/* Additional payment info for paid status */}
                                            {processedShopData.paymentStatus === 'paid' && (
                                                <div className="mt-4 p-4 bg-success/5 rounded-xl border border-success/10">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-base-content/70">Paid Date:</span>
                                                        <span className="text-base-content font-medium">
                                                            {new Date().toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm mt-2">
                                                        <span className="text-base-content/70">Valid Until:</span>
                                                        <span className="text-success font-medium">
                                                            {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                         
                        </div>


                    </div>

                </div>

                {/* Navigation Tabs */}
                <div className="bg-base-100 rounded-3xl p-2 mb-8 border border-neutral/40 shadow-lg">
                    <div className="flex overflow-x-auto">
                        {["overview", "services", "reviews", "contact"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${activeTab === tab
                                    ? "bg-primary text-primary-content shadow-lg"
                                    : "text-base-content/70 hover:text-base-content hover:bg-base-200"
                                    }`}
                            >
                                {tab === "overview" && <BarChart3 size={18} />}
                                {tab === "services" && <Wrench size={18} />}
                                {tab === "reviews" && <Star size={18} />}
                                {tab === "contact" && <MapPin size={18} />}
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                            <>
                                {/* Performance Metrics */}
                                <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral/40 shadow-xl">
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8">
                                        <h2 className="text-2xl font-bold text-base-content mb-4 md:mb-0">
                                            Shop Performance
                                        </h2>
                                        <div className="flex items-center gap-3">
                                            <button className="flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 bg-base-200 text-base-content rounded-xl border border-base-300 transition-colors duration-200 hover:bg-base-300 text-sm">
                                                <Filter size={16} className="text-primary" />
                                                Filter
                                            </button>
                                            <button className="flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 bg-base-200 text-base-content rounded-xl border border-base-300 transition-colors duration-200 hover:bg-base-300 text-sm">
                                                <Download size={16} className="text-primary" />
                                                Export
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <StatCard
                                            icon={Wrench}
                                            value={processedShopData.metrics.totalServices}
                                            label="Total Services"
                                            trend={8}
                                        />
                                        <StatCard
                                            icon={Calendar}
                                            value={processedShopData.metrics.yearsExperience}
                                            label="Years Experience"
                                            trend={5}
                                            color="secondary"
                                        />
                                        <StatCard
                                            icon={Star}
                                            value={`${processedShopData.metrics.customerSatisfaction}%`}
                                            label="Customer Satisfaction"
                                            trend={12}
                                            color="success"
                                        />
                                        <StatCard
                                            icon={Users}
                                            value={processedShopData.metrics.repeatClients}
                                            label="Repeat Clients"
                                            trend={15}
                                            color="warning"
                                        />
                                    </div>
                                </div>

                                {/* Service Categories Overview */}
                                <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral/40 shadow-xl">
                                    <h2 className="text-2xl font-bold text-base-content mb-6">Service Categories</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {processedShopData.categories.map((category, index) => (
                                            <div key={index} className="bg-base-200 rounded-xl p-4 border border-base-300 transition-all duration-300 hover:scale-[1.02] group">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                                                        <Wrench className="text-primary" size={18} />
                                                    </div>
                                                    <h3 className="font-semibold text-base-content">{category}</h3>
                                                </div>
                                                <p className="text-base-content/70 text-sm">
                                                    {Object.values(processedShopData.services[category] || {}).flat().length} services available
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Services Tab */}
                        {activeTab === "services" && (
                            <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral/40 shadow-xl">
                                <h2 className="text-2xl font-bold text-base-content mb-6">Available Services</h2>
                                <div className="space-y-6">
                                    {Object.entries(processedShopData.services).map(([category, services]) => (
                                        <ServiceCategory
                                            key={category}
                                            category={category}
                                            services={services}
                                        />
                                    ))}
                                    {Object.keys(processedShopData.services).length === 0 && (
                                        <div className="text-center py-12">
                                            <Wrench className="mx-auto text-base-content/40 mb-4" size={48} />
                                            <p className="text-base-content/70">No services listed yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === "reviews" && (
                            <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral/40 shadow-xl">
                                <h2 className="text-2xl font-bold text-base-content mb-6">
                                    Customer Reviews ({reviews.length})
                                </h2>

                                {reviewsLoading ? (
                                    <div className="text-center py-8">
                                        <span className="loading loading-bars loading-md text-primary"></span>
                                        <p className="text-base-content/70 mt-2">Loading reviews...</p>
                                    </div>
                                ) : reviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {reviews.map((review, index) => (
                                            <div key={review._id || index} className="bg-base-200 rounded-xl p-6 border border-base-300">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                            <span className="font-semibold text-primary">
                                                                {review.userName?.charAt(0) || review.customerName?.charAt(0) || review.userEmail?.charAt(0) || "C"}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-base-content">
                                                                {review.userName || review.customerName || review.userEmail || "Anonymous Customer"}
                                                            </p>
                                                            <p className="text-base-content/70 text-sm">
                                                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Recent"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="text-warning" size={16} fill="currentColor" />
                                                        <span className="font-semibold">{review.rating || "0"}</span>
                                                    </div>
                                                </div>
                                                <p className="text-base-content/80">
                                                    {review.comment || review.feedback || review.reviewText || "No comment provided"}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Star className="mx-auto text-base-content/40 mb-4" size={48} />
                                        <p className="text-base-content/70">No reviews yet</p>
                                        <p className="text-base-content/50 text-sm mt-2">Customer reviews will appear here</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Contact Tab */}
                        {activeTab === "contact" && (
                            <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral/40 shadow-xl">
                                <h2 className="text-2xl font-bold text-base-content mb-6">Contact Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        {[
                                            { icon: Phone, label: "Phone", value: processedShopData.phone },
                                            { icon: Mail, label: "Email", value: processedShopData.email },
                                            { icon: Clock, label: "Working Hours", value: `${processedShopData.workingHours.open} - ${processedShopData.workingHours.close}` },
                                            { icon: Calendar, label: "Weekend", value: processedShopData.workingHours.weekend },
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-center gap-4 p-4 bg-base-200 rounded-xl border border-base-300 transition-all duration-300 hover:bg-base-300 group">
                                                <div className="p-3 rounded-lg bg-base-100 group-hover:bg-base-200/50 transition-colors duration-300 shadow-sm">
                                                    <item.icon className="text-primary" size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-base-content/70 text-sm">{item.label}</p>
                                                    <p className="text-base-content font-medium break-all">{item.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Address Information */}
                                    <div className="space-y-4">
                                        <div className="bg-base-200 rounded-xl p-6 border border-base-300 h-full">
                                            <h3 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                                                <MapPin className="text-primary" size={20} />
                                                Location
                                            </h3>
                                            <div className="space-y-3">
                                                <p className="text-base-content font-medium">{processedShopData.address.street}</p>
                                                <div className="text-base-content/70 text-sm space-y-1">
                                                    <p>{processedShopData.address.city}, {processedShopData.address.district}</p>
                                                    <p>{processedShopData.address.division}, {processedShopData.address.country}</p>
                                                    <p>Postal Code: {processedShopData.address.postalCode}</p>
                                                </div>
                                                <button
                                                    onClick={() => window.open(processedShopData.address.mapUrl, '_blank')}
                                                    className="flex items-center gap-2 text-primary font-semibold mt-4 hover:text-secondary transition-colors duration-300"
                                                >
                                                    <Navigation size={16} />
                                                    Open in Google Maps
                                                </button>
                                            </div>
                                        </div>

                                        {/* Social Links */}
                                        {Object.keys(processedShopData.socialLinks).length > 0 && (
                                            <div className="bg-base-200 rounded-xl p-6 border border-base-300">
                                                <h3 className="font-semibold text-base-content mb-4">Follow Us</h3>
                                                <div className="flex gap-3">
                                                    {processedShopData.socialLinks.facebook && (
                                                        <button
                                                            onClick={() => window.open(processedShopData.socialLinks.facebook, '_blank')}
                                                            className="p-3 bg-base-100 rounded-lg hover:bg-base-300 transition-colors duration-300"
                                                        >
                                                            <Facebook className="text-primary" size={20} />
                                                        </button>
                                                    )}
                                                    {processedShopData.socialLinks.instagram && (
                                                        <button
                                                            onClick={() => window.open(processedShopData.socialLinks.instagram, '_blank')}
                                                            className="p-3 bg-base-100 rounded-lg hover:bg-base-300 transition-colors duration-300"
                                                        >
                                                            <Instagram className="text-primary" size={20} />
                                                        </button>
                                                    )}
                                                    {processedShopData.socialLinks.twitter && (
                                                        <button
                                                            onClick={() => window.open(processedShopData.socialLinks.twitter, '_blank')}
                                                            className="p-3 bg-base-100 rounded-lg hover:bg-base-300 transition-colors duration-300"
                                                        >
                                                            <Twitter className="text-primary" size={20} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">

                        {/* Business Hours */}
                        <div className="bg-base-100 rounded-3xl p-6 border border-neutral/40 shadow-xl">
                            <h2 className="text-xl font-bold text-base-content mb-4">Business Hours</h2>
                            <div className="space-y-3">
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                    <div key={day} className="flex justify-between items-center p-3 bg-base-200 rounded-xl border border-base-300 transition-colors duration-200 hover:bg-base-300">
                                        <span className="text-base-content font-medium">{day}</span>
                                        <span className={`font-semibold ${day === processedShopData.workingHours.weekend
                                            ? "text-error"
                                            : "text-success"
                                            }`}>
                                            {day === processedShopData.workingHours.weekend
                                                ? "Closed"
                                                : `${processedShopData.workingHours.open} - ${processedShopData.workingHours.close}`
                                            }
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Management Actions */}
                        {loggedInUser && (loggedInUser.email === processedShopData.email || loggedInUser.role === "admin") && (
                            <div className="bg-base-100 rounded-3xl p-6 border border-neutral/40 shadow-xl">
                                <h2 className="text-xl font-bold text-base-content mb-4">Shop Management</h2>
                                <div className="space-y-3">
                                    <ActionButton
                                        icon={Edit3}
                                        label="Edit Shop Profile"
                                        variant="primary"
                                    />
                                    <ActionButton
                                        icon={Settings}
                                        label="Shop Settings"
                                        variant="secondary"
                                    />
                                    <ActionButton
                                        icon={BarChart3}
                                        label="View Analytics"
                                        variant="secondary"
                                    />
                                    <ActionButton
                                        icon={Share2}
                                        label="Share Profile"
                                        variant="secondary"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Service Specialties */}
                        <div className="bg-base-100 rounded-3xl p-6 border border-neutral/40 shadow-xl">
                            <h2 className="text-xl font-bold text-base-content mb-4">Specialties</h2>
                            <div className="flex flex-wrap gap-2">
                                {processedShopData.categories.map((category, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-xl border border-primary/20 font-medium transition-colors duration-300 hover:bg-primary/20"
                                    >
                                        {category}
                                    </span>
                                ))}
                                {processedShopData.categories.length === 0 && (
                                    <p className="text-base-content/70 text-sm">No specialties listed</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MechanicProfile;