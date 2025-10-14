"use client";

import React, { useEffect, useState } from "react";
import { 
    Wrench, Clock, CheckCircle, DollarSign, Star, Users, 
    Calendar, MapPin, MessageCircle, Phone, TrendingUp, 
    AlertCircle, Package, Settings, FileText, BarChart3, Car
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import useUser from "@/hooks/useUser";

const MechanicDashboardOverview = () => {
    const { user: loggedInUser, loading: userLoading } = useUser();
    const [loading, setLoading] = useState(true);
    const [shopData, setShopData] = useState(null);
    const [serviceRequests, setServiceRequests] = useState([]);
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!loggedInUser?._id) return;

            setLoading(true);
            try {
                // Fetch shop data
                const shopRes = await fetch(`/api/shops/user/${loggedInUser._id}`);
                const shopData = await shopRes.json();
                setShopData(shopData);

                // Fetch service requests for the shop
                const requestsRes = await fetch(`/api/service-request/shop/${loggedInUser._id}`);
                const requestsData = await requestsRes.json();
                setServiceRequests(requestsData);
                setAcceptedRequests(requestsData.filter(req => req.status === 'in-progress' || req.status === 'completed'));

                // Fetch reviews for the shop
                const reviewsRes = await fetch(`/api/reviews/shop/${loggedInUser._id}`);
                const reviewsData = await reviewsRes.json();
                setReviews(reviewsData);

                // Generate sample revenue data (in a real app, this would come from your API)
                const sampleRevenue = [
                    { month: "Jan", revenue: 45000, jobs: 12 },
                    { month: "Feb", revenue: 52000, jobs: 15 },
                    { month: "Mar", revenue: 48000, jobs: 14 },
                    { month: "Apr", revenue: 61000, jobs: 18 },
                    { month: "May", revenue: 58000, jobs: 16 },
                    { month: "Jun", revenue: 67000, jobs: 20 },
                ];
                setRevenueData(sampleRevenue);

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!userLoading && loggedInUser) {
            fetchDashboardData();
        }
    }, [loggedInUser, userLoading]);

    // --- Data Processing ---
    const currentRequests = serviceRequests.filter(req => req.status === 'in-progress');
    const completedRequests = serviceRequests.filter(req => req.status === 'completed');
    const pendingRequests = serviceRequests.filter(req => req.status === 'pending');

    // Calculate statistics
    const totalEarnings = completedRequests.reduce((total, req) => {
        const budget = parseInt(req.estimatedBudget?.split('-')[0]) || 0;
        return total + budget;
    }, 0);

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
        : 0;

    const completionRate = serviceRequests.length > 0 
        ? ((completedRequests.length / serviceRequests.length) * 100).toFixed(0)
        : 0;

    // Service type breakdown
    const serviceTypeCount = serviceRequests.reduce((acc, curr) => {
        const type = curr.problemCategory || "General Repair";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const serviceTypeBreakdown = Object.entries(serviceTypeCount).map(([name, value]) => ({
        name,
        value,
    }));

    // Recent activity (last 5 requests)
    const recentActivity = [...serviceRequests]
        .sort((a, b) => new Date(b.requestedDate) - new Date(a.requestedDate))
        .slice(0, 5);

    // Upcoming schedules
    const upcomingSchedules = serviceRequests
        .filter(req => req.preferredSchedule?.date && new Date(req.preferredSchedule.date) >= new Date())
        .sort((a, b) => new Date(a.preferredSchedule.date) - new Date(b.preferredSchedule.date))
        .slice(0, 5);

    // Pie Chart Colors
    const COLORS = ["#EA580C", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4", "#9333EA"];

    // --- Component Definitions ---

    const StatCard = ({ icon: Icon, value, label, change, trend, color = "primary" }) => {
        const colorClasses = {
            primary: {
                bg: "bg-primary/10",
                hoverBg: "group-hover:bg-primary/20",
                text: "text-primary"
            },
            success: {
                bg: "bg-success/10",
                hoverBg: "group-hover:bg-success/20",
                text: "text-success"
            },
            warning: {
                bg: "bg-warning/10",
                hoverBg: "group-hover:bg-warning/20",
                text: "text-warning"
            },
            error: {
                bg: "bg-error/10",
                hoverBg: "group-hover:bg-error/20",
                text: "text-error"
            }
        };

        const classes = colorClasses[color] || colorClasses.primary;

        return (
            <div className="bg-base-100 rounded-3xl p-6 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] group">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${classes.bg} ${classes.hoverBg} transition-colors duration-300`}>
                        <Icon className={classes.text} size={24} />
                    </div>
                    {change && (
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            trend === "up" ? "bg-success/20 text-success" : "bg-error/20 text-error"
                        }`}>
                            {trend === "up" ? "↑" : "↓"} {change}
                        </span>
                    )}
                </div>
                <p className="text-3xl font-bold text-base-content mb-1">{value}</p>
                <p className="text-base-content/60 text-sm font-medium">{label}</p>
            </div>
        );
    };

    const platformMetrics = [
        {
            id: 1,
            title: "Active Jobs",
            value: loading ? "…" : currentRequests.length,
            change: "+2",
            trend: "up",
            icon: Wrench,
            color: "primary",
        },
        {
            id: 2,
            title: "Completed",
            value: loading ? "…" : completedRequests.length,
            change: "+5",
            trend: "up",
            icon: CheckCircle,
            color: "success",
        },
        {
            id: 3,
            title: "Total Earnings",
            value: loading ? "…" : `৳${totalEarnings.toLocaleString()}`,
            change: "+12%",
            trend: "up",
            icon: DollarSign,
            color: "warning",
        },
        {
            id: 4,
            title: "Avg. Rating",
            value: loading ? "…" : averageRating,
            change: "+0.3",
            trend: "up",
            icon: Star,
            color: "primary",
        },
        {
            id: 5,
            title: "Completion Rate",
            value: loading ? "…" : `${completionRate}%`,
            change: "+8%",
            trend: "up",
            icon: TrendingUp,
            color: "success",
        },
        {
            id: 6,
            title: "Pending Requests",
            value: loading ? "…" : pendingRequests.length,
            change: pendingRequests.length > 0 ? "Attention" : null,
            trend: pendingRequests.length > 0 ? "down" : "up",
            icon: AlertCircle,
            color: pendingRequests.length > 0 ? "error" : "success",
        },
    ];

    // Custom label for pie chart
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    // --- Loading and Auth Check ---
    if (userLoading || loading) {
        return (
            <div className="flex items-center justify-center h-full w-full bg-base-200">
                <span className="loading loading-bars loading-xl text-primary"></span>
            </div>
        );
    }

    if (!loggedInUser) {
        return (
            <div className="flex items-center justify-center h-full w-full bg-base-200">
                <div className="text-center">
                    <AlertCircle className="mx-auto text-error mb-4" size={48} />
                    <p className="text-base-content">Please log in to access the dashboard</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 bg-base-200 space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-orange-600 rounded-3xl p-6 md:p-10 text-white shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-2xl">
                        <Wrench size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Mechanic Dashboard</h1>
                        <p className="text-orange-100 text-sm sm:text-lg mt-2">
                            Welcome back, <span className="font-semibold text-white">{loggedInUser.name}</span>
                        </p>
                        <p className="text-orange-200 text-sm mt-1">
                            {shopData?.shop?.shopName || "Your Auto Repair Shop"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm flex-wrap">
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                        <Star size={16} />
                        <span>{averageRating} Average Rating ({reviews.length} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                        <MapPin size={16} />
                        <span>{shopData?.shop?.address?.city || "City"} • {shopData?.shop?.address?.street || "Location"}</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
                {platformMetrics.map((metric) => (
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

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Revenue Trend Chart */}
                <div className="xl:col-span-2 bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
                    <h2 className="text-xl md:text-2xl font-bold text-base-content mb-8">Revenue & Jobs Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral)" />
                            <XAxis dataKey="month" stroke="var(--color-base-content)" />
                            <YAxis stroke="var(--color-base-content)" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'var(--color-base-100)', 
                                    border: '1px solid var(--color-neutral)', 
                                    borderRadius: '8px' 
                                }} 
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#EA580C"
                                strokeWidth={3}
                                dot={{ fill: '#EA580C', r: 4 }}
                                name="Revenue (৳)"
                            />
                            <Line
                                type="monotone"
                                dataKey="jobs"
                                stroke="#22C55E"
                                strokeWidth={3}
                                dot={{ fill: '#22C55E', r: 4 }}
                                name="Jobs Completed"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Service Type Breakdown */}
                <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
                    <h2 className="text-xl md:text-2xl font-bold text-base-content mb-8">Service Types</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={serviceTypeBreakdown}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={renderCustomizedLabel}
                                labelLine={false}
                            >
                                {serviceTypeBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'var(--color-base-100)', 
                                    border: '1px solid var(--color-neutral)', 
                                    borderRadius: '8px' 
                                }} 
                            />
                            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '10px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity & Upcoming Schedules */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="xl:col-span-2 bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-base-content">Recent Activity</h2>
                        <Clock className="text-primary" size={24} />
                    </div>
                    <div className="space-y-4">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((request, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-base-200 rounded-xl border border-base-300 hover:bg-base-300 transition-colors duration-200">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`w-3 h-3 rounded-full ${
                                            request.status === 'completed' ? 'bg-success' :
                                            request.status === 'in-progress' ? 'bg-primary' :
                                            'bg-warning'
                                        }`}></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-base-content truncate">
                                                {request.deviceType} • {request.problemCategory}
                                            </p>
                                            <p className="text-sm text-base-content/60 truncate">
                                                {request.user?.name || request.userEmail}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-base-content">
                                            ৳{request.estimatedBudget?.split('-')[0] || '0'}
                                        </p>
                                        <p className="text-xs text-base-content/60">
                                            {new Date(request.requestedDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-base-content/70">
                                <Package className="mx-auto mb-2 text-base-content/40" size={32} />
                                <p>No recent activity</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Upcoming Schedules */}
                <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-base-content">Upcoming Schedules</h2>
                        <Calendar className="text-primary" size={24} />
                    </div>
                    <div className="space-y-4">
                        {upcomingSchedules.length > 0 ? (
                            upcomingSchedules.map((schedule, index) => (
                                <div key={index} className="p-4 bg-base-200 rounded-xl border border-base-300 hover:bg-base-300 transition-colors duration-200">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Car className="text-primary" size={16} />
                                        <p className="font-semibold text-base-content text-sm truncate">
                                            {schedule.deviceType}
                                        </p>
                                    </div>
                                    <p className="text-xs text-base-content/60 mb-2 truncate">
                                        {schedule.user?.name || schedule.userEmail}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                                            {schedule.problemCategory}
                                        </span>
                                        <span className="text-xs text-base-content/60">
                                            {new Date(schedule.preferredSchedule.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-base-content/70">
                                <Calendar className="mx-auto mb-2 text-base-content/40" size={32} />
                                <p>No upcoming schedules</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-xl sm:text-2xl font-bold text-base-content mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button 
                        onClick={() => window.location.href = '/service-requests'}
                        className="flex items-center justify-center gap-2 p-4 bg-primary text-primary-content rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 hover:bg-orange-700 hover:shadow-lg transform hover:scale-[1.03]"
                    >
                        <Wrench size={20} />
                        <span>Browse Jobs</span>
                    </button>
                    <button 
                        onClick={() => window.location.href = '/dashboard/mechanic/requests'}
                        className="flex items-center justify-center gap-2 p-4 bg-base-200 text-base-content rounded-xl text-xs md:text-sm font-semibold border border-base-300 transition-all duration-300 hover:bg-base-300 hover:shadow-lg transform hover:scale-[1.03]"
                    >
                        <Users size={20} className="text-primary" />
                        <span>My Requests</span>
                    </button>
                    <button 
                        onClick={() => window.location.href = '/dashboard/mechanic/messages'}
                        className="flex items-center justify-center gap-2 p-4 bg-base-200 text-base-content rounded-xl text-xs md:text-sm font-semibold border border-base-300 transition-all duration-300 hover:bg-base-300 hover:shadow-lg transform hover:scale-[1.03]"
                    >
                        <MessageCircle size={20} className="text-primary" />
                        <span>Messages</span>
                    </button>
                    <button 
                        onClick={() => window.location.href = '/dashboard/mechanic/settings'}
                        className="flex items-center justify-center gap-2 p-4 bg-primary text-primary-content rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 hover:bg-orange-700 hover:shadow-lg transform hover:scale-[1.03]"
                    >
                        <Settings size={20} />
                        <span>Shop Settings</span>
                    </button>
                </div>
            </div>

            {/* Recent Reviews */}
            {reviews.length > 0 && (
                <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-base-content">Recent Reviews</h2>
                        <Star className="text-warning" size={24} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviews.slice(0, 4).map((review, index) => (
                            <div key={index} className="p-4 bg-base-200 rounded-xl border border-base-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-content font-bold text-sm">
                                        {review.user?.name?.charAt(0) || "C"}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-base-content text-sm">
                                            {review.user?.name || "Customer"}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={i < review.rating ? "text-warning fill-warning" : "text-base-content/30"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-base-content/80 line-clamp-2">
                                    {review.comment || "No comment provided"}
                                </p>
                                <p className="text-xs text-base-content/60 mt-2">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MechanicDashboardOverview;