"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ServiceCard from "@/app/Components/ServiceCard";
import { MapPin, Loader2 } from "lucide-react";

export default function Category(){
    const searchParams = useSearchParams();
  const category = decodeURIComponent(searchParams.get("category") || ""); // ✅ decode URL safely

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    fetch(`/api/shops?category=${encodeURIComponent(category)}`)
      .then((res) => res.json())
      .then((data) => {
        setServices(data.result || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  return (
    <section className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold ">
            {category ? `${category}` : "All Categories"}
          </h1>
          <p className=" mt-2">
            Browse trusted mechanics and workshops under {category}.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
          </div>
        )}

        {/* Empty State */}
        {!loading && services.length === 0 && (
          <div className="text-center py-16 rounded-2xl shadow border border-gray-200">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-orange-500 mb-2">
              No Shops Found
            </h3>
            <p className="text-gray-500">
              We couldn’t find any services for "{category}".
            </p>
          </div>
        )}

        {/* Service Cards Grid */}
        {!loading && services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}