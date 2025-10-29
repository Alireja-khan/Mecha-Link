"use client";

import React, { useEffect, useState } from "react";
import { Users, Store, Wrench, UserCheck, Star, Shield, Crown, Calendar, Eye, FileText, Settings, BarChart3, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import useUser from "@/hooks/useUser";

const AdminDashboardOverview = () => {
    const { user: loggedInUser, loading: userLoading } = useUser();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        users: 0,
        mechanicShops: 0,
        serviceRequests: 0,
        averageRating: 0,
        totalMechanic: 0
    });
    const [totalData, setTotalData] = useState({ result: [] });
    const [totalShop, setTotalShop] = useState({ result: [] });
    const [recentSignups, setRecentSignups] = useState([]);
    const [totalReviews, setTotalReviews] = useState([]);
    const [paymentData, setPaymentData] = useState({ payments: [], totalAmount: 0 });

    useEffect(() => {
        // --- Data Fetching Functions ---
        const fetchDashboardStats = async () => {
            try {
                const res = await fetch("/api/countCollection");
                const data = await res.json();
                setDashboardData(data || {});
            } catch (err) {
                console.error("Failed to fetch dashboard stats:", err);
            }
        };

        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/users/dashboardUser?overview=true");
                const data = await res.json();
                setRecentSignups(data || []);
            } catch (err) {
                console.error("Failed to fetch recent users:", err);
            }
        };

        const fetchPayments = async () => {
            try {
                const res = await fetch("/api/payment");
                const data = await res.json();
                setPaymentData(data);
            } catch (err) {
                console.error("Failed to fetch payments:", err);
            }
        };

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all necessary data in parallel
                await Promise.all([
                    fetchDashboardStats(),
                    fetchUsers(),
                    fetchPayments(),
                    fetch("/api/service-request").then(res => res.json()).then(data => setTotalData(data)),
                    fetch("/api/shops").then(res => res.json()).then(data => setTotalShop(data)),
                    fetch("/api/reviews").then(res => res.json()).then(data => setTotalReviews(data))
                ]);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // --- Loading and Auth Check ---
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

    // --- Data Processing ---
    const { result: requests = [] } = totalData;
    const { result: shops = [] } = totalShop;
    const reviews = totalReviews;
    const { payments = [], totalAmount = 0 } = paymentData;

    // Process payment data for dynamic chart
    const processPaymentTrends = () => {
        if (!payments.length) return [];

        // Group payments by month and calculate total amount per month
        const monthlyData = payments.reduce((acc, payment) => {
            if (!payment.paymentDate) return acc;
            
            const date = new Date(payment.paymentDate);
            const monthYear = date.toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
            });
            
            const amount = parseFloat(payment.amount) || 0;
            
            if (!acc[monthYear]) {
                acc[monthYear] = { month: monthYear, amount: 0, payments: 0 };
            }
            
            acc[monthYear].amount += amount;
            acc[monthYear].payments += 1;
            
            return acc;
        }, {});

        // Convert to array and sort by date
        return Object.values(monthlyData)
            .sort((a, b) => {
                const dateA = new Date(a.month);
                const dateB = new Date(b.month);
                return dateA - dateB;
            })
            .slice(-6); // Show last 6 months
    };

    const paymentTrends = processPaymentTrends();

    // Recent Service Requests (last 5)
    const recentServiceReq = requests.slice(-5).reverse().map((service) => ({
        name: service.deviceType || service.userEmail,
        problem: service.problemCategory || "Other",
        date: new Date(service.requestedDate || Date.now()).toLocaleDateString(),
    }));

    // Recent Shops (last 5)
    const recentShopsData = shops.slice(-5).reverse().map((s) => ({
        name: s.shop?.shopName || s.shop?.contact?.businessEmail || "Unnamed Shop",
        serviceType: Array.isArray(s.shop?.categories) ? s.shop.categories.join(", ") : "Other",
        date: new Date(s.shop?.createdAt || Date.now()).toLocaleDateString(),
    }));

    const platformMetrics = [
        {
            id: 1,
            title: "Total Users",
            value: loading ? "…" : dashboardData.users || 0,
            change: "+12%",
            trend: "up",
            icon: Users,
            color: "orange",
        },
        {
            id: 2,
            title: "Mechanic Shops",
            value: loading ? "…" : dashboardData.mechanicShops || 0,
            change: "+8%",
            trend: "up",
            icon: Store,
            color: "blue",
        },
        {
            id: 3,
            title: "Service Requests",
            value: loading ? "…" : dashboardData.serviceRequests || 0,
            change: "+15%",
            trend: "up",
            icon: Wrench,
            color: "green",
        },
        {
            id: 4,
            title: "Active Mechanics",
            value: loading ? "…" : dashboardData.totalMechanic || 0,
            change: "+5%",
            trend: "up",
            icon: UserCheck,
            color: "purple",
        },
        {
            id: 5,
            title: "Total Revenue",
            value: loading ? "…" : `$${totalAmount.toLocaleString()}`,
            change: "+18%",
            trend: "up",
            icon: DollarSign,
            color: "emerald",
        },
        {
            id: 6,
            title: "Avg. Rating",
            value: loading ? "…" : dashboardData.averageRating || 0,
            change: "+0.2",
            trend: "up",
            icon: Star,
            color: "yellow",
        },
    ];

    // Service Type Breakdown Data
    const serviceTypeCount = requests.reduce((acc, curr) => {
        const type = curr.deviceType || "Other";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const serviceTypeBreakdown = Object.entries(serviceTypeCount).map(([name, value]) => ({
        name,
        value,
    }));

    // Pie Chart Colors
    const COLORS = ["#EA580C", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4", "#9333EA"];

    // --- Component Definitions ---

    const colorMap = {
        orange: { bg: "bg-orange-500/15", hoverBg: "group-hover:bg-orange-500/25", text: "text-orange-500" },
        blue: { bg: "bg-blue-500/15", hoverBg: "group-hover:bg-blue-500/25", text: "text-blue-500" },
        green: { bg: "bg-green-500/15", hoverBg: "group-hover:bg-green-500/25", text: "text-green-500" },
        purple: { bg: "bg-purple-500/15", hoverBg: "group-hover:bg-purple-500/25", text: "text-purple-500" },
        emerald: { bg: "bg-emerald-500/15", hoverBg: "group-hover:bg-emerald-500/25", text: "text-emerald-500" },
        yellow: { bg: "bg-yellow-500/15", hoverBg: "group-hover:bg-yellow-500/25", text: "text-yellow-500" },
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

    // Custom label for pie chart with percentages
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

    // Custom tooltip for payment trends
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-base-100 p-4 border border-neutral rounded-lg shadow-lg">
                    <p className="font-bold text-base-content">{label}</p>
                    <p className="text-green-600">
                        Amount: <span className="font-bold">${payload[0].value.toLocaleString()}</span>
                    </p>
                    <p className="text-blue-600">
                        Payments: <span className="font-bold">{payload[0].payload.payments}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    // --- Main Component Render ---
    return (
        <div className="min-h-screen p-4 md:p-8 bg-base-200 space-y-8">
            {/* Header - Unified Design */}
            <div className="bg-gradient-to-br from-primary to-orange-600 rounded-3xl p-6 md:p-10 text-white shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-2xl">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Admin Dashboard</h1>
                        <p className="text-orange-100 text-sm sm:text-lg mt-2">
                            Welcome back, <span className="font-semibold text-white">{loggedInUser.name}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm flex-wrap">
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                        <Crown size={16} />
                        <span>System Administrator</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                        <Calendar size={16} />
                        <span>Joined {new Date(loggedInUser.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid - Uniform Card Style */}
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

            {/* Charts - Uniform Card Style */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Dynamic Payment Trends Chart */}
                <div className="xl:col-span-2 bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
                    <h2 className="text-xl md:text-2xl font-bold text-base-content mb-8">Revenue Trends</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={paymentTrends} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral)" />
                            <XAxis dataKey="month" stroke="var(--color-base-content)" />
                            <YAxis stroke="var(--color-base-content)" />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#22C55E"
                                strokeWidth={3}
                                dot={{ fill: '#22C55E', r: 4 }}
                                name="Revenue"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
                    <h2 className="text-xl md:text-2xl font-bold text-base-content mb-8">Service Type Breakdown</h2>
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
                            <Tooltip contentStyle={{ backgroundColor: 'var(--color-base-100)', border: '1px solid var(--color-neutral)', borderRadius: '8px' }} />
                            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '10px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity - Uniform Card Style */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Service Requests */}
                <div className="bg-base-100 col-span-1 xl:col-span-2 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-base-content">Recent Service Requests</h2>
                        <Eye className="text-primary" size={24} />
                    </div>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-8">
                                <span className="loading loading-bars loading-md text-primary"></span>
                            </div>
                        ) : recentServiceReq.length > 0 ? (
                            recentServiceReq.map((req, i) => (
                                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-base-200 rounded-xl border border-base-300 hover:bg-base-300 transition-colors duration-200">
                                    <div>
                                        <p className="font-semibold text-base-content">{req.name}</p>
                                        <p className="text-sm text-base-content/60">{req.problem}</p>
                                    </div>
                                    <span className="text-xs text-base-content mt-2 sm:mt-0 whitespace-nowrap">{req.date}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-base-content/70">No recent service requests</div>
                        )}
                    </div>
                </div>

                {/* Recent Signups */}
                <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-base-content">Recent Signups</h2>
                        <UserCheck className="text-primary" size={24} />
                    </div>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-8">
                                <span className="loading loading-bars loading-md text-primary"></span>
                            </div>
                        ) : recentSignups.length > 0 ? (
                            recentSignups.map((user, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-base-200 rounded-xl border border-base-300 hover:bg-base-300 transition-colors duration-200">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                        {user.name?.charAt(0) || "U"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-base-content truncate">{user.name}</p>
                                        <p className="text-sm text-base-content/60 capitalize truncate">{user.role}</p>
                                    </div>
                                    <span className="text-xs text-base-content/50 whitespace-nowrap flex-shrink-0">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-base-content/70">No recent signups</div>
                        )}
                    </div>
                </div>

            </div>

            {/* Recent Shops - Uniform Card Style */}
            <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-base-content">Recent Shops</h2>
                    <Store className="text-primary" size={24} />
                </div>
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-8">
                            <span className="loading loading-bars loading-md text-primary"></span>
                        </div>
                    ) : recentShopsData.length > 0 ? (
                        recentShopsData.map((shop, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-base-200 rounded-xl border border-base-300 transition-colors duration-200 hover:bg-base-300 overflow-hidden">
                                <div className="w-10 h-10 mr-4 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-primary-content font-bold text-sm flex-shrink-0">
                                    {shop.name?.charAt(0) || "U"}
                                </div>
                                <div className="flex-1 min-w-0 pr-2">
                                    <p className="font-semibold text-sm sm:text-base text-base-content max-w-[240px] md:max-w-full truncate">{shop.name}</p>
                                    <p className="text-xs sm:text-sm text-base-content/70 truncate">{shop.serviceType}</p>
                                </div>
                                <span className="text-xs text-base-content/60 flex-shrink-0 whitespace-nowrap">{shop.date}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-base-content/70 text-sm">No recent shops</div>
                    )}
                </div>
            </div>

            {/* Quick Actions - Uniform Card Style and Button Style */}
            <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-xl sm:text-2xl font-bold text-base-content mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="flex items-center justify-center gap-2 p-4 bg-primary text-primary-content rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 hover:bg-orange-700 hover:shadow-lg transform hover:scale-[1.03]">
                        <UserCheck size={20} />
                        <span>User Management</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 p-4 bg-base-200 text-base-content rounded-xl text-xs md:text-sm font-semibold border border-base-300 transition-all duration-300 hover:bg-base-300 hover:shadow-lg transform hover:scale-[1.03]">
                        <Settings size={20} className="text-primary" />
                        <span>System Settings</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 p-4 bg-base-200 text-base-content rounded-xl text-xs md:text-sm font-semibold border border-base-300 transition-all duration-300 hover:bg-base-300 hover:shadow-lg transform hover:scale-[1.03]">
                        <BarChart3 size={20} className="text-primary" />
                        <span>Analytics</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 p-4 bg-primary text-primary-content rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 hover:bg-orange-700 hover:shadow-lg transform hover:scale-[1.03]">
                        <FileText size={20} />
                        <span>Reports</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardOverview;