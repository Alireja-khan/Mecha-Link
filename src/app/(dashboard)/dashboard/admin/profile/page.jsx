"use client";

import React, { useEffect } from "react";
import useUser from "@/hooks/useUser";
import {
    Shield, User, Mail, Phone, MapPin, Calendar, Lock, Settings, Activity, Users, BarChart3, Clock, Building, FileText, AlertCircle, Eye, KeyRound, Database, Server, Network, Zap, Crown, BadgeCheck, Sparkles, Edit3, LogOut, Bell, Search, Filter, Download, Upload, Trash2,
} from "lucide-react";

const AdminProfile = () => {
    // Assuming useUser returns an object with a user or null
    const { user: loggedInUser, loading: userLoading } = useUser();

    console.log(loggedInUser);

    if (userLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen">
                <span className="loading loading-bars loading-xl text-orange-500"></span>
            </div>
        );
    }

    if (!loggedInUser) {
        // optional redirect logic here - a proper redirect would be better than a loading spinner
        return (
            <div className="flex items-center justify-center h-screen w-screen text-gray-700 text-xl">
                <p>Authentication failed or user not logged in.</p>
            </div>
        );
    }

    // Dynamic admin data from logged-in user
    const adminData = {
        name: loggedInUser.name || loggedInUser.email,
        role: "System Administrator",
        email: loggedInUser.email,
        phone: loggedInUser.phone || "Not provided",
        location: loggedInUser.location || "Headquarters",
        bio: loggedInUser.bio || "System administrator managing platform operations",
        department: loggedInUser.department || "Engineering",
        jobTitle: loggedInUser.jobTitle || "Admin",
        joined: new Date(loggedInUser.createdAt || Date.now()).toLocaleDateString(),
        lastLogin: loggedInUser.lastLoggedIn
            ? new Date(loggedInUser.lastLoggedIn).toLocaleString()
            : "N/A",
        status: "Active",
        permissions: ["User Management", "System Settings", "Analytics", "Content Moderation", "Database Access", "Security"],
        metrics: {
            usersManaged: 1247,
            shopsApproved: 356,
            serviceRequestsHandled: 892,
            reportsGenerated: 45,
        },
        security: {
            twoFactor: true,
            passwordLastChanged: new Date().toLocaleDateString(),
            loginAlerts: true,
        },
    };

    const StatCard = ({ icon: Icon, value, label, trend }) => (
        <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors duration-300">
                    <Icon className="text-orange-600" size={24} />
                </div>
                {trend && (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-gray-600 text-sm font-medium">{label}</p>
        </div>
    );

    const ActionButton = ({ icon: Icon, label, variant = "primary" }) => (
        <button className={`
            flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold w-full transition-all duration-300 hover:scale-[1.01] text-center
            ${variant === 'primary'
                ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl'
                : 'bg-white text-gray-700 border border-orange-200 hover:border-orange-300 hover:bg-orange-50'
            }
        `}>
            <Icon size={20} />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 mx-auto">

            <div className="p-4 md:p-6 lg:p-8 mx-auto">
                {/* Hero Section with Large Profile */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                    {/* Large Profile Card - Takes 2/3 width on large screens */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-orange-100 shadow-xl">
                        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8">

                            {/* Extra Large Profile Image (Responsive Sizing) */}
                            <div className="w-56 h-56 md:w-48 md:h-48 lg:w-80 lg:h-80 rounded-2xl border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 flex-shrink-0">
                                {loggedInUser.profileImage ? (
                                    <img
                                        src={loggedInUser.profileImage}
                                        alt={adminData.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl md:text-6xl font-bold">
                                        {adminData.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 mb-3 md:mb-4">
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{adminData.name}</h1>
                                    <BadgeCheck className="text-blue-500" size={24} />
                                </div>

                                <div className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-orange-100 rounded-full border border-orange-200 mb-4 md:mb-6">
                                    <Crown className="text-orange-500" size={18} />
                                    <span className="font-semibold text-base md:text-lg">{adminData.role}</span>
                                </div>

                                <p className="text-gray-600 text-base md:text-lg mb-4 md:mb-6 leading-relaxed max-w-full lg:max-w-2xl">
                                    {adminData.bio}
                                </p>

                                {/* Metadata Badges */}
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 md:px-4 md:py-2 rounded-xl border border-orange-200 text-sm md:text-base">
                                        <Building className="text-orange-500" size={16} />
                                        <span className="text-orange-700 font-medium">{adminData.department}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 md:px-4 md:py-2 rounded-xl border border-orange-200 text-sm md:text-base">
                                        <User className="text-orange-500" size={16} />
                                        <span className="text-orange-700 font-medium">{adminData.jobTitle}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 md:px-4 md:py-2 rounded-xl border border-orange-200 text-sm md:text-base">
                                        <Calendar className="text-orange-500" size={16} />
                                        <span className="text-orange-700 font-medium">Joined {adminData.joined}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Quick Stats Sidebar (Full width on small, 1/3 on large) */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-1 space-y-0">
                                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl col-span-2 md:col-span-1 lg:col-span-1">
                                    <span className="text-gray-600">Online Since</span>
                                    <span className="font-semibold text-orange-600">4h 12m</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl col-span-2 md:col-span-1 lg:col-span-1">
                                    <span className="text-gray-600">Tasks Today</span>
                                    <span className="font-semibold text-orange-600">18/24</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl col-span-2 md:col-span-1 lg:col-span-1">
                                    <span className="text-gray-600">System Health</span>
                                    <span className="font-semibold text-green-600">98%</span>
                                </div>
                            </div>
                        </div>

                        {/* System Permissions */}
                        <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-xl">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">System Permissions</h2>
                            <div className="flex flex-wrap gap-2">
                                {adminData.permissions.map((perm, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-orange-500/10 text-orange-700 text-xs md:text-sm rounded-xl border border-orange-500/20 font-medium hover:bg-orange-500/20 transition-colors duration-300 cursor-pointer"
                                    >
                                        {perm}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid (Responsive Grid) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - Metrics & Actions (2/3 width on large) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Performance Metrics */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-orange-100 shadow-xl">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Performance Metrics</h2>
                                <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 bg-orange-50 text-orange-700 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200 text-sm">
                                        <Filter size={16} />
                                        Filter
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 bg-orange-50 text-orange-700 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200 text-sm">
                                        <Download size={16} />
                                        Export
                                    </button>
                                </div>
                            </div>

                            {/* Stat Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <StatCard icon={Users} value={adminData.metrics.usersManaged} label="Users Managed" trend={12} />
                                <StatCard icon={Shield} value={adminData.metrics.shopsApproved} label="Shops Approved" trend={8} />
                                <StatCard icon={Activity} value={adminData.metrics.serviceRequestsHandled} label="Requests Handled" trend={-3} />
                                <StatCard icon={FileText} value={adminData.metrics.reportsGenerated} label="Reports Generated" trend={25} />
                            </div>
                        </div>

                        {/* Management Actions */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-orange-100 shadow-xl">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 md:mb-8">Management Tools</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ActionButton icon={User} label="User Management" variant="primary" />
                                <ActionButton icon={Shield} label="Security Center" variant="secondary" />
                                <ActionButton icon={BarChart3} label="Analytics Dashboard" variant="secondary" />
                                <ActionButton icon={Settings} label="System Settings" variant="primary" />
                                <ActionButton icon={Database} label="Database Admin" variant="secondary" />
                                <ActionButton icon={FileText} label="Report Center" variant="primary" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Info Panels (1/3 width on large) */}
                    <div className="space-y-8">

                        {/* Contact Information */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-orange-100 shadow-xl">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                            <div className="space-y-4">
                                {[
                                    { icon: Mail, label: "Email", value: adminData.email },
                                    { icon: Phone, label: "Phone", value: adminData.phone },
                                    { icon: MapPin, label: "Location", value: adminData.location },
                                    { icon: Clock, label: "Last Login", value: adminData.lastLogin },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200 hover:border-orange-300 transition-all duration-300 group">
                                        <div className="p-3 rounded-lg bg-white group-hover:bg-orange-100 transition-colors duration-300 shadow-sm">
                                            <item.icon className="text-orange-500" size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-600 text-sm">{item.label}</p>
                                            <p className="text-gray-900 font-medium break-all">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Security Status */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-orange-100 shadow-xl">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Status</h2>
                            <div className="space-y-4">
                                {[
                                    { label: "Two-Factor Auth", value: adminData.security.twoFactor, icon: KeyRound },
                                    { label: "Login Alerts", value: adminData.security.loginAlerts, icon: Eye },
                                ].map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                                        <div className="flex items-center gap-3">
                                            <item.icon className="text-orange-500" size={20} />
                                            <span className="text-gray-700 font-medium">{item.label}</span>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${item.value
                                            ? "bg-green-100 text-green-600 border border-green-200"
                                            : "bg-red-100 text-red-600 border border-red-200"
                                            }`}>
                                            {item.value ? "ACTIVE" : "INACTIVE"}
                                        </span>
                                    </div>
                                ))}
                                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                                    <p className="text-gray-600 text-sm">Password Last Changed</p>
                                    <p className="text-gray-900 font-medium text-lg">{adminData.security.passwordLastChanged}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;