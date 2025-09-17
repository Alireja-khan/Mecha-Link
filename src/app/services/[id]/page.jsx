"use client";
import "leaflet/dist/leaflet.css";

import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import L from "leaflet";
import Image from "next/image";
import {Check, Headset, Share2, UserPlus} from "lucide-react";

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
    <div className="min-h-screen bg-white">
      <div className="relative h-80 bg-gray-100">
        <Image
          src="https://cdn.biswasautomobilesbd.com/article_images/655b1cbf475703d5024fb9fd.webp"
          alt="Service Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-6 left-6 text-white">
                
          <div className="bg-primary w-50 text-white px-3 py-1 rounded-full text-sm mb-2">
            General Maintenance eee
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Complete Vehicle Maintenance Service
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-white rounded-full overflow-hidden">
              <Image
                src="https://miro.medium.com/1*JktzC9GrA_l4yz0cCy8a5Q.jpeg"
                alt="Mike Thompson"
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg border border-color shadow-sm p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src="https://plus.unsplash.com/premium_photo-1661963333582-427bde8afe51?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FyJTIwcmVwYWlyJTIwc2hvcHxlbnwwfHwwfHx8MA%3D%3D"
                      alt="Mike Thompson"
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">Mike Thompson</h2>
                    <p className="text-neutral">Certified Master Mechanic</p>
                    <p className="text-sm text-neutral">Thompson Auto Care</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border  rounded-md hover:bg-gray-50 flex items-center gap-2">
                    <UserPlus />
                    Follow
                  </button>
                  <button className="px-4 py-2 border  rounded-md hover:bg-gray-50 flex items-center gap-2">
                    {" "}
                    <Share2 size={20} /> Share
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="font-semibold">4.9 Rating</p>
                  <p className="text-sm text-neutral">127 reviews</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">450+ Jobs</p>
                  <p className="text-sm text-neutral">Completed</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">12 Years</p>
                  <p className="text-sm text-neutral">Experience</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">Downtown</p>
                  <p className="text-sm text-neutral">Seattle, WA</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Available Times</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button className="border rounded-md px-3 py-2 hover:bg-gray-50">
                    9:00 AM
                  </button>
                  <button className="border rounded-md px-3 py-2 hover:bg-gray-50">
                    11:00 AM
                  </button>
                  <button className="border rounded-md px-3 py-2 hover:bg-gray-50">
                    1:00 PM
                  </button>
                  <button className="border rounded-md px-3 py-2 hover:bg-gray-50">
                    3:00 PM
                  </button>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h4 className="font-semibold mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <p>(206) 555-0123</p>
                    <p>mike@thompsonsauto.com</p>
                    <p>1234 Main St, Seattle, WA 98101</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Location</h4>
                  <MapContainer
                    center={position}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{height: "200px", width: "100%"}}
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

            <div className="bg-white rounded-lg border border-color shadow-sm p-6">
              <h3 className="text-2xl font-semibold mb-4">
                Service Description
              </h3>
              <p className="text-neutral mb-4">
                Keep your vehicle running smoothly with our comprehensive
                maintenance service. Our certified mechanics perform thorough
                inspections and maintenance to ensure your car optimal
                performance, safety, and longevity.
              </p>

              <div className="bg-blue-50 border border-color rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-[#55338A] mb-2">
                  Special Offer
                </h4>
                <p className="text-sm text-neutral">
                  Book this month and get 10% off your next service! Valid for
                  new customers only.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">What is Included</h4>
                  <ul className="space-y-2 text-sm text-neutral">
                    <li className="flex gap-2 items-center"><Check size={18}/> Multi-point inspection</li>
                    <li className="flex gap-2 items-center"><Check size={18}/> Fluid level checks and top-offs</li>
                    <li className="flex gap-2 items-center"><Check size={18}/> Battery and charging system test</li>
                    <li className="flex gap-2 items-center"><Check size={18}/> Brake system inspection</li>
                    <li className="flex gap-2 items-center"><Check size={18}/> Tire pressure and tread check</li>
                    <li className="flex gap-2 items-center"><Check size={18}/> Detailed service report</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Service Benefits</h4>
                  <ul className="space-y-2 text-sm text-neutral">
                    <li className="flex gap-2 items-center"><Check size={18}/> Prevent costly repairs</li>
                    <li className="flex gap-2 items-center"><Check size={18}/> Improve fuel efficiency</li>
                    <li className="flex gap-2 items-center"><Check size={18}/> Extend vehicle lifespan</li>
                    <li className="flex gap-2 items-center"><Check size={18}/> Maintain warranty coverage</li>
                    <li className="flex gap-2 items-center"><Check size={18}/> Ensure safety and reliability</li>
                    <li className="flex gap-2 items-center"><Check size={18}/> Peace of mind driving</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-color shadow-sm p-6">
              <h3 className="text-2xl font-semibold mb-4">Customer Reviews</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src="https://img.freepik.com/free-photo/smiling-auto-mechanic-with-wrench-standing-hands-folded-white-background_662251-2939.jpg?semt=ais_incoming&w=740&q=80"
                      alt="Sarah Johnson"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">Mr Johnson</h4>
                      <div className="text-yellow-400">★★★★★</div>
                      <span className="text-sm text-neutral">2 weeks ago</span>
                    </div>
                    <p className="text-neutral">
                      Excellent service! Mike was professional and explained
                      everything clearly. My car runs like new.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src="https://img.freepik.com/free-photo/smiling-auto-mechanic-with-wrench-standing-hands-folded-white-background_662251-2939.jpg?semt=ais_incoming&w=740&q=80"
                      alt="David Chen"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">David Chen</h4>
                      <div className="text-yellow-400">★★★★★</div>
                      <span className="text-sm text-neutral">1 month ago</span>
                    </div>
                    <p className="text-neutral">
                      Great experience. Fair pricing and quality work. Will
                      definitely book again.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-color shadow-sm p-6">
              <h3 className="text-2xl font-semibold mb-4">Book This Service</h3>
              <div className="space-y-4">
                <div className="border-t border-color pt-4">
                  <div className="space-y-2 mt-4">
                    <button className="w-full bg-primary cursor-pointer text-white py-3 rounded-md hover:bg-primary">
                      Book Now
                    </button>

                    <button className="w-full border cursor-pointer bg-secondary text-white border-gray-300 py-3 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2">
                     <Headset /> Chat with Mike
                    </button>

                    <button className="w-full border border-gray-300 py-3 rounded-md hover:bg-gray-50">
                      Request Quote
                    </button>
                  </div>
                </div>
              </div>
            </div>


            <div className="bg-white rounded-lg border border-color shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Why Choose Mike?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary rounded"></div>
                  <div>
                    <p className="font-medium">Verified Mechanic</p>
                    <p className="text-sm text-neutral">Background checked</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-600 rounded"></div>
                  <div>
                    <p className="font-medium">ASE Certified</p>
                    <p className="text-sm text-neutral">Master technician</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-600 rounded"></div>
                  <div>
                    <p className="font-medium">Satisfaction Guaranteed</p>
                    <p className="text-sm text-neutral">100% money back</p>
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
