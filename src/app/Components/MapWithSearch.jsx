"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { Search, MapPin, Loader2, Filter } from "lucide-react";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import Link from "next/link";

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
    fetch(`/api/maps?category=${encodeURIComponent(selectedCategory)}&search=${encodeURIComponent(search)}`)
      .then(res => res.json())
      .then(data => {
        const filteredData = data.filter(shop => shop.latitude && shop.longitude);
        setMechanicShops(filteredData);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch shops:", error);
        setLoading(false);
        setMechanicShops([]);
      });
  }, [search, selectedCategory])

  return (
    <section className="py-12 md:py-20 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-3 font-roboto-con">
            Find Mechanic Shops <span className="text-primary font-caveat inline-block">Near You</span>
          </h2>
          <p className="text-base md:text-xl max-w-2xl mx-auto font-nunito-sans">
            Explore local service providers and filter by category or search term.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 md:mb-8 bg-base-200 p-4 rounded-xl border border-base-300 shadow-lg">

          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/60 w-5 h-5" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by location"
              className="w-full pl-12 pr-5 py-3 rounded-xl border border-base-300 bg-base-100 text-base-content placeholder:text-base-content/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 sm:w-64">
            <Filter className="w-5 h-5 text-primary hidden sm:block" />
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select select-bordered w-full bg-base-100 border-base-300 text-base-content focus:border-primary focus:ring-1 focus:ring-primary text-sm shadow-sm"
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

        <div className="h-[600px] w-full relative bg-base-300 rounded-2xl shadow-2xl border-4 border-base-300 overflow-hidden">

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-base-100/80 backdrop-blur-sm z-[1000]">
              <div className="flex flex-col items-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" />
                <span className="text-lg font-semibold text-base-content">Loading map data...</span>
              </div>
            </div>
          )}

          {!loading && (
            <MapContainer
              center={[23.8121, 90.4134]}
              zoom={8}
              scrollWheelZoom={true}
              className="h-full w-full z-10"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {mechanicShops && mechanicShops.length > 0 ? (
                mechanicShops.map((shop) => (
                  <Marker
                    key={shop._id}
                    position={[shop.latitude, shop.longitude]}
                  >
                    <Popup className=" w-50">
                      <Link href={`/services/${shop._id}`}>
                        <img className="min-w-full w-50 h-40 object-cover" src={shop.logo} alt="Shop logo" />
                        <h4 className="text-sm font-semibold mt-3">{shop.shopName}</h4>
                      </Link>
                    </Popup>
                  </Marker>
                ))
              ) : (
                <div className="leaflet-control leaflet-bottom leaflet-left p-4 bg-warning/90 rounded-lg text-warning-content shadow-lg m-3 border border-warning">
                  No shops found for your search criteria. Try a different category or search term.
                </div>
              )}

              <FitBounds mechanicShops={mechanicShops} />
            </MapContainer>
          )}

          {!loading && mechanicShops.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center p-8 bg-base-100 rounded-xl shadow-2xl border border-base-300">
                <MapPin className="w-10 h-10 mx-auto text-warning mb-4" />
                <h3 className="text-xl font-bold text-base-content">No Shops Found</h3>
                <p className="text-base-content/70 mt-2 max-w-sm">
                  Your search or filter combination returned no results. Try adjusting the category or search term.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}