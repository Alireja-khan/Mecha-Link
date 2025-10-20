"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ServiceCard from "@/app/Components/ServiceCard";
import { MapPin, Loader2, Sparkles } from "lucide-react";

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
    <section className="min-h-screen">
        <section className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span className="text-white text-sm font-semibold">Trusted Service Providers</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Find Your Perfect
                  <span className="block text-orange-100">Service Partner</span>
                </h1>

                <p className="text-xl text-orange-100 mb-8 leading-relaxed max-w-2xl">
                  Connect with certified mechanics and service shops. Browse ratings, services, and locations to find the perfect match for your needs.
                </p>

                
              </div>

              {/* Right Illustration/Content */}
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-3xl border-2 border-white/20 flex items-center justify-center">
                    <div className="text-center p-8">
                      <MapPin className="w-16 h-16 text-white mx-auto mb-4" />
                      <h3 className="text-white text-xl font-semibold mb-2">Local Experts</h3>
                      <p className="text-orange-100 text-sm">
                        Find trusted service providers in your area with verified reviews and ratings
                      </p>
                    </div>
                  </div>
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400/20 rounded-full backdrop-blur-sm border border-yellow-300/30"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400/20 rounded-full backdrop-blur-sm border border-green-300/30"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <div className="container mx-auto py-8">
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