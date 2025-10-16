"use client";

import React, { useEffect } from "react";
import useUser from "@/hooks/useUser";
import {
    User, Mail, Phone, MapPin, Calendar, Shield, Car, Wrench, Star, Clock, 
    Settings, FileText, MessageSquare, Bell, Edit3, LogOut, BadgeCheck, 
    Sparkles, Award, CreditCard, Heart, History, ShieldCheck
} from "lucide-react";

const UserProfile = () => {
    const { user: loggedInUser, loading: userLoading } = useUser();

    if (userLoading) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <span className="loading loading-bars loading-xl text-primary"></span>
            </div>
        );
    }

    if (!loggedInUser) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <span className="loading loading-bars loading-xl text-primary"></span>
            </div>
        );
    }

    // Dynamic user data from logged-in user
    const userData = {
        name: loggedInUser.name || "User",
        role: "Verified Customer",
        email: loggedInUser.email,
        phone: loggedInUser.phone || "Not provided",
        location: loggedInUser.location || "Not specified",
        bio: loggedInUser.bio || "Automotive service enthusiast looking for reliable car maintenance solutions",
        membership: "Premium Member",
        joined: new Date(loggedInUser.createdAt || Date.now()).toLocaleDateString(),
        lastLogin: loggedInUser.lastLoggedIn
            ? new Date(loggedInUser.lastLoggedIn).toLocaleString()
            : "N/A",
        status: "Active",
        preferences: ["Car Maintenance", "Quick Service", "Quality Work", "Fair Pricing", "Emergency Support", "Mobile Service"],
        metrics: {
            totalServices: 24,
            completedServices: 18,
            pendingServices: 2,
            totalSpent: 2450,
            favoriteShop: "AutoCare Pro",
            averageRating: 4.8,
        },
        security: {
            twoFactor: true,
            passwordLastChanged: new Date().toLocaleDateString(),
            loginAlerts: true,
        },
    };

    const StatCard = ({ icon: Icon, value, label, trend }) => (
        <div className="bg-base-100 rounded-2xl p-6 border border-neutral/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="text-primary" size={24} />
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
                                        alt={userData.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-content text-4xl md:text-6xl font-bold">
                                        {userData.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 mb-3 md:mb-4">
                                    <h1 className="text-3xl md:text-4xl font-bold text-base-content">{userData.name}</h1>
                                    <BadgeCheck className="text-info" size={24} />
                                </div>

                                {/* Role Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-primary/10 rounded-full border border-primary/20 mb-4 md:mb-6">
                                    <ShieldCheck className="text-primary" size={18} />
                                    <span className="font-semibold text-base md:text-lg text-primary">{userData.role}</span>
                                </div>

                                <p className="text-base-content/80 text-base md:text-lg mb-4 md:mb-6 leading-relaxed max-w-full lg:max-w-2xl">
                                    {userData.bio}
                                </p>

                                {/* Metadata Badges */}
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    <div className="flex items-center gap-2 bg-base-200 px-3 py-1 md:px-4 md:py-2 rounded-xl border border-base-300 text-sm md:text-base transition-colors duration-200 hover:bg-base-300">
                                        <Award className="text-primary" size={16} />
                                        <span className="text-base-content font-medium">{userData.membership}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-base-200 px-3 py-1 md:px-4 md:py-2 rounded-xl border border-base-300 text-sm md:text-base transition-colors duration-200 hover:bg-base-300">
                                        <Car className="text-primary" size={16} />
                                        <span className="text-base-content font-medium">{userData.metrics.favoriteShop}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-base-200 px-3 py-1 md:px-4 md:py-2 rounded-xl border border-base-300 text-sm md:text-base transition-colors duration-200 hover:bg-base-300">
                                        <Calendar className="text-primary" size={16} />
                                        <span className="text-base-content font-medium">Joined {userData.joined}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats Container */}
                        <div className="bg-base-100 rounded-3xl p-6 border border-neutral/40 shadow-lg">
                            <h3 className="text-xl font-semibold text-base-content mb-4">Service Summary</h3>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-1 space-y-0">
                                <div className="flex justify-between items-center p-3 bg-base-200 rounded-xl col-span-2 md:col-span-1 lg:col-span-1 transition-colors duration-200 hover:bg-base-300">
                                    <span className="text-base-content/70">Active Requests</span>
                                    <span className="font-semibold text-primary">{userData.metrics.pendingServices}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-base-200 rounded-xl col-span-2 md:col-span-1 lg:col-span-1 transition-colors duration-200 hover:bg-base-300">
                                    <span className="text-base-content/70">Completed</span>
                                    <span className="font-semibold text-primary">{userData.metrics.completedServices}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-base-200 rounded-xl col-span-2 md:col-span-1 lg:col-span-1 transition-colors duration-200 hover:bg-base-300">
                                    <span className="text-base-content/70">Avg. Rating</span>
                                    <span className="font-semibold text-success">{userData.metrics.averageRating}</span>
                                </div>
                            </div>
                        </div>

                        {/* Service Preferences */}
                        <div className="bg-base-100 rounded-3xl p-6 border border-neutral/40 shadow-xl">
                            <h2 className="text-xl font-bold text-base-content mb-4">Service Preferences</h2>
                            <div className="flex flex-wrap gap-2">
                                {userData.preferences.map((pref, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-primary/10 text-primary text-xs md:text-sm rounded-xl border border-primary/20 font-medium transition-colors duration-300 hover:bg-primary/20 cursor-pointer"
                                    >
                                        {pref}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - Metrics & Actions */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Service Metrics */}
                        <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral/40 shadow-xl">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8">
                                <h2 className="text-2xl font-bold text-base-content mb-4 md:mb-0">Service Metrics</h2>
                                <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 bg-base-200 text-base-content rounded-xl border border-base-300 transition-colors duration-200 hover:bg-base-300 text-sm">
                                        <History size={16} className="text-primary" />
                                        History
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 bg-base-200 text-base-content rounded-xl border border-base-300 transition-colors duration-200 hover:bg-base-300 text-sm">
                                        <FileText size={16} className="text-primary" />
                                        Reports
                                    </button>
                                </div>
                            </div>

                            {/* Stat Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <StatCard icon={Wrench} value={userData.metrics.totalServices} label="Total Services" trend={12} />
                                <StatCard icon={Award} value={userData.metrics.completedServices} label="Completed Services" trend={8} />
                                <StatCard icon={Clock} value={userData.metrics.pendingServices} label="Pending Services" trend={-2} />
                                <StatCard icon={CreditCard} value={`$${userData.metrics.totalSpent}`} label="Total Spent" trend={15} />
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral/40 shadow-xl">
                            <h2 className="text-2xl font-bold text-base-content mb-6 md:mb-8">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ActionButton icon={Car} label="Book New Service" variant="primary" />
                                <ActionButton icon={History} label="Service History" variant="secondary" />
                                <ActionButton icon={Heart} label="Favorite Shops" variant="secondary" />
                                <ActionButton icon={CreditCard} label="Payment Methods" variant="primary" />
                                <ActionButton icon={MessageSquare} label="Support Center" variant="secondary" />
                                <ActionButton icon={Bell} label="Notifications" variant="primary" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Info Panels */}
                    <div className="space-y-8">

                        {/* Contact Information */}
                        <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral/40 shadow-xl">
                            <h2 className="text-2xl font-bold text-base-content mb-6">Contact Information</h2>
                            <div className="space-y-4">
                                {[
                                    { icon: Mail, label: "Email", value: userData.email },
                                    { icon: Phone, label: "Phone", value: userData.phone },
                                    { icon: MapPin, label: "Location", value: userData.location },
                                    { icon: Clock, label: "Last Login", value: userData.lastLogin },
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
                        </div>

                        {/* Security Status */}
                        <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral/40 shadow-xl">
                            <h2 className="text-2xl font-bold text-base-content mb-6">Security Status</h2>
                            <div className="space-y-4">
                                {[
                                    { label: "Two-Factor Auth", value: userData.security.twoFactor, icon: Shield },
                                    { label: "Login Alerts", value: userData.security.loginAlerts, icon: Bell },
                                ].map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-4 bg-base-200 rounded-xl border border-base-300 transition-colors duration-200 hover:bg-base-300">
                                        <div className="flex items-center gap-3">
                                            <item.icon className="text-primary" size={20} />
                                            <span className="text-base-content font-medium">{item.label}</span>
                                        </div>
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
                                    <p className="text-base-content font-medium text-lg">{userData.security.passwordLastChanged}</p>
                                </div>
                            </div>
                        </div>

                        {/* Account Actions */}
                        <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral/40 shadow-xl">
                            <h2 className="text-2xl font-bold text-base-content mb-6">Account Actions</h2>
                            <div className="space-y-3">
                                <button className="flex items-center gap-3 w-full p-4 bg-base-200 rounded-xl border border-base-300 transition-all duration-300 hover:bg-base-300 hover:border-primary group">
                                    <Edit3 className="text-primary" size={20} />
                                    <span className="font-medium text-base-content">Edit Profile</span>
                                </button>
                                <button className="flex items-center gap-3 w-full p-4 bg-base-200 rounded-xl border border-base-300 transition-all duration-300 hover:bg-base-300 hover:border-primary group">
                                    <Settings className="text-primary" size={20} />
                                    <span className="font-medium text-base-content">Account Settings</span>
                                </button>
                                <button className="flex items-center gap-3 w-full p-4 bg-base-200 rounded-xl border border-base-300 transition-all duration-300 hover:bg-base-300 hover:border-primary group">
                                    <Shield className="text-primary" size={20} />
                                    <span className="font-medium text-base-content">Privacy & Security</span>
                                </button>
                                <button className="flex items-center gap-3 w-full p-4 bg-error/10 rounded-xl border border-error/20 transition-all duration-300 hover:bg-error/20 hover:border-error/30 group">
                                    <LogOut className="text-error" size={20} />
                                    <span className="font-medium text-error">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;