"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { Search, MapPin, Loader2, Filter } from "lucide-react";
import Link from "next/link";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function FitBounds({ mechanicShops }) {
  const map = useMap();

  useEffect(() => {
    if (!mechanicShops || mechanicShops.length === 0) {
      map.setView([23.8121, 90.4134], 8);
      return;
    }

    const bounds = L.latLngBounds(
      mechanicShops.map((shop) => [shop.latitude, shop.longitude])
    );

    map.flyToBounds(bounds, {
      padding: [75, 75],
      duration: 1.5,
    });
  }, [mechanicShops, map]);

  return null;
}

const shopCategories = [
  "Car Service & Repair",
  "Motorcycle Service & Repair",
  "Truck/Commercial Vehicle Service",
  "Home Appliance Repair",
  "HVAC & Cooling Specialist",
  "Car Detailing & Accessories",
];

export default function MapWithSearch() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [mechanicShops, setMechanicShops] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/maps?category=${encodeURIComponent(selectedCategory)}&search=${encodeURIComponent(search)}`
    )
      .then((res) => res.json())
      .then((data) => {
        const filteredData = data.filter((shop) => shop.latitude && shop.longitude);
        setMechanicShops(filteredData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch shops:", error);
        setLoading(false);
        setMechanicShops([]);
      });
  }, [search, selectedCategory]);

  return (
    <section className="py-16 bg-base-100 text-text font-poppins">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-urbanist text-base-content">
            Find <span className="text-primary inline-block">Mechanic Shops</span> Near You
          </h2>
          <p className="text-lg text-text/70 max-w-2xl mx-auto">
            Explore trusted service providers and filter by category or location to get quick, reliable help.
          </p>
        </div>

        {/* Search + Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 bg-base-200 p-5 rounded-xl shadow-md border border-neutral">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by shop name, service, or city..."
              className="w-full pl-12 pr-5 py-3 rounded-lg border border-neutral/50 bg-base-100 text-base-content placeholder:text-base-content outline-none transition-all duration-200"
            />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 sm:w-64">
            <Filter className="w-5 h-5 text-primary hidden sm:block" />
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select select-bordered w-full bg-base-100 border-neutral/50 text-base-content text-sm rounded-lg"
            >
              <option value="all">All Service Categories</option>
              {shopCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Map Card */}
        <div className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-xl border border-base-200">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-base-100 backdrop-blur-sm z-50">
              <div className="flex flex-col items-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" />
                <span className="text-lg font-semibold text-base-content/60">
                  Loading nearby shops...
                </span>
              </div>
            </div>
          )}

          {!loading && (
            <MapContainer
              center={[23.8121, 90.4134]}
              zoom={8}
              scrollWheelZoom={true}
              className="h-full w-full z-[1]"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {mechanicShops?.length > 0 ? (
                mechanicShops.map((shop) => (
                  <Marker key={shop._id} position={[shop.latitude, shop.longitude]}>
                    <Popup>
                      <div className="font-sans b flex flex-col text-center">
                        <strong className="text-primary text-lg mb-2">
                          {shop.shopName}
                        </strong>
                        <Link href={`/services/${shop._id}`}>
                          <button className="bg-primary text-white py-1 px-3 rounded-lg font-semibold hover:bg-primary/90 transition">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ))
              ) : (
                <div className="leaflet-control leaflet-bottom leaflet-left text-sm p-4 bg-yellow-100/90 text-yellow-800 rounded-lg shadow-lg m-3 border border-yellow-200">
                  No shops found. Try adjusting your filters.
                </div>
              )}

              <FitBounds mechanicShops={mechanicShops} />
            </MapContainer>
          )}

          {!loading && mechanicShops.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center p-8 bg-base-100 rounded-xl shadow-lg border border-neutral">
                <MapPin className="w-10 h-10 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-bold text-base-content">No Shops Found</h3>
                <p className="text-base-content/60 mt-2 max-w-sm mx-auto">
                  Your search didn’t match any shops. Try another keyword or category.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}