"use client";

import { Phone, Wrench, User, AlertTriangle, Eye, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ServiceReqCard = ({ request, mode = "summary", onStatusChange }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Safe value getter to prevent errors
  const getValue = (obj, path, defaultValue = "Not provided") => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj) || defaultValue;
  };

  const timeAgo = (date) => {
    if (!date) return "Recently";
    
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    
    for (const [unit, value] of Object.entries(intervals)) {
      const count = Math.floor(seconds / value);
      if (count >= 1) return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  };

  const formatDate = (date) => {
    if (!date) return "Date not available";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  console.log(request._id)
  
  const urgencyConfig = {
    low: { color: "text-green-600 bg-green-50 border border-green-200", label: "Low Priority", icon: Clock },
    medium: { color: "text-yellow-600 bg-yellow-50 border border-yellow-200", label: "Medium Priority", icon: AlertTriangle },
    high: { color: "text-orange-600 bg-orange-50 border border-orange-200", label: "High Priority", icon: AlertTriangle },
    emergency: { color: "text-red-600 bg-red-50 border border-red-200", label: "Emergency", icon: AlertTriangle },
  };

  const statusConfig = {
    pending: { color: "text-yellow-600 bg-yellow-50 border border-yellow-200", label: "Pending" },
    accepted: { color: "text-blue-600 bg-blue-50 border border-blue-200", label: "Accepted" },
    'in-progress': { color: "text-purple-600 bg-purple-50 border border-purple-200", label: "In Progress" },
    completed: { color: "text-green-600 bg-green-50 border border-green-200", label: "Completed" },
    cancelled: { color: "text-gray-600 bg-gray-50 border border-gray-200", label: "Cancelled" },
  };

  // Safe data extraction
  const urgency = getValue(request, 'serviceDetails.urgency', 'medium');
  const status = getValue(request, 'status', 'pending');
  const urgencyInfo = urgencyConfig[urgency] || urgencyConfig.medium;
  const statusInfo = statusConfig[status] || statusConfig.pending;

  const handleAcceptRequest = async () => {
    if (!request?._id) {
      console.error("No request ID available");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/service-request/${request._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "accepted",
          acceptedDate: new Date().toISOString(),
        }),
      });
      
      if (response.ok) {
        // Option 1: Reload page
        window.location.reload();
        // Option 2: Call callback if provided (uncomment below)
        // if (onStatusChange) onStatusChange(request._id, "accepted");
      } else {
        console.error("Failed to accept request");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = () => {
    if (request?._id) {
      router.push(`/service-requests/${request._id}`);
    }
  };

  // DetailItem component (safe rendering)
  const DetailItem = ({ label, value, icon: Icon, capitalize = false, largeValue = false }) => (
    <div className="space-y-1">
      {label && (
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="flex items-start gap-2">
        {Icon && <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />}
        <span className={`text-gray-900 ${capitalize ? 'capitalize' : ''} ${largeValue ? 'break-words' : ''}`}>
          {value || "Not provided"}
        </span>
      </div>
    </div>
  );

  // If no request object, show loading/error state
  if (!request) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-gray-900">
            {getValue(request, 'deviceType', 'Unknown Device')} - {getValue(request, 'serviceDetails.problemTitle', 'No title')}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            {formatDate(getValue(request, 'requestedDate'))}
            <span>•</span>
            <Clock className="w-4 h-4" />
            {timeAgo(getValue(request, 'requestedDate'))}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          {/* Status & Urgency Badges */}
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            {status === 'pending' && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${urgencyInfo.color}`}>
                {urgencyInfo.label}
              </span>
            )}
          </div>

            <Link
            href={`/serviceReq/${request._id}`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              <Eye className="w-4 h-4" />
              View Details
            </Link>
        
        </div>
      </div>

      {/* Service Info Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <DetailItem 
          label="Device Type" 
          value={getValue(request, 'deviceType')} 
          icon={Wrench}
          capitalize 
        />
        <DetailItem 
          label="Problem Category" 
          value={getValue(request, 'problemCategory')} 
          capitalize 
        />
        <DetailItem 
          label="Brand" 
          value={getValue(request, 'vehicleInfo.brand')} 
        />
        <DetailItem 
          label="Model" 
          value={getValue(request, 'vehicleInfo.model')} 
        />
      </div>

      {/* Problem Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">Problem Description</h2>
        </div>
        <DetailItem value={getValue(request, 'serviceDetails.problemTitle')} largeValue />
      </div>

      {/* Customer Info - Only in detail mode */}
      {mode === "detail" && (
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <DetailItem
              label="Service Phone"
              value={getValue(request, 'contactInfo.phoneNumber')}
              icon={Phone}
            />
            <DetailItem
              label="Alternate Phone"
              value={getValue(request, 'contactInfo.alternatePhone')}
            />
          </div>
          
          {getValue(request, 'contactInfo.specialInstructions') !== "Not provided" && (
            <div className="mt-4">
              <DetailItem
                label="Special Instructions"
                value={getValue(request, 'contactInfo.specialInstructions')}
                largeValue
              />
            </div>
          )}
        </div>
      )}

      {/* Actions - Only in detail mode for pending requests */}
      {mode === "detail" && status === "pending" && (
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Actions</h2>
          <button
            onClick={handleAcceptRequest}
            disabled={isLoading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Accepting..." : "Accept Request"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceReqCard;