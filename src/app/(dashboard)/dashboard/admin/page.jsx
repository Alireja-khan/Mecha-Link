"use client";

import React, { useEffect, useState } from "react";
import { Users, Store, Wrench, UserCheck, DollarSign, Star, Shield, Crown, Calendar, Eye, FileText, Settings, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import useUser from "@/hooks/useUser";

const getColorClasses = (color) => {
    switch (color) {
        case 'orange':
            return {
                text: 'text-orange-600',
                bg_light: 'bg-orange-500/10 group-hover:bg-orange-500/20',
            };
        case 'blue':
            return {
                text: 'text-blue-600',
                bg_light: 'bg-blue-500/10 group-hover:bg-blue-500/20',
            };
        case 'green':
            return {
                text: 'text-green-600',
                bg_light: 'bg-green-500/10 group-hover:bg-green-500/20',
            };
        case 'purple':
            return {
                text: 'text-purple-600',
                bg_light: 'bg-purple-500/10 group-hover:bg-purple-500/20',
            };
        case 'emerald':
            return {
                text: 'text-emerald-600',
                bg_light: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
            };
        case 'yellow':
            return {
                text: 'text-yellow-600',
                bg_light: 'bg-yellow-500/10 group-hover:bg-yellow-500/20',
            };
        default:
            return {
                text: 'text-gray-600',
                bg_light: 'bg-gray-500/10 group-hover:bg-gray-500/20',
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
            <div className="flex items-center justify-center min-h-screen w-screen bg-gray-50">
                <span className="loading loading-bars loading-xl text-orange-500"></span>
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

    const COLORS = ["#EA580C", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4", "#9333EA"];

    const StatCard = ({ icon: Icon, value, label, change, trend, color = "orange" }) => {
        const colorClasses = getColorClasses(color);

        return (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-3 rounded-xl ${colorClasses.bg_light} transition-colors duration-300`}>
                        <Icon className={`${colorClasses.text}`} size={20} sm={24} />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {trend === 'up' ? '↑' : '↓'} {change}
                    </span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 leading-tight">{value}</p>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">{label}</p>
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
        <div className="min-h-screen p-4 sm:p-6 bg-gray-50 space-y-6 sm:space-y-8 mx-auto">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 sm:p-3 bg-white/20 rounded-xl sm:rounded-2xl">
                            <Shield size={24} sm={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-bold">Admin Dashboard</h1>
                            <p className="text-orange-100 text-sm sm:text-lg mt-1 sm:mt-2">
                                Welcome back, <span className="font-semibold text-white">{loggedInUser.name}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm mt-4 sm:mt-0">
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl">
                        <Crown size={14} sm={16} />
                        <span>System Administrator</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl">
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
                <div className="xl:col-span-2 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-orange-100 shadow-xl">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Service Requests Trend</h2>
                    <ResponsiveContainer width="100%" height={250} sm={300}>
                        <LineChart data={serviceTrends} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '10px' }} />
                            <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                            <Line
                                type="monotone"
                                dataKey="requests"
                                stroke="#EA580C"
                                strokeWidth={3}
                                dot={{ fill: '#EA580C', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-orange-100 shadow-xl">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Service Type Breakdown</h2>
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
                            <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                            <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
                <div className="bg-white col-span-1 xl:col-span-2 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-orange-100 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Service Requests</h2>
                        <Eye className="text-orange-500" size={20} />
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                        {loading ? (
                            <div className="text-center py-8">
                                <span className="loading loading-bars loading-md text-orange-500"></span>
                            </div>
                        ) : recentServiceReq.length > 0 ? (
                            recentServiceReq.map((req, i) => (
                                <div key={i} className="flex items-center justify-between p-3 sm:p-4 bg-orange-50 rounded-xl border border-orange-200">
                                    <div className="truncate pr-2">
                                        <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{req.name}</p>
                                        <p className="text-xs sm:text-sm text-gray-600 truncate">{req.problem}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 flex-shrink-0">{req.date}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 text-sm">No recent service requests</div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-orange-100 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Signups</h2>
                        <UserCheck className="text-orange-500" size={20} />
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                        {loading ? (
                            <div className="text-center py-8">
                                <span className="loading loading-bars loading-md text-orange-500"></span>
                            </div>
                        ) : recentSignups.length > 0 ? (
                            recentSignups.map((user, i) => (
                                <div key={i} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-orange-50 rounded-xl border border-orange-200">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-sm">
                                        {user.name?.charAt(0) || "U"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{user.name}</p>
                                        <p className="text-xs sm:text-sm text-gray-600 capitalize truncate">{user.role}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 flex-shrink-0">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 text-sm">No recent signups</div>
                        )}
                    </div>
                </div>

            </div>
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-orange-100 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Shops</h2>
                    <Store className="text-orange-500" size={20} />
                </div>
                <div className="space-y-3 sm:space-y-4">
                    {loading ? (
                        <div className="text-center py-8">
                            <span className="loading loading-bars loading-md text-orange-500"></span>
                        </div>
                    ) : recentShopsData.length > 0 ? (
                        recentShopsData.map((shop, i) => (
                            <div key={i} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-orange-50 rounded-xl border border-orange-200">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-sm">
                                    {shop.name?.charAt(0) || "S"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{shop.name}</p>
                                    <p className="text-xs sm:text-sm text-gray-600 truncate">{shop.serviceType}</p>
                                </div>
                                <span className="text-xs text-gray-500 flex-shrink-0">{shop.date}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500 text-sm">No recent shops</div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-orange-100 shadow-xl">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="flex items-center justify-center gap-2 p-3 sm:p-4 bg-orange-500 text-white rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 hover:bg-orange-600 hover:shadow-md">
                        <UserCheck size={18} />
                        <span>User Management</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 p-3 sm:p-4 bg-white text-gray-700 rounded-xl text-xs md:text-sm font-semibold border border-orange-200 hover:bg-orange-50 hover:shadow-md">
                        <Settings size={18} />
                        <span>System Settings</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 p-3 sm:p-4 bg-white text-gray-700 rounded-xl text-xs md:text-sm font-semibold border border-orange-200 hover:bg-orange-50 hover:shadow-md">
                        <BarChart3 size={18} />
                        <span>Analytics</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 p-3 sm:p-4 bg-orange-500 text-white rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 hover:bg-orange-600 hover:shadow-md">
                        <FileText size={18} />
                        <span>Reports</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardOverview;