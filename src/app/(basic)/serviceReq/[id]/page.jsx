"use client";
import React, { useState, useEffect } from "react";
import {
    Phone,
    MapPin,
    Wrench,
    CalendarClock,
    Clock,
    User,
    AlertTriangle,
    DollarSign,
    MessageCircle,
    Shield,
    CheckCircle,
    XCircle,
    Mail,
    Map,
    Image as ImageIcon,
    Trash2
} from "lucide-react";
import { useParams } from "next/navigation";
import Swal from 'sweetalert2';
import useUser from "@/hooks/useUser";

const ServiceRequestDetails = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [request, setRequest] = useState(null);
    const { id } = useParams();
    const { user: loggedInUser, status } = useUser();

    const customerUserId = request?.userId;
    const currentMechanicId = loggedInUser?._id;

    useEffect(() => {
        if (!id) return; // Guard against missing ID

        fetch(`/api/service-request/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (!data.user) {
                    data.user = { email: data.userEmail, _id: data.userId };
                }
                setRequest(data);

                // --- START Console Log Additions ---
                const serviceRequestId = id;
                const customerId = data.userId;
                // currentMechanicId here is the ID of the logged-in user viewing the page.
                const viewerId = loggedInUser?._id;

                console.log("--- Service Request IDs ---");
                console.log("Service Request ID (from URL):", serviceRequestId);
                console.log("Customer User ID (from request data):", customerId);
                console.log("Current Logged-in User ID (Mechanic/Viewer):", viewerId);
                console.log("---------------------------");
                // --- END Console Log Additions ---

            })
            .catch(error => {
                console.error("Error fetching service request:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Fetch Error',
                    text: 'Could not load service request details.',
                    confirmButtonColor: '#f97316'
                });
            });
    }, [id, loggedInUser?._id]) // Added loggedInUser?._id as a dependency

    if (!request) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading service request...</p>
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

    // --- REMOVED MOCK_MECHANIC_EMAIL and isMockMechanic logic ---
    const loggedInUserRole = loggedInUser?.role?.toLowerCase();

    const isCustomerViewingOwnRequest = loggedInUser?._id === request.userId;

    const showMessagingButton = loggedInUserRole === 'mechanic' && !isCustomerViewingOwnRequest;
    const showCallButton = loggedInUserRole === 'mechanic' && !isCustomerViewingOwnRequest;

    // Check if the user is an Admin to show the clear all button
    const showAdminClearButton = loggedInUserRole === 'admin';

    const nonMechanicMessage = isCustomerViewingOwnRequest
        ? "This is your service request. Contact options are for service providers."
        : loggedInUserRole === 'admin'
            ? "Messaging is disabled for Admin review."
            : "";

    const handleAcceptRequest = async () => {
        if (loggedInUserRole !== 'mechanic') {
            Swal.fire({ icon: 'warning', title: 'Permission Denied', text: 'Only a mechanic can accept this request.', confirmButtonColor: '#f97316' });
            return;
        }

        try {
            const response = await fetch(`/api/service-requests/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'accepted',
                    acceptedBy: currentMechanicId,
                    acceptedDate: new Date().toISOString()
                })
            });

            if (response.ok) {
                // --- REMOVED SUCCESS ALERT ---
                window.location.reload();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: 'Failed to accept request status.',
                    confirmButtonColor: '#f97316'
                });
            }
        } catch (error) {
            console.error('Error accepting request:', error);
            Swal.fire({
                icon: 'error',
                title: 'System Error',
                text: 'An unexpected error occurred while accepting the request.',
                confirmButtonColor: '#f97316'
            });
        }
    };


    const handleContactCustomer = () => {
        const phoneNumber = request.contactInfo?.phoneNumber;
        if (phoneNumber) {
            window.open(`tel:${phoneNumber}`, '_blank');
        }
    };

    const handleMessageContact = async () => {
        const serviceRequestId = request._id;

        if (!serviceRequestId || !customerUserId || !currentMechanicId) {
            Swal.fire({
                icon: 'warning',
                title: 'Data Missing',
                text: 'Cannot start chat: Missing Service Request ID, Customer ID, or Mechanic ID.',
                confirmButtonColor: '#f97316'
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Start Conversation?',
            html: `Do you want to start an in-app chat for service request **#${serviceRequestId}**?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Start Chat!',
            cancelButtonText: 'No, Cancel',
            confirmButtonColor: '#f97316'
        });

        if (!result.isConfirmed) return;

        try {
            const apiResponse = await fetch('/api/chats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceRequestId,
                    customerId: customerUserId,
                    mechanicId: currentMechanicId
                })
            });

            const data = await apiResponse.json();

            const chatPath = `/dashboard/${loggedInUserRole}/messages`;

            // --- REMOVED SUCCESS/RETRIEVED ALERT ---
            window.location.href = chatPath;

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
            // Updated mapsUrl to use standard Google Maps format
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            window.open(mapsUrl, '_blank');
        } else if (address) {
            // Updated mapsUrl to use standard Google Maps format
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
        <div className="min-h-screen bg-gray-50 py-10 sm:py-12">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Service Request</h1>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color} whitespace-nowrap`}>
                                    <StatusIcon className="inline w-4 h-4 mr-1" />
                                    {statusInfo.label}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">
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
                                    className="flex items-center justify-center gap-2 px-4 py-2 border border-orange-500 text-orange-600 bg-white rounded-lg hover:bg-orange-50 transition-colors font-medium text-sm"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Message Customer
                                </button>
                            ) : nonMechanicMessage ? (
                                <div className="p-2 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-600 font-medium">
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <p className="text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner text-sm leading-relaxed">
                                        {request.serviceDetails?.description || "No detailed description provided by the customer."}
                                    </p>
                                </div>

                                {request.serviceDetails?.images?.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Problem Images ({request.serviceDetails.images.length})</label>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                            {request.serviceDetails.images.map((img, index) => (
                                                <div key={index} className="relative aspect-square cursor-pointer overflow-hidden rounded-lg group shadow-sm hover:shadow-md transition-shadow">
                                                    <img
                                                        src={img}
                                                        alt={`Problem evidence ${index + 1}`}
                                                        className="w-full h-full object-cover border border-gray-200 group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.parentNode.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500"><ImageIcon size={18} /></div>';
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
                                    {request.user?.profileImage ? (
                                        <img
                                            src={request.user.profileImage}
                                            alt="Customer profile"
                                            className="w-20 h-20 rounded-full object-cover border-4 border-orange-100 shadow-md"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-20 h-20 flex items-center justify-center rounded-full border-4 border-orange-100 shadow-md">
                                            <User className="w-10 h-10 text-gray-300" />
                                        </div>
                                    )}
                                </div>

                                <DetailItem label="Full Name" value={request?.userName || "Not Provided"} />
                                <DetailItem label="Email" value={request.user?.email || request.userEmail} icon={Mail} />

                                <div className="pt-4 border-t border-gray-100 space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-700">Request Contact</h3>
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

                        {loggedInUserRole === 'mechanic' && request.status === 'pending' && (
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
                        {request.status !== 'pending' && (
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <h2 className="text-xl font-semibold mb-4 text-gray-700">Request Status</h2>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">Current Status: <span className="font-medium text-gray-900">{statusInfo.label}</span></p>
                                    {request.acceptedDate && (
                                        <p className="text-sm text-gray-600">
                                            Accepted on: {new Date(request.acceptedDate).toLocaleDateString()}
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
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-3">
            <Icon className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        {children}
    </div>
);

const DetailItem = ({ label, value, icon: Icon, capitalize = false, largeValue = false }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">{label}</label>
        <div className="flex items-start gap-2">
            {Icon && <Icon className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />}
            <span className={`text-gray-900 ${capitalize ? 'capitalize' : ''} ${largeValue ? 'break-words text-base font-medium' : 'text-sm'} leading-tight`}>
                {value || <span className="text-gray-400 italic">Not provided</span>}
            </span>
        </div>
    </div>
);

const TimelineItem = ({ date, title, description, active = false, pending = false }) => {
    const color = active ? 'bg-orange-500' : pending ? 'bg-gray-300' : 'bg-green-500';
    const textColor = active ? 'text-gray-900 font-semibold' : 'text-gray-700';

    return (
        <div className="flex gap-3 relative">
            <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${color} ring-4 ${active ? 'ring-orange-100' : 'ring-gray-100'} z-10`} />
                <div className={`w-0.5 h-full ${pending ? 'bg-gray-200' : 'bg-orange-200'} mt-1 -mb-2`} />
            </div>
            <div className="flex-1 pb-3">
                <p className={`text-sm ${textColor}`}>{title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{description}</p>
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