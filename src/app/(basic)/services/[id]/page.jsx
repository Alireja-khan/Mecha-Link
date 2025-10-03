"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Image from "next/image";
import {
  Check,
  Headset,
  Share2,
  UserPlus,
  MapPin,
  Clock,
  Phone,
  Mail,
  Star,
  Award,
  Calendar,
  Navigation,
  Users,
  Car,
  Bike,
  Truck,
  Zap,
  Facebook,
  MessageSquare,
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

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const [shopdata, setShopdata] = useState({});
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { user } = useUser(); // use 'user' consistently

  useEffect(() => {
    fetch(`/api/shops/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setShopdata(data);
        if (data.shop?.address) {
          geocodeAddress(data.shop.address);
        }
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
        setIsMapReady(true);
      } else {
        setIsMapReady(true);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setIsMapReady(true);
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
    userId, // Owner ID is at the top level, use this for serviceProviderId
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

  const handleMessageContact = async () => {
    const shopId = _id;
    const customerId = user?._id;
    const serviceProviderId = userId; // Owner ID

    console.log("--- Chat Initiation Data ---");
    console.log("Shop ID (Service Entity ID):", shopId);
    console.log("Customer ID (Logged-in User ID):", customerId);
    console.log("Service Provider ID (Owner ID):", serviceProviderId);
    console.log("Shop Name:", shopName);
    console.log("----------------------------");

    if (!customerId) {
      Swal.fire({
        icon: "error",
        title: "Login Required",
        text: "You must be logged in to start a chat.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    // ⭐ NEW CHECK: Prevent chat if the customer is the owner
    if (customerId === serviceProviderId) {
      Swal.fire({
        icon: "info",
        title: "Access Denied",
        text: "You cannot start a chat with your own service shop.",
        confirmButtonColor: "#f97316",
      });
      console.log(
        "Chat initiation aborted: Customer ID matches Service Provider ID."
      );
      return;
    }

    if (!shopId || !serviceProviderId || !shopName) {
      Swal.fire({
        icon: "warning",
        title: "Data Missing",
        text: "Cannot start chat: Missing Shop ID, Owner ID, or Shop Name.",
        confirmButtonColor: "#f97316",
      });
      console.log("Chat initiation aborted: Missing required shop data.");
      return;
    }

    const result = await Swal.fire({
      title: "Start Conversation?",
      html: `Do you want to start an in-app chat with **${shopName}**?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Start Chat!",
      cancelButtonText: "No, Cancel",
      confirmButtonColor: "#f97316",
    });

    if (!result.isConfirmed) {
      console.log("Chat initiation cancelled by user.");
      return;
    }

    try {
      const chatRequestBody = {
        shopId: shopId,
        customerId: customerId,
        mechanicId: serviceProviderId,
        mechanicName: shopName,
        mechanicLogo: logo,
      };

      console.log("API Request Body for /api/chats:", chatRequestBody);

      const apiResponse = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chatRequestBody),
      });

      const data = await apiResponse.json();

      console.log(
        "API Response Status:",
        apiResponse.status,
        apiResponse.statusText
      );
      console.log("API Response Data:", data);

      if (!apiResponse.ok) {
        throw new Error(data.message || "Failed to create/retrieve chat.");
      }

      const chatPath = `/dashboard/${user?.role || "customer"}/messages`;

      console.log("Chat successfully initiated. Redirecting to:", chatPath);

      window.location.href = chatPath;
    } catch (error) {
      console.error("Chat Error in handleMessageContact:", error);
      Swal.fire({
        icon: "error",
        title: "Chat Error",
        text:
          error.message ||
          "An unexpected error occurred while starting the chat.",
        confirmButtonColor: "#f97316",
      });
    }
  };

  const { street, city, country, postalCode } = address;
  const { phone, businessEmail, whatsapp } = contact;
  const { open, close, weekend } = workingHours;
  const {
    Car: CarServices = {},
    Motorcycle = {},
    "Trucks & Commercial Vehicles": Trucks = {},
    "Electric Vehicle (EV)": ElectricVehicle = {},
  } = vehicleTypes;
  const { facebook } = socialLinks;

  const fullAddress =
    street || city || country
      ? `${street || ""}${street ? ", " : ""}${city || ""}${city ? ", " : ""}${
          country || ""
        }${postalCode ? " " + postalCode : ""}`.trim()
      : "Address not provided";

  const location = [city, country].filter(Boolean).join(", ");

  const serviceSections = [
    {
      title: "Car Services",
      data: CarServices,
      icon: <Car className="w-5 h-5" />,
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: "Motorcycle Services",
      data: Motorcycle,
      icon: <Bike className="w-5 h-5" />,
      gradient: "from-orange-600 to-orange-700",
    },
    {
      title: "Trucks & Commercial",
      data: Trucks,
      icon: <Truck className="w-5 h-5" />,
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: "Electric Vehicle (EV)",
      data: ElectricVehicle,
      icon: <Zap className="w-5 h-5" />,
      gradient: "from-orange-600 to-orange-700",
    },
  ];

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

  return (
    <div className="min-h-screen">
      {submitSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg">
          <p className="font-semibold">Thank you for your feedback!</p>
          <p className="text-sm">
            Your review has been submitted successfully.
          </p>
        </div>
      )}

      <div className="border-b border-primary">
        <div className="px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              {logo && (
                <div className="relative w-92 h-56 md:w-[800px] md:h-72 lg:w-[900px] lg:h-[450px] rounded-lg overflow-hidden ring-2  ring-orange-100 shadow-lg object-cover">
                  <Image
                    src={logo}
                    alt={shopName || "Shop Logo"}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">
              <div className="flex-1 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h1 className="text-3xl lg:text-4xl font-bold">
                        {shopName || "Shop Name"}
                      </h1>
                      <div className="flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
                        <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                        <span>4.8</span>
                      </div>
                    </div>

                    {location && (
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 sm:self-start">
                    <button
                      onClick={handleMessageContact}
                      className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-200 shadow-sm hover:shadow-md min-w-[120px]"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">Message</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all duration-200 min-w-[100px]">
                      <Share2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {categories && (
                    <span className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                      {categories}
                    </span>
                  )}

                  {details && (
                    <p className="text-gray-400 text-base leading-relaxed max-w-3xl">
                      {details}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {mechanicCount && (
                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {mechanicCount} Mechanics
                      </span>
                    </div>
                  )}
                  {ownerName && ownerName !== "Not provided" && (
                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                      <UserPlus className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {ownerName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" container my-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Services & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services Section */}
            <div className="rounded-2xl border border-primary shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-8">Services We Offer</h2>

              <div className="space-y-8">
                {serviceSections.map(
                  (section) =>
                    section.data &&
                    Object.keys(section.data).length > 0 && (
                      <div key={section.title} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`bg-gradient-to-r ${section.gradient} p-2.5 rounded-lg text-white`}
                          >
                            {section.icon}
                          </div>
                          <h3 className="text-lg font-semibold">
                            {section.title}
                          </h3>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          {Object.entries(section.data).map(
                            ([category, services]) => (
                              <div
                                key={category}
                                className="rounded-xl p-5 border border-primary hover:shadow-md transition-all duration-200"
                              >
                                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">
                                  {category}
                                </h4>
                                <ul className="space-y-2">
                                  {services &&
                                    services
                                      .slice(0, 4)
                                      .map((service, index) => (
                                        <li
                                          key={index}
                                          className="flex items-start text-gray-400 text-sm"
                                        >
                                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                          <span>{service}</span>
                                        </li>
                                      ))}
                                  {services && services.length > 4 && (
                                    <li className="text-orange-600 font-medium text-xs pt-1">
                                      +{services.length - 4} more
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>

            <ReviewShow reviews={shopdata.reviews} />
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-primary shadow-sm p-6 space-y-5">
              <h3 className="text-lg font-bold mb-4">Contact Information</h3>

              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <MapPin className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">Address</h4>
                    <div className="text-sm text-gray-400 space-y-0.5">
                      <p>{street || "Not provided"}</p>
                      {(city || country) && (
                        <p>
                          {city || ""}
                          {city && country ? ", " : ""}
                          {country || ""}
                        </p>
                      )}
                      {postalCode && <p>{postalCode}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-primary"></div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Phone className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-gray-400">
                    {phone || "Not provided"}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Mail className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-gray-400 break-all">
                    {businessEmail || "Not provided"}
                  </span>
                </div>

                {whatsapp && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <svg
                        className="w-4 h-4 text-orange-600"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                      </svg>
                    </div>
                    <span className="text-gray-400">{whatsapp}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-primary"></div>

              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-2">
                      Working Hours
                    </h4>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Weekdays</span>
                        <span className="font-medium">
                          {open && close
                            ? `${open} - ${close}`
                            : "Not provided"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Weekend</span>
                        <span className="font-medium">
                          {weekend || "Not provided"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {facebook && (
                <>
                  <div className="border-t border-primary"></div>
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-orange-600 hover:text-orange-700 transition-colors group"
                  >
                    <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                      <Facebook className="w-4 h-4" />
                    </div>
                    <span className="font-medium">Visit Facebook Page</span>
                  </a>
                </>
              )}
            </div>

            {certifications && certifications.length > 0 && (
              <div className="rounded-2xl border border-primary shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Award className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold">Certifications</h3>
                </div>

                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-lg border border-orange-200/50 hover:border-orange-300 transition-all duration-200"
                    >
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-gray-700">
                        {cert}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {createdAt && (
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-sm p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold">Member Since</h3>
                </div>

                <div>
                  <p className="text-4xl font-bold mb-1">
                    {new Date(createdAt).getFullYear()}
                  </p>
                  <p className="text-orange-100 text-sm">
                    {new Date(createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-primary shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold">Location</h3>
              </div>

              {fullAddress && fullAddress !== "Address not provided" && (
                <p className="text-sm text-gray-400 mb-4">{fullAddress}</p>
              )}

              <div className="h-64 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 mb-4">
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
                          <strong>{shopName || "Shop Location"}</strong>
                          {fullAddress &&
                            fullAddress !== "Address not provided" && (
                              <>
                                <br />
                                <span className="text-sm">{fullAddress}</span>
                              </>
                            )}
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {street && (
                <a
                  href={getDirectionsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-200 shadow-sm"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
              )}
            </div>

            <RatingForm onSubmit={handleFeedbackSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}
