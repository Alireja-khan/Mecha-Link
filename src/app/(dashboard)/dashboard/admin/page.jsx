"use client";

import React, { useEffect, useState } from "react";
import {
    Wrench,
    MapPin,
    Calendar,
    Users,
    FileText,
    Settings,
    BarChart3,
    Shield,
    AlertTriangle,
    TrendingUp,
    UserCheck,
    Car,
    DollarSign,
    Star,
    Building2,
    Bell,
    Activity,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
} from "recharts";
import useUser from "@/hooks/useUser";

const AdminDashboardOverview = () => {

    const { user: loggedInUser, loading: userLoading } = useUser();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalData, setTotalData] = useState({ result: [], totalDocs: 0, totalPage: 0 });
    const [totalShop, setTotalShop] = useState([]);
    const [recentSignups, setRecentSignups] = useState([]);
    const [userData, setUserData] = useState([]);





    // To get all recent 5 users //

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/users/dashboardUser?overview=true");
                const data = await res.json();
                setRecentSignups(data || []);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    console.log(recentSignups);


    // To get all the users

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/users/dashboardUser");
                const data = await res.json();
                setUserData(data || []);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    console.log(userData);


    // To get all the Requests data //

    useEffect(() => {
        setLoading(true);
        fetch(
            `/api/service-request`
        )
            .then((res) => res.json())
            .then((data) => {
                setTotalData(data);
                setLoading(false);
            });
    }, []);

    console.log(totalData, totalShop, loggedInUser);


    // To get all the shop data //

    useEffect(() => {
        setLoading(true);
        fetch(
            `/api/shops`
        )
            .then((res) => res.json())
            .then((data) => {
                setTotalShop(data);
                setLoading(false);
            });
    }, []);


    if (userLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen">
                <span className="loading loading-bars loading-xl text-orange-500"></span>
            </div>
        );
    }

    if (!loggedInUser) {
        // optional redirect logic here
        return (
            <div className="flex items-center justify-center h-screen w-screen">
                <span className="loading loading-bars loading-xl text-orange-500"></span>
            </div>
        );
    }



    // ✅ Admin Profile Info
    const adminProfile = {
        name: "Admin User",
        joined: "January 15, 2020",
        role: "System Administrator",
        location: "Headquarters, Chicago, USA",
        permissions: "Full Access",
    };



    const { result: requests = [], totalDocs, totalPage } = totalData;
    const recentServiceReq = requests
        .slice(-5) // last 5
        .reverse() // newest first
        .map((service) => ({
            name: service.deviceType || service.userEmail,
            problem: service.problemCategory || "Other",
            date: new Date(service.requestedDate || Date.now()).toLocaleDateString(),
        }));


    const { result: shops = [] } = totalShop;
    const recentShops = shops
        .slice(-5) // last 5
        .reverse() // newest first
        .map((s) => ({
            name: s.shop.shopName || s.shop.contact.businessEmail,
            serviceType: s.shop.categories || "Other",
            date: new Date(s.shop.createdAt || Date.now()).toLocaleDateString(),
        }));

    // ✅ KPI Cards
    const platformMetrics = [
        { id: 1, title: "Total Users", value: loading ? "…" : userData.length, change: "+12%", trend: "up", icon: <Users size={20} className="text-blue-500" /> },
        { id: 2, title: "Total Mechanic Shop", value: loading ? "…" : shops.length, change: "+12%", trend: "up", icon: <Users size={20} className="text-blue-500" /> },
        { id: 3, title: "Total Service Requests", value: loading ? "…" : requests.length, change: "+12%", trend: "up", icon: <Users size={20} className="text-blue-500" /> },
        { id: 4, title: "Active Mechanics", value: "156", change: "+5%", trend: "up", icon: <UserCheck size={20} className="text-green-500" /> },
        { id: 5, title: "Revenue", value: "$24,580", change: "+18%", trend: "up", icon: <DollarSign size={20} className="text-purple-500" /> },
        { id: 6, title: "Avg. Rating", value: "4.6 ★", change: "+0.2", trend: "up", icon: <Star size={20} className="text-yellow-500" /> },

    ];

    // ✅ Chart Data
    const serviceTrends = [
        { month: "Jan", requests: 200 },
        { month: "Feb", requests: 240 },
        { month: "Mar", requests: 300 },
        { month: "Apr", requests: 270 },
        { month: "May", requests: 350 },
        { month: "Jun", requests: 400 },
    ];

    const revenueTrends = [
        { month: "Jan", revenue: 1200 },
        { month: "Feb", revenue: 1500 },
        { month: "Mar", revenue: 1800 },
        { month: "Apr", revenue: 1600 },
        { month: "May", revenue: 2200 },
        { month: "Jun", revenue: 2500 },
    ];

    const serviceTypeCount = (totalData.result || []).reduce((acc, curr) => {
        const type = curr.deviceType || "Other";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    // Convert to recharts format
    const serviceTypeBreakdown = Object.entries(serviceTypeCount).map(([name, value]) => ({
        name,
        value,
    }));

    const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4", "#9333EA", "#3B82F6"];


    // ✅ Table Data
    const topMechanics = [
        { name: "John Smith", jobs: 48, rating: 4.9, earnings: "$2,800" },
        { name: "Maria Garcia", jobs: 45, rating: 4.8, earnings: "$2,500" },
        { name: "Rahul Sharma", jobs: 41, rating: 4.7, earnings: "$2,300" },
    ];

    const feedbacks = [
        { user: "David Miller", feedback: "Great service, quick response!", rating: 5 },
        { user: "Sophia Lee", feedback: "Mechanic arrived late.", rating: 3 },
        { user: "Liam Brown", feedback: "Fair pricing and good quality.", rating: 4 },
    ];



    const financialSummary = [
        { label: "Total Revenue", value: "$24,580" },
        { label: "Pending Payments", value: "$1,240" },
        { label: "Completed Payments", value: "$22,300" },
        { label: "Refunds Issued", value: "$1,040" },
    ];

    const systemHealth = [
        { component: "API Server", status: "operational", latency: "45ms" },
        { component: "Database", status: "operational", latency: "12ms" },
        { component: "Payment Gateway", status: "degraded", latency: "280ms" },
        { component: "File Storage", status: "operational", latency: "65ms" },
    ];

    // ✅ Status Badge Helper
    const getStatusBadge = (status) => {
        let base = "text-xs font-medium px-2.5 py-0.5 rounded-full";
        switch (status) {
            case "operational":
                return <span className={`${base} bg-green-100 text-green-800`}>Operational</span>;
            case "degraded":
                return <span className={`${base} bg-yellow-100 text-yellow-800`}>Degraded</span>;
            default:
                return <span className={`${base} bg-red-100 text-red-800`}>Down</span>;
        }
    };

    return (
        <div className="p-8 space-y-10 min-h-screen bg-gray-50">

            {/* 🧭 Admin Banner */}
            <div className="bg-primary rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                    <Shield size={32} />
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                </div>
                <p className="text-lg"><span className="opacity-90">Welcome back,</span> <span className="font-semibold">{loggedInUser.name}!</span> <span className="opacity-90">Here’s an overview of MechaLink.</span></p>
            </div>

            {/* 📊 KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {platformMetrics.map((metric) => (
                    <div key={metric.id} className="bg-white rounded-xl p-5 shadow border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">{metric.title}</p>
                                <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                                <span className={`text-sm ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                                    {metric.change} vs last month
                                </span>
                            </div>
                            <div className="p-2 bg-gray-50 rounded-lg">{metric.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 📈 Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Service Trend */}
                <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                    <h2 className="font-bold text-gray-800 mb-4">Service Requests Trend</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={serviceTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="requests" stroke="#2563eb" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue Trend */}
                <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                    <h2 className="font-bold text-gray-800 mb-4">Revenue Overview</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={revenueTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#9333ea" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Service Type Pie */}
                <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                    <h2 className="font-bold text-gray-800 mb-4">Service Type Breakdown</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={serviceTypeBreakdown}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={70}
                                labelLine={false}
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) / 2;
                                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                                    return (
                                        <text
                                            x={x}
                                            y={y}
                                            fill="white"
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                            fontSize={12}
                                            fontWeight="bold"
                                        >
                                            {(percent * 100).toFixed(0)}%
                                        </text>
                                    );
                                }}
                            >
                                {serviceTypeBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>

                            <Legend />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>

                </div>
            </div>

            {/* 📋 Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* recentServiceReq */}
                <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                    <h2 className="font-bold text-gray-800 mb-4">Recent Service Requests</h2>
                    {loading ? (
                        <p className="text-gray-500">Loading users...</p>
                    ) : (
                        <ul className="space-y-3">
                            {recentServiceReq.length > 0 ? (
                                recentServiceReq.map((u, i) => (
                                    <li key={i} className="grid grid-cols-3 p-3 bg-gray-50 rounded-lg">
                                        <span className="font-medium">{u.name}</span>
                                        <span className="text-sm text-gray-600">{u.problem}</span>
                                        <span className="text-xs text-gray-500">{u.date}</span>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">No recent signups</p>
                            )}
                        </ul>
                    )}
                </div>

                {/* Feedbacks */}
                <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                    <h2 className="font-bold text-gray-800 mb-4">Recent Feedback</h2>
                    {feedbacks.map((f, i) => (
                        <div key={i} className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="font-semibold">{f.user}</p>
                            <p className="text-sm text-gray-600">{f.feedback}</p>
                            <p className="text-yellow-500 mt-1">{"★".repeat(f.rating)}</p>
                        </div>
                    ))}
                </div>

                {/* Signups */}
                <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                    <h2 className="font-bold text-gray-800 mb-4">Recent Signups</h2>
                    {loading ? (
                        <p className="text-gray-500">Loading users...</p>
                    ) : (
                        <ul className="space-y-3">
                            {recentSignups.length > 0 ? (
                                recentSignups.map((u, i) => (
                                    <li key={i} className="grid grid-cols-3 p-3 bg-gray-50 rounded-lg">
                                        <span className="font-medium">{u.name}</span>
                                        <span className="text-sm text-gray-600">{u.role}</span>
                                        <span className="text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</span>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">No recent signups</p>
                            )}
                        </ul>
                    )}
                </div>

            </div>
            {/* Recent Shops */}
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                <h2 className="font-bold text-gray-800 mb-4">Recent Shops</h2>
                {loading ? (
                    <p className="text-gray-500">Loading users...</p>
                ) : (
                    <ul className="space-y-3">
                        {recentShops.length > 0 ? (
                            recentShops.map((s, i) => (
                                <li key={i} className="grid grid-cols-3 p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">{s.name}</span>
                                    <span className="text-sm text-gray-600">{s.serviceType}</span>
                                    <span className="text-xs text-gray-500">{s.date}</span>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500">No recent signups</p>
                        )}
                    </ul>
                )}
            </div>

            {/* 💰 Financial Summary + System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Financial Summary */}
                <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                    <h2 className="font-bold text-gray-800 mb-4">Financial Summary</h2>
                    <ul className="space-y-3">
                        {financialSummary.map((f, i) => (
                            <li key={i} className="flex justify-between bg-gray-50 p-3 rounded-lg">
                                <span>{f.label}</span>
                                <span className="font-semibold">{f.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* System Health */}
                <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                    <h2 className="font-bold text-gray-800 mb-4">System Health</h2>
                    <div className="space-y-3">
                        {systemHealth.map((s, i) => (
                            <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <div>
                                    <p className="font-medium">{s.component}</p>
                                    <p className="text-sm text-gray-600">Latency: {s.latency}</p>
                                </div>
                                {getStatusBadge(s.status)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ⚙️ Quick Actions */}
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                <h2 className="font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 bg-blue-50 rounded-xl text-blue-700 font-medium hover:bg-blue-100 transition flex items-center gap-2">
                        <UserCheck size={20} /> User Management
                    </button>
                    <button className="p-4 bg-green-50 rounded-xl text-green-700 font-medium hover:bg-green-100 transition flex items-center gap-2">
                        <Settings size={20} /> System Settings
                    </button>
                    <button className="p-4 bg-purple-50 rounded-xl text-purple-700 font-medium hover:bg-purple-100 transition flex items-center gap-2">
                        <BarChart3 size={20} /> Analytics
                    </button>
                    <button className="p-4 bg-orange-50 rounded-xl text-orange-700 font-medium hover:bg-orange-100 transition flex items-center gap-2">
                        <FileText size={20} /> Reports
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardOverview;
