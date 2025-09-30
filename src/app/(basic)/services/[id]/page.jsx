"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Image from "next/image";
import { Check, Headset, Share2, UserPlus, MapPin, Clock, Phone, Mail, Star, Award, Calendar, Navigation, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReviewShow from "../ReviewShow";
import RatingForm from "../Ratting";
import Swal from "sweetalert2";
import useUser from "@/hooks/useUser";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const [shopdata, setShopdata] = useState({});
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [isMapReady, setIsMapReady] = useState(false);
  const {user} = useUser();

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

  console.log(shopdata);

  const geocodeAddress = async (address) => {
    const { street, city, country, postalCode } = address;
    const fullAddress = `${street}, ${city}, ${country} ${postalCode}`;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        setIsMapReady(true);
      } else {
        setIsMapReady(true);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setIsMapReady(true);
    }
  };

  const getDirectionsUrl = () => {
    const { street, city, country, postalCode } = shopdata.shop?.address || {};
    const fullAddress = `${street}, ${city}, ${country} ${postalCode}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
  };

  const {
    _id,
    shop = {},
    certifications = [],
    socialLinks = {},
    createdAt
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
    ownerEmail
  } = shop;

  const { street, city, country, postalCode } = address;
  const { phone, businessEmail, whatsapp } = contact;
  const { open, close, weekend } = workingHours;
  const { Car = {}, Motorcycle = {}, "Trucks & Commercial Vehicles": Trucks = {}, "Electric Vehicle (EV)": ElectricVehicle = {} } = vehicleTypes;
  const { facebook } = socialLinks;

  const fullAddress = street || city || country ?
    `${street || ''}${street ? ', ' : ''}${city || ''}${city ? ', ' : ''}${country || ''}${postalCode ? ' ' + postalCode : ''}`.trim()
    : 'Address not provided';

  // Service sections with proper icons
  const serviceSections = [
    {
      title: "Car Services",
      data: Car,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      title: "Motorcycle Services",
      data: Motorcycle,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
        </svg>
      )
    },
    {
      title: "Trucks & Commercial Vehicles",
      data: Trucks,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Electric Vehicle (EV)",
      data: ElectricVehicle,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
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
        Swal.fire({
          icon: "success",
          title: "Feedback submitted successfully",
          text: "Thanks for your feedback! Your feedback is valueable for us and our users.",
        });
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 to-orange-100/20">
      {/* Header Section with Large Image */}
      <div className="bg-white border-b border-orange-100">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Large Shop Logo */}
            <div className="flex-shrink-0">
              {logo && (
                <div className="relative w-208 h-88 rounded-3xl shadow-2xl border-4 border-white overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600">
                  <Image
                    src={logo}
                    alt="Shop Logo"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>

            {/* Shop Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold text-gray-900">{shopName || 'Not provided'}</h1>
                <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium border border-orange-200">
                  <Star className="w-4 h-4" />
                  <span>4.8</span>
                </div>
              </div>

              {categories && (
                <span className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full text-base font-medium mb-4">
                  {categories}
                </span>
              )}

              {details && (
                <p className="text-gray-600 text-xl max-w-3xl mb-6 leading-relaxed">{details}</p>
              )}

              {/* Additional Info */}
              <div className="flex flex-wrap gap-4">
                {mechanicCount && (
                  <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
                    <Users className="w-5 h-5 text-orange-500" />
                    <span className="text-orange-700 font-medium">{mechanicCount} Mechanics</span>
                  </div>
                )}
                {ownerName && ownerName !== "Not provided" && (
                  <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
                    <UserPlus className="w-5 h-5 text-orange-500" />
                    <span className="text-orange-700 font-medium">Owner: {ownerName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 lg:flex-col lg:ml-auto">
              <button className="flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105 shadow-lg">
                <Phone className="w-5 h-5" />
                Contact
              </button>
              <button className="flex items-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold border border-orange-200 hover:bg-orange-50 transition-all duration-300">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className=" px-4 grid grid-cols-3 gap-5 sm:px-6 lg:px-8 py-8">


        {/* Full Width Services Section */}
        <div className="mb-8 col-span-2">
          <div className="bg-white rounded-3xl border border-orange-100 shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Services Offered</h2>

            <div className="space-y-8">
              {serviceSections.map((section) => (
                section.data && Object.keys(section.data).length > 0 && (
                  <div key={section.title} className="mb-8 last:mb-0">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-orange-500 p-3 rounded-xl">
                        {section.icon}
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900">{section.title}</h3>
                    </div>

                    {/* Horizontal Scroll Container */}
                    <div className="overflow-x-auto">
                      <div className="flex gap-6 pb-4 min-w-max">
                        {Object.entries(section.data).map(([category, services]) => (
                          <div key={category} className="bg-orange-50 rounded-2xl p-6 border border-orange-200 hover:border-orange-300 transition-all duration-300 group min-w-80">
                            <h4 className="font-semibold text-gray-900 mb-4 text-lg uppercase tracking-wide">{category}</h4>
                            <ul className="space-y-3">
                              {services && services.slice(0, 5).map((service, index) => (
                                <li key={index} className="flex items-center text-gray-700">
                                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                  <span className="text-base">{service}</span>
                                </li>
                              ))}
                              {services && services.length > 5 && (
                                <li className="text-orange-600 font-medium text-sm mt-2">
                                  +{services.length - 5} more services
                                </li>
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-1 gap-8">
          {/* Main Content - Contact & Hours */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-orange-100 shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h2>

              <div className="">
                {/* Address */}
                <div className="mb-5">
                  <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-200 hover:border-orange-300 transition-all duration-300 group">
                    <div className="bg-orange-500 p-3 rounded-xl group-hover:bg-orange-600 transition-colors duration-300">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Address</h3>
                      <div className="space-y-2 text-gray-600">
                        <p>{street || 'Not provided'}</p>
                        <p>{city || 'Not provided'}{city && country ? ', ' : ''}{country || ''}</p>
                        <p>{postalCode || ''}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex mb-5 items-start gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-200 hover:border-orange-300 transition-all duration-300 group">
                  <div className="bg-orange-500 p-3 rounded-xl group-hover:bg-orange-600 transition-colors duration-300">
                    <Headset className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
                    <div className="space-y-3 text-gray-600">
                      <p className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-orange-500" />
                        {phone || 'Not provided'}
                      </p>
                      <p className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-orange-500" />
                        {businessEmail || 'Not provided'}
                      </p>
                      <p className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                        </svg>
                        {whatsapp || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="">
                  <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-200 hover:border-orange-300 transition-all duration-300 group">
                    <div className="bg-orange-500 p-3 rounded-xl group-hover:bg-orange-600 transition-colors duration-300">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Working Hours</h3>
                      <div className="space-y-3 text-gray-600">
                        <div className="flex justify-between">
                          <span>Weekdays</span>
                          <span className="font-medium">{open || 'Not provided'} - {close || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Weekend</span>
                          <span className="font-medium">{weekend || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  {facebook && (
                    <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-200 hover:border-orange-300 transition-all duration-300 group">
                      <div className="bg-orange-500 p-3 rounded-xl group-hover:bg-orange-600 transition-colors duration-300">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Social Media</h3>
                        <a href={facebook} className="text-orange-600 hover:text-orange-800 transition-colors font-medium" target="_blank" rel="noopener noreferrer">
                          Visit Facebook Page
                        </a>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Certifications Card */}
            {certifications && certifications.length > 0 && (
              <div className="bg-white rounded-3xl border border-orange-100 shadow-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-orange-500 p-3 rounded-xl">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Certifications</h3>
                </div>
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-200 hover:border-orange-300 transition-all duration-300 group">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="font-medium text-gray-700">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Member Since Card */}
            {createdAt && (
              <div className="bg-white rounded-3xl border border-orange-100 shadow-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-orange-500 p-3 rounded-xl">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Member Since</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {new Date(createdAt).getFullYear()}
                </p>
                <p className="text-gray-600">
                  {new Date(createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            )}

            {/* Map Card */}
            <div className="bg-white rounded-3xl border border-orange-100 shadow-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-orange-500 p-3 rounded-xl">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Location</h3>
              </div>

              {fullAddress && (
                <p className="text-gray-600 mb-6">{fullAddress}</p>
              )}

              <div className="h-80 rounded-2xl overflow-hidden bg-gray-200 border border-orange-200">
                {isMapReady ? (
                  <MapContainer
                    center={mapCenter}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={mapCenter}>
                      <Popup>
                        <div className="text-center">
                          <strong>{shopName || 'Shop Location'}</strong>
                          <br />
                          {fullAddress}
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="loading loading-bars loading-md text-orange-500"></span>
                  </div>
                )}
              </div>

              {street && (
                <a
                  href={getDirectionsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-6 flex items-center justify-center gap-3 bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </a>
              )}
            </div>



          </div>
        </div>


      </div>
            <div className=" px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ReviewShow reviews={shopdata.reviews} />
                </div>
                <div className="">
                  <RatingForm onSubmit={handleFeedbackSubmit} />
                </div>
              </div>
            </div>
    </div>
  );
}