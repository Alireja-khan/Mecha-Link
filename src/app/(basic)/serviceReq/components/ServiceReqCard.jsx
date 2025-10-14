"use client";

import { Wrench, AlertTriangle, Eye, Clock, Zap, HardHat, User, Mail, CheckCircle, Circle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
// import Loading from "../../../Components/Loading"

const ServiceReqCard = ({ request }) => {
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  // const [loading, setLoading] = useState(true);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (!request?.userEmail) return;

      setLoadingUser(true);
      try {
        const response = await fetch(`/api/users?email=${encodeURIComponent(request.userEmail)}`);
        if (response.ok) {
          const user = await response.json();
          setUserData(user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, [request?.userEmail]);

  const getValue = (obj, path, defaultValue = "N/A") => {
    return (
      path.split(".").reduce((acc, key) => acc?.[key], obj) || defaultValue
    );
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
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // --- Configuration (Orange/Yellow Focus) ---

  const urgencyConfig = {
    low: { color: "text-green-500", bg: "bg-green-50", label: "Low Priority", icon: Clock },
    medium: { color: "text-yellow-500", bg: "bg-yellow-50", label: "Medium Priority", icon: AlertTriangle },
    high: { color: "text-orange-500", bg: "bg-orange-50", label: "High Priority", icon: Zap, },
    emergency: { color: "text-red-600", bg: "bg-red-50", label: "Emergency", icon: Zap, },
  };

  const statusConfig = {
    pending: { color: "text-blue-500", bg: "bg-amber-100", label: "Pending" },
    "in-progress": { color: "text-blue-600", bg: "bg-orange-100", label: "In Progress" },
    completed: { color: "text-green-600", bg: "bg-green-100", label: "Completed" },
    cancelled: { color: "text-gray-500", bg: "bg-gray-100", label: "Cancelled" },
  };

  // Status tracking steps in order
  const statusSteps = [
    { key: 'pending', label: 'Pending' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' }
  ];

  // Safe data extraction
  const urgency = getValue(
    request,
    "serviceDetails.urgency",
    "medium"
  ).toLowerCase();
  const status = getValue(request, "status", "pending").toLowerCase();
  const urgencyInfo = urgencyConfig[urgency] || urgencyConfig.medium;
  const statusInfo = statusConfig[status] || statusConfig.pending;

  // Get current status index
  const currentStatusIndex = statusSteps.findIndex(step => step.key === status);

  // --- Sub-Components ---

  const DetailItem = ({ label, value, icon: Icon, capitalize = false, largeValue = false,
  }) => (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-orange-400 flex-shrink-0" />}
        <span
          className={`font-medium ${capitalize ? "capitalize" : ""
            } ${largeValue ? "text-base break-words" : "text-sm"}`}
        >
          {value}
        </span>
      </div>
    </div>
  );

  // Vertical Status Tracker Component
  const StatusTracker = () => (
    <div className="w-full">
      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
        Status Tracking
      </h4>
      <div className="space-y-3">
        {statusSteps.map((step, index) => {
          const isCompleted = index < currentStatusIndex; // Previous steps are completed
          const isCurrent = index === currentStatusIndex; // Current step
          const isFuture = index > currentStatusIndex; // Future steps

          return (
            <div key={step.key} className="flex items-center gap-3">
              {/* Status Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${isCompleted
                ? 'bg-green-500 border-green-500 text-white' // Green for completed steps
                : isCurrent
                  ? 'border-orange-500 bg-white text-orange-500' // Orange for current step
                  : 'border-gray-300 bg-gray-100 text-gray-400' // Gray for future steps
                }`}>
                {isCompleted || isCurrent ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>

              {/* Status Label */}
              <div className="flex-1">
                <span className={`text-sm font-medium ${isCompleted
                  ? 'text-green-600' // Green text for completed steps
                  : isCurrent
                    ? 'text-orange-500 font-semibold' // Orange text for current step
                    : 'text-gray-400' // Gray text for future steps
                  }`}>
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // User info component
  const UserInfo = () => {
    if (loadingUser) {
      return (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-pulse">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      );
    }

    if (!userData) {
      return (
        <div className="flex items-center gap-3 p-3 bg-orange-50 truncate rounded-lg border border-orange-200">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="font-medium text-orange-800">Customer</p>
            <p className="text-sm text-orange-600 flex items-center truncate gap-1">
              <Mail className="w-3 h-3" />
              {request?.userEmail || "No email"}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-primary shadow-sm">
        {userData.profileImage ? (
          <img
            src={userData.profileImage}
            alt={userData.name || "Customer"}
            className="w-10 h-10 rounded-full object-cover border-2 border-orange-200"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`${userData.profileImage ? '' : 'w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center'}`}
          style={{ display: userData.profileImage ? 'none' : 'flex' }}>
          <User className="w-5 h-5 text-orange-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {userData.name || userData.userName || "Customer"}
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-1 truncate">
            <Mail className="w-3 h-3 flex-shrink-0" />
            {userData.email || request?.userEmail}
          </p>
          {userData.phone && (
            <p className="text-xs text-gray-500 mt-1">
              📞 {userData.phone}
            </p>
          )}
        </div>
      </div>
    );
  };

  // --- Main Render ---

  if (!request) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      </div>
    );
  }

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Loading></Loading>
  //     </div>
  //   );
  // }


  return (
    <>
      <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden border border-primary transition-all duration-300">
        {/* 1. UNIQUE LEFT PANEL: User Info, Status and Date/Time */}
        <div className="flex-shrink-0 w-full md:w-64 border-r border-primary p-6 md:p-6 flex md:flex-col justify-between items-center md:items-start space-y-4">
          {/* User Information */}
          <div className="order-1 md:order-none w-full">
            <UserInfo />
          </div>

          {/* Status Tracker - Replaces the Status Badge */}
          <div className="order-2 md:order-none w-full mt-4">
            <StatusTracker />
          </div>

          {/* Time & Date */}
          <div className="order-3 md:order-none text-right md:text-left text-sm opacity-90 w-full mt-4">
            <p className="font-semibold">
              {formatDate(getValue(request, "requestedDate"))}
            </p>
            <p className="font-light">
              {timeAgo(getValue(request, "requestedDate"))}
            </p>
          </div>
        </div>

        {/* 2. MAIN CONTENT AREA */}
        <div className="flex-1 p-6 md:p-8">
          {/* Header / Title Section */}
          <div className="flex justify-between items-start gap-4 pb-4 border-b border-primary mb-6">
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold leading-snug capitalize">
                    {getValue(request, "deviceType")} -{" "}
                    {getValue(request, "serviceDetails.problemTitle")}
                  </h2>
                  <p
                    className={`text-sm font-medium mt-1 ${urgencyInfo.color} flex items-center gap-1`}
                  >
                    <urgencyInfo.icon className="w-4 h-4" />
                    Urgency: {urgencyInfo.label}
                  </p>
                  <div>
                    <p className="mt-2 truncate">
                      <strong>Location:</strong> {request.location?.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service & Vehicle Info Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <DetailItem
              label="Device Type"
              value={getValue(request, "deviceType")}
              icon={Wrench}
              capitalize
            />
            <DetailItem
              label="Category"
              value={getValue(request, "problemCategory")}
              capitalize
            />
            <DetailItem
              label="Brand"
              value={getValue(request, "serviceDetails.vehicleInfo.brand")}
            />
            <DetailItem
              label="Model"
              value={getValue(request, "serviceDetails.vehicleInfo.model")}
            />
          </div>

          {/* Problem Description Block */}
          <div className="p-4 border border-l-4 border-orange-300 rounded-lg mb-6">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">
              Detailed Problem
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm line-clamp-2">
              {getValue(
                request,
                "serviceDetails.description",
                "No detailed description provided."
              )}
            </p>
          </div>

          {/* Details Button - Moved under Problem Description */}
          <div className="flex justify-end">
            <Link
              href={`/serviceReq/${request._id}`}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-semibold shadow-lg"
            >
              <Eye className="w-4 h-4" />
              View Details
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceReqCard;