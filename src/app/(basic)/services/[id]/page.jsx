"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Image from "next/image";
import { Check, Headset, Share2, UserPlus, MapPin, Clock, Phone, Mail, Star, Award, Calendar, Navigation } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const [shopdata, setShopdata] = useState({});
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default center
  const [isMapReady, setIsMapReady] = useState(false);
  
  useEffect(() => {
    fetch(`/api/shops/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setShopdata(data);
        
        // Try to geocode the address when data is loaded
        if (data.shop?.address) {
          geocodeAddress(data.shop.address);
        }
      });
  }, [id]);

  // Function to geocode address to coordinates
  const geocodeAddress = async (address) => {
    const { street, city, country, postalCode } = address;
    const fullAddress = `${street}, ${city}, ${country} ${postalCode}`;
    
    try {
      // Using OpenStreetMap Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        setIsMapReady(true);
      } else {
        // Fallback to default coordinates if geocoding fails
        console.warn('Geocoding failed, using default coordinates');
        setIsMapReady(true);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setIsMapReady(true);
    }
  };

  const getDirectionsUrl = () => {
    const { street, city, country, postalCode } = address;
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
    categories
  } = shop;

  const { street, city, country, postalCode } = address;
  const { phone, businessEmail, whatsapp } = contact;
  const { open, close, weekend } = workingHours;
  const { Car = {}, Motorcycle = {} } = vehicleTypes;
  const { facebook } = socialLinks;

  const carServices = Car;
  const MotorcycleServices = Motorcycle;

  // Format full address for display
  const fullAddress = street || city || country ? 
    `${street || ''}${street ? ', ' : ''}${city || ''}${city ? ', ' : ''}${country || ''}${postalCode ? ' ' + postalCode : ''}`.trim() 
    : 'Address not provided';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Shop Logo and Basic Info */}
            <div className="flex items-start gap-6">
              {logo && (
                <div className="relative w-24 h-24 rounded-2xl shadow-lg border-4 border-white overflow-hidden">
                  <Image
                    src={logo}
                    alt="Shop Logo"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{shopName || 'Not provided'}</h1>
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    <Star className="w-4 h-4" />
                    <span>4.8</span>
                  </div>
                </div>
                
                {categories && (
                  <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-3">
                    {categories}
                  </span>
                )}
                
                {details && (
                  <p className="text-gray-600 text-lg max-w-3xl">{details}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 lg:ml-auto">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg">
                <Phone className="w-4 h-4" />
                Contact
              </button>
              <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact & Hours Card */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Address */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                      <div className="space-y-1 text-gray-600">
                        <p>{street || 'Not provided'}</p>
                        <p>{city || 'Not provided'}{city && country ? ', ' : ''}{country || ''}</p>
                        <p>{postalCode || ''}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Headset className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                      <div className="space-y-1 text-gray-600">
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {phone || 'Not provided'}
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {businessEmail || 'Not provided'}
                        </p>
                        <p className="flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
                          </svg>
                          {whatsapp || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Working Hours</h3>
                      <div className="space-y-2 text-gray-600">
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
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Social Media</h3>
                        <a href={facebook} className="text-blue-600 hover:text-blue-800 transition-colors" target="_blank" rel="noopener noreferrer">
                          Visit Facebook Page
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Services Offered</h2>

              {/* Car Services */}
              {carServices && Object.keys(carServices).length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Car Services</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(carServices).map(([category, services]) => (
                      <div key={category} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">{category}</h4>
                        <ul className="space-y-2">
                          {services && services.map((service, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              <span>{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Motorcycle Services */}
              {MotorcycleServices && Object.keys(MotorcycleServices).length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Motorcycle Services</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(MotorcycleServices).map(([category, services]) => (
                      <div key={category} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">{category}</h4>
                        <ul className="space-y-2">
                          {services && services.map((service, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              <span>{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Certifications Card */}
            {certifications && certifications.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
                </div>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Member Since Card */}
            {createdAt && (
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Member Since</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {new Date(createdAt).getFullYear()}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            )}

            {/* Map Card */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Navigation className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Location</h3>
              </div>
              
              {fullAddress && (
                <p className="text-sm text-gray-600 mb-4">{fullAddress}</p>
              )}
              
              <div className="h-64 rounded-lg overflow-hidden bg-gray-200">
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
                    <div className="text-gray-500">Loading map...</div>
                  </div>
                )}
              </div>
              
              {street && (
                <a 
                  href={getDirectionsUrl()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}