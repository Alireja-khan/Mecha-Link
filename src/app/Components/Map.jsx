"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Sample mechanic shops
const mechanicShops = [
  { id: 1, name: "Faruk Auto Service", latitude: 22.9487, longitude: 91.1849, location: "Chittagong" },
  { id: 2, name: "Omar Car Repair", latitude: 22.9495, longitude: 91.1857, location: "Chittagong" },
  { id: 3, name: "Chittagong Garage", latitude: 22.9502, longitude: 91.1839, location: "Chittagong" },
  { id: 4, name: "Speedy Motors", latitude: 22.9479, longitude: 91.1862, location: "Chittagong" },
  { id: 5, name: "City Auto Works", latitude: 22.9510, longitude: 91.1850, location: "Chittagong" },
  { id: 6, name: "Pro Mechanic Center", latitude: 22.9492, longitude: 91.1835, location: "Chittagong" },
  { id: 7, name: "Elite Car Service", latitude: 22.9480, longitude: 91.1842, location: "Chittagong" },
  { id: 8, name: "Rapid Garage", latitude: 22.9507, longitude: 91.1845, location: "Chittagong" },
  { id: 9, name: "Top Gear Auto", latitude: 22.9498, longitude: 91.1860, location: "Chittagong" },
  { id: 10, name: "Mega Motors Hub", latitude: 22.9515, longitude: 91.1838, location: "Chittagong" },
  { id: 11, name: "Home Service Kushtia", latitude: 23.9103, longitude: 89.1339, location: "Kushtia" },
  { id: 12, name: "Desh Travels, Rajshahi Garage", latitude: 24.3858, longitude: 88.5489, location: "Rajshahi" },
  { id: 13, name: "M/S RATUL AUTO", latitude: 22.6947, longitude: 90.3571, location: "Chittagong" },
  { id: 14, name: "Rana Auto Care", latitude: 25.7526, longitude: 89.2299, location: "Dinajpur" },
  { id: 15, name: "Moti Garage", latitude: 25.6302, longitude: 88.6308, location: "Pabna" },
  { id: 16, name: "M/S Hammad Motors", latitude: 24.8953, longitude: 91.8661, location: "Sylhet" },
  { id: 17, name: "Combat Care MT Garage", latitude: 23.8375, longitude: 90.4144, location: "Dhaka" },
];

// Component to fly map to searched location
function FlyToLocation({ query }) {
  const map = useMap();

  if (!query) return null;

  // Fetch coordinates from OpenStreetMap Nominatim
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`, {
    headers: { "User-Agent": "mechanic-map-app/1.0" },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        map.flyTo([parseFloat(lat), parseFloat(lon)], 15, { duration: 1.5 });
      }
    })
    .catch((err) => console.error(err));

  return null;
}

export default function MapWithSearch() {
  const [search, setSearch] = useState("");

  return (
    <section className="py-20">
      <div className="container mx-auto">
        <div className="max-w-lg mx-auto mb-5">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search place or city..."
            className="w-full px-5 py-2 rounded-lg border border-gray-300"
          />
        </div>

        <div className="h-[500px] w-full">
          <MapContainer
            center={[23.8121, 90.4134]} // initial center
            zoom={8}
            scrollWheelZoom={true}
            className="h-full w-full rounded-lg z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Markers */}
            {mechanicShops.map((shop) => (
              <Marker key={shop.id} position={[shop.latitude, shop.longitude]}>
                <Popup>
                  <strong>{shop.name}</strong>
                  <br />
                  {shop.location}
                </Popup>
              </Marker>
            ))}

            {/* Fly to searched location */}
            <FlyToLocation query={search} />
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
