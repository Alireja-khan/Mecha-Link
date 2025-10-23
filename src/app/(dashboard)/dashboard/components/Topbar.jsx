"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Wrench,
  ClipboardList,
  Menu,
  AlertTriangle,
  CheckCircle,
  CreditCard,
  Sparkles,
  X,
} from "lucide-react";
import useUser from "@/hooks/useUser";
import NotificationWidget from "@/app/shared/NotificationWidget";
import ToggleTheme from "../../../shared/ToggleTheme";
import { useRouter } from "next/navigation";
import CartIcon from "@/app/shared/cartIcon";

const transitionClasses = "transition duration-200 ease-in-out";

// ✅ User Dropdown Component
const UserDropdown = ({ loggedInUser, roleConfig }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoleBadgeStyles = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-500 text-white border-red-600";
      case "mechanic":
        return "bg-blue-500 text-white border-blue-600";
      default:
        return "bg-orange-500 text-white border-orange-600";
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="relative flex items-center gap-2 sm:gap-3 cursor-pointer px-1.5 py-1.5 xl:px-2 xl:py-2 rounded-full hover-lift transition-all duration-200 flex-shrink"
      onClick={() => setDropdownOpen((prev) => !prev)}
    >
      {loggedInUser && (
        <div className="relative flex-shrink-0">
          <img
            src={
              loggedInUser.profileImage
                ? loggedInUser.profileImage
                : `https://ui-avatars.com/api/?name=${loggedInUser.name}&background=f97316&color=fff&bold=true`
            }
            alt={loggedInUser.name || "User Avatar"}
            className="aspect-square rounded-full object-cover border-2 border-primary transition-all duration-200 w-10 h-10"
          />
        </div>
      )}

      {loggedInUser?.role && (
        <div className="hidden lg:flex flex-col text-left justify-center min-w-0">
          <span className="text-sm font-semibold truncate text-base-content">
            {loggedInUser.name || "Unknown"}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-md self-start ${getRoleBadgeStyles(
              loggedInUser.role
            )}`}
          >
            {loggedInUser.role.charAt(0).toUpperCase() +
              loggedInUser.role.slice(1)}
          </span>
        </div>
      )}
    </div>
  );
};

// ✅ Payment Reminder Component for Mechanics with Tooltip
const PaymentReminder = ({ paymentStatus, onPayClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (paymentStatus) {
    return (
      <div className="relative" ref={tooltipRef}>
        <div
          className="flex items-center gap-2 px-4 py-2 bg-success/20 text-success rounded-xl border border-success/30 cursor-help"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Sparkles size={18} className="text-success" />
          <span className="text-sm font-semibold">Shop Active! 🎉</span>
          <CheckCircle size={16} className="text-success" />
        </div>

        {/* Tooltip for Paid Status */}
        {showTooltip && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 z-50">
            <div className="bg-base-100 rounded-xl p-4 border border-base-300 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-base-content">Payment Verified</h3>
                <button
                  onClick={() => setShowTooltip(false)}
                  className="text-base-content/50 hover:text-base-content"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-sm text-base-content/70 mb-3">
                Your shop is fully activated and visible to customers. Thank you for your payment!
              </p>
              <div className="flex items-center gap-2 text-success text-sm">
                <CheckCircle size={16} />
                <span>Valid until: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!paymentStatus) {
    return (
      <div className="relative" ref={tooltipRef}>
        <div
          className="flex items-center gap-2 px-4 py-2 bg-error/20 text-error rounded-xl border border-error/30 hover:bg-error/30 hover:scale-105 transition-all duration-300 animate-pulse cursor-pointer"
          onClick={onPayClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <AlertTriangle size={18} className="text-error" />
          <span className="text-sm font-semibold">Payment Required</span>
          <CreditCard size={16} className="text-error" />
        </div>

        {/* Tooltip for Pending Payment */}
        {showTooltip && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 z-50">
            <div className="bg-base-100 rounded-xl p-4 border border-base-300 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base-content">Complete Your Payment</h3>
                {/* <button
                  onClick={() => setShowTooltip(false)}
                  className="text-base-content/50 hover:text-base-content"
                >
                  <X size={14} />
                </button> */}
              </div>
              <p className="text-sm text-base-content/70 mb-4">
                Activate your shop listing by completing the payment. Your shop will be visible to customers after payment verification.
              </p>
              <div className="space-y-2 text-sm text-base-content/70">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-error rounded-full"></div>
                  <span>Amount: <strong className="text-base-content">৳1000.00</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-error rounded-full"></div>
                  <span>One-time activation fee</span>
                </div>
              </div>
              {/* <button
                onClick={onPayClick}
                className="w-full mt-4 btn btn-error btn-sm gap-2 hover:scale-105 transition-transform duration-200"
              >
                <CreditCard size={16} />
                Pay Now - ৳1000.00
              </button> */}
            </div>
          </div>
        )}
      </div>
    );
  }


  return null;
};

// ✅ Updated Topbar with increased size
const Topbar = ({ pageTitle = "Dashboard", setIsMobileOpen }) => {
  const { user: loggedInUser } = useUser();
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch shop data for mechanics to check payment status
  useEffect(() => {
    const fetchShopData = async () => {
      if (loggedInUser?.role === 'mechanic' && loggedInUser?.email) {
        try {
          setLoading(true);
          const response = await fetch(`/api/shops?email=${loggedInUser.email}`);
          if (response.ok) {
            const data = await response.json();
            // Handle array response
            if (Array.isArray(data) && data.length > 0) {
              setShopData(data[0]);
            } else {
              setShopData(data);
            }
          }
        } catch (error) {
          console.error("Error fetching shop data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchShopData();
  }, [loggedInUser]);

  const getRoleStyles = (role) => {
    switch (role) {
      case "admin":
        return {
          badgeColor: "bg-red-100 text-red-600 border-red-400",
          actionText: "Manage Users",
          actionIcon: <Users size={18} />,
          btnBg: "bg-red-600 hover:bg-red-700 shadow-red-300/50",
        };
      case "mechanic":
        return {
          badgeColor: "bg-blue-100 text-blue-600 border-blue-400",
          actionText: "Service Requests",
          actionIcon: <Wrench size={18} />,
          btnBg: "bg-blue-600 hover:bg-blue-700 shadow-blue-300/50",
        };
      default:
        return {
          badgeColor: "bg-orange-100 text-orange-600 border-orange-400",
          actionText: "New Booking",
          actionIcon: <ClipboardList size={18} />,
          btnBg: "bg-orange-600 hover:bg-orange-700 shadow-orange-300/50",
        };
    }
  };

  const roleConfig = loggedInUser ? getRoleStyles(loggedInUser.role) : null;

  // Handle payment click - navigate to shop profile or payment page
  const handlePayClick = () => {
    router.push("/dashboard/mechanic/profile");
  };

  return (
    <header className="sticky top-0 z-15 flex items-center justify-between px-4 sm:px-8 md:px-10 py-3 sm:py-2.5 border-b border-neutral bg-base-100">
      <div className="flex items-center gap-4">
        {/* ✅ Hamburger Button */}
        <button
          className="p-1 rounded-lg text-base-content hover:bg-base-200 hover:text-primary transition duration-150 2xl:hidden"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu size={26} />
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-base-content truncate">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Payment Reminder for Mechanics */}
        {loggedInUser?.role === 'mechanic' && !loading && (
          <PaymentReminder
            paymentStatus={shopData?.paymentInfo}
            onPayClick={handlePayClick}
          />
        )}

        <CartIcon/>
        <ToggleTheme />

        {/* Notification Widget */}
        {loggedInUser && <NotificationWidget loggedInUser={loggedInUser} />}

        {roleConfig && (
          <button
            className={`hidden md:flex px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-white text-sm sm:text-base font-semibold transition items-center gap-2 shadow-md ${roleConfig.btnBg}`}
            title={roleConfig.actionText}
          >
            {roleConfig.actionIcon}
            <span className="hidden md:block">{roleConfig.actionText}</span>
          </button>
        )}

        {loggedInUser && (
          <UserDropdown
            loggedInUser={loggedInUser}
            roleConfig={roleConfig}
          />
        )}
      </div>
    </header>
  );
};

export default Topbar;