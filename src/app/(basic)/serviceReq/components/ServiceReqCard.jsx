"use client";

import { Phone, Wrench, User, AlertTriangle, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const ServiceReqCard = ({ request, mode = "summary" }) => {
  const router = useRouter();

  const timeAgo = (date) => {
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

  const urgencyConfig = {
    low: { color: "text-green-600 bg-green-50", label: "Low Priority" },
    medium: { color: "text-yellow-600 bg-yellow-50", label: "Medium Priority" },
    high: { color: "text-orange-600 bg-orange-50", label: "High Priority" },
    emergency: { color: "text-red-600 bg-red-50", label: "Emergency" },
  };

  const urgencyInfo =
    urgencyConfig[request.serviceDetails?.urgency] || urgencyConfig.medium;

  const handleAcceptRequest = async () => {
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
        window.location.reload();
      } else {
        console.error("Failed to accept request");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleViewDetails = (id) => {
    router.push(`/service-requests/${id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {request.deviceType} - {request.serviceDetails?.problemTitle}
          </h1>
          <p className="text-gray-600">{timeAgo(request.requestedDate)}</p>
        </div>

        {mode === "summary" && (
          <button
            onClick={() => handleViewDetails(request._id)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
        )}
      </div>

      {/* Service Info */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <DetailItem label="Device Type" value={request.deviceType} capitalize />
        <DetailItem
          label="Problem Category"
          value={request.problemCategory}
          capitalize
        />
        <DetailItem label="Brand" value={request.vehicleInfo?.brand} />
        <DetailItem
          label="Model"
          value={request.vehicleInfo?.model || "Not provided"}
        />
      </div>

      {/* Problem Info */}
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="w-6 h-6 text-orange-500" />
        <h2 className="text-lg font-semibold">Problem</h2>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${urgencyInfo.color}`}
        >
          {urgencyInfo.label}
        </span>
      </div>
      <DetailItem value={request.serviceDetails?.problemTitle} largeValue />

      {/* Customer Info (only in detail mode) */}
      {mode === "detail" && (
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-orange-500" />
            <h2 className="text-lg font-semibold">Customer Information</h2>
          </div>
          <DetailItem
            label="Service Phone"
            value={request.contactInfo?.phoneNumber}
            icon={Phone}
          />
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
      )}

      {/* Actions */}
      {mode === "detail" && request.status === "pending" && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Service Actions</h2>
          <button
            onClick={handleAcceptRequest}
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Accept Request
          </button>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({
  label,
  value,
  icon: Icon,
  capitalize = false,
  largeValue = false,
}) => (
  <div className="mb-2">
    {label && (
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
    )}
    <div className="flex items-start gap-2">
      {Icon && <Icon className="w-4 h-4 text-gray-400 mt-0.5" />}
      <span
        className={`text-gray-900 ${capitalize ? "capitalize" : ""} ${
          largeValue ? "break-words" : ""
        }`}
      >
        {value || "Not provided"}
      </span>
    </div>
  </div>
);

export default ServiceReqCard;
