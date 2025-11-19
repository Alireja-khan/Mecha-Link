"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import {
    Mail, Phone, MapPin, Calendar, Wrench, Star, Clock,
    BadgeCheck, Award, ShieldCheck
} from "lucide-react";

const UserProfile = () => {
    const { user: loggedInUser, loading: userLoading } = useUser();
    const [summeryData, setSummeryData] = useState({})

    useEffect(() => {
        fetch(`/api/users/summery?email=${loggedInUser?.email}`)
            .then(res => res.json())
            .then(data => {
                setSummeryData(data)
            })
    }, [loggedInUser])
    if (userLoading) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <span className="loading loading-bars loading-xl text-primary"></span>
            </div>
        );
    }

    console.log(loggedInUser)
    if (!loggedInUser) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <span className="loading loading-bars loading-xl text-primary"></span>
            </div>
        );
    }

    const preferences = ["Car Maintenance", "Quick Service", "Quality Work", "Fair Pricing", "Emergency Support", "Mobile Service"];


    const StatCard = ({ icon: Icon, value, label }) => (
        <div className="bg-base-100 rounded-2xl p-6 border border-neutral/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="text-primary" size={24} />
                </div>
            </div>
            <p className="text-3xl font-bold text-base-content mb-1">{value}</p>
            <p className="text-base-content/70 text-sm font-medium">{label}</p>
        </div>
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
                                        src={loggedInUser?.profileImage}
                                        alt={loggedInUser?.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-content text-4xl md:text-6xl font-bold">
                                        {loggedInUser?.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 mb-3 md:mb-4">
                                    <h1 className="text-3xl md:text-4xl font-bold text-base-content">{loggedInUser?.name}</h1>
                                    <BadgeCheck className="text-info" size={24} />
                                </div>

                                {/* Role Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-primary/10 rounded-full border border-primary/20 mb-4 md:mb-6">
                                    <ShieldCheck className="text-primary" size={18} />
                                    <span className="font-semibold text-base md:text-lg text-primary">{loggedInUser?.role}</span>
                                </div>

                                <p className="text-base-content/80 text-base md:text-lg mb-4 md:mb-6 leading-relaxed max-w-full lg:max-w-2xl">
                                    {loggedInUser?.bio || "You didn't add any bio here. You can update your bio from setting page"}
                                </p>

                                {/* Metadata Badges */}
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    <div className="flex items-center gap-2 bg-base-200 px-3 py-1 md:px-4 md:py-2 rounded-xl border border-base-300 text-sm md:text-base transition-colors duration-200 hover:bg-base-300">
                                        <Award className="text-primary" size={16} />
                                        <span className="text-base-content font-medium">{loggedInUser?.membership || "Premium User"}</span>
                                    </div>

                                    <div className="flex items-center gap-2 bg-base-200 px-3 py-1 md:px-4 md:py-2 rounded-xl border border-base-300 text-sm md:text-base transition-colors duration-200 hover:bg-base-300">
                                        <Calendar className="text-primary" size={16} />
                                        <span className="text-base-content font-medium">
                                            Joined {new Date(loggedInUser?.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats Container */}
                        <div className="bg-base-100 rounded-3xl p-6 border border-neutral/40 shadow-lg">
                            <h3 className="text-xl font-semibold text-base-content mb-4">Basic Info</h3>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-1 space-y-0">
                                <div className="flex justify-between items-center p-3 bg-base-200 rounded-xl col-span-2 md:col-span-1 lg:col-span-1 transition-colors duration-200 hover:bg-base-300">
                                    <span className="text-base-content/70 font-semibold">Role:</span>
                                    <span className="font-semibold text-primary">{loggedInUser?.role}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-base-200 rounded-xl col-span-2 md:col-span-1 lg:col-span-1 transition-colors duration-200 hover:bg-base-300">
                                    <span className="text-base-content/70 font-semibold">Provider</span>
                                    <span className="font-semibold text-primary">{loggedInUser?.provider}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-base-200 rounded-xl col-span-2 md:col-span-1 lg:col-span-1 transition-colors duration-200 hover:bg-base-300">
                                    <span className="text-base-content/70">Avg. Given Rating</span>
                                    <span className="font-semibold text-success">{summeryData?.reviewStats?.averageRating}</span>
                                </div>
                            </div>
                        </div>

                        {/* Service Preferences */}
                        <div className="bg-base-100 rounded-3xl p-6 border border-neutral/40 shadow-xl">
                            <h2 className="text-xl font-bold text-base-content mb-4">Service Preferences</h2>
                            <div className="flex flex-wrap gap-2">
                                {preferences.map((pref, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-primary/10 text-primary text-xs md:text-sm rounded-xl border border-primary/20 font-medium transition-colors duration-300 hover:bg-primary/20"
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
                            </div>

                            {/* Stat Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <StatCard icon={Wrench} value={summeryData?.serviceStats?.total} label="Total Services" />
                                <StatCard icon={Award} value={summeryData?.serviceStats?.completed} label="Completed Services" />
                                <StatCard icon={Clock} value={summeryData?.serviceStats?.pending} label="Pending Services" trend={-2} />
                                <StatCard icon={Star} value={summeryData?.reviewStats?.totalReviews} label="Total Review" trend={15} />
                            </div>
                        </div>

                    </div>

                    {/* Right Column - Info Panels */}
                    <div className="space-y-8">

                        {/* Contact Information */}
                        <div className="bg-base-100 h-full rounded-3xl p-6 md:p-8 border border-neutral/40 shadow-xl">
                            <h2 className="text-2xl font-bold text-base-content mb-6">Contact Information</h2>
                            <div className="space-y-4">
                                {[
                                    { icon: Mail, label: "Email", value: loggedInUser?.email },
                                    { icon: Phone, label: "Phone", value: loggedInUser?.phone || "010000000" },
                                    { icon: MapPin, label: "Location", value: loggedInUser?.location || "Not specified" },
                                    { icon: Clock, label: "Last Login", value: new Date(loggedInUser?.lastLoggedIn).toLocaleDateString() },
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

                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;