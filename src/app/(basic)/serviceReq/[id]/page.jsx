"use client";
import React, { useState, useEffect } from "react";
import {
    Phone, MapPin, Wrench, CalendarClock, Clock, User, AlertTriangle, DollarSign, MessageCircle, Shield, CheckCircle, XCircle, Mail, Map, Image as ImageIcon, Trash2
} from "lucide-react";
import { useParams } from "next/navigation";
import Swal from 'sweetalert2';
import useUser from "@/hooks/useUser";

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

                // Console logs for debugging
                console.log("--- Service Request IDs ---");
                console.log("Service Request ID (from URL):", id);
                console.log("Customer User ID (from request data):", requestData.userId);
                console.log("Current Logged-in User ID (Mechanic/Viewer):", loggedInUser?._id);
                console.log("Complete User Data:", completeUserData);
                console.log("---------------------------");

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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Loading service request...</p>
                </div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400">Service request not found.</p>
                </div>
            </div>
        );
    }

    const statusConfig = {
        pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock, label: "Pending" },
        accepted: { color: "bg-orange-100 text-orange-800 border-orange-200", icon: CheckCircle, label: "Accepted" },
        "in-progress": { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Wrench, label: "In Progress" },
        completed: { color: "bg-green-100 text-green-800 border-green-200", icon: Shield, label: "Completed" },
        cancelled: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle, label: "Cancelled" }
    };

    const statusInfo = statusConfig[request.status?.toLowerCase()] || statusConfig.pending;
    const StatusIcon = statusInfo.icon;

    const urgencyConfig = {
        low: { color: "text-green-600 bg-green-50", label: "Low Priority" },
        medium: { color: "text-yellow-600 bg-yellow-50", label: "Medium Priority" },
        high: { color: "text-orange-600 bg-orange-50", label: "High Priority" },
        emergency: { color: "text-red-600 bg-red-50", label: "Emergency" }
    };

    const urgencyInfo = urgencyConfig[request.serviceDetails?.urgency] || urgencyConfig.medium;

    const loggedInUserRole = loggedInUser?.role?.toLowerCase();
    const isCustomerViewingOwnRequest = loggedInUser?._id === request.userId;
    const isShopOwnerAcceptedRequest = request.acceptedBy === currentMechanicId;

    const showMessagingButton = (loggedInUserRole === 'mechanic' || loggedInUserRole === 'admin' || loggedInUserRole === 'shop') && !isCustomerViewingOwnRequest;
    const showCallButton = (loggedInUserRole === 'mechanic' || loggedInUserRole === 'admin' || loggedInUserRole === 'shop') && !isCustomerViewingOwnRequest;

    const nonMechanicMessage = isCustomerViewingOwnRequest
        ? "This is your service request. Contact options are for service providers."
        : "";

    const handleAcceptRequest = async () => {
        // Allow both 'mechanic' and 'shop' roles to accept requests
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
                        acceptedBy: currentMechanicId, // This is the shop owner's user ID
                        acceptedByRole: loggedInUserRole,
                        assignedShop: currentMechanicId, // Assign to this shop
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

        // Use complete user data if available
        const userData = displayUser || request.user;

        const chatPayload = {
            serviceRequestId: request._id,
            customerId: request.userId,
            customerName: userData?.name || userData?.userName || "Not Provided",
            customerEmail: userData?.email || request.userEmail,
            customerProfileImage: userData?.profileImage || null,
            mechanicId: loggedInUser._id,
            mechanicName: loggedInUser.name || "Not Provided",
            mechanicEmail: loggedInUser.email,
            messages: [],
            mechanicProfileImage: loggedInUser.profileImage || null,
        };

        try {
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
        <div className="min-h-screen py-10 sm:py-12">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="rounded-xl shadow-lg border border-primary p-6 sm:p-8 mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl sm:text-3xl font-bold">Service Request</h1>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color} whitespace-nowrap`}>
                                    <StatusIcon className="inline w-4 h-4 mr-1" />
                                    {statusInfo.label}
                                </span>
                            </div>
                            <p className="text-sm text-gray-400">
                                Created on {new Date(request.requestedDate).toLocaleDateString()} at{' '}
                                {new Date(request.requestedDate).toLocaleTimeString()}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            {showCallButton && (
                                <button
                                    onClick={handleContactCustomer}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm"
                                >
                                    <Phone className="w-4 h-4" />
                                    Call Customer
                                </button>
                            )}

                            {showMessagingButton ? (
                                <button
                                    onClick={handleMessageContact}
                                    className="flex items-center justify-center gap-2 px-4 py-2 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium text-sm"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Message Customer
                                </button>
                            ) : nonMechanicMessage ? (
                                <div className="py-2 px-3 border border-primary bg-orange-100 rounded-lg text-sm text-orange-950 font-medium">
                                    {nonMechanicMessage}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <InfoCard title="Service Information" icon={Wrench}>
                            <div className="grid sm:grid-cols-2 gap-3">
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
                        </InfoCard>

                        <InfoCard title="Problem Details" icon={AlertTriangle}>
                            <div className="flex items-center gap-3 mb-4 -mt-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${urgencyInfo.color}`}>
                                    {urgencyInfo.label}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <DetailItem label="Problem Title" value={request.serviceDetails?.problemTitle} largeValue />
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                    <p className="text-orange-950 bg-orange-100 p-4 rounded-lg border border-primary shadow-inner text-sm leading-relaxed">
                                        {request.serviceDetails?.description || "No detailed description provided by the customer."}
                                    </p>
                                </div>

                                {request.serviceDetails?.images?.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-3">Problem Images ({request.serviceDetails.images.length})</label>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                            {request.serviceDetails.images.map((img, index) => (
                                                <div key={index} className="relative aspect-square cursor-pointer overflow-hidden rounded-lg group shadow-sm hover:shadow-md transition-shadow">
                                                    <img
                                                        src={img}
                                                        alt={`Problem evidence ${index + 1}`}
                                                        className="w-full h-full object-cover border border-gray-200 group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.parentNode.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400"><ImageIcon size={18} /></div>';
                                                        }}
                                                        onClick={() => setSelectedImage(img)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </InfoCard>

                        <InfoCard title="Service Location" icon={MapPin}>
                            <div className="space-y-3">
                                <DetailItem label="Address" value={request.location?.address} largeValue />
                                <button
                                    onClick={handleOpenMaps}
                                    className="flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700 transition-colors border border-orange-200 px-3 py-1 rounded-md bg-orange-50 hover:bg-orange-100 text-sm"
                                >
                                    <Map className="w-4 h-4" />
                                    Open in Google Maps
                                </button>
                            </div>
                        </InfoCard>

                        <InfoCard title="Request Timeline" icon={Clock}>
                            <div className="space-y-2">
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
                        </InfoCard>
                    </div>

                    <div className="space-y-6">
                        <InfoCard title="Customer Information" icon={User}>
                            <div className="space-y-4">
                                <div className="flex justify-center mb-4">
                                    {displayUser?.profileImage ? (
                                        <img
                                            src={displayUser.profileImage}
                                            alt="Customer profile"
                                            className="w-20 h-20 rounded-full object-cover border-4 border-orange-100 shadow-md"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-20 h-20 flex items-center justify-center rounded-full border-4 border-orange-100 shadow-md">
                                            <User className="w-10 h-10 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Display all user data from completeUserData */}
                                <DetailItem label="Full Name" value={displayUser?.name || displayUser?.userName || "Not Provided"} />
                                <DetailItem label="Email" value={displayUser?.email || request.userEmail} icon={Mail} />
                                <DetailItem label="Phone" value={displayUser?.phone} icon={Phone} />
                                {displayUser?.address && <DetailItem label="Address" value={displayUser.address} largeValue />}
                                {displayUser?.bio && <DetailItem label="Bio" value={displayUser.bio} largeValue />}

                                {/* Display any other user fields that might exist */}
                                {displayUser && Object.entries(displayUser).map(([key, value]) => {
                                    if (['_id', 'email', 'name', 'userName', 'profileImage', 'phone', 'address', 'bio', 'password', 'otp', 'otpExpiresAt'].includes(key)) return null;
                                    if (typeof value === 'object' || !value) return null;
                                    return <DetailItem key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} value={value.toString()} />;
                                })}

                                <div className="pt-4 border-t border-gray-100 space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-400">Request Contact</h3>
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
                        </InfoCard>

                        <InfoCard title="Schedule & Budget" icon={CalendarClock}>
                            <div className="space-y-3">
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
                                <div className="pt-2 border-t border-gray-100">
                                    <DetailItem
                                        label="Estimated Budget"
                                        value={request.estimatedBudget ?
                                            `BDT ${request.estimatedBudget.replace('-', ' - ')}` : "Not specified"
                                        }
                                        icon={DollarSign}
                                    />
                                </div>
                            </div>
                        </InfoCard>

                        {/* Service Action Cards */}
                        {(loggedInUserRole === 'mechanic' || loggedInUserRole === 'shop') && request.status === 'pending' && (
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <h2 className="text-xl font-semibold mb-4 text-orange-600">Service Action</h2>
                                <button
                                    onClick={handleAcceptRequest}
                                    className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold shadow-md hover:shadow-lg"
                                >
                                    <CheckCircle className="w-5 h-5 inline mr-2" />
                                    Accept Request
                                </button>
                            </div>
                        )}

                        {request.status === 'in-progress' && isShopOwnerAcceptedRequest && (
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <h2 className="text-xl font-semibold mb-4 text-green-600">Service In Progress</h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    You are currently working on this service request.
                                </p>
                                <button
                                    onClick={handleCompleteRequest}
                                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold shadow-md hover:shadow-lg"
                                >
                                    <CheckCircle className="w-5 h-5 inline mr-2" />
                                    Mark as Completed
                                </button>
                            </div>
                        )}

                        {request.status !== 'pending' && request.status !== 'in-progress' && (
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <h2 className="text-xl font-semibold mb-4 text-gray-400">Request Status</h2>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-400">Current Status: <span className="font-medium">{statusInfo.label}</span></p>
                                    {request.acceptedDate && (
                                        <p className="text-sm text-gray-400">
                                            Accepted on: {new Date(request.acceptedDate).toLocaleDateString()}
                                        </p>
                                    )}
                                    {request.completedDate && (
                                        <p className="text-sm text-gray-400">
                                            Completed on: {new Date(request.completedDate).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="max-w-5xl max-h-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="text-white hover:text-orange-400 transition-colors text-4xl p-2"
                                aria-label="Close image modal"
                            >
                                ×
                            </button>
                        </div>
                        <img
                            src={selectedImage}
                            alt="Enlarged problem view"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
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

const InfoCard = ({ title, icon: Icon, children }) => (
    <div className="rounded-xl shadow-lg border border-primary p-6">
        <div className="flex items-center gap-3 mb-5 border-b border-primary pb-3">
            <Icon className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        {children}
    </div>
);

const DetailItem = ({ label, value, icon: Icon, capitalize = false, largeValue = false }) => (
    <div>
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">{label}</label>
        <div className="flex items-start gap-2">
            {Icon && <Icon className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />}
            <span className={`${capitalize ? 'capitalize' : ''} ${largeValue ? 'break-words text-base font-medium' : 'text-sm'} leading-tight`}>
                {value || <span className="text-gray-400 italic">Not provided</span>}
            </span>
        </div>
    </div>
);

const TimelineItem = ({ date, title, description, active = false, pending = false }) => {
    const color = active ? 'bg-orange-500' : pending ? 'bg-gray-300' : 'bg-green-500';
    const textColor = active ? 'font-semibold' : 'text-gray-400';

    return (
        <div className="flex gap-3 relative">
            <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${color} ring-4 ${active ? 'ring-orange-100' : 'ring-gray-100'} z-10`} />
                <div className={`w-0.5 h-full ${pending ? 'bg-gray-200' : 'bg-orange-200'} mt-1 -mb-2`} />
            </div>
            <div className="flex-1 pb-3">
                <p className={`text-sm ${textColor}`}>{title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                {date && (
                    <p className="text-xs text-gray-400 mt-1">
                        {new Date(date).toLocaleDateString()} · {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                )}
            </div>
        </div>
    );
};
export default ServiceRequestDetails;