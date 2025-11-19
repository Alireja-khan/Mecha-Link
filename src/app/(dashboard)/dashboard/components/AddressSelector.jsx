"use client";
import { useEffect, useState } from "react";

export default function AddressSelector({ location, setLocation }) {
  const [locationData, setLocationData] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  useEffect(() => {
    fetch("/location.json")
      .then((res) => res.json())
      .then((data) => setLocationData(data))
      .catch((err) => console.error("Failed to load locations:", err));
  }, []);

  // Get unique regions
  const regions = [...new Set(locationData.map((item) => item.region))];

  // Filter districts by region
  const districts = selectedRegion
    ? [
      ...new Set(
        locationData
          .filter((item) => item.region === selectedRegion)
          .map((i) => i.district)
      ),
    ]
    : [];

  // Filter cities by district
  const cities = selectedDistrict
    ? [
      ...new Set(
        locationData
          .filter((item) => item.district === selectedDistrict)
          .map((i) => i.city)
      ),
    ]
    : [];

  // Filter covered areas by city
  const areas = selectedCity
    ? locationData.find((item) => item.city === selectedCity)?.covered_area ||
    []
    : [];

  useEffect(() => {
    if (selectedArea && selectedCity && selectedDistrict && selectedRegion) {
      const selected = locationData.find((item) => item.city === selectedCity);
      setLocation({
        address: `${selectedArea}, ${selectedCity}, ${selectedDistrict}, ${selectedRegion}`,
        latitude: selected?.latitude || null,
        longitude: selected?.longitude || null,
      });
    }
    // If any selection is cleared, ensure the address is also cleared partially or fully
    if (!selectedArea) {
      setLocation((prev) => ({
        ...prev,
        address: selectedCity
          ? `[Select Area], ${selectedCity}, ${selectedDistrict}, ${selectedRegion}`
          : "",
      }));
    }
  }, [
    selectedArea,
    selectedCity,
    selectedDistrict,
    selectedRegion,
    locationData,
    setLocation,
  ]);

  return (
    // Updated container background to base-200 for subtle contrast against base-100 cards
    <div className="mt-2 space-y-4">
      {/* Region Selector */}
      <div>
        {/* Updated label color */}
        <label className="block mb-1 text-sm font-medium text-base-content">Division</label>
        <select
          // Updated color classes and focus styles
          className="w-full p-3 border border-neutral rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-base-100 text-base-content transition-colors"
          value={selectedRegion}
          onChange={(e) => {
            setSelectedRegion(e.target.value);
            setSelectedDistrict("");
            setSelectedCity("");
            setSelectedArea("");
          }}
        >
          <option value="">Select Division</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* District Selector */}
      <div>
        <label className="block mb-1 text-sm font-medium text-base-content">District</label>
        <select
          // Updated color classes and focus styles
          className="w-full p-3 border border-neutral rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-base-100 text-base-content transition-colors disabled:bg-base-200 disabled:opacity-70 disabled:cursor-not-allowed"
          value={selectedDistrict}
          onChange={(e) => {
            setSelectedDistrict(e.target.value);
            setSelectedCity("");
            setSelectedArea("");
          }}
          disabled={!selectedRegion}
        >
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      {/* City Selector */}
      <div>
        <label className="block mb-1 text-sm font-medium text-base-content">City</label>
        <select
          // Updated color classes and focus styles
          className="w-full p-3 border border-neutral rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-base-100 text-base-content transition-colors disabled:bg-base-200 disabled:opacity-70 disabled:cursor-not-allowed"
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setSelectedArea("");
          }}
          disabled={!selectedDistrict}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Covered Area Selector */}
      <div>
        <label className="block mb-1 text-sm font-medium text-base-content">Area</label>
        <select
          // Updated color classes and focus styles
          className="w-full p-3 border border-neutral rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-base-100 text-base-content transition-colors disabled:bg-base-200 disabled:opacity-70 disabled:cursor-not-allowed"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          disabled={!selectedCity}
        >
          <option value="">Select Area</option>
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {/* Final Selection Preview - Added base-200 background for emphasis */}
      <div className="p-3 bg-base-200 rounded-lg border border-neutral mt-4 text-base-content text-sm">
        <p className="font-semibold mb-1">
          Final Address (Editable):
        </p>
        <input
          // Updated input styles to match form theme
          className="w-full p-2 border border-neutral rounded-lg focus:ring-1 focus:ring-primary bg-base-100 text-base-content text-sm"
          type="text"
          required
          onChange={(e) =>
            setLocation((prev) => ({
              ...prev,
              address: e.target.value,
            }))
          }
          value={location.address}
        />
      </div>
    </div>
  );
}