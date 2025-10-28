"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Image from "next/image";
import {
  Check, Headset, Share2, UserPlus, MapPin, Clock, Phone, Mail, Star, Award, Calendar, Navigation, Users, Car, Bike, Truck, Zap, Facebook, MessageSquare, Wrench
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReviewShow from "../ReviewShow";
import RatingForm from "../RatingForm";
import useUser from "@/hooks/useUser";
import Swal from "sweetalert2";
import { FaWhatsapp } from "react-icons/fa6";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from "react-share";

// === LEAFLET CONFIG ===
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// === CONSTANTS ===
const serviceIcons = {
  "Car Service & Repair": <Car className="w-5 h-5" />,
  "Motorcycle Service & Repair": <Bike className="w-5 h-5" />,
  "Truck/Commercial Vehicle Service": <Truck className="w-5 h-5" />,
  "Home Appliance Repair": <Zap className="w-5 h-5" />,
  "HVAC & Cooling Specialist": <Zap className="w-5 h-5" />,
  "Car Detailing & Accessories": <Car className="w-5 h-5" />,
};

const gradientClasses = {
  "Car Service & Repair": "from-primary to-orange-600",
  "Motorcycle Service & Repair": "from-orange-600 to-orange-700",
  "Truck/Commercial Vehicle Service": "from-blue-500 to-blue-600",
  "Home Appliance Repair": "from-green-500 to-green-600",
  "HVAC & Cooling Specialist": "from-purple-500 to-purple-600",
  "Car Detailing & Accessories": "from-teal-500 to-teal-600",
};

// === SKELETON LOADING COMPONENTS (Adjusted for better mobile/desktop sizing) ===
const HeroSkeleton = () => (
  <div className="relative bg-gradient-to-r from-primary via-orange-600 to-red-600 overflow-hidden text-white py-10 sm:py-12">
    <div className="absolute inset-0 bg-black/10"></div>
    <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

    <div className="lg:container relative z-10 mx-auto px-6">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-center">
        {/* Logo Skeleton */}
        <div className="skeleton bg-orange-400/50 h-100 max-w-200 w-full rounded-xl md:rounded-2xl flex-shrink-0"></div>

        {/* Shop Info Skeleton */}
        <div className="flex-1 text-center md:text-left w-full">
          <div className="skeleton bg-orange-400/50 h-6 w-3/4 max-w-xs rounded-full mb-3 mx-auto md:mx-0"></div>
          <div className="skeleton bg-orange-400/50 h-10 w-full max-w-sm rounded-lg mb-2 mx-auto md:mx-0"></div>
          <div className="skeleton bg-orange-400/50 h-5 w-1/2 max-w-xs rounded mb-5 mx-auto md:mx-0"></div>

          {/* Action Buttons Skeleton */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <div className="skeleton bg-white/30 h-11 w-32 rounded-xl"></div>
            <div className="skeleton bg-white/30 h-11 w-24 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const OverviewSkeleton = () => (
  <div className="bg-base-200 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 border border-neutral">
    <div className="skeleton bg-base-300 h-7 w-32 sm:w-40 rounded-lg mb-5"></div>
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton bg-base-300 h-7 w-20 rounded-full"></div>
        ))}
      </div>
      <div className="space-y-2">
        <div className="skeleton bg-base-300 h-4 w-full rounded"></div>
        <div className="skeleton bg-base-300 h-4 w-11/12 rounded"></div>
        <div className="skeleton bg-base-300 h-4 w-4/5 rounded"></div>
      </div>
      <div className="flex flex-wrap gap-3 pt-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="skeleton bg-base-300 h-11 w-40 rounded-xl"></div>
        ))}
      </div>
    </div>
  </div>
);

const ServicesSkeleton = () => (
  <div className="bg-base-200 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 border border-neutral">
    <div className="skeleton bg-base-300 h-7 w-40 sm:w-48 rounded-lg mb-7"></div>
    <div className="space-y-7">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="skeleton bg-base-300 w-10 h-10 rounded-xl"></div>
            <div className="skeleton bg-base-300 h-5 w-32 rounded"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[...Array(2)].map((_, j) => (
              <div key={j} className="rounded-xl p-5 border border-base-300">
                <div className="skeleton bg-base-300 h-4 w-24 rounded mb-3"></div>
                <ul className="space-y-2">
                  {[...Array(3)].map((_, k) => (
                    <li key={k} className="flex items-start">
                      <div className="skeleton bg-base-300 w-4 h-4 rounded-full mr-2 flex-shrink-0"></div>
                      <div className="skeleton bg-base-300 h-3 w-32 rounded"></div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ContactSkeleton = () => (
  <div className="bg-base-200 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-7 border border-neutral">
    <div className="skeleton bg-base-300 h-6 w-32 sm:w-40 rounded-lg mb-5"></div>
    <div className="space-y-5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-start gap-3 sm:gap-4">
          <div className="skeleton bg-base-300 w-10 h-10 rounded-xl flex-shrink-0"></div>
          <div className="flex-1">
            <div className="skeleton bg-base-300 h-4 w-20 rounded mb-1"></div>
            <div className="skeleton bg-base-300 h-3 w-28 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MapSkeleton = () => (
  <div className="bg-base-200 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-7 border border-neutral">
    <div className="skeleton bg-base-300 h-6 w-28 sm:w-32 rounded-lg mb-5"></div>
    <div className="skeleton bg-base-300 h-4 w-full rounded mb-4"></div>
    <div className="skeleton bg-base-300 h-64 rounded-xl mb-4"></div>
    <div className="skeleton bg-base-300 h-11 w-full rounded-xl"></div>
  </div>
);

const ReviewSkeleton = () => (
  <div className="rounded-xl sm:rounded-2xl border border-neutral bg-base-200 shadow-sm p-6 sm:p-8">
    <div className="skeleton bg-base-300 h-7 w-40 sm:w-48 rounded-lg mb-5"></div>
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-xl p-4 sm:p-5 border border-base-300">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-3 flex-1">
              <div className="skeleton bg-base-300 w-10 h-10 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="skeleton bg-base-300 h-4 w-28 rounded mb-1"></div>
                <div className="skeleton bg-base-300 h-3 w-20 rounded"></div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="skeleton bg-base-300 h-5 w-14 rounded mb-1"></div>
            </div>
          </div>
          <div className="skeleton bg-base-300 h-3 w-full rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

// === MAIN COMPONENT ===

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const [shopdata, setShopdata] = useState({});
  // Use a sensible default center for better UX before data loads
  const [mapCenter, setMapCenter] = useState([40.730610, -73.935242]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const { user } = useUser();

  // Share functionality
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `Check out ${shopdata.shop?.shopName || 'this amazing service shop'} on Mechanic Finder!`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      Swal.fire({
        icon: "success",
        title: "Copied!",
        text: "Link copied to clipboard",
        timer: 2000,
        showConfirmButton: false,
        position: "top-right",
        toast: true,
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // --- Geocoding Function (Used as fallback) ---
  const geocodeAddress = async (address) => {
    const { street, city, country, postalCode } = address;
    const fullAddress = `${street}, ${city}, ${country} ${postalCode}`;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          fullAddress
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
      setIsMapReady(true);
      setLoading(false);
    } catch (error) {
      console.error("Geocoding error:", error);
      setIsMapReady(true);
      setLoading(false);
    }
  };

  // --- Data Fetching and Dynamic Map Center Update ---
  useEffect(() => {
    setLoading(true);
    fetch(`/api/shops/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setShopdata(data);
        const shop = data.shop || {};

        // 1. PRIORITY: Use existing latitude and longitude from backend
        if (shop.location?.latitude && shop.location?.longitude) {
          setMapCenter([shop.location.latitude, shop.location.longitude]);
          setIsMapReady(true);
          setLoading(false);
        }
        // 2. FALLBACK: Use geocoding if precise coordinates are missing
        else if (shop.address) {
          geocodeAddress(shop.address); // This will handle setIsMapReady and setLoading
        }
        // 3. FINAL FALLBACK: Just stop loading
        else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching shop data:", error);
        setLoading(false);
      });
  }, [id]);

  const getDirectionsUrl = () => {
    const { street, city, country, postalCode } = shopdata.shop?.address || {};
    const fullAddress = `${street}, ${city}, ${country} ${postalCode}`;
    // Corrected the Google Maps URL structure for directions based on address
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      fullAddress
    )}`;
  };

  const {
    _id,
    userId,
    shop = {},
    certifications = [],
    socialLinks = {},
    createdAt,
  } = shopdata || {};

  const {
    shopName,
    details,
    address = {},
    contact = {},
    workingHours = {},
    vehicleTypes = {},
    logo,
    categories,
    mechanicCount,
    ownerName,
  } = shop;

  // --- Service Section Generation ---
  const serviceSections = [];

  if (vehicleTypes && typeof vehicleTypes === 'object') {
    Object.entries(vehicleTypes).forEach(([category, categoryData]) => {
      if (categoryData && typeof categoryData === 'object' && Object.keys(categoryData).length > 0) {
        serviceSections.push({
          title: category,
          data: categoryData,
          icon: serviceIcons[category] || <Wrench className="w-5 h-5" />,
          gradient: gradientClasses[category] || "from-primary to-orange-600",
        });
      }
    });
  }

  if (serviceSections.length === 0 && categories && categories.length > 0) {
    categories.forEach(category => {
      serviceSections.push({
        title: category,
        data: {},
        icon: serviceIcons[category] || <Wrench className="w-5 h-5" />,
        gradient: gradientClasses[category] || "from-primary to-orange-600",
      });
    });
  }

  // --- Message Contact Handler ---
  const handleMessageContact = async () => {
    const shopId = _id;
    const customerId = user?._id;
    const customerName = user?.name;
    const customerEmail = user?.email;
    const customerProfileImage = user?.profileImage;
    const shopName = shop.shopName;
    const ownerName = shop.ownerName;
    const ownerEmail = shop.ownerEmail;
    const logo = shop.logo;

    if (!customerId) {
      return Swal.fire({
        icon: "error",
        title: "Login Required",
        text: "You must be logged in to start a chat.",
        confirmButtonColor: "#f97316",
      });
    }

    if (customerId === userId) {
      return Swal.fire({
        icon: "info",
        title: "Access Denied",
        text: "You cannot start a chat with your own service shop.",
        confirmButtonColor: "#f97316",
      });
    }

    try {
      // Fetch all chats for this user
      const chatsResponse = await fetch(`/api/chats?userId=${customerId}`);
      const chats = await chatsResponse.json();

      // Check if a chat with this shop already exists
      const existingChat = chats.find((c) =>
        c.participants.some(p => p.userId === ownerEmail) &&
        c.participants.some(p => p.userId === customerId)
      );

      if (!existingChat) {
        const chatRequestBody = {
          participants: [
            { userId: customerId, name: customerName, email: customerEmail, profileImage: customerProfileImage },
            { userId: ownerEmail, name: ownerName, email: ownerEmail, profileImage: logo }
          ]
        };

        const createResponse = await fetch("/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(chatRequestBody),
        });

        const data = await createResponse.json();
        if (!createResponse.ok) throw new Error(data.message || "Failed to create chat");
      }

      // Navigate to messages page
      window.location.href = `/dashboard/${user?.role || "customer"}/messages`;

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Chat Error",
        text: error.message || "An unexpected error occurred while starting the chat.",
        confirmButtonColor: "#f97316",
      });
    }
  };

  const { street, city, country, postalCode } = address;
  const { phone, businessEmail, whatsapp } = contact;
  const { open, close, weekend } = workingHours;
  const { facebook } = socialLinks;

  const fullAddress =
    street || city || country
      ? `${street || ""}${street ? ", " : ""}${city || ""}${city ? ", " : ""}${country || ""
        }${postalCode ? " " + postalCode : ""}`.trim()
      : "Address not provided";

  const location = [city, country].filter(Boolean).join(", ");

  const handleFeedbackSubmit = (data) => {
    if (!data.rating) return null;
    data.createdAt = new Date();
    data.shopId = _id;
    data.userName = user?.name;
    data.userEmail = user?.email;
    data.userPhoto = user?.profileImage;

    fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 5000);
        return fetch(`/api/shops/${id}`);
      })
      .then((res) => res.json())
      .then((data) => {
        setShopdata(data);
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
      });
  };

  // --- LOADING STATE RENDER ---
  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        {/* Hero Skeleton */}
        <HeroSkeleton />

        {/* Main Content Skeleton */}
        <div className="lg:container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column - Services & Reviews */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <OverviewSkeleton />
              <ServicesSkeleton />
              <ReviewSkeleton />
            </div>

            {/* Right Column - Contact Info, Certifications, etc. */}
            <div className="space-y-6 sm:space-y-8">
              <ContactSkeleton />
              <MapSkeleton />
              {/* Rating Form Skeleton */}
              <div className="bg-base-200 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-7 border border-neutral">
                <div className="skeleton bg-base-300 h-6 w-40 rounded-lg mb-5"></div>
                <div className="space-y-4">
                  <div className="skeleton bg-base-300 h-9 w-full rounded"></div>
                  <div className="skeleton bg-base-300 h-20 w-full rounded"></div>
                  <div className="skeleton bg-base-300 h-11 w-full rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN CONTENT RENDER ---
  return (
    <div className="min-h-screen bg-base-100">
      {submitSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-xl animate-fade-in">
          <p className="font-semibold text-sm">Thank you for your feedback!</p>
          <p className="text-xs">
            Your review has been submitted successfully.
          </p>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-2xl shadow-2xl max-w-3xl p-6 border border-base-300 transform transition-all duration-300 scale-100 hover:scale-105">
            <h3 className="text-2xl font-bold text-base-content mb-4">Share This Shop</h3>
            <p className="text-base-content/70 mb-6">Share this service shop with your friends and community</p>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <FacebookShareButton url={shareUrl} quote={shareTitle}>
                <div className="flex flex-col items-center gap-2 p-3 bg-base-200 rounded-lg hover:bg-blue-500 hover:scale-110 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 transform">
                  <FacebookIcon size={40} round />
                  <span className="text-xs font-medium text-base-content">Facebook</span>
                </div>
              </FacebookShareButton>

              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <div className="flex flex-col items-center gap-2 p-3 bg-base-200 rounded-lg hover:bg-blue-400 hover:scale-110 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 transform">
                  <TwitterIcon size={40} round />
                  <span className="text-xs font-medium text-base-content">Twitter</span>
                </div>
              </TwitterShareButton>

              <LinkedinShareButton url={shareUrl} title={shareTitle}>
                <div className="flex flex-col items-center gap-2 p-3 bg-base-200 rounded-lg hover:bg-blue-700 hover:scale-110 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 transform">
                  <LinkedinIcon size={40} round />
                  <span className="text-xs font-medium text-base-content">LinkedIn</span>
                </div>
              </LinkedinShareButton>

              <WhatsappShareButton url={shareUrl} title={shareTitle}>
                <div className="flex flex-col items-center gap-2 p-3 bg-base-200 rounded-lg hover:bg-green-500 hover:scale-110 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 transform">
                  <WhatsappIcon size={40} round />
                  <span className="text-xs font-medium text-base-content">WhatsApp</span>
                </div>
              </WhatsappShareButton>
            </div>

            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 py-3 px-4 border border-base-300 text-base-content font-semibold rounded-lg hover:bg-base-200 hover:border-primary hover:text-primary hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Link
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 py-3 px-4 bg-base-300 text-base-content font-semibold rounded-lg hover:bg-base-400 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary via-orange-600 to-red-600 overflow-hidden text-white py-10 sm:py-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="lg:container mx-auto relative z-10 px-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
            {logo && (
              <div className="relative h-100 lg:max-w-150 xl:max-w-200 w-full rounded-2xl overflow-hidden ring-2 ring-white shadow-2xl">
                <Image
                  src={logo}
                  alt={shopName || "Shop Logo"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Shop Info */}
            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-2">
                    <h1 className="text-3xl sm:text-[40px] xl:text-5xl font-bold drop-shadow-lg leading-tight">
                      {shopName || "Shop Name"}
                    </h1>
                    <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl text-white font-semibold text-base">
                      <Star className="w-4 h-4 fill-white" />
                      <span>{shopdata.avgRating || "0"}</span>
                    </div>

                  </div>

                  {location && (
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-orange-100">
                      <MapPin className="w-4 h-4" />
                      <span className="text-base">{location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-5 justify-center lg:justify-start">
                <button
                  onClick={handleMessageContact}
                  className="flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-bold text-sm sm:text-base hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-w-[140px] justify-center"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Message</span>
                </button>
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-bold text-sm sm:text-base hover:bg-white/30 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-w-[120px] justify-center"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:container mx-auto px-6 py-6 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Services & Reviews */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Overview Card */}
            <div className="bg-base-200 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 border border-neutral">
              <h2 className="text-xl sm:text-2xl font-bold mb-5 text-base-content">Overview</h2>

              <div className="space-y-5 sm:space-y-6">
                {categories && categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gradient-to-r from-primary to-orange-600 text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-md"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}

                {details && (
                  <p className="text-base-content/60 text-base sm:text-lg leading-relaxed max-w-3xl">
                    {details}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 pt-3">
                  {mechanicCount && (
                    <div className="flex items-center gap-2 bg-orange-100/20 px-4 py-2.5 rounded-xl border border-orange-200 text-sm sm:text-base">
                      <Users className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="font-semibold text-base-content">
                        {mechanicCount} Professional Mechanics
                      </span>
                    </div>
                  )}
                  {ownerName && ownerName !== "Not provided" && (
                    <div className="flex items-center gap-2 bg-orange-100/20 px-4 py-2.5 rounded-xl border border-orange-200 text-sm sm:text-base">
                      <UserPlus className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="font-semibold text-base-content">
                        Owner: {ownerName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="bg-base-200 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 border border-neutral">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-base-content">Services We Offer</h2>

              {serviceSections.length === 0 ? (
                <div className="text-center py-10">
                  <Wrench className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                  <p className="text-base-content/60 text-base">
                    No services listed yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-7 sm:space-y-8">
                  {serviceSections.map((section) => (
                    <div key={section.title} className="space-y-5 sm:space-y-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div
                          className={`bg-gradient-to-r ${section.gradient} p-2 sm:p-3 rounded-xl text-white shadow-md flex-shrink-0`}
                        >
                          {section.icon}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-base-content/90">
                          {section.title}
                        </h3>
                      </div>

                      {section.data && Object.keys(section.data).length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                          {Object.entries(section.data).map(
                            ([subCategory, services]) => (
                              <div
                                key={subCategory}
                                className="rounded-xl p-5 sm:p-6 border border-neutral bg-base-100 hover:shadow-lg transition-all duration-300"
                              >
                                <h4 className="font-bold mb-3 text-base-content text-xs uppercase tracking-wider border-b border-neutral pb-2">
                                  {subCategory}
                                </h4>
                                <ul className="space-y-2 sm:space-y-3">
                                  {Array.isArray(services) && services
                                    .slice(0, 4)
                                    .map((service, index) => (
                                      <li
                                        key={index}
                                        className="flex items-start text-base-content/70 text-sm sm:text-base"
                                      >
                                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>{service}</span>
                                      </li>
                                    ))}
                                  {Array.isArray(services) && services.length > 4 && (
                                    <li className="text-orange-600 font-bold text-xs pt-2">
                                      +{services.length - 4} more services available
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-base-content/60 text-sm italic bg-base-100 p-4 rounded-xl">
                          No specific services listed for this category.
                        </p>
                      )}
                    </div>
                  ))}
                </div>

              )}
            </div>

            {/* Reviews Section */}
            <ReviewShow reviews={shopdata.reviews} />
          </div>

          {/* Right Column - Contact Info, Certifications, etc. */}
          <div className="space-y-6 sm:space-y-8">
            {/* Contact Card */}
            <div className="bg-base-200 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-7 border border-neutral">
              <h3 className="text-lg sm:text-xl font-bold mb-5 text-base-content flex items-center gap-3">
                <div className="bg-primary/15 p-2.5 rounded-xl group-hover:bg-orange-200/40 flex items-center justify-center transition-colors flex-shrink-0">
                  <Headset className="w-5 h-5 text-primary" />
                </div>
                Contact Information
              </h3>

              <div className="space-y-5 sm:space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary/15 p-2.5 rounded-xl group-hover:bg-orange-200/40 flex items-center justify-center transition-colors flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base-content mb-1 text-sm sm:text-base">Address</h4>
                    <div className="text-base-content/80 space-y-0.5 text-sm">
                      <p className="font-medium">{street || "Not provided"}</p>
                      {(city || country) && (
                        <p>
                          {city || ""}
                          {city && country ? ", " : ""}
                          {country || ""}
                        </p>
                      )}
                      {postalCode && <p className="text-xs">{postalCode}</p>}
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral"></div>

                {/* Contact Details */}
                <div className="space-y-3">
                  {phone && (
                    <div className="flex items-center gap-4 group cursor-pointer hover:bg-base-100 p-3 rounded-xl transition-colors">
                      <div className="bg-primary/15 p-2.5 rounded-xl group-hover:bg-primary/30 flex items-center justify-center transition-colors flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary group-hover:text-secondary" />
                      </div>
                      <div>
                        <span className="font-semibold text-base-content block text-sm">Phone</span>
                        <span className="text-base-content/60 text-sm">{phone}</span>
                      </div>
                    </div>
                  )}

                  {businessEmail && (
                    <div className="flex items-center gap-4 group cursor-pointer hover:bg-base-100 p-3 rounded-xl transition-colors">
                      <div className="bg-primary/15 p-2.5 rounded-xl group-hover:bg-primary/30 flex items-center justify-center transition-colors flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary group-hover:text-secondary" />
                      </div>
                      <div>
                        <span className="font-semibold text-base-content block text-sm">Email</span>
                        <span className="text-base-content/60 break-all text-sm">{businessEmail}</span>
                      </div>
                    </div>
                  )}

                  {whatsapp && (
                    <div className="flex items-center gap-4 group cursor-pointer hover:bg-base-100 p-3 rounded-xl transition-colors">
                      <div className="bg-primary/15 p-2.5 rounded-xl group-hover:bg-primary/30 flex items-center justify-center transition-colors flex-shrink-0">
                        <FaWhatsapp className="w-5 h-5 text-primary group-hover:text-secondary" />
                      </div>
                      <div>
                        <span className="font-semibold text-base-content block text-sm">WhatsApp</span>
                        <span className="text-base-content/60 text-sm">{whatsapp}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-neutral"></div>

                {/* Working Hours */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary/15 p-2.5 rounded-xl group-hover:bg-orange-200/40 flex items-center justify-center transition-colors flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base-content mb-2 text-sm sm:text-base">Working Hours</h4>
                    <div className="space-y-1 text-base-content/60 text-sm">
                      <div className="flex justify-between items-center">
                        <span>Weekdays</span>
                        <span className="font-semibold text-base-content/80">
                          {open && close ? `${open} - ${close}` : "Not provided"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Weekend</span>
                        <span className="font-semibold text-base-content/80">
                          {weekend || "Not provided"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                {facebook && (
                  <>
                    <div className="border-t border-neutral"></div>
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 group hover:bg-base-100 p-3 rounded-xl transition-colors"
                    >
                      <div className="bg-primary/15 p-2.5 rounded-xl group-hover:bg-primary/30 flex items-center justify-center transition-colors flex-shrink-0">
                        <Facebook className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-semibold text-primary text-sm sm:text-base">Visit Facebook Page</span>
                    </a>
                  </>
                )}
              </div>
            </div>
            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <div className="bg-base-200 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-7 border border-neutral">
                <div className="flex items-center gap-3 sm:gap-4 mb-5">
                  <div className="bg-primary/15 p-2 sm:p-3 rounded-xl flex-shrink-0">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-base-content">Certifications</h3>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-secondary/30 bg-primary/10 hover:shadow-md transition-shadow text-sm sm:text-base"
                    >
                      <div className="h-6 w-6 bg-success/25 flex items-center justify-center rounded-full overflow-hidden">
                        <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      </div>
                      <span className="font-semibold text-primary">
                        {cert}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Member Since */}
            {createdAt && (
              <div className="bg-gradient-to-br from-primary to-orange-600 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-7 text-white">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="bg-white/20 p-2 sm:p-3 rounded-xl flex-shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold">Member Since</h3>
                </div>

                <div>
                  <p className="text-4xl sm:text-5xl font-bold mb-1 drop-shadow leading-none">
                    {new Date(createdAt).getFullYear()}
                  </p>
                  <p className="text-orange-100 text-xs sm:text-sm">
                    {new Date(createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Location Map */}
            <div className="bg-base-200 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-7 border border-neutral">
              <div className="flex items-center gap-3 sm:gap-4 mb-5">
                <div className="bg-primary/15 p-2 sm:p-3 rounded-xl flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-base-content">Location</h3>
              </div>

              {fullAddress && fullAddress !== "Address not provided" && (
                <p className="text-base-content mb-4 text-center bg-secondary/15 p-3 rounded-xl border border-primary text-sm">
                  {fullAddress}
                </p>
              )}

              {/* Responsive map height */}
              <div className="h-64 sm:h-72 rounded-xl overflow-hidden bg-gray-100 border border-orange-200 mb-5 shadow-inner">
                {isMapReady ? (
                  <MapContainer
                    center={mapCenter}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={false}
                    className="z-0"
                  >
                    <TileLayer
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={mapCenter}>
                      <Popup>
                        <div className="text-center text-sm">
                          <strong className="text-orange-600">{shopName || "Shop Location"}</strong>
                          {fullAddress && fullAddress !== "Address not provided" && (
                            <>
                              <br />
                              <span className="text-xs text-gray-600">{fullAddress}</span>
                            </>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-4 border-orange-200 border-t-primary rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {street && (
                <a
                  href={getDirectionsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-orange-600 text-white py-3 rounded-xl font-bold text-sm sm:text-base hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </a>
              )}
            </div>

            {/* Rating Form */}
            <RatingForm onSubmit={handleFeedbackSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}