"use client";

import useUser from "@/hooks/useUser";
import {
  Wrench,
  AlertTriangle,
  Eye,
  Clock,
  Zap,
  User,
  Mail,
  CheckCircle,
  Circle,
  Phone,
  MoreVertical,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

const ServiceReqCard = ({ request }) => {
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const { user: loggedInUser } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!request?.userEmail) return;
      setLoadingUser(true);
      try {
        const response = await fetch(
          `/api/users?email=${encodeURIComponent(request.userEmail)}`
        );
        if (response.ok) {
          const user = await response.json();
          setUserData(Array.isArray(user) ? user[0] : user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, [request?.userEmail]);

  const getValue = (obj, path, defaultValue = "N/A") =>
    path.split(".").reduce((acc, key) => acc?.[key], obj) || defaultValue;

  const timeAgo = (date) => {
    if (!date) return "Recently";
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);
    const intervals = { year: 31536000, month: 2592000, day: 86400, hour: 3600, minute: 60 };
    for (const [unit, value] of Object.entries(intervals)) {
      const count = Math.floor(seconds / value);
      if (count >= 1) return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      : "N/A";

  const urgencyConfig = {
    low: { color: "text-green-500", label: "Low Priority", icon: Clock },
    medium: { color: "text-yellow-500", label: "Medium Priority", icon: AlertTriangle },
    high: { color: "text-orange-500", label: "High Priority", icon: Zap },
    emergency: { color: "text-red-600", label: "Emergency", icon: Zap },
  };

  const statusSteps = [
    { key: "pending", label: "Pending" },
    { key: "in-progress", label: "In Progress" },
    { key: "completed", label: "Completed" },
  ];

  const urgency = getValue(request, "serviceDetails.urgency", "medium").toLowerCase();
  const status = getValue(request, "status", "pending").toLowerCase();
  const urgencyInfo = urgencyConfig[urgency] || urgencyConfig.medium;
  const currentStatusIndex = statusSteps.findIndex((step) => step.key === status);

  const DetailItem = ({ label, value, icon: Icon }) => (
    <div className="space-y-1 break-words">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-2 text-sm">
        {Icon && <Icon className="w-4 h-4 text-orange-400 flex-shrink-0" />}
        <span className="font-medium">{value}</span>
      </div>
    </div>
  );

  const StatusTracker = () => (
    <div className="w-full">
      <h4 className="text-xs font-bold uppercase tracking-widest text-base-content/60 mb-3">
        Status Tracking
      </h4>
      <div className="space-y-3">
        {statusSteps.map((step, index) => {
          const isCompleted = index < currentStatusIndex;
          const isCurrent = index === currentStatusIndex;
          return (
            <div key={step.key} className="flex items-center gap-3">
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full border-2 flex-shrink-0 ${isCompleted
                  ? "bg-success border-success text-white"
                  : isCurrent
                    ? "border-primary text-primary bg-base-100"
                    : "border-gray-300 text-gray-400 bg-gray-100"
                  }`}
              >
                {isCompleted || isCurrent ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-sm font-medium ${isCompleted
                  ? "text-green-600"
                  : isCurrent
                    ? "text-orange-500 font-semibold"
                    : "text-gray-400"
                  }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const UserInfo = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [loadingChat, setLoadingChat] = useState(false);

    const Avatar = ({ src, alt, fallbackLetter }) => {
      const [imageError, setImageError] = useState(false);
      useEffect(() => setImageError(false), [src]);
      return (
        <div className="w-10 h-10 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center">
          {src && !imageError ? (
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-orange-500 font-semibold text-lg">{fallbackLetter}</span>
          )}
        </div>
      );
    };

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loadingUser)
      return (
        <div className="flex items-center gap-3 p-3 bg-base-100 rounded-xl border border-base-300 animate-pulse">
          <div className="skeleton w-10 h-10 bg-base-200 rounded-full" />
          <div className="space-y-2">
            <div className="skeleton h-3 bg-base-200 rounded w-24" />
            <div className="skeleton h-3 bg-base-200 rounded w-32" />
          </div>
        </div>
      );

    const name = userData?.name || "Customer";
    const email = userData?.email || "no-email@example.com";
    const profileImage = userData?.profileImage;
    const fallbackLetter = name[0]?.toUpperCase();

    return (
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center gap-3 p-3 bg-base-100 rounded-xl border border-base-300 shadow-sm overflow-hidden">
          <Avatar src={profileImage} alt={name} fallbackLetter={fallbackLetter} />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base-content truncate">{name}</p>
            <p className="text-sm text-base-content/60 truncate flex items-center gap-1">
              <Mail className="w-3 h-3" /> {email}
            </p>
          </div>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-1 rounded-full hover:bg-base-200 transition"
          >
            <MoreVertical className="w-4 h-4 text-base-content/60" />
          </button>
        </div>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-44 bg-base-100 border border-neutral rounded-lg shadow-lg overflow-hidden z-20">
            <button
              onClick={() => alert("Message sent!")}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-base-content/5 w-full text-base-content"
            >
              <MessageSquare className="w-4 h-4 text-primary" /> Send Message
            </button>
            <Link
              href={`/profile/${userData?._id || "#"}`}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-base-content/5 w-full text-base-content"
            >
              <User className="w-4 h-4 text-primary" /> View Profile
            </Link>
          </div>
        )}
      </div>
    );
  };

  if (!request)
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row border border-neutral rounded-2xl shadow-md overflow-hidden transition-all duration-300 bg-base-200">
      {/* LEFT SIDE */}
      <div className="w-full md:w-64 flex flex-col justify-between gap-5 p-5 border-b md:border-b-0 md:border-r border-neutral overflow-hidden">
        <UserInfo />
        <StatusTracker />
        <div className="pt-2 text-sm text-base-content/60 border-t border-neutral">
          <p className="font-semibold">{formatDate(request.requestedDate)}</p>
          <p>{timeAgo(request.requestedDate)}</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 p-5 md:p-8 flex flex-col">
        <div className="flex-1">
          {/* TOP CONTENT */}
          <div className="pb-4 border-b border-neutral mb-5">
            <h2 className="text-xl text-base-content md:text-2xl font-extrabold leading-snug col-span-1 capitalize">
              {getValue(request, "deviceType")} -{" "}
              {getValue(request, "serviceDetails.problemTitle")}
            </h2>
            <p className={`text-sm font-medium mt-1 flex items-center gap-1 ${urgencyInfo.color}`}>
              <urgencyInfo.icon className="w-4 h-4" />
              Urgency: {urgencyInfo.label}
            </p>
            <p className="mt-2 text-base-content/60 text-sm">
              <strong className="text-base-content">Location:</strong> {request.location?.address || "N/A"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            <DetailItem label="Device Type" value={getValue(request, "deviceType")} icon={Wrench} />
            <DetailItem label="Category" value={getValue(request, "problemCategory")} />
            <DetailItem
              label="Brand"
              value={getValue(request, "serviceDetails.vehicleInfo.brand")}
            />
          </div>

          <div className="p-4 border-l-4 border-secondary rounded-lg bg-secondary/10">
            <h3 className="text-sm font-bold text-base-content uppercase mb-2">
              Detailed Problem
            </h3>
            <p className="text-sm text-base-content/60 leading-relaxed break-words">
              {(() => {
                const desc = getValue(request, "serviceDetails.description", "No detailed description provided.");
                const words = desc.split(" ");
                return words.length > 30 ? words.slice(0, 30).join(" ") + "..." : desc;
              })()}
            </p>
          </div>
        </div>

        {/* BUTTON ALWAYS AT BOTTOM */}
        <div className="mt-6 flex justify-end">
          <Link
            href={`/serviceReq/${request._id}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition shadow-md text-sm font-semibold"
          >
            <Eye className="w-4 h-4" /> View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceReqCard;
