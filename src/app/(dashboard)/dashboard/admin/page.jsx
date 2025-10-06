// DashboardOverview.jsx
"use client";

import React, { useEffect, useState } from "react";
import { Users, Store, Wrench, UserCheck, DollarSign, Star, Shield, Crown, Calendar, Eye, FileText, Settings, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import useUser from "@/hooks/useUser";

const getColorClasses = (color) => {
    switch (color) {
        case 'orange':
            return {
                text: 'text-primary',
                bg_light: 'bg-primary/20 group-hover:bg-primary/30',
            };
        case 'blue':
            return {
                text: 'text-info',
                bg_light: 'bg-info/20 group-hover:bg-info/30',
            };
        case 'green':
            return {
                text: 'text-success',
                bg_light: 'bg-success/20 group-hover:bg-success/30',
            };
        case 'purple':
            // Keeping generic Tailwind purple for unsupported DaisyUI color
            return {
                text: 'text-purple-500',
                bg_light: 'bg-purple-500/20 group-hover:bg-purple-500/30',
            };
        case 'emerald':
            return {
                text: 'text-success',
                bg_light: 'bg-success/20 group-hover:bg-success/30',
            };
        case 'yellow':
            return {
                text: 'text-warning',
                bg_light: 'bg-warning/20 group-hover:bg-warning/30',
            };
        default:
            return {
                text: 'text-base-content',
                bg_light: 'bg-base-200/50 group-hover:bg-base-200',
            };
    }
};

const AdminDashboardOverview = () => {
    const { user: loggedInUser, loading: userLoading } = useUser();
    const [loading, setLoading] = useState(true);
    const [totalData, setTotalData] = useState({ result: [] });
    const [totalShop, setTotalShop] = useState({ result: [] });
    const [recentSignups, setRecentSignups] = useState([]);
    const [userData, setUserData] = useState([]);
    const [totalReviews, setTotalReviews] = useState([])

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/users/dashboardUser?overview=true");
                const data = await res.json();
                setRecentSignups(data || []);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            }
        };

        const fetchAllUsers = async () => {
            try {
                const res = await fetch("/api/users/dashboardUser");
                const data = await res.json();
                setUserData(data || []);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            }
        };



        const fetchData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchUsers(),
                    fetchAllUsers(),
                    fetch("/api/service-request").then(res => res.json()).then(data => setTotalData(data)),
                    fetch("/api/shops").then(res => res.json()).then(data => setTotalShop(data)),
                    fetch("/api/reviews").then(res => res.json()).then(data => setTotalReviews(data))
                ]);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    if (userLoading || !loggedInUser) {
        return (
            <div className="flex items-center justify-center min-h-screen w- bg-base-100">
                <span className="loading loading-bars loading-xl text-primary"></span>
            </div>
        );
    }

    const { result: requests = [] } = totalData;
    const { result: shops = [] } = totalShop;
    const reviews = totalReviews;

    const recentServiceReq = requests.slice(-5).reverse().map((service) => ({
        name: service.deviceType || service.userEmail,
        problem: service.problemCategory || "Other",
        date: new Date(service.requestedDate || Date.now()).toLocaleDateString(),
    }));

    const recentShopsData = shops.slice(-5).reverse().map((s) => ({
        name: s.shop?.shopName || s.shop?.contact?.businessEmail || "Unnamed Shop",
        serviceType: Array.isArray(s.shop?.categories) ? s.shop.categories.join(", ") : "Other",
        date: new Date(s.shop?.createdAt || Date.now()).toLocaleDateString(),
    }));

    const calculateTotalMechanics = (shopsArray) => {
        if (!shopsArray || !Array.isArray(shopsArray)) return 0;

        return shopsArray.reduce((total, shop) => {
            const count = shop.shop?.mechanicCount || 0;
            return total + count;
        }, 0);
    };
    const totalMechanics = calculateTotalMechanics(shops);

    const calculateTotalRatings = (reviewsArray) => {
        if (!reviewsArray || !Array.isArray(reviewsArray)) return 0;

        return reviewsArray.reduce((total, review) => {
            const count = review.rating || 0;
            return total + count;
        }, 0);
    };
    const totalRatings = calculateTotalRatings(totalReviews);
    const averageRatings = reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : "N/A";


    const platformMetrics = [
        { id: 1, title: "Total Users", value: loading ? "…" : userData.length, change: "+12%", trend: "up", icon: Users, color: "orange" },
        { id: 2, title: "Mechanic Shops", value: loading ? "…" : shops.length, change: "+8%", trend: "up", icon: Store, color: "blue" },
        { id: 3, title: "Service Requests", value: loading ? "…" : requests.length, change: "+15%", trend: "up", icon: Wrench, color: "green" },
        { id: 4, title: "Active Mechanics", value: loading ? "…" : totalMechanics, change: "+5%", trend: "up", icon: UserCheck, color: "purple" },
        { id: 5, title: "Revenue", value: "$24,580", change: "+18%", trend: "up", icon: DollarSign, color: "emerald" },
        { id: 6, title: "Avg. Rating", value: loading ? "…" : averageRatings, change: "+0.2", trend: "up", icon: Star, color: "yellow" },
    ];

    const serviceTrends = [
        { month: "Jan", requests: 200 },
        { month: "Feb", requests: 240 },
        { month: "Mar", requests: 300 },
        { month: "Apr", requests: 270 },
        { month: "May", requests: 350 },
        { month: "Jun", requests: 400 },
    ];

    const serviceTypeCount = requests.reduce((acc, curr) => {
        const type = curr.deviceType || "Other";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const serviceTypeBreakdown = Object.entries(serviceTypeCount).map(([name, value]) => ({
        name,
        value,
    }));

    const COLORS = ["#f97316", "#22c55e", "#fbbf24", "#ef4444", "#3b82f6", "#8b5cf6"];

    const StatCard = ({ icon: Icon, value, label, change, trend, color = "orange" }) => {
        const colorClasses = getColorClasses(color);

        return (
            // ADDED: transition-all duration-300 and hover:scale/shadow for lift effect
            <div className="bg-base-100 rounded-2xl p-5 sm:p-6 border border-neutral/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-3 rounded-xl ${colorClasses.bg_light} transition-colors duration-300`}>
                        <Icon className={`${colorClasses.text}`} size={20} sm={24} />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${trend === 'up' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                        {trend === 'up' ? '↑' : '↓'} {change}
                    </span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-base-content mb-1 leading-tight">{value}</p>
                <p className="text-base-content/70 text-xs sm:text-sm font-medium">{label}</p>
            </div>
        );
    };

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10} fontWeight="bold">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 bg-base-200 space-y-6 sm:space-y-8 mx-auto text-base-content -z-50">
            {/* Banner - No hover needed on the fixed banner */}
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-primary-content shadow-2xl shadow-primary/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 sm:p-3 bg-base-100/20 rounded-xl sm:rounded-2xl">
                            <Shield size={24} sm={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-bold">Admin Dashboard</h1>
                            <p className="text-primary-content/90 text-sm sm:text-lg mt-1 sm:mt-2">
                                Welcome back, <span className="font-semibold text-primary-content">{loggedInUser.name}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm mt-4 sm:mt-0">
                    {/* Hover effect on info badges */}
                    <div className="flex items-center gap-2 bg-base-100/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl **transition-colors duration-200 hover:bg-base-100/40**">
                        <Crown size={14} sm={16} />
                        <span>System Administrator</span>
                    </div>
                    <div className="flex items-center gap-2 bg-base-100/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl **transition-colors duration-200 hover:bg-base-100/40**">
                        <Calendar size={14} sm={16} />
                        <span>Joined {new Date(loggedInUser.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
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

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
                {/* Chart Card 1: Added hover effects */}
                <div className="xl:col-span-2 bg-base-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-neutral/40 shadow-xl **transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]**">
                    <h2 className="text-xl sm:text-2xl font-bold text-base-content mb-6 sm:mb-8">Service Requests Trend</h2>
                    <ResponsiveContainer width="100%" height={250} sm={300}>
                        <LineChart data={serviceTrends} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral)" />
                            <XAxis dataKey="month" stroke="var(--color-base-content)" style={{ fontSize: '10px' }} />
                            <YAxis stroke="var(--color-base-content)" style={{ fontSize: '10px' }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', background: 'var(--fallback-b3, #415a77)', border: '1px solid var(--fallback-n, #2d3748)' }} />
                            <Line
                                type="monotone"
                                dataKey="requests"
                                stroke="var(--color-primary)"
                                strokeWidth={3}
                                dot={{ fill: 'var(--color-primary)', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Chart Card 2: Added hover effects */}
                <div className="bg-base-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-neutral/40 shadow-xl **transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]**">
                    <h2 className="text-xl sm:text-2xl font-bold text-base-content mb-6 sm:mb-8">Service Type Breakdown</h2>
                    <ResponsiveContainer width="100%" height={250} sm={300}>
                        <PieChart>
                            <Pie
                                data={serviceTypeBreakdown}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={window.innerWidth < 640 ? 80 : 100}
                                label={renderCustomizedLabel}
                                labelLine={false}
                            >
                                {serviceTypeBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', background: 'var(--fallback-b3, #415a77)', border: '1px solid var(--fallback-n, #2d3748)' }} />
                            <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
                {/* Recent Service Requests List: Added hover effects to the container */}
                <div className="bg-base-100 col-span-1 xl:col-span-2 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-neutral/40 shadow-xl **transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]**">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-base-content">Recent Service Requests</h2>
                        <Eye className="text-primary" size={20} />
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                        {loading ? (
                            <div className="text-center py-8">
                                <span className="loading loading-bars loading-md text-primary"></span>
                            </div>
                        ) : recentServiceReq.length > 0 ? (
                            recentServiceReq.map((req, i) => (
                                // ADDED: transition-colors and hover:bg-base-300 for list items
                                <div key={i} className="flex items-center justify-between p-3 sm:p-4 bg-base-200 rounded-xl border border-base-300 **transition-colors duration-200 hover:bg-base-300**">
                                    <div className="truncate pr-2">
                                        <p className="font-semibold text-sm sm:text-base text-base-content truncate">{req.name}</p>
                                        <p className="text-xs sm:text-sm text-base-content/70 truncate">{req.problem}</p>
                                    </div>
                                    <span className="text-xs text-base-content/60 flex-shrink-0">{req.date}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-base-content/70 text-sm">No recent service requests</div>
                        )}
                    </div>
                </div>

                {/* Recent Signups List: Added hover effects to the container */}
                <div className="bg-base-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-neutral/40 shadow-xl **transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]**">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-base-content">Recent Signups</h2>
                        <UserCheck className="text-primary" size={20} />
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                        {loading ? (
                            <div className="text-center py-8">
                                <span className="loading loading-bars loading-md text-primary"></span>
                            </div>
                        ) : recentSignups.length > 0 ? (
                            recentSignups.map((user, i) => (
                                // ADDED: transition-colors and hover:bg-base-300 for list items
                                <div key={i} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-base-200 rounded-xl border border-base-300 **transition-colors duration-200 hover:bg-base-300**">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-lg sm:rounded-xl flex items-center justify-center text-primary-content font-bold text-sm">
                                        {user.name?.charAt(0) || "U"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm sm:text-base text-base-content truncate">{user.name}</p>
                                        <p className="text-xs sm:text-sm text-base-content/70 capitalize truncate">{user.role}</p>
                                    </div>
                                    <span className="text-xs text-base-content/60 flex-shrink-0">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-base-content/70 text-sm">No recent signups</div>
                        )}
                    </div>
                </div>

            </div>
            {/* Recent Shops List: Added hover effects to the container */}
            <div className="bg-base-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-neutral/40 shadow-xl **transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]**">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-base-content">Recent Shops</h2>
                    <Store className="text-primary" size={20} />
                </div>
                <div className="space-y-3 sm:space-y-4">
                    {loading ? (
                        <div className="text-center py-8">
                            <span className="loading loading-bars loading-md text-primary"></span>
                        </div>
                    ) : recentShopsData.length > 0 ? (
                        recentShopsData.map((shop, i) => (
                            // ADDED: transition-colors and hover:bg-base-300 for list items
                            <div key={i} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-base-200 rounded-xl border border-base-300 **transition-colors duration-200 hover:bg-base-300**">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-info to-info/70 rounded-lg sm:rounded-xl flex items-center justify-center text-info-content font-bold text-sm">
                                    {shop.name?.charAt(0) || "S"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm sm:text-base text-base-content truncate">{shop.name}</p>
                                    <p className="text-xs sm:text-sm text-base-content/70 truncate">{shop.serviceType}</p>
                                </div>
                                <span className="text-xs text-base-content/60 flex-shrink-0">{shop.date}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-base-content/70 text-sm">No recent shops</div>
                    )}
                </div>
            </div>

            {/* Quick Actions Card: No hover needed, focus on button hovers inside */}
            <div className="bg-base-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-neutral/40 shadow-xl">
                <h2 className="text-xl sm:text-2xl font-bold text-base-content mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Primary Button: hover:bg-secondary has a built-in color transition */}
                    <button className="flex items-center justify-center gap-2 p-3 sm:p-4 bg-primary text-primary-content rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 hover:bg-secondary hover:shadow-md">
                        <UserCheck size={18} />
                        <span>User Management</span>
                    </button>
                    {/* Secondary Button: added hover effects */}
                    <button className="flex items-center justify-center gap-2 p-3 sm:p-4 bg-base-200 text-base-content rounded-xl text-xs md:text-sm font-semibold border border-base-300 transition-all duration-300 hover:bg-base-300 hover:shadow-md">
                        <Settings size={18} className="text-primary" />
                        <span>System Settings</span>
                    </button>
                    {/* Secondary Button: added hover effects */}
                    <button className="flex items-center justify-center gap-2 p-3 sm:p-4 bg-base-200 text-base-content rounded-xl text-xs md:text-sm font-semibold border border-base-300 transition-all duration-300 hover:bg-base-300 hover:shadow-md">
                        <BarChart3 size={18} className="text-primary" />
                        <span>Analytics</span>
                    </button>
                    {/* Primary Button */}
                    <button className="flex items-center justify-center gap-2 p-3 sm:p-4 bg-primary text-primary-content rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 hover:bg-secondary hover:shadow-md">
                        <FileText size={18} />
                        <span>Reports</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardOverview;