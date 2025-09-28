"use client";

import {  Wrench, AlertTriangle, Eye, Clock, Zap, HardHat } from "lucide-react";
import Link from "next/link";

const ServiceReqCard = ({ request }) => {

  const getValue = (obj, path, defaultValue = "N/A") => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj) || defaultValue;
  };

  const timeAgo = (date) => {
    if (!date) return "Recently";
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
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
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // --- Configuration (Orange/Yellow Focus) ---

  const urgencyConfig = {
    low: { color: "text-green-500", bg: "bg-green-50", label: "Low Priority", icon: Clock },
    medium: { color: "text-yellow-500", bg: "bg-yellow-50", label: "Medium Priority", icon: AlertTriangle },
    high: { color: "text-orange-500", bg: "bg-orange-50", label: "High Priority", icon: Zap },
    emergency: { color: "text-red-600", bg: "bg-red-50", label: "Emergency", icon: Zap },
  };

  const statusConfig = {
    pending: { color: "text-blue-500", bg: "bg-amber-100", label: "Pending" },
    accepted: { color: "text-indigo-500", bg: "bg-indigo-100", label: "Accepted" },
    'in-progress': { color: "text-blue-600", bg: "bg-orange-100", label: "In Progress" },
    completed: { color: "text-green-600", bg: "bg-green-100", label: "Completed" },
    cancelled: { color: "text-gray-500", bg: "bg-gray-100", label: "Cancelled" },
  };

  // Safe data extraction
  const urgency = getValue(request, 'serviceDetails.urgency', 'medium').toLowerCase();
  const status = getValue(request, 'status', 'pending').toLowerCase();
  const urgencyInfo = urgencyConfig[urgency] || urgencyConfig.medium;
  const statusInfo = statusConfig[status] || statusConfig.pending;
  


  // --- Sub-Components ---

  const DetailItem = ({ label, value, icon: Icon, capitalize = false, largeValue = false }) => (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-orange-400 flex-shrink-0" />}
        <span className={`text-gray-800 font-medium ${capitalize ? 'capitalize' : ''} ${largeValue ? 'text-base break-words' : 'text-sm'}`}>
          {value}
        </span>
      </div>
    </div>
  );

  // --- Main Render ---

  if (!request) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      </div>
    );
  }

  return (
      <>
        <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">

          {/* 1. UNIQUE LEFT PANEL: Status and Date/Time */}
          <div className="flex-shrink-0 w-full md:w-56 bg-orange-600 text-white p-6 md:p-8 flex md:flex-col justify-between items-center md:items-start space-y-4">

            {/* Status Badge */}
            <div className="order-1 md:order-none text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">Request Status</span>
              <div className="mt-1 text-2xl font-extrabold flex items-center gap-2">
                <HardHat className="w-6 h-6" />
                {statusInfo.label}
              </div>
            </div>

            {/* Time & Date */}
            <div className="order-3 md:order-none text-right md:text-left text-sm opacity-90">
              <p className="font-semibold">{formatDate(getValue(request, 'requestedDate'))}</p>
              <p className="font-light">{timeAgo(getValue(request, 'requestedDate'))}</p>
            </div>
          </div>

          {/* 2. MAIN CONTENT AREA */}
          <div className="flex-1 p-6 md:p-8">

            {/* Header / Title Section */}
            <div className="flex justify-between items-start gap-4 pb-4 border-b border-gray-100 mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 leading-snug capitalize">
                  {getValue(request, 'deviceType')} - {getValue(request, 'serviceDetails.problemTitle')}
                </h2>
                <p className={`text-sm font-medium mt-1 ${urgencyInfo.color} flex items-center gap-1`}>
                  <urgencyInfo.icon className="w-4 h-4" />
                  Urgency: {urgencyInfo.label}
                </p>
                <p className="mt-2"><strong>Location:</strong> {request.location.address}</p>
              </div>

              {/* Action Button - FIXED: Using correct URL */}
              <Link
                href={`/serviceReq/${request._id}`}
                className="flex items-center gap-2 px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold shadow-lg"
              >
                <Eye className="w-4 h-4" />
                View Details
              </Link>
            </div>

            {/* Service & Vehicle Info Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <DetailItem
                label="Device Type"
                value={getValue(request, 'deviceType')}
                icon={Wrench}
                capitalize
              />
              <DetailItem
                label="Category"
                value={getValue(request, 'problemCategory')}
                capitalize
              />
              <DetailItem
                label="Brand"
                value={getValue(request, 'serviceDetails.vehicleInfo.brand')}
              />
              <DetailItem
                label="Model"
                value={getValue(request, 'serviceDetails.vehicleInfo.model')}
              />
            </div>

            {/* Problem Description Block */}
            <div className=" p-4 bg-gray-50 border-l-4 border-orange-300 rounded-lg">
              <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Detailed Problem</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                {getValue(request, 'serviceDetails.description', 'No detailed description provided.')}
              </p>
            </div>

          </div>
        </div>
      </>
  );
};

export default ServiceReqCard;