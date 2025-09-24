"use client";
import React, { useState, useEffect } from "react";
import {
    Phone,
    MapPin,
    Wrench,
    CalendarClock,
    Clock,
    Car,
    User,
    AlertTriangle,
    DollarSign,
    MessageCircle,
    Shield,
    CheckCircle,
    XCircle,
    Mail,
    Map,
    Image as ImageIcon
} from "lucide-react";
import getUserData from "@/lib/getUserData";
import { useSession } from "next-auth/react";

const ServiceRequestDetails = ({ request }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loadingUser, setLoadingUser] = useState(false);
    const { data: session, status } = useSession();
    const [loggedInUser, setLoggedInUser] = useState(null);


    useEffect(() => {
        fetch(`/api/users?email=${session?.user?.email}`)
            .then((res) => res.json())
            .then((data) => setLoggedInUser(data));
    }, [session?.user?.email]);

    console.log(loggedInUser);



    // Fetch user data from users collection



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

    // Status configuration
    const statusConfig = {
        pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock, label: "Pending" },
        accepted: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle, label: "Accepted" },
        "in-progress": { color: "bg-orange-100 text-orange-800 border-orange-200", icon: Wrench, label: "In Progress" },
        completed: { color: "bg-green-100 text-green-800 border-green-200", icon: Shield, label: "Completed" },
        cancelled: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle, label: "Cancelled" }
    };

    const statusInfo = statusConfig[request.status?.toLowerCase()] || statusConfig.pending;
    const StatusIcon = statusInfo.icon;

    // Urgency configuration
    const urgencyConfig = {
        low: { color: "text-green-600 bg-green-50", label: "Low Priority" },
        medium: { color: "text-yellow-600 bg-yellow-50", label: "Medium Priority" },
        high: { color: "text-orange-600 bg-orange-50", label: "High Priority" },
        emergency: { color: "text-red-600 bg-red-50", label: "Emergency" }
    };

    const urgencyInfo = urgencyConfig[request.serviceDetails?.urgency] || urgencyConfig.medium;

    // Handle accept request
    const handleAcceptRequest = async () => {
        try {
            const response = await fetch(`/api/service-requests/${request._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'accepted',
                    acceptedDate: new Date().toISOString()
                })
            });

            if (response.ok) {
                window.location.reload();
            } else {
                console.error('Failed to accept request');
            }
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    // Handle contact customer
    const handleContactCustomer = () => {
        const phoneNumber = request.contactInfo?.phoneNumber;
        if (phoneNumber) {
            window.open(`tel:${phoneNumber}`, '_blank');
        }
    };

    // Handle WhatsApp contact
    const handleWhatsAppContact = () => {
        const phoneNumber = request.contactInfo?.phoneNumber?.replace('+', '');
        const message = `Hello! I'm contacting you regarding your service request for ${request.deviceType} - ${request.serviceDetails?.problemTitle}`;

        if (phoneNumber) {
            window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">Service Request Details</h1>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                                    <StatusIcon className="inline w-4 h-4 mr-1" />
                                    {statusInfo.label}
                                </span>
                            </div>
                            <p className="text-gray-600">
                                Created on {new Date(request.requestedDate).toLocaleDateString()} at{' '}
                                {new Date(request.requestedDate).toLocaleTimeString()}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleContactCustomer}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Phone className="w-4 h-4" />
                                Call Customer
                            </button>
                            <button
                                onClick={handleWhatsAppContact}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Primary Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Service Information Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Wrench className="w-6 h-6 text-orange-500" />
                                <h2 className="text-xl font-semibold">Service Information</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <DetailItem label="Device Type" value={request.deviceType} capitalize />
                                    <DetailItem label="Problem Category" value={request.problemCategory} capitalize />
                                    <DetailItem label="Brand" value={request.vehicleInfo?.brand} />
                                </div>
                                <div className="space-y-3">
                                    <DetailItem label="Model" value={request.vehicleInfo?.model || "Not provided"} />
                                    <DetailItem label="Year" value={request.vehicleInfo?.year || "Not provided"} />
                                    <DetailItem label="VIN" value={request.vehicleInfo?.vin || "Not provided"} />
                                </div>
                            </div>
                        </div>

                        {/* Problem Details Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="w-6 h-6 text-orange-500" />
                                <h2 className="text-xl font-semibold">Problem Details</h2>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${urgencyInfo.color}`}>
                                    {urgencyInfo.label}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <DetailItem label="Problem Title" value={request.serviceDetails?.problemTitle} largeValue />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <p className="text-gray-900 bg-gray-50 p-4 rounded-lg border">
                                        {request.serviceDetails?.description || "No description provided"}
                                    </p>
                                </div>

                                {/* Images Gallery */}
                                {request.images?.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Problem Images</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {request.images.map((img, index) => (
                                                <div key={index} className="relative group cursor-pointer">
                                                    <img
                                                        src={img}
                                                        alt={`Problem evidence ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-lg border shadow-sm group-hover:opacity-80 transition-opacity"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                        onClick={() => setSelectedImage(img)}
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <MapPin className="w-6 h-6 text-orange-500" />
                                <h2 className="text-xl font-semibold">Service Location</h2>
                            </div>

                            <div className="space-y-3">
                                <DetailItem label="Address" value={request.location?.address} largeValue />
                                <button
                                    onClick={() => {
                                        const mapsUrl = `https://www.google.com/maps?q=${request.location?.latitude},${request.location?.longitude}`;
                                        window.open(mapsUrl, '_blank');
                                    }}
                                    className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors"
                                >
                                    <Map className="w-4 h-4" />
                                    Open in Google Maps
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Customer Information Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <User className="w-6 h-6 text-orange-500" />
                                <h2 className="text-xl font-semibold">Customer Information</h2>
                            </div>

                            <div className="space-y-4">
                                {loadingUser ? (
                                    <div className="flex justify-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                                    </div>
                                ) : userData ? (
                                    <>
                                        {/* User Profile Image */}
                                        {userData.profileImage && (
                                            <div className="flex justify-center mb-4">
                                                <img
                                                    src={userData.profileImage}
                                                    alt="Customer profile"
                                                    className="w-20 h-20 rounded-full object-cover border-2 border-orange-200"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* User Details */}
                                        <DetailItem label="Full Name" value={userData.name} />
                                        <DetailItem label="Email" value={userData.email} icon={Mail} />
                                        <DetailItem label="User ID" value={request.userId} />

                                        {/* Registration Date */}
                                        {userData.createdAt && (
                                            <DetailItem
                                                label="Member Since"
                                                value={new Date(userData.createdAt).toLocaleDateString()}
                                            />
                                        )}

                                        {/* Provider info */}
                                        {userData.provider && (
                                            <DetailItem
                                                label="Registered Via"
                                                value={userData.provider.charAt(0).toUpperCase() + userData.provider.slice(1)}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-4">
                                        <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                        <p className="text-gray-500 text-sm">User information not available</p>
                                        <p className="text-gray-400 text-xs mt-1">Email: {request.userEmail}</p>
                                        <p className="text-gray-400 text-xs">User ID: {request.userId}</p>
                                    </div>
                                )}

                                {/* Contact info from service request */}
                                <div className="pt-4 border-t">
                                    <DetailItem label="Service Phone" value={request.contactInfo?.phoneNumber} icon={Phone} />
                                    <DetailItem
                                        label="Alternate Phone"
                                        value={request.contactInfo?.alternatePhone || "Not provided"}
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
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <CalendarClock className="w-6 h-6 text-orange-500" />
                                <h2 className="text-xl font-semibold">Schedule & Budget</h2>
                            </div>

                            <div className="space-y-4">
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
                                <div className="pt-2 border-t">
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

                        {/* Timeline Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold mb-4">Request Timeline</h2>

                            <div className="space-y-4">
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

                        {/* Action Buttons */}
                        {request.status === 'pending' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold mb-4">Service Actions</h2>
                                <div className="grid gap-3">
                                    <button
                                        onClick={handleAcceptRequest}
                                        className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                                    >
                                        Accept Request
                                    </button>
                                    <button
                                        onClick={handleContactCustomer}
                                        className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Call Customer
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Status Info for non-pending requests */}
                        {request.status !== 'pending' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold mb-4">Request Status</h2>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">Current Status: <span className="font-medium">{statusInfo.label}</span></p>
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

            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="max-w-4xl max-h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white text-lg">Problem Image</h3>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="text-white hover:text-gray-300 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <img
                            src={selectedImage}
                            alt="Enlarged problem view"
                            className="max-w-full max-h-[80vh] object-contain rounded-lg"
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

// Reusable Detail Item Component
const DetailItem = ({ label, value, icon: Icon, capitalize = false, largeValue = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <div className="flex items-start gap-2">
            {Icon && <Icon className="w-4 h-4 text-gray-400 mt-0.5" />}
            <span className={`text-gray-900 ${capitalize ? 'capitalize' : ''} ${largeValue ? 'break-words' : ''}`}>
                {value || "Not provided"}
            </span>
        </div>
    </div>
);

// Timeline Item Component
const TimelineItem = ({ date, title, description, active = false, pending = false }) => (
    <div className="flex gap-3">
        <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full ${active ? 'bg-orange-500' : pending ? 'bg-gray-300' : 'bg-green-500'}`} />
            <div className="w-0.5 h-full bg-gray-200 mt-1" />
        </div>
        <div className="flex-1 pb-4">
            <p className="font-medium text-gray-900">{title}</p>
            <p className="text-sm text-gray-600">{description}</p>
            {date && (
                <p className="text-xs text-gray-500 mt-1">
                    {new Date(date).toLocaleDateString()} at {new Date(date).toLocaleTimeString()}
                </p>
            )}
        </div>
    </div>
);

export default ServiceRequestDetails;