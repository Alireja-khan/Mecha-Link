// AdminProfile.jsx
"use client";

import React, { useEffect } from "react";
import useUser from "@/hooks/useUser";
import {
    Shield, User, Mail, Phone, MapPin, Calendar, Lock, Settings, Activity, Users, BarChart3, Clock, Building, FileText, AlertCircle, Eye, KeyRound, Database, Server, Network, Zap, Crown, BadgeCheck, Sparkles, Edit3, LogOut, Bell, Search, Filter, Download, Upload, Trash2,
} from "lucide-react";

const AdminProfile = () => {
    // Assuming useUser returns an object with a user or null
    const { user: loggedInUser, loading: userLoading } = useUser();

    if (userLoading) {
        return (
            // Use base-300 for deepest background, text-primary for spinner
            <div className="flex items-center justify-center h-screen w-screen ">
                <span className="loading loading-bars loading-xl text-primary"></span>
            </div>
        );
    }

    if (!loggedInUser) {
        return (
            <div className="flex items-center justify-center h-screen w-screen ">
                <span className="loading loading-bars loading-xl text-primary"></span>
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
        // Card BG: base-100, Border: neutral/40, Added hover transitions
        <div className="bg-base-100 rounded-2xl p-6 border border-neutral/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex items-center justify-between mb-4">
                {/* Icon BG: primary color with opacity */}
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="text-primary" size={24} />
                </div>
                {trend && (
                    // Trend Status: Uses DaisyUI success/error classes
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${trend > 0 ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                )}
            </div>
            {/* Value/Label text: base-content for readability */}
            <p className="text-3xl font-bold text-base-content mb-1">{value}</p>
            <p className="text-base-content/70 text-sm font-medium">{label}</p>
        </div>
    );

    const ActionButton = ({ icon: Icon, label, variant = "primary" }) => (
        <button className={`
            flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold w-full transition-all duration-300 hover:scale-[1.01] text-center
            ${variant === 'primary'
                ? 'bg-primary text-primary-content hover:bg-secondary shadow-lg hover:shadow-xl'
                : 'bg-base-200 text-base-content border border-base-300 hover:border-primary hover:bg-base-300'
            }
        `}>
            <Icon size={20} />
            <span>{label}</span>
        </button>
    );

    return (
        // Main BG: base-200
        <div className="min-h-screen bg-base-200 mx-auto text-base-content">

            <div className="p-4 md:p-6 lg:p-8 mx-auto">
                {/* Hero Section with Large Profile */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                    {/* Large Profile Card - Takes 2/3 width on large screens */}
                    <div className="lg:col-span-2 bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral/40 shadow-xl">
                        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8">

                            {/* Extra Large Profile Image (Avatar) */}
                            <div className="w-56 h-56 md:w-48 md:h-48 lg:w-80 lg:h-80 rounded-2xl border-4 border-base-100 shadow-2xl overflow-hidden bg-gradient-to-br from-primary to-secondary flex-shrink-0">
                                {loggedInUser.profileImage ? (
                                    <img
                                        src={loggedInUser.profileImage}
                                        alt={adminData.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    // Use primary/secondary gradient for the fallback
                                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-content text-4xl md:text-6xl font-bold">
                                        {adminData.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 mb-3 md:mb-4">
                                    <h1 className="text-3xl md:text-4xl font-bold text-base-content">{adminData.name}</h1>
                                    <BadgeCheck className="text-info" size={24} />
                                </div>

                                {/* Role Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-primary/10 rounded-full border border-primary/20 mb-4 md:mb-6">
                                    <Crown className="text-primary" size={18} />
                                    <span className="font-semibold text-base md:text-lg text-primary">{adminData.role}</span>
                                </div>

                                <p className="text-base-content/80 text-base md:text-lg mb-4 md:mb-6 leading-relaxed max-w-full lg:max-w-2xl">
                                    {adminData.bio}
                                </p>

                                {/* Metadata Badges */}
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    {/* All badges use primary/base theme colors */}
                                    <div className="flex items-center gap-2 bg-base-200 px-3 py-1 md:px-4 md:py-2 rounded-xl border border-base-300 text-sm md:text-base **transition-colors duration-200 hover:bg-base-300**">
                                        <Building className="text-primary" size={16} />
                                        <span className="text-base-content font-medium">{adminData.department}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-base-200 px-3 py-1 md:px-4 md:py-2 rounded-xl border border-base-300 text-sm md:text-base **transition-colors duration-200 hover:bg-base-300**">
                                        <User className="text-primary" size={16} />
                                        <span className="text-base-content font-medium">{adminData.jobTitle}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-base-200 px-3 py-1 md:px-4 md:py-2 rounded-xl border border-base-300 text-sm md:text-base **transition-colors duration-200 hover:bg-base-300**">
                                        <Calendar className="text-primary" size={16} />
                                        <span className="text-base-content font-medium">Joined {adminData.joined}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Quick Stats Sidebar (Full width on small, 1/3 on large) */}
                    <div className="space-y-6">
                        {/* Quick Stats Container */}
                        <div className="bg-base-100 rounded-3xl p-6 border border-neutral/40 shadow-lg">
                            <h3 className="text-xl font-semibold text-base-content mb-4">Quick Stats</h3>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-1 space-y-0">
                                {/* Quick Stat Items */}
                                <div className="flex justify-between items-center p-3 bg-base-200 rounded-xl col-span-2 md:col-span-1 lg:col-span-1 **transition-colors duration-200 hover:bg-base-300**">
                                    <span className="text-base-content/70">Online Since</span>
                                    <span className="font-semibold text-primary">4h 12m</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-base-200 rounded-xl col-span-2 md:col-span-1 lg:col-span-1 **transition-colors duration-200 hover:bg-base-300**">
                                    <span className="text-base-content/70">Tasks Today</span>
                                    <span className="font-semibold text-primary">18/24</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-base-200 rounded-xl col-span-2 md:col-span-1 lg:col-span-1 **transition-colors duration-200 hover:bg-base-300**">
                                    <span className="text-base-content/70">System Health</span>
                                    <span className="font-semibold text-success">98%</span>
                                </div>
                            </div>
                        </div>

                        {/* System Permissions */}
                        <div className="bg-base-100 rounded-3xl p-6 border border-neutral/40 shadow-xl">
                            <h2 className="text-xl font-bold text-base-content mb-4">System Permissions</h2>
                            <div className="flex flex-wrap gap-2">
                                {adminData.permissions.map((perm, i) => (
                                    // Permission Tags: Use primary color with opacity
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-primary/10 text-primary text-xs md:text-sm rounded-xl border border-primary/20 font-medium **transition-colors duration-300 hover:bg-primary/20** cursor-pointer"
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
                        <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral/40 shadow-xl">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8">
                                <h2 className="text-2xl font-bold text-base-content mb-4 md:mb-0">Performance Metrics</h2>
                                <div className="flex items-center gap-3">
                                    {/* Secondary Action Buttons */}
                                    <button className="flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 bg-base-200 text-base-content rounded-xl border border-base-300 **transition-colors duration-200 hover:bg-base-300** text-sm">
                                        <Filter size={16} className="text-primary" />
                                        Filter
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 bg-base-200 text-base-content rounded-xl border border-base-300 **transition-colors duration-200 hover:bg-base-300** text-sm">
                                        <Download size={16} className="text-primary" />
                                        Export
                                    </button>
                                </div>
                            </div>

                            {/* Stat Cards Grid - Uses StatCard component already updated */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <StatCard icon={Users} value={adminData.metrics.usersManaged} label="Users Managed" trend={12} />
                                <StatCard icon={Shield} value={adminData.metrics.shopsApproved} label="Shops Approved" trend={8} />
                                <StatCard icon={Activity} value={adminData.metrics.serviceRequestsHandled} label="Requests Handled" trend={-3} />
                                <StatCard icon={FileText} value={adminData.metrics.reportsGenerated} label="Reports Generated" trend={25} />
                            </div>
                        </div>

                        {/* Management Actions */}
                        <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral/40 shadow-xl">
                            <h2 className="text-2xl font-bold text-base-content mb-6 md:mb-8">Management Tools</h2>
                            {/* Uses ActionButton component already updated */}
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
                        <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral/40 shadow-xl">
                            <h2 className="text-2xl font-bold text-base-content mb-6">Contact Information</h2>
                            <div className="space-y-4">
                                {[
                                    { icon: Mail, label: "Email", value: adminData.email },
                                    { icon: Phone, label: "Phone", value: adminData.phone },
                                    { icon: MapPin, label: "Location", value: adminData.location },
                                    { icon: Clock, label: "Last Login", value: adminData.lastLogin },
                                ].map((item, index) => (
                                    // Info List Item BG: base-200, Border: base-300, Added hover transitions
                                    <div key={index} className="flex items-center gap-4 p-4 bg-base-200 rounded-xl border border-base-300 **transition-all duration-300 hover:bg-base-300** group">
                                        {/* Icon Container BG: base-100, Hover BG: base-200/50 */}
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
                        </div>

                        {/* Security Status */}
                        <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral/40 shadow-xl">
                            <h2 className="text-2xl font-bold text-base-content mb-6">Security Status</h2>
                            <div className="space-y-4">
                                {[
                                    { label: "Two-Factor Auth", value: adminData.security.twoFactor, icon: KeyRound },
                                    { label: "Login Alerts", value: adminData.security.loginAlerts, icon: Eye },
                                ].map((item, index) => (
                                    // Security List Item BG: base-200, Border: base-300
                                    <div key={index} className="flex justify-between items-center p-4 bg-base-200 rounded-xl border border-base-300 **transition-colors duration-200 hover:bg-base-300**">
                                        <div className="flex items-center gap-3">
                                            <item.icon className="text-primary" size={20} />
                                            <span className="text-base-content font-medium">{item.label}</span>
                                        </div>
                                        {/* Status Tag: Uses DaisyUI success/error colors */}
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${item.value
                                            ? "bg-success/20 text-success border border-success/30"
                                            : "bg-error/20 text-error border border-error/30"
                                            }`}>
                                            {item.value ? "ACTIVE" : "INACTIVE"}
                                        </span>
                                    </div>
                                ))}
                                {/* Password Change Info */}
                                <div className="p-4 bg-base-200 rounded-xl border border-base-300">
                                    <p className="text-base-content/70 text-sm">Password Last Changed</p>
                                    <p className="text-base-content font-medium text-lg">{adminData.security.passwordLastChanged}</p>
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