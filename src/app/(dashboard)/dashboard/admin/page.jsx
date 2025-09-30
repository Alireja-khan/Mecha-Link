"use client";

import React, { useEffect, useState } from "react";
import { Users, Store, Wrench, UserCheck, DollarSign, Star, Shield, Crown, Calendar, Eye, FileText, Settings, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import useUser from "@/hooks/useUser";

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


    if (userLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen">
                <span className="loading loading-bars loading-xl text-orange-500"></span>
            </div>
        );
    }

    if (!loggedInUser) {
        return (
            <div className="flex items-center justify-center h-screen w-screen">
                <span className="loading loading-bars loading-xl text-orange-500"></span>
            </div>
        );
    }

    console.log(totalShop, totalReviews)

    const { result: requests = [] } = totalData;
    const { result: shops = [] } = totalShop;
    const reviews = totalReviews;
    console.log(reviews);

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

    // Calculate total mechanics
    const calculateTotalMechanics = (shopsArray) => {
        if (!shopsArray || !Array.isArray(shopsArray)) return 0;

        return shopsArray.reduce((total, shop) => {
            const count = shop.shop?.mechanicCount || 0;
            return total + count;
        }, 0);
    };
    const totalMechanics = calculateTotalMechanics(shops);

    // Calculate total mechanics
    const calculateTotalRatings = (reviewsArray) => {
        if (!reviewsArray || !Array.isArray(reviewsArray)) return 0;

        return reviewsArray.reduce((total, review) => {
            const count = review.rating || 0;
            return total + count;
        }, 0);
    };
    const totalRatings = calculateTotalRatings(totalReviews);
    const averageRatings = totalRatings/reviews.length
    console.log(totalRatings, averageRatings);



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

    const StatCard = ({ icon: Icon, value, label, change, trend, color = "orange" }) => (
        <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${color}-500/10 group-hover:bg-${color}-500/20 transition-colors duration-300`}>
                    <Icon className={`text-${color}-600`} size={24} />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {trend === 'up' ? '↑' : '↓'} {change}
                </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-gray-600 text-sm font-medium">{label}</p>
        </div>
    );

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

    return (
        <div className="min-h-screen p-6  space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-2xl">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                        <p className="text-orange-100 text-lg mt-2">
                            Welcome back, <span className="font-semibold text-white">{loggedInUser.name}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
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

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
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

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 bg-white rounded-3xl p-8 border border-orange-100 shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Service Requests Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={serviceTrends}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#6b7220" />
                            <XAxis dataKey="month" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip />
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

                <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Service Type Breakdown</h2>
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
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Service Requests */}
                <div className="bg-white col-span-2 rounded-3xl p-8 border border-orange-100 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Recent Service Requests</h2>
                        <Eye className="text-orange-500" size={20} />
                    </div>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-8">
                                <span className="loading loading-bars loading-md text-orange-500"></span>
                            </div>
                        ) : recentServiceReq.length > 0 ? (
                            recentServiceReq.map((req, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
                                    <div>
                                        <p className="font-semibold text-gray-900">{req.name}</p>
                                        <p className="text-sm text-gray-600">{req.problem}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">{req.date}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">No recent service requests</div>
                        )}
                    </div>
                </div>

                {/* Recent Signups */}
                <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Recent Signups</h2>
                        <UserCheck className="text-orange-500" size={20} />
                    </div>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-8">
                                <span className="loading loading-bars loading-md text-orange-500"></span>
                            </div>
                        ) : recentSignups.length > 0 ? (
                            recentSignups.map((user, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">
                                        {user.name?.charAt(0) || "U"}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">No recent signups</div>
                        )}
                    </div>
                </div>

            </div>
            {/* Recent Shops */}
            <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Recent Shops</h2>
                    <Store className="text-orange-500" size={20} />
                </div>
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-8">
                            <span className="loading loading-bars loading-md text-orange-500"></span>
                        </div>
                    ) : recentShopsData.length > 0 ? (
                        recentShopsData.map((shop, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                                    {shop.name?.charAt(0) || "S"}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900 truncate">{shop.name}</p>
                                    <p className="text-sm text-gray-600 truncate">{shop.serviceType}</p>
                                </div>
                                <span className="text-xs text-gray-500">{shop.date}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">No recent shops</div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="flex items-center gap-3 p-4 bg-orange-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-orange-600">
                        <UserCheck size={20} />
                        <span>User Management</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 bg-white text-gray-700 rounded-xl font-semibold border border-orange-200 hover:bg-orange-50">
                        <Settings size={20} />
                        <span>System Settings</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 bg-white text-gray-700 rounded-xl font-semibold border border-orange-200 hover:bg-orange-50">
                        <BarChart3 size={20} />
                        <span>Analytics</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 bg-orange-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-orange-600">
                        <FileText size={20} />
                        <span>Reports</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardOverview;  