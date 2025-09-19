"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Image from "next/image";
import { Check, Headset, Share2, UserPlus } from "lucide-react";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function ServiceDetailsPage() {
  const position = [23.8041, 90.4152];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="relative h-80 md:h-96 w-full">
        <Image
          src="https://cdn.biswasautomobilesbd.com/article_images/655b1cbf475703d5024fb9fd.webp"
          alt="Service Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-6 left-6 text-white max-w-xl">
          <div className="bg-orange-500 px-3 py-1 rounded-full text-sm mb-2 inline-block">
            General Maintenance
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Complete Vehicle Maintenance Service
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
              <Image
                src="https://miro.medium.com/1*JktzC9GrA_l4yz0cCy8a5Q.jpeg"
                alt="AutoFix Garage"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-semibold">AutoFix Garage</p>
              <p className="text-sm">4.9 (127 reviews)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left/Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mechanic Info */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                    <Image
                      src="https://plus.unsplash.com/premium_photo-1661963333582-427bde8afe51?fm=jpg&q=60&w=3000"
                      alt="Mike Thompson"
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">Mike Thompson</h2>
                    <p className="text-gray-500">Certified Master Mechanic</p>
                    <p className="text-gray-400 text-sm">Thompson Auto Care</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-orange-500 hover:text-white flex items-center gap-2 transition">
                    <UserPlus /> Follow
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-orange-500 hover:text-white flex items-center gap-2 transition">
                    <Share2 /> Share
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-4 text-center mb-6">
                <div>
                  <p className="font-semibold">4.9 Rating</p>
                  <p className="text-sm text-gray-500">127 reviews</p>
                </div>
                <div>
                  <p className="font-semibold">450+ Jobs</p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
                <div>
                  <p className="font-semibold">12 Years</p>
                  <p className="text-sm text-gray-500">Experience</p>
                </div>
                <div>
                  <p className="font-semibold">Downtown</p>
                  <p className="text-sm text-gray-500">Seattle, WA</p>
                </div>
              </div>

              {/* Available Times */}
              <div>
                <h4 className="font-medium mb-2">Available Times</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"].map((time) => (
                    <button
                      key={time}
                      className="border rounded-md px-3 py-2 hover:bg-orange-50 text-gray-700"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact & Location */}
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <p className="text-sm text-gray-600">(206) 555-0123</p>
                  <p className="text-sm text-gray-600">mike@thompsonsauto.com</p>
                  <p className="text-sm text-gray-600">1234 Main St, Seattle, WA 98101</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Location</h4>
                  <MapContainer
                    center={position}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: "200px", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    />
                    <Marker position={position}>
                      <Popup>
                        <strong>AutoFix Garage</strong> <br /> Banasree, Dhaka
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </div>

            {/* Service Description & Benefits */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200 space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2">Service Description</h3>
                <p className="text-gray-600">
                  Keep your vehicle running smoothly with our comprehensive maintenance service. Certified mechanics perform inspections to ensure optimal performance, safety, and longevity.
                </p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4">
                <h4 className="font-semibold text-orange-500 mb-1">Special Offer</h4>
                <p className="text-sm text-gray-600">
                  Book this month and get 10% off your next service! Valid for new customers only.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">What is Included</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {[
                      "Multi-point inspection",
                      "Fluid level checks and top-offs",
                      "Battery and charging system test",
                      "Brake system inspection",
                      "Tire pressure and tread check",
                      "Detailed service report",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="text-orange-500" size={18} /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Service Benefits</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {[
                      "Prevent costly repairs",
                      "Improve fuel efficiency",
                      "Extend vehicle lifespan",
                      "Maintain warranty coverage",
                      "Ensure safety and reliability",
                      "Peace of mind driving",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="text-orange-500" size={18} /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <h3 className="text-2xl font-semibold mb-4">Customer Reviews</h3>
              <div className="space-y-6">
                {[
                  {
                    name: "Mr Johnson",
                    review: "Excellent service! Mike was professional and explained everything clearly. My car runs like new.",
                    date: "2 weeks ago",
                  },
                  {
                    name: "David Chen",
                    review: "Great experience. Fair pricing and quality work. Will definitely book again.",
                    date: "1 month ago",
                  },
                ].map((r, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src="https://img.freepik.com/free-photo/smiling-auto-mechanic-with-wrench-standing-hands-folded-white-background_662251-2939.jpg?semt=ais_incoming&w=740&q=80"
                        alt={r.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{r.name}</h4>
                        <div className="text-yellow-400">★★★★★</div>
                        <span className="text-sm text-gray-500">{r.date}</span>
                      </div>
                      <p className="text-gray-600">{r.review}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200 space-y-4">
              <h3 className="text-2xl font-semibold">Book This Service</h3>
              <button className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition">
                Book Now
              </button>
              <button className="w-full border border-gray-300 py-3 rounded-md hover:bg-orange-50 flex items-center justify-center gap-2 transition text-gray-700">
                <Headset /> Chat with Mike
              </button>
              <button className="w-full border border-gray-300 py-3 rounded-md hover:bg-orange-50 transition text-gray-700">
                Request Quote
              </button>
            </div>

            {/* Why Choose Card */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200 space-y-3">
              <h3 className="text-lg font-semibold mb-3">Why Choose Mike?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-orange-500 rounded"></div>
                  <div>
                    <p className="font-medium">Verified Mechanic</p>
                    <p className="text-sm text-gray-500">Background checked</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-600 rounded"></div>
                  <div>
                    <p className="font-medium">ASE Certified</p>
                    <p className="text-sm text-gray-500">Master technician</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-600 rounded"></div>
                  <div>
                    <p className="font-medium">Satisfaction Guaranteed</p>
                    <p className="text-sm text-gray-500">100% money back</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
