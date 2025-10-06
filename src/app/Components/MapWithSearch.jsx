"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";

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
    if (!mechanicShops || mechanicShops.length === 0) return;

    const bounds = L.latLngBounds(
      mechanicShops.map((shop) => [shop.latitude, shop.longitude])
    );
    map.fitBounds(bounds, { padding: [50, 50] }); // smooth zoom and padding
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
    fetch(`/api/maps?category=${encodeURIComponent(selectedCategory)}&search=${search}`)
      .then(res => res.json())
      .then(data => {
        setMechanicShops(data);
        setLoading(false);
      })
  }, [search, selectedCategory])

  return (
    <section className="py-20">
      <div className="container">
        <div className="flex justify-between">
          <div className="max-w-lg mb-5">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search place or city..."
              className="w-full px-5 py-2 rounded-lg border border-gray-300"
            />
          </div>
          <div className="flex gap-2">
            <label htmlFor="category" className="font-medium text-gray-700">
              Select Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {shopCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-[500px] w-full">
          {
            loading && (
              <div className="flex items-center justify-center h-screen w-full">
                <span className="loading loading-bars loading-xl text-orange-500"></span>
              </div>
            )
          }
          {!loading &&
            <MapContainer
              center={[23.8121, 90.4134]}
              zoom={8}
              scrollWheelZoom={false}
              className="h-full w-full rounded-lg z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {mechanicShops && mechanicShops?.map((shop) => (
                <Marker key={shop._id} position={[shop.latitude, shop.longitude]}>
                  <Popup className=" w-50">
                    <Link href={`/services/${shop._id}`}>
                      <img className="min-w-full w-50 h-40 object-cover" src={shop.logo} alt="Shop logo" />
                      <h4 className="text-sm font-semibold mt-3">{shop.shopName}</h4>
                    </Link>
                  </Popup>
                </Marker>
              ))}
              <FitBounds mechanicShops={mechanicShops} />
            </MapContainer>
          }
        </div>
      </div>
    </section>
  );
}
