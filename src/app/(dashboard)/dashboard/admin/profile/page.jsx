"use client";

import React from "react";
import useUser from "@/hooks/useUser";
import {
    Shield,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Key,
    Lock,
    Settings,
    Activity,
    Users,
    BarChart3,
    Clock,
} from "lucide-react";

const AdminProfile = () => {
    const { user: loggedInUser, loading: userLoading } = useUser();

    if (userLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen">
                <span className="loading loading-bars loading-xl text-orange-500"></span>
            </div>
        );
    }

    if (!loggedInUser || loggedInUser.role !== "admin") {
        return (
            <div className="flex items-center justify-center h-screen w-screen text-gray-600">
                <p>Access denied. Admins only.</p>
            </div>
        );
    }

    // Dynamic admin data from logged-in user
    const adminData = {
        name: loggedInUser.name || loggedInUser.email,
        role: "System Administrator",
        email: loggedInUser.email,
        phone: loggedInUser.phone || "N/A",
        location: loggedInUser.location || "Headquarters",
        joined: new Date(loggedInUser.createdAt || Date.now()).toLocaleDateString(),
        lastLogin: loggedInUser.lastLogin
            ? new Date(loggedInUser.lastLogin).toLocaleString()
            : "N/A",
        status: loggedInUser.isActive ? "Active" : "Inactive",
        permissions: loggedInUser.permissions || ["User Management", "System Settings", "Analytics"],
        metrics: {
            usersManaged: loggedInUser.metrics?.usersManaged || 0,
            shopsApproved: loggedInUser.metrics?.shopsApproved || 0,
            serviceRequestsHandled: loggedInUser.metrics?.serviceRequestsHandled || 0,
            reportsGenerated: loggedInUser.metrics?.reportsGenerated || 0,
        },
        security: {
            twoFactor: loggedInUser.security?.twoFactor || false,
            passwordLastChanged: loggedInUser.security?.passwordLastChanged
                ? new Date(loggedInUser.security.passwordLastChanged).toLocaleDateString()
                : "N/A",
            loginAlerts: loggedInUser.security?.loginAlerts || false,
        },
    };

    const getStatusBadge = (status) => {
        const base = "px-3 py-1 text-xs font-semibold rounded-full";
        return status === "Active" ? (
            <span className={`${base} bg-green-100 text-green-800`}>{status}</span>
        ) : (
            <span className={`${base} bg-red-100 text-red-800`}>{status}</span>
        );
    };

    return (
        <div className="p-8 space-y-8 min-h-screen bg-gray-50">


            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-28 h-40 my-1 ml-1 rounded-md overflow-hidden shadow-lg">
                {loggedInUser.profileImage ? (
                    <img
                        src={loggedInUser.profileImage}
                        alt={adminData.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                        {adminData.name.charAt(0)}
                    </div>
                )}
            </div>
                <div className="flex-1 space-y-2 p-8">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        {adminData.name} {getStatusBadge(adminData.status)}
                    </h1>
                    <p className="text-gray-600">{adminData.role}</p>
                    <p className="text-sm text-gray-500">Joined {adminData.joined}</p>
                </div>
            </div>

            {/* Personal Info & Permissions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
                    <h2 className="font-bold text-gray-800 mb-4">Personal Information</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-center gap-3">
                            <Mail size={18} /> {adminData.email}
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone size={18} /> {adminData.phone}
                        </li>
                        <li className="flex items-center gap-3">
                            <MapPin size={18} /> {adminData.location}
                        </li>
                        <li className="flex items-center gap-3">
                            <Calendar size={18} /> Joined {adminData.joined}
                        </li>
                        <li className="flex items-center gap-3">
                            <Clock size={18} /> Last Login: {adminData.lastLogin}
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
                    <h2 className="font-bold text-gray-800 mb-4">System Permissions</h2>
                    <div className="flex flex-wrap gap-2">
                        {adminData.permissions.map((perm, i) => (
                            <span
                                key={i}
                                className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-100"
                            >
                                {perm}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
                <h2 className="font-bold text-gray-800 mb-6">Performance Metrics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                        <Users className="mx-auto text-blue-600 mb-2" size={24} />
                        <p className="text-2xl font-bold">{adminData.metrics.usersManaged}</p>
                        <p className="text-sm text-gray-600">Users Managed</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                        <Shield className="mx-auto text-green-600 mb-2" size={24} />
                        <p className="text-2xl font-bold">{adminData.metrics.shopsApproved}</p>
                        <p className="text-sm text-gray-600">Shops Approved</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                        <Activity className="mx-auto text-purple-600 mb-2" size={24} />
                        <p className="text-2xl font-bold">{adminData.metrics.serviceRequestsHandled}</p>
                        <p className="text-sm text-gray-600">Requests Handled</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                        <BarChart3 className="mx-auto text-orange-600 mb-2" size={24} />
                        <p className="text-2xl font-bold">{adminData.metrics.reportsGenerated}</p>
                        <p className="text-sm text-gray-600">Reports Generated</p>
                    </div>
                </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
                <h2 className="font-bold text-gray-800 mb-4">Security & Settings</h2>
                <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center gap-3">
                        <Lock size={18} /> Two-Factor Authentication:{" "}
                        <span className="font-semibold">{adminData.security.twoFactor ? "Enabled" : "Disabled"}</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <Key size={18} /> Password Last Changed: {adminData.security.passwordLastChanged}
                    </li>
                    <li className="flex items-center gap-3">
                        <Activity size={18} /> Login Alerts: {adminData.security.loginAlerts ? "On" : "Off"}
                    </li>
                </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
                <h2 className="font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 bg-blue-50 rounded-xl text-blue-700 font-medium hover:bg-blue-100 transition flex items-center gap-2">
                        <Settings size={20} /> Edit Profile
                    </button>
                    <button className="p-4 bg-green-50 rounded-xl text-green-700 font-medium hover:bg-green-100 transition flex items-center gap-2">
                        <Shield size={20} /> Manage Roles
                    </button>
                    <button className="p-4 bg-purple-50 rounded-xl text-purple-700 font-medium hover:bg-purple-100 transition flex items-center gap-2">
                        <Lock size={20} /> Security Settings
                    </button>
                    <button className="p-4 bg-orange-50 rounded-xl text-orange-700 font-medium hover:bg-orange-100 transition flex items-center gap-2">
                        <BarChart3 size={20} /> View Reports
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
