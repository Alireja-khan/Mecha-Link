"use client";
import React, { useState, useEffect } from "react";
import { 
    Wrench, Clock, CheckCircle, MapPin, User, Building, Phone, 
    MessageCircle, Mail, Map, Calendar, DollarSign, Search, Filter,
    Eye, MessageSquare, Check, X
} from "lucide-react";
import Swal from "sweetalert2";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import Link from "next/link";

// --- Utility Components ---
const StatCard = ({ icon: Icon, value, label, color = "primary" }) => {
    const colorClasses = {
        primary: {
            bg: "bg-primary/10",
            bgHover: "group-hover:bg-primary/20",
            text: "text-primary"
        },
        success: {
            bg: "bg-success/10",
            bgHover: "group-hover:bg-success/20",
            text: "text-success"
        },
        error: {
            bg: "bg-error/10",
            bgHover: "group-hover:bg-error/20",
            text: "text-error"
        },
        warning: {
            bg: "bg-warning/10",
            bgHover: "group-hover:bg-warning/20",
            text: "text-warning"
        }
    };

    const classes = colorClasses[color] || colorClasses.primary;

    return (
        <div className="bg-base-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-neutral shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-xl ${classes.bg} ${classes.bgHover} transition-colors duration-300`}>
                    <Icon className={classes.text} size={20} />
                </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-base-content mb-1">{value}</p>
            <p className="text-base-content/70 text-xs sm:text-sm font-medium">{label}</p>
        </div>
    );
};

const MechanicRequestsPage = () => {
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const { user: loggedInUser } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (loggedInUser?._id) {
            fetchShopRequests();
        }
    }, [loggedInUser]);

    const fetchShopRequests = async () => {
        try {
            const response = await fetch(`/api/service-request/shop/${loggedInUser._id}`);
            if (response.ok) {
                const data = await response.json();
                setAcceptedRequests(data);
            } else {
                throw new Error('Failed to fetch shop requests');
            }
        } catch (error) {
            console.error('Error fetching shop service requests:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load your service requests',
                confirmButtonColor: 'var(--color-error)'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteRequest = async (requestId) => {
        const result = await Swal.fire({
            title: 'Complete Service?',
            text: 'Mark this service request as completed?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: 'var(--color-success)',
            cancelButtonColor: 'var(--color-error)',
            confirmButtonText: 'Yes, Complete',
            cancelButtonText: 'Cancel',
            background: 'var(--color-base-100)',
            color: 'var(--color-base-content)'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/service-request/${requestId}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        status: 'completed',
                        completedDate: new Date().toISOString()
                    })
                });

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Completed!',
                        text: 'Service marked as completed',
                        confirmButtonColor: 'var(--color-success)',
                        background: 'var(--color-base-100)',
                        color: 'var(--color-base-content)'
                    });
                    fetchShopRequests();
                } else {
                    throw new Error('Failed to complete service');
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to complete service',
                    confirmButtonColor: 'var(--color-error)',
                    background: 'var(--color-base-100)',
                    color: 'var(--color-base-content)'
                });
            }
        }
    };

    const handleContactCustomer = (phoneNumber) => {
        if (phoneNumber) {
            window.open(`tel:${phoneNumber}`, '_blank');
        }
    };

    const handleMessageContact = async (request) => {
        if (!request || !loggedInUser) return;

        const chatPayload = {
            serviceRequestId: request._id,
            customerId: request.userId,
            customerName: request.user?.name || request.user?.userName || "Customer",
            customerEmail: request.user?.email || request.userEmail,
            customerProfileImage: request.user?.profileImage || null,
            mechanicId: loggedInUser._id,
            mechanicName: loggedInUser.name || "Shop Owner",
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

            router.push(`/dashboard/${loggedInUser.role.toLowerCase()}/messages`);

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Chat Error',
                text: 'Failed to start chat with customer',
                confirmButtonColor: 'var(--color-error)',
                background: 'var(--color-base-100)',
                color: 'var(--color-base-content)'
            });
        }
    };

    const handleOpenMaps = (location) => {
        const { latitude, longitude } = location || {};
        const address = encodeURIComponent(location?.address || "Service Location");

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
                confirmButtonColor: 'var(--color-warning)',
                background: 'var(--color-base-100)',
                color: 'var(--color-base-content)'
            });
        }
    };

    // Filter requests based on search and status
    const filteredRequests = acceptedRequests.filter((request) => {
        const matchesSearch = 
            request.deviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.problemCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.location?.address?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Statistics
    const stats = {
        total: acceptedRequests.length,
        inProgress: acceptedRequests.filter(req => req.status === 'in-progress').length,
        completed: acceptedRequests.filter(req => req.status === 'completed').length,
        pending: acceptedRequests.filter(req => req.status === 'pending').length
    };

    // Status badge component
    const getStatusBadge = (status) => {
        const base = "px-2 sm:px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap";
        switch (status) {
            case "completed":
                return <span className={`${base} bg-success/10 text-success border-success/30`}>Completed</span>;
            case "in-progress":
                return <span className={`${base} bg-primary/10 text-primary border-primary/30`}>In Progress</span>;
            case "pending":
                return <span className={`${base} bg-warning/10 text-warning border-warning/30`}>Pending</span>;
            default:
                return <span className={`${base} bg-base-300 text-base-content/80 border-neutral/20`}>Unknown</span>;
        }
    };

    // Format date utility
    const formatDateShort = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    // Mobile Card Component
    const RequestMobileCard = ({ request }) => (
        <div className="bg-base-100 p-4 rounded-xl border border-neutral/50 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="flex items-start gap-3 mb-3 border-b border-neutral/50 pb-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-content font-bold text-sm flex-shrink-0">
                    {request.deviceType?.charAt(0) || "R"}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base-content truncate">{request.deviceType || 'Unknown Device'}</p>
                    <p className="text-xs text-base-content/70 truncate flex items-center gap-1">
                        <User size={12} className="text-base-content/40" />
                        {request.user?.name || request.user?.userName || 'Unknown Customer'}
                    </p>
                    <p className="text-xs text-base-content/70 truncate flex items-center gap-1">
                        <MapPin size={12} className="text-base-content/40" />
                        {request.location?.address?.split(',')[0] || 'Location N/A'}
                    </p>
                </div>
                <div className="flex-shrink-0">
                    {getStatusBadge(request.status)}
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-base-content/70">Category:</span>
                    <span className="text-base-content font-medium">{request.problemCategory}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-base-content/70">Schedule:</span>
                    <span className="text-base-content font-medium">
                        {request.preferredSchedule?.date ? 
                            formatDateShort(request.preferredSchedule.date) : 
                            'Not specified'
                        }
                    </span>
                </div>
                {request.estimatedBudget && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-base-content/70">Budget:</span>
                        <span className="text-base-content font-medium">
                            BDT {request.estimatedBudget.replace('-', ' - ')}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between pt-3 flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-base-content/60 flex items-center gap-1">
                        <Clock size={12} />
                        {formatDateShort(request.requestedDate)}
                    </span>
                </div>
                <div className="flex gap-2">
                    {request.status === 'in-progress' && (
                        <button
                            onClick={() => handleCompleteRequest(request._id)}
                            className="p-2 bg-success/10 text-success rounded-lg border border-success/20 hover:bg-success/20 transition-colors"
                            title="Mark Complete"
                        >
                            <Check size={16} />
                        </button>
                    )}
                    <button
                        onClick={() => handleMessageContact(request)}
                        className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors"
                        title="Message Customer"
                    >
                        <MessageCircle size={16} />
                    </button>
                    <Link
                        href={`/serviceReq/${request._id}`}
                        className="p-2 bg-secondary/10 text-secondary rounded-lg border border-secondary/20 hover:bg-secondary/20 transition-colors"
                        title="View Details"
                    >
                        <Eye size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-full bg-base-100">
                <span className="loading loading-bars loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full p-3 sm:p-4 lg:p-6 mx-auto bg-base-200">
            {/* Header */}
            <div className="mb-4 sm:mb-6 lg:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-1 sm:mb-2">Shop Service Requests</h1>
                <p className="text-base-content/70 text-sm sm:text-base lg:text-lg">
                    Manage all service requests accepted by your shop
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                <StatCard icon={Building} value={stats.total} label="Total Requests" color="primary" />
                <StatCard icon={Clock} value={stats.inProgress} label="In Progress" color="warning" />
                <StatCard icon={CheckCircle} value={stats.completed} label="Completed" color="success" />
                <StatCard icon={Wrench} value={stats.pending} label="Pending" color="error" />
            </div>

            {/* Main Content */}
            <div className="bg-base-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-neutral shadow-2xl">
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-3 w-full mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" size={18} />
                        <input
                            type="text"
                            placeholder="Search requests, customers, devices, or locations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 sm:py-3 border border-neutral rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-primary/50 w-full text-sm focus:outline-none text-base-content"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 sm:px-4 py-2.5 sm:py-3 border border-neutral rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-primary/50 text-sm focus:outline-none text-base-content"
                    >
                        <option value="all">All Statuses</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>

                {/* Mobile View */}
                <div className="block xl:hidden space-y-4">
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map(request => (
                            <RequestMobileCard key={request._id} request={request} />
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <Wrench size={48} className="mx-auto text-base-content/30" />
                            <p className="text-base-content/60 mt-4">No service requests found</p>
                            {acceptedRequests.length === 0 && (
                                <button
                                    onClick={() => router.push('/service-requests')}
                                    className="mt-4 bg-primary text-primary-content px-6 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-300"
                                >
                                    Browse Available Requests
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden xl:block rounded-2xl border border-neutral overflow-x-auto">
                    {filteredRequests.length > 0 ? (
                        <table className="min-w-full divide-y divide-neutral">
                            <thead className="bg-base-300">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Service Details</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Customer Info</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Location & Schedule</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Budget</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Status</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-base-content">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-base-100 divide-y divide-neutral">
                                {filteredRequests.map((request) => (
                                    <tr key={request._id} className="hover:bg-base-200/50 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-content font-bold text-sm">
                                                    {request.deviceType?.charAt(0) || "R"}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-base-content">{request.deviceType}</p>
                                                    <p className="text-sm text-base-content/70">{request.problemCategory}</p>
                                                    <Link
                                                        href={`/serviceReq/${request._id}`}
                                                        className="text-primary hover:text-secondary text-sm font-medium flex items-center gap-1 transition-colors duration-200 mt-1"
                                                    >
                                                        <Eye size={14} />
                                                        View details
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <User size={14} className="text-primary" />
                                                    <span className="text-sm text-base-content">
                                                        {request.user?.name || request.user?.userName || 'Not Provided'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} className="text-primary" />
                                                    <span className="text-sm text-base-content/70">
                                                        {request.user?.email || request.userEmail || 'Not Provided'}
                                                    </span>
                                                </div>
                                                {request.contactInfo?.phoneNumber && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={14} className="text-primary" />
                                                        <span className="text-sm text-base-content/70">
                                                            {request.contactInfo.phoneNumber}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} className="text-primary" />
                                                    <span className="text-sm text-base-content">
                                                        {request.location?.address || 'Address not provided'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-primary" />
                                                    <span className="text-sm text-base-content/70">
                                                        {request.preferredSchedule?.date ? 
                                                            formatDateShort(request.preferredSchedule.date) : 
                                                            'Date not specified'
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <DollarSign size={14} className="text-primary" />
                                                <span className="text-sm text-base-content font-medium">
                                                    {request.estimatedBudget ? 
                                                        `BDT ${request.estimatedBudget.replace('-', ' - ')}` : 
                                                        'Not specified'
                                                    }
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(request.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                {request.status === 'in-progress' && (
                                                    <button
                                                        onClick={() => handleCompleteRequest(request._id)}
                                                        className="p-2 bg-success/10 text-success rounded-xl border border-success/20 hover:bg-success/20 hover:scale-105 transition-all duration-200"
                                                        title="Mark Complete"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleMessageContact(request)}
                                                    className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/20 hover:bg-primary/20 hover:scale-105 transition-all duration-200"
                                                    title="Message Customer"
                                                >
                                                    <MessageCircle size={16} />
                                                </button>
                                                {request.contactInfo?.phoneNumber && (
                                                    <button
                                                        onClick={() => handleContactCustomer(request.contactInfo.phoneNumber)}
                                                        className="p-2 bg-info/10 text-info rounded-xl border border-info/20 hover:bg-info/20 hover:scale-105 transition-all duration-200"
                                                        title="Call Customer"
                                                    >
                                                        <Phone size={16} />
                                                    </button>
                                                )}
                                                {request.location && (
                                                    <button
                                                        onClick={() => handleOpenMaps(request.location)}
                                                        className="p-2 bg-warning/10 text-warning rounded-xl border border-warning/20 hover:bg-warning/20 hover:scale-105 transition-all duration-200"
                                                        title="Open Maps"
                                                    >
                                                        <Map size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                <Wrench className="text-base-content/30" size={48} />
                                <p className="text-base-content/60 text-lg">No service requests found</p>
                                {acceptedRequests.length === 0 && (
                                    <button
                                        onClick={() => router.push('/service-requests')}
                                        className="mt-4 bg-primary text-primary-content px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-300"
                                    >
                                        Browse Available Requests
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MechanicRequestsPage;