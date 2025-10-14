"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Image from "next/image";
import { Check, Headset, Share2, UserPlus, MapPin, Clock, Phone, Mail, Star, Award, Calendar, Navigation, Users, Car, Bike, Truck, Zap, Facebook, MessageSquare, Wrench
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReviewShow from "../ReviewShow";
import RatingForm from "../Ratting";
import useUser from "@/hooks/useUser";
import Swal from "sweetalert2";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Service icons mapping based on category
const serviceIcons = {
  "Car Service & Repair": <Car className="w-5 h-5" />,
  "Motorcycle Service & Repair": <Bike className="w-5 h-5" />,
  "Truck/Commercial Vehicle Service": <Truck className="w-5 h-5" />,
  "Home Appliance Repair": <Zap className="w-5 h-5" />,
  "HVAC & Cooling Specialist": <Zap className="w-5 h-5" />,
  "Car Detailing & Accessories": <Car className="w-5 h-5" />,
};

const gradientClasses = {
  "Car Service & Repair": "from-orange-500 to-orange-600",
  "Motorcycle Service & Repair": "from-orange-600 to-orange-700",
  "Truck/Commercial Vehicle Service": "from-blue-500 to-blue-600",
  "Home Appliance Repair": "from-green-500 to-green-600",
  "HVAC & Cooling Specialist": "from-purple-500 to-purple-600",
  "Car Detailing & Accessories": "from-teal-500 to-teal-600",
};

// Skeleton Loading Components
const HeroSkeleton = () => (
  <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 overflow-hidden text-white py-12">
    <div className="absolute inset-0 bg-black/10"></div>
    <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
    
    <div className="container relative z-10">
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Logo Skeleton */}
        <div className="skeleton bg-orange-400/50 h-100 w-200 rounded-2xl"></div>
        
        {/* Shop Info Skeleton */}
        <div className="flex-1 text-center lg:text-left">
          <div className="skeleton bg-orange-400/50 h-8 w-48 rounded-full mb-4 mx-auto lg:mx-0"></div>
          <div className="skeleton bg-orange-400/50 h-12 w-64 rounded-lg mb-3 mx-auto lg:mx-0"></div>
          <div className="skeleton bg-orange-400/50 h-6 w-48 rounded mb-6 mx-auto lg:mx-0"></div>
          
          {/* Action Buttons Skeleton */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <div className="skeleton bg-white/30 h-12 w-40 rounded-xl"></div>
            <div className="skeleton bg-white/30 h-12 w-32 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const OverviewSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
    <div className="skeleton bg-gray-200 h-8 w-40 rounded-lg mb-6"></div>
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton bg-gray-200 h-8 w-24 rounded-full"></div>
        ))}
      </div>
      <div className="space-y-3">
        <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
        <div className="skeleton bg-gray-200 h-4 w-3/4 rounded"></div>
        <div className="skeleton bg-gray-200 h-4 w-5/6 rounded"></div>
      </div>
      <div className="flex flex-wrap gap-4 pt-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="skeleton bg-gray-200 h-12 w-48 rounded-xl"></div>
        ))}
      </div>
    </div>
  </div>
);

const ServicesSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
    <div className="skeleton bg-gray-200 h-8 w-48 rounded-lg mb-8"></div>
    <div className="space-y-8">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="skeleton bg-gray-200 w-12 h-12 rounded-xl"></div>
            <div className="skeleton bg-gray-200 h-6 w-40 rounded"></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[...Array(2)].map((_, j) => (
              <div key={j} className="rounded-xl p-6 border border-orange-200">
                <div className="skeleton bg-gray-200 h-5 w-32 rounded mb-4"></div>
                <ul className="space-y-3">
                  {[...Array(3)].map((_, k) => (
                    <li key={k} className="flex items-start">
                      <div className="skeleton bg-gray-200 w-5 h-5 rounded-full mr-3"></div>
                      <div className="skeleton bg-gray-200 h-4 w-40 rounded"></div>
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
  <div className="bg-white rounded-2xl shadow-lg p-7 border border-orange-100">
    <div className="skeleton bg-gray-200 h-6 w-40 rounded-lg mb-6"></div>
    <div className="space-y-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-start gap-4">
          <div className="skeleton bg-gray-200 w-12 h-12 rounded-xl"></div>
          <div className="flex-1">
            <div className="skeleton bg-gray-200 h-5 w-24 rounded mb-2"></div>
            <div className="skeleton bg-gray-200 h-4 w-32 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MapSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg p-7 border border-orange-100">
    <div className="skeleton bg-gray-200 h-6 w-32 rounded-lg mb-6"></div>
    <div className="skeleton bg-gray-200 h-4 w-full rounded mb-5"></div>
    <div className="skeleton bg-gray-200 h-72 rounded-xl mb-5"></div>
    <div className="skeleton bg-gray-200 h-12 w-full rounded-xl"></div>
  </div>
);

const ReviewSkeleton = () => (
  <div className="rounded-2xl border border-primary shadow-sm p-8">
    <div className="skeleton bg-gray-200 h-8 w-48 rounded-lg mb-6"></div>
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-xl p-5 border border-primary">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="skeleton bg-gray-200 w-12 h-12 rounded-full"></div>
              <div className="flex-1">
                <div className="skeleton bg-gray-200 h-5 w-32 rounded mb-2"></div>
                <div className="skeleton bg-gray-200 h-4 w-24 rounded"></div>
              </div>
            </div>
            <div className="text-right">
              <div className="skeleton bg-gray-200 h-6 w-16 rounded mb-1"></div>
              <div className="skeleton bg-gray-200 h-3 w-20 rounded"></div>
            </div>
          </div>
          <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const [shopdata, setShopdata] = useState({});
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/shops/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Shop Data:", data);
        setShopdata(data);
        if (data.shop?.address) {
          geocodeAddress(data.shop.address);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching shop data:", error);
        setLoading(false);
      });
  }, [id]);

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

  const getDirectionsUrl = () => {
    const { street, city, country, postalCode } = shopdata.shop?.address || {};
    const fullAddress = `${street}, ${city}, ${country} ${postalCode}`;
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

  console.log("Vehicle Types:", vehicleTypes);
  console.log("Categories:", categories);

  // FIXED: Create service sections based on the actual data structure
  const serviceSections = [];

  if (vehicleTypes && typeof vehicleTypes === 'object') {
    Object.entries(vehicleTypes).forEach(([category, categoryData]) => {
      if (categoryData && typeof categoryData === 'object' && Object.keys(categoryData).length > 0) {
        serviceSections.push({
          title: category,
          data: categoryData,
          icon: serviceIcons[category] || <Wrench className="w-5 h-5" />,
          gradient: gradientClasses[category] || "from-orange-500 to-orange-600",
        });
      }
    });
  }

  // If no services found in vehicleTypes, check if there are categories
  if (serviceSections.length === 0 && categories && categories.length > 0) {
    categories.forEach(category => {
      serviceSections.push({
        title: category,
        data: {},
        icon: serviceIcons[category] || <Wrench className="w-5 h-5" />,
        gradient: gradientClasses[category] || "from-orange-500 to-orange-600",
      });
    });
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        {/* Hero Skeleton */}
        <HeroSkeleton />
        
        {/* Main Content Skeleton */}
        <div className="container py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Services & Reviews */}
            <div className="lg:col-span-2 space-y-8">
              <OverviewSkeleton />
              <ServicesSkeleton />
              <ReviewSkeleton />
            </div>

            {/* Right Column - Contact Info, Certifications, etc. */}
            <div className="space-y-8">
              <ContactSkeleton />
              <MapSkeleton />
              {/* Rating Form Skeleton */}
              <div className="bg-white rounded-2xl shadow-lg p-7 border border-orange-100">
                <div className="skeleton bg-gray-200 h-6 w-40 rounded-lg mb-6"></div>
                <div className="space-y-4">
                  <div className="skeleton bg-gray-200 h-10 w-full rounded"></div>
                  <div className="skeleton bg-gray-200 h-24 w-full rounded"></div>
                  <div className="skeleton bg-gray-200 h-12 w-full rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {submitSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg animate-fade-in">
          <p className="font-semibold">Thank you for your feedback!</p>
          <p className="text-sm">
            Your review has been submitted successfully.
          </p>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 overflow-hidden text-white py-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {logo && (
              <div className="relative h-100 w-200 rounded-2xl overflow-hidden ring-2 ring-white shadow-2xl">
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
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-3">
                    <h1 className="text-4xl lg:text-5xl font-bold drop-shadow-lg">
                      {shopName || "Shop Name"}
                    </h1>
                    <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-white font-semibold">
                      <Star className="w-5 h-5 fill-white" />
                      <span>4.8</span>
                    </div>
                  </div>

                  {location && (
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-orange-100 mb-2">
                      <MapPin className="w-5 h-5" />
                      <span className="text-lg">{location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleMessageContact}
                  className="flex items-center gap-3 bg-white text-orange-600 px-8 py-4 rounded-xl font-bold hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-w-[160px] justify-center"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Message</span>
                </button>
                <button className="flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:bg-white/30 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-w-[140px] justify-center">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Services & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Overview</h2>
              
              <div className="space-y-6">
                {categories && categories.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-shadow"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}

                {details && (
                  <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
                    {details}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 pt-4">
                  {mechanicCount && (
                    <div className="flex items-center gap-3 bg-orange-50 px-5 py-3 rounded-xl border border-orange-200">
                      <Users className="w-5 h-5 text-orange-600" />
                      <span className="font-semibold text-gray-700">
                        {mechanicCount} Professional Mechanics
                      </span>
                    </div>
                  )}
                  {ownerName && ownerName !== "Not provided" && (
                    <div className="flex items-center gap-3 bg-orange-50 px-5 py-3 rounded-xl border border-orange-200">
                      <UserPlus className="w-5 h-5 text-orange-600" />
                      <span className="font-semibold text-gray-700">
                        Owner: {ownerName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
              <h2 className="text-2xl font-bold mb-8 text-gray-800">Services We Offer</h2>

              {serviceSections.length === 0 ? (
                <div className="text-center py-12">
                  <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    No services listed yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {serviceSections.map((section) => (
                    <div key={section.title} className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`bg-gradient-to-r ${section.gradient} p-3 rounded-xl text-white shadow-md`}
                        >
                          {section.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {section.title}
                        </h3>
                      </div>

                      {section.data && Object.keys(section.data).length > 0 ? (
                        <div className="grid sm:grid-cols-2 gap-6">
                          {Object.entries(section.data).map(
                            ([subCategory, services]) => (
                              <div
                                key={subCategory}
                                className="rounded-xl p-6 border border-orange-200 bg-gradient-to-br from-white to-orange-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                              >
                                <h4 className="font-bold mb-4 text-gray-800 text-sm uppercase tracking-wide border-b border-orange-200 pb-2">
                                  {subCategory}
                                </h4>
                                <ul className="space-y-3">
                                  {Array.isArray(services) && services
                                    .slice(0, 4)
                                    .map((service, index) => (
                                      <li
                                        key={index}
                                        className="flex items-start text-gray-600 text-base"
                                      >
                                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>{service}</span>
                                      </li>
                                    ))}
                                  {Array.isArray(services) && services.length > 4 && (
                                    <li className="text-orange-600 font-bold text-sm pt-2">
                                      +{services.length - 4} more services available
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-base italic bg-gray-50 p-4 rounded-xl">
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
          <div className="space-y-8">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg p-7 border border-orange-100">
              <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Headset className="w-6 h-6 text-orange-600" />
                </div>
                Contact Information
              </h3>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-xl flex-shrink-0">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">Address</h4>
                    <div className="text-gray-600 space-y-1">
                      <p className="font-medium">{street || "Not provided"}</p>
                      {(city || country) && (
                        <p>
                          {city || ""}
                          {city && country ? ", " : ""}
                          {country || ""}
                        </p>
                      )}
                      {postalCode && <p className="text-sm">{postalCode}</p>}
                    </div>
                  </div>
                </div>

                <div className="border-t border-orange-200"></div>

                {/* Contact Details */}
                <div className="space-y-4">
                  {phone && (
                    <div className="flex items-center gap-4 group cursor-pointer hover:bg-orange-50 p-3 rounded-xl transition-colors">
                      <div className="bg-orange-100 p-3 rounded-xl group-hover:bg-orange-200 transition-colors">
                        <Phone className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800 block">Phone</span>
                        <span className="text-gray-600">{phone}</span>
                      </div>
                    </div>
                  )}

                  {businessEmail && (
                    <div className="flex items-center gap-4 group cursor-pointer hover:bg-orange-50 p-3 rounded-xl transition-colors">
                      <div className="bg-orange-100 p-3 rounded-xl group-hover:bg-orange-200 transition-colors">
                        <Mail className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800 block">Email</span>
                        <span className="text-gray-600 break-all">{businessEmail}</span>
                      </div>
                    </div>
                  )}

                  {whatsapp && (
                    <div className="flex items-center gap-4 group cursor-pointer hover:bg-orange-50 p-3 rounded-xl transition-colors">
                      <div className="bg-orange-100 p-3 rounded-xl group-hover:bg-orange-200 transition-colors">
                        <svg
                          className="w-5 h-5 text-orange-600"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800 block">WhatsApp</span>
                        <span className="text-gray-600">{whatsapp}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-orange-200"></div>

                {/* Working Hours */}
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-xl flex-shrink-0">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-3">Working Hours</h4>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex justify-between items-center">
                        <span>Weekdays</span>
                        <span className="font-semibold text-gray-800">
                          {open && close ? `${open} - ${close}` : "Not provided"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Weekend</span>
                        <span className="font-semibold text-gray-800">
                          {weekend || "Not provided"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                {facebook && (
                  <>
                    <div className="border-t border-orange-200"></div>
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 group hover:bg-orange-50 p-3 rounded-xl transition-colors"
                    >
                      <div className="bg-orange-100 p-3 rounded-xl group-hover:bg-orange-200 transition-colors">
                        <Facebook className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="font-semibold text-orange-600">Visit Facebook Page</span>
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-7 border border-orange-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-orange-100 p-3 rounded-xl">
                    <Award className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Certifications</h3>
                </div>

                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100 hover:shadow-md transition-shadow"
                    >
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="font-semibold text-orange-900">
                        {cert}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Member Since */}
            {createdAt && (
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-7 text-white">
                <div className="flex items-center gap-4 mb-5">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">Member Since</h3>
                </div>

                <div>
                  <p className="text-5xl font-bold mb-2 drop-shadow">
                    {new Date(createdAt).getFullYear()}
                  </p>
                  <p className="text-orange-100 text-base">
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
            <div className="bg-white rounded-2xl shadow-lg p-7 border border-orange-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Location</h3>
              </div>

              {fullAddress && fullAddress !== "Address not provided" && (
                <p className="text-gray-600 mb-5 text-center bg-orange-50 p-4 rounded-xl border border-orange-200">
                  {fullAddress}
                </p>
              )}

              <div className="h-72 rounded-xl overflow-hidden bg-gray-100 border border-orange-200 mb-5 shadow-inner">
                {isMapReady ? (
                  <MapContainer
                    center={mapCenter}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={mapCenter}>
                      <Popup>
                        <div className="text-center">
                          <strong className="text-orange-600">{shopName || "Shop Location"}</strong>
                          {fullAddress && fullAddress !== "Address not provided" && (
                            <>
                              <br />
                              <span className="text-sm text-gray-600">{fullAddress}</span>
                            </>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {street && (
                <a
                  href={getDirectionsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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