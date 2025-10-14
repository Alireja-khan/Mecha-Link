"use client";
import React, { useState, useEffect } from "react";
import {
    Phone, MapPin, Wrench, CalendarClock, Clock, User, AlertTriangle,
    DollarSign, MessageCircle, Shield, CheckCircle, XCircle, Mail,
    Map, Image as ImageIcon, Trash2, Star, Navigation, Share2, Users,
    Calendar, Check, Award, Headset, MessageSquare
} from "lucide-react";
import { useParams } from "next/navigation";
import Swal from 'sweetalert2';
import useUser from "@/hooks/useUser";
import Loading from "../../../Components/Loading"

const ServiceRequestDetails = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [request, setRequest] = useState(null);
    const [completeUserData, setCompleteUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { user: loggedInUser, status } = useUser();
    

    const customerUserId = request?.userId;
    const currentMechanicId = loggedInUser?._id;

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                // First, get the service request
                const requestResponse = await fetch(`/api/service-request/${id}`);
                if (!requestResponse.ok) {
                    throw new Error('Failed to fetch service request');
                }
                const requestData = await requestResponse.json();

                // If user data is incomplete, fetch complete user data using the email
                if (requestData.userEmail) {
                    const userResponse = await fetch(`/api/users?email=${encodeURIComponent(requestData.userEmail)}`);
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        setCompleteUserData(userData);
                    }
                }

                // Prepare the request data with user info
                if (!requestData.user) {
                    requestData.user = {
                        email: requestData.userEmail,
                        _id: requestData.userId
                    };
                }

                setRequest(requestData);

            } catch (error) {
                console.error("Error fetching data:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Fetch Error',
                    text: 'Could not load service request details.',
                    confirmButtonColor: '#f97316'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, loggedInUser?._id]);

    // Combine user data for display
    const displayUser = completeUserData || request?.user;

    // Skeleton Components
    const HeroSkeleton = () => (
        <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 overflow-hidden text-white py-12">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

            <div className="container relative z-10">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                    {/* Device Image Skeleton */}
                    <div className="relative h-100 w-200 rounded-2xl overflow-hidden ring-2 ring-white shadow-2xl animate-pulse">
                        <div className="skeleton bg-orange-400/50 w-full h-full"></div>
                    </div>

                    {/* Request Info Skeleton */}
                    <div className="flex-1 text-center lg:text-left animate-pulse">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-3">
                                    <div className="skeleton bg-white/30 h-12 w-64 rounded-lg"></div>
                                    <div className="skeleton bg-white/30 h-8 w-32 rounded-xl"></div>
                                </div>

                                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                                    <div className="skeleton bg-white/30 w-5 h-5 rounded-full"></div>
                                    <div className="skeleton bg-white/30 h-6 w-40 rounded"></div>
                                </div>

                                <div className="flex items-center justify-center lg:justify-start gap-2">
                                    <div className="skeleton bg-white/30 w-5 h-5 rounded-full"></div>
                                    <div className="skeleton bg-white/30 h-6 w-48 rounded"></div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons Skeleton */}
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                            <div className="skeleton bg-white/30 h-12 w-32 rounded-xl"></div>
                            <div className="skeleton bg-white/30 h-12 w-36 rounded-xl"></div>
                            <div className="skeleton bg-white/30 h-12 w-40 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const CardSkeleton = ({ title = true, items = 3 }) => (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100 animate-pulse">
            {title && (
                <div className="flex items-center gap-3 mb-6">
                    <div className="skeleton bg-gray-200 w-10 h-10 rounded-lg"></div>
                    <div className="skeleton bg-gray-200 h-7 w-48 rounded"></div>
                </div>
            )}
            <div className="space-y-4">
                {[...Array(items)].map((_, index) => (
                    <div key={index} className="space-y-2">
                        <div className="skeleton bg-gray-200 h-4 w-32 rounded"></div>
                        <div className="skeleton bg-gray-200 h-6 w-full rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );

    const CustomerCardSkeleton = () => (
        <div className="bg-white rounded-2xl shadow-lg p-7 border border-orange-100 animate-pulse">
            <div className="flex items-center gap-3 mb-6">
                <div className="skeleton bg-gray-200 w-10 h-10 rounded-lg"></div>
                <div className="skeleton bg-gray-200 h-7 w-48 rounded"></div>
            </div>
            
            <div className="flex justify-center mb-4">
                <div className="skeleton bg-gray-200 w-54 h-44 rounded-md"></div>
            </div>

            <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="space-y-2">
                        <div className="skeleton bg-gray-200 h-3 w-24 rounded"></div>
                        <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );

    const ActionCardSkeleton = () => (
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-7 text-white animate-pulse">
            <div className="flex items-center gap-4 mb-5">
                <div className="skeleton bg-white/30 w-12 h-12 rounded-xl"></div>
                <div className="skeleton bg-white/30 h-6 w-32 rounded"></div>
            </div>
            <div className="skeleton bg-white/30 h-12 w-full rounded-xl"></div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
                <HeroSkeleton />
                
                {/* Main Content Skeleton */}
                <div className="container py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <CardSkeleton items={4} />
                            <CardSkeleton items={3} />
                            <CardSkeleton items={2} />
                            <CardSkeleton items={4} />
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-8">
                            <CustomerCardSkeleton />
                            <CardSkeleton title={true} items={4} />
                            <ActionCardSkeleton />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loading></Loading>
            </div>
        );
    }

    const statusConfig = {
        pending: {
            color: "bg-yellow-100 text-yellow-800 border-yellow-200",
            gradient: "from-yellow-500 to-yellow-600",
            icon: Clock,
            label: "Pending"
        },
        accepted: {
            color: "bg-orange-100 text-orange-800 border-orange-200",
            gradient: "from-orange-500 to-orange-600",
            icon: CheckCircle,
            label: "Accepted"
        },
        "in-progress": {
            color: "bg-blue-100 text-blue-800 border-blue-200",
            gradient: "from-blue-500 to-blue-600",
            icon: Wrench,
            label: "In Progress"
        },
        completed: {
            color: "bg-green-100 text-green-800 border-green-200",
            gradient: "from-green-500 to-green-600",
            icon: Shield,
            label: "Completed"
        },
        cancelled: {
            color: "bg-red-100 text-red-800 border-red-200",
            gradient: "from-red-500 to-red-600",
            icon: XCircle,
            label: "Cancelled"
        }
    };

    const statusInfo = statusConfig[request.status?.toLowerCase()] || statusConfig.pending;
    const StatusIcon = statusInfo.icon;

    const urgencyConfig = {
        low: { color: "text-green-600 bg-green-50 border-green-200", label: "Low Priority" },
        medium: { color: "text-yellow-600 bg-yellow-50 border-yellow-200", label: "Medium Priority" },
        high: { color: "text-orange-600 bg-orange-50 border-orange-200", label: "High Priority" },
        emergency: { color: "text-red-600 bg-red-50 border-red-200", label: "Emergency" }
    };

    const urgencyInfo = urgencyConfig[request.serviceDetails?.urgency] || urgencyConfig.medium;

    const loggedInUserRole = loggedInUser?.role?.toLowerCase();
    const isCustomerViewingOwnRequest = loggedInUser?._id === request.userId;
    const isShopOwnerAcceptedRequest = request.acceptedBy === currentMechanicId;

    const showMessagingButton = (loggedInUserRole === 'mechanic' || loggedInUserRole === 'admin' || loggedInUserRole === 'shop') && !isCustomerViewingOwnRequest;
    const showCallButton = (loggedInUserRole === 'mechanic' || loggedInUserRole === 'admin' || loggedInUserRole === 'shop') && !isCustomerViewingOwnRequest;

    // Get device image - use first problem image or a placeholder
    const deviceImage = request.serviceDetails?.images?.[0] || null;

    const handleAcceptRequest = async () => {
        if (loggedInUserRole !== 'mechanic' && loggedInUserRole !== 'shop') {
            Swal.fire({
                icon: 'warning',
                title: 'Permission Denied',
                text: 'Only mechanics or shop owners can accept this request.',
                confirmButtonColor: '#f97316'
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Accept Service Request?',
            text: 'You are about to accept this service request. This will assign your shop as the service provider.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#f97316',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Accept Request',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/service-request/${id}/status`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        status: 'in-progress',
                        acceptedBy: currentMechanicId,
                        acceptedByRole: loggedInUserRole,
                        assignedShop: currentMechanicId,
                        acceptedDate: new Date().toISOString()
                    })
                });

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Request Accepted!',
                        text: 'Service request has been accepted and is now in progress.',
                        confirmButtonColor: '#f97316'
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to accept request');
                }
            } catch (error) {
                console.error('Error accepting request:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Accept Failed',
                    text: error.message || 'Failed to accept service request.',
                    confirmButtonColor: '#f97316'
                });
            }
        }
    };

    const handleCompleteRequest = async () => {
        const result = await Swal.fire({
            title: 'Complete Service Request?',
            text: 'This will mark the service request as completed. This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Complete Service',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/service-request/${id}/status`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        status: 'completed',
                        completedDate: new Date().toISOString()
                    })
                });

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Service Completed!',
                        text: 'Service request has been marked as completed.',
                        confirmButtonColor: '#10b981'
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    throw new Error('Failed to complete service request');
                }
            } catch (error) {
                console.error('Error completing request:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Completion Failed',
                    text: 'Failed to mark service request as completed.',
                    confirmButtonColor: '#f97316'
                });
            }
        }
    };

    const handleContactCustomer = () => {
        const phoneNumber = request.contactInfo?.phoneNumber;
        if (phoneNumber) {
            window.open(`tel:${phoneNumber}`, '_blank');
        }
    };

    const handleMessageContact = async () => {
        if (!request || !loggedInUser) {
            Swal.fire({
                icon: 'warning',
                title: 'Data Missing',
                text: 'Service request or user information not available yet.',
                confirmButtonColor: '#f97316'
            });
            return;
        }

        try {
            const loggedInUserRole = loggedInUser.role?.toLowerCase();

            // 1️⃣ Fetch all chats of the logged-in user
            const res = await fetch(`/api/chats?userId=${loggedInUser._id}`);
            if (!res.ok) throw new Error('Failed to fetch chats');
            const userChats = await res.json();

            const customerId = request.userId;
            const mechanicId = loggedInUser._id;

            // 2️⃣ Check if a chat already exists with these participants
            const existingChat = userChats.find(chat =>
                chat.participants?.some(p => p.userId === customerId) &&
                chat.participants?.some(p => p.userId === mechanicId)
            );

            if (existingChat) {
                // Redirect to existing chat
                window.location.href = `/dashboard/${loggedInUserRole}/messages`;
                return;
            }

            // 3️⃣ Build new chat structure
            const chatPayload = {
                participants: [
                    {
                        userId: loggedInUser?._id,
                        name: loggedInUser?.name || "User",
                        email: loggedInUser?.email,
                        profileImage: loggedInUser?.profileImage || ""
                    },
                    {
                        userId: request?.userId,
                        name: request?.user?.name || request.userName || "Customer",
                        email: request?.user?.email || request.userEmail,
                        profileImage: request?.user?.profileImage || ""
                    }
                ],
                messages: [],
                createdAt: new Date().toISOString(),
                serviceRequestId: request._id
            };

            // 4️⃣ Create chat
            const apiResponse = await fetch('/api/chats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chatPayload)
            });

            if (!apiResponse.ok) throw new Error('Failed to create chat');

            window.location.href = `/dashboard/${loggedInUser.role.toLowerCase()}/messages`;

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Chat Error',
                text: error.message || 'An unexpected error occurred while starting the chat.',
                confirmButtonColor: '#f97316'
            });
        }
    };

    const handleOpenMaps = () => {
        const { latitude, longitude } = request.location || {};
        const address = encodeURIComponent(request.location?.address || "Service Location");

        if (latitude && longitude) {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            window.open(mapsUrl, '_blank');
        } else if (address) {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
            window.open(mapsUrl, '_blank');
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Location Missing',
                text: 'Location coordinates or address are not available for this request.',
                confirmButtonColor: '#f97316'
            });
        }
    };

    

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
            {/* Hero Section with Device Image */}
            <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 overflow-hidden text-white py-12">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

                <div className="container relative z-10">
                    <div className="flex flex-col lg:flex-row gap-8 items-center">
                        {/* Device Image */}
                        {deviceImage && (
                            <div className="relative h-100 w-200 rounded-2xl overflow-hidden ring-2 ring-white shadow-2xl">
                                <img
                                    src={deviceImage}
                                    alt="Device requiring service"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Request Info */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-3">
                                        <h1 className="text-4xl lg:text-5xl font-bold drop-shadow-lg">
                                            Service Request
                                        </h1>
                                        <div className={`flex items-center gap-1.5 bg-white backdrop-blur-sm px-4 py-2 rounded-xl  font-semibold border ${statusInfo.color}`}>
                                            <StatusIcon className="w-5 h-5" />
                                            <span>{statusInfo.label}</span>
                                        </div>
                                    </div>

                                    {request.deviceType && (
                                        <div className="flex items-center justify-center lg:justify-start gap-2 text-white mb-2">
                                            <Wrench className="w-5 h-5" />
                                            <span className="text-lg capitalize">{request.deviceType}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-center lg:justify-start gap-2 text-white">
                                        <Calendar className="w-5 h-5" />
                                        <span className="text-lg">
                                            Created on {new Date(request.requestedDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                {showCallButton && (
                                    <button
                                        onClick={handleContactCustomer}
                                        className="flex items-center gap-3 bg-white text-orange-600 px-8 py-4 rounded-xl font-bold hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-w-[140px] justify-center"
                                    >
                                        <Phone className="w-5 h-5" />
                                        <span>Call</span>
                                    </button>
                                )}

                                {showMessagingButton && (
                                    <button
                                        onClick={handleMessageContact}
                                        className="flex items-center gap-3 bg-green-500 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-w-[160px] justify-center"
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                        <span>Message</span>
                                    </button>
                                )}

                                {(loggedInUserRole === 'mechanic' || loggedInUserRole === 'shop') && request.status === 'pending' && (
                                    <button
                                        onClick={handleAcceptRequest}
                                        className="flex items-center gap-3 bg-white text-orange-600 px-8 py-4 rounded-xl font-bold hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-w-[140px] justify-center"
                                    >
                                        <CheckCircle className="w-5 h-5 inline mr-2" />
                                        Accept Request
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Service Information Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                                <div className="bg-orange-100 p-2 rounded-lg">
                                    <Wrench className="w-6 h-6 text-orange-600" />
                                </div>
                                Service Information
                            </h2>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <DetailItem label="Device Type" value={request.deviceType} capitalize />
                                    <DetailItem label="Problem Category" value={request.problemCategory} capitalize />
                                    <DetailItem label="Brand" value={request.serviceDetails?.vehicleInfo?.brand} />
                                </div>
                                <div className="space-y-2">
                                    <DetailItem label="Model" value={request.serviceDetails?.vehicleInfo?.model} />
                                    <DetailItem label="Year" value={request.serviceDetails?.vehicleInfo?.year} />
                                    <DetailItem label="VIN" value={request.serviceDetails?.vehicleInfo?.vin} />
                                </div>
                            </div>
                        </div>

                        {/* Problem Details Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                                <div className="bg-orange-100 p-2 rounded-lg">
                                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                                </div>
                                Problem Details
                            </h2>

                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${urgencyInfo.color}`}>
                                        {urgencyInfo.label}
                                    </span>
                                </div>

                                <DetailItem label="Problem Title" value={request.serviceDetails?.problemTitle} largeValue />

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-3">Description</label>
                                    <p className="text-gray-700 bg-orange-50 p-5 rounded-xl border border-orange-200 text-base leading-relaxed shadow-inner">
                                        {request.serviceDetails?.description || "No detailed description provided by the customer."}
                                    </p>
                                </div>


                            </div>
                        </div>

                        {/* Service Location Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                                <div className="bg-orange-100 p-2 rounded-lg">
                                    <MapPin className="w-6 h-6 text-orange-600" />
                                </div>
                                Service Location
                            </h2>

                            <div className="">
                                <DetailItem label="Address" value={request.location?.address} largeValue />
                                <button
                                    onClick={handleOpenMaps}
                                    className="flex items-center mt-5 gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-8 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full justify-center"
                                >
                                    <Navigation className="w-5 h-5" />
                                    Get Directions
                                </button>
                            </div>
                        </div>

                        {/* Request Timeline Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                                <div className="bg-orange-100 p-2 rounded-lg">
                                    <Clock className="w-6 h-6 text-orange-600" />
                                </div>
                                Request Timeline
                            </h2>

                            <div className="">
                                <TimelineItem
                                    date={request.requestedDate}
                                    title="Request Submitted"
                                    description="Service request was created"
                                    active
                                />
                                {request.acceptedDate && (
                                    <TimelineItem
                                        date={request.acceptedDate}
                                        title="Request Accepted"
                                        description="Mechanic accepted the request"
                                        active
                                    />
                                )}
                                <TimelineItem
                                    date={request.preferredSchedule?.date}
                                    title="Scheduled Service"
                                    description="Preferred service date"
                                    pending={!request.acceptedDate}
                                />
                                <TimelineItem
                                    date={request.completedDate}
                                    title="Service Completed"
                                    description="Work completed successfully"
                                    pending={!request.completedDate}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-8">
                        {/* Customer Information Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-7 border border-orange-100">
                            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                                <div className="bg-orange-100 p-2 rounded-lg">
                                    <User className="w-6 h-6 text-orange-600" />
                                </div>
                                Customer Information
                            </h3>

                            <div className="space-y-2">
                                <div className="flex justify-center mb-4">
                                    {displayUser?.profileImage ? (
                                        <img
                                            src={displayUser.profileImage}
                                            alt="Customer profile"
                                            className="w-54 h-44  object-cover border rounded-md shadow-lg"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-24 h-24 flex items-center justify-center rounded-full border-4 border-orange-200 shadow-lg bg-orange-100">
                                            <User className="w-10 h-10 text-orange-400" />
                                        </div>
                                    )}
                                </div>

                                <DetailItem label="Full Name" value={displayUser?.name || displayUser?.userName || "Not Provided"} />
                                <DetailItem label="Email" value={displayUser?.email || request.userEmail} icon={Mail} />
                                <DetailItem label="Phone" value={displayUser?.phone} icon={Phone} />

                                {displayUser?.address && <DetailItem label="Address" value={displayUser.address} largeValue />}
                                {displayUser?.bio && <DetailItem label="Bio" value={displayUser.bio} largeValue />}

                                <div className="pt-4 border-t border-orange-200 space-y-2">
                                    <h3 className="text-sm font-semibold text-gray-600">Request Contact</h3>
                                    <DetailItem label="Service Phone" value={request.contactInfo?.phoneNumber} icon={Phone} />
                                    <DetailItem
                                        label="Alternate Phone"
                                        value={request.contactInfo?.alternatePhone}
                                    />
                                    {request.contactInfo?.specialInstructions && (
                                        <DetailItem
                                            label="Special Instructions"
                                            value={request.contactInfo.specialInstructions}
                                            largeValue
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Schedule & Budget Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-7 border border-orange-100">
                            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                                <div className="bg-orange-100 p-2 rounded-lg">
                                    <CalendarClock className="w-6 h-6 text-orange-600" />
                                </div>
                                Schedule & Budget
                            </h3>

                            <div className="space-y-2">
                                <DetailItem
                                    label="Preferred Date"
                                    value={request.preferredSchedule?.date ?
                                        new Date(request.preferredSchedule.date).toLocaleDateString() : "Not specified"
                                    }
                                />
                                <DetailItem
                                    label="Time Slot"
                                    value={request.preferredSchedule?.timeSlot ?
                                        request.preferredSchedule.timeSlot.charAt(0).toUpperCase() +
                                        request.preferredSchedule.timeSlot.slice(1) : "Any time"
                                    }
                                />
                                <DetailItem
                                    label="Flexibility"
                                    value={request.preferredSchedule?.flexibility ?
                                        request.preferredSchedule.flexibility.charAt(0).toUpperCase() +
                                        request.preferredSchedule.flexibility.slice(1) : "Flexible"
                                    }
                                />
                                <div className="pt-3 border-t border-orange-200">
                                    <DetailItem
                                        label="Estimated Budget"
                                        value={request.estimatedBudget ?
                                            `BDT ${request.estimatedBudget.replace('-', ' - ')}` : "Not specified"
                                        }
                                        icon={DollarSign}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Service Action Cards */}
                        {(loggedInUserRole === 'mechanic' || loggedInUserRole === 'shop') && request.status === 'pending' && (
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-7 text-white">
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="bg-white/20 p-3 rounded-xl">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold">Service Action</h3>
                                </div>
                                <button
                                    onClick={handleAcceptRequest}
                                    className="w-full bg-white text-orange-600 py-4 rounded-xl font-bold hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    <CheckCircle className="w-5 h-5 inline mr-2" />
                                    Accept Request
                                </button>
                            </div>
                        )}

                        {request.status === 'in-progress' && isShopOwnerAcceptedRequest && (
                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-7 text-white">
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="bg-white/20 p-3 rounded-xl">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold">Service In Progress</h3>
                                </div>
                                <p className="text-green-100 text-sm mb-4">
                                    You are currently working on this service request.
                                </p>
                                <button
                                    onClick={handleCompleteRequest}
                                    className="w-full bg-white text-green-600 py-4 rounded-xl font-bold hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    <CheckCircle className="w-5 h-5 inline mr-2" />
                                    Mark as Completed
                                </button>
                            </div>
                        )}

                        {request.status !== 'pending' && request.status !== 'in-progress' && (
                            <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-7">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="bg-orange-100 p-3 rounded-xl">
                                        <Shield className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Request Status</h3>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-sm text-gray-600">
                                        Current Status: <span className="font-semibold text-gray-800">{statusInfo.label}</span>
                                    </p>
                                    {request.acceptedDate && (
                                        <p className="text-sm text-gray-600">
                                            Accepted on: {new Date(request.acceptedDate).toLocaleDateString()}
                                        </p>
                                    )}
                                    {request.completedDate && (
                                        <p className="text-sm text-gray-600">
                                            Completed on: {new Date(request.completedDate).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="max-w-6xl max-h-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white text-lg font-semibold">Problem Image</h3>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="text-white hover:text-orange-400 transition-colors text-3xl p-2 rounded-full hover:bg-white/10"
                                aria-label="Close image modal"
                            >
                                ×
                            </button>
                        </div>
                        <img
                            src={selectedImage}
                            alt="Enlarged problem view"
                            className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

// Updated DetailItem component to match the style
const DetailItem = ({ label, value, icon: Icon, capitalize = false, largeValue = false }) => (
    <div className="group hover:bg-orange-50  py-3 px-4 rounded-xl transition-colors duration-200 border border-orange-500">
        <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
            {label}
        </label>
        <div className="flex items-start gap-3">
            {Icon && (
                <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors flex-shrink-0">
                    <Icon className="w-4 h-4 text-orange-600" />
                </div>
            )}
            <span className={`${capitalize ? 'capitalize' : ''} ${largeValue ? 'break-words text-base font-medium text-gray-800' : 'text-sm text-gray-700'} leading-relaxed flex-1`}>
                {value || <span className="text-gray-400 italic">Not provided</span>}
            </span>
        </div>
    </div>
);

// Updated TimelineItem component
const TimelineItem = ({ date, title, description, active = false, pending = false }) => {
    const dotColor = active ? 'bg-orange-500 ring-orange-200' : pending ? 'bg-gray-300 ring-gray-100' : 'bg-green-500 ring-green-200';
    const lineColor = pending ? 'bg-gray-200' : 'bg-orange-200';
    const textColor = active ? 'text-gray-800 font-semibold' : 'text-gray-600';

    return (
        <div className="flex gap-4 relative">
            <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full ${dotColor} ring-4 z-10`} />
                <div className={`w-0.5 h-full ${lineColor} mt-1 -mb-2`} />
            </div>
            <div className="flex-1 pb-4">
                <p className={`text-base ${textColor} mb-1`}>{title}</p>
                <p className="text-sm text-gray-500 mb-2">{description}</p>
                {date && (
                    <p className="text-xs text-gray-400">
                        {new Date(date).toLocaleDateString()} · {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ServiceRequestDetails;