"use client";
import {useEffect, useState} from "react";

export default function AddressSelector({location, setLocation}) {
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
  }, [
    selectedArea,
    selectedCity,
    selectedDistrict,
    selectedRegion,
    locationData,
  ]);

  return (
    <div className="mt-2 space-y-4  rounded-lg">
      {/* Region Selector */}
      <div>
        <label className="block mb-1 ">Division</label>
        <select
          className="w-full p-2 border border-neutral rounded"
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
        <label className="block mb-1 ">District</label>
        <select
          className="w-full p-2 border border-neutral rounded"
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
        <label className="block mb-1 ">City</label>
        <select
          className="w-full p-2 border border-neutral rounded"
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
        <label className="block mb-1 "> Area</label>
        <select
          className="w-full p-2 border border-neutral rounded"
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

      {/* Final Selection Preview */}
      <div className="p-3 bg-white rounded border border-neutral mt-4">
        <p>
          <strong>Selected Address:</strong>
        </p>
        <input
          className="w-full"
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
