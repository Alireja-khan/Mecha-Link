"use client";
import React, { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import Link from "next/link";
import SpecificServices from "./SpecificServices";

export default function ServiceSec() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/shops?home=true`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setServices(data || []);
        setLoading(false);
      });
  }, []);

  // Service Card Skeleton Component
  const ServiceCardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-pulse">
      {/* Image Skeleton */}
      <div className="skeleton bg-gray-200 h-48 w-full rounded-2xl mb-4"></div>
      
      {/* Title Skeleton */}
      <div className="skeleton bg-gray-200 h-6 w-3/4 rounded mb-3"></div>
      
      {/* Rating Skeleton */}
      <div className="flex items-center gap-2 mb-3">
        <div className="skeleton bg-gray-200 h-5 w-5 rounded-full"></div>
        <div className="skeleton bg-gray-200 h-4 w-16 rounded"></div>
      </div>
      
      {/* Location Skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <div className="skeleton bg-gray-200 h-4 w-4 rounded"></div>
        <div className="skeleton bg-gray-200 h-4 w-32 rounded"></div>
      </div>
      
      {/* Services Skeleton */}
      <div className="space-y-2 mb-4">
        <div className="skeleton bg-gray-200 h-3 w-full rounded"></div>
        <div className="skeleton bg-gray-200 h-3 w-5/6 rounded"></div>
        <div className="skeleton bg-gray-200 h-3 w-4/6 rounded"></div>
      </div>
      
      {/* Button Skeleton */}
      <div className="skeleton bg-gray-200 h-10 w-full rounded-xl"></div>
    </div>
  );

  // Section Header Skeleton
  const SectionHeaderSkeleton = () => (
    <div className="text-center mb-10 max-w-2xl mx-auto animate-pulse">
      <div className="skeleton bg-gray-300 h-12 w-80 mx-auto rounded-lg mb-4"></div>
      <div className="skeleton bg-gray-300 h-5 w-full rounded mb-2"></div>
      <div className="skeleton bg-gray-300 h-5 w-5/6 mx-auto rounded"></div>
    </div>
  );

  return (
    <>
      <section className="py-20">
        <div>
          <SpecificServices></SpecificServices>
        </div>
        <div className="container">
          {loading ? (
            <SectionHeaderSkeleton />
          ) : (
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <h2 className="md:text-5xl text-4xl font-bold text-center">
                Trusted <span className="text-primary">Mechanics</span> Near You
              </h2>
              <p className="md:text-lg text-medium mt-4">
                MechaLink connects you with verified mechanics nearby – making
                vehicle repairs and services faster, easier, and more reliable.
              </p>
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {[...Array(6)].map((_, index) => (
                <ServiceCardSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Services Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {services?.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
          
          {/* See All Button */}
          <div className="text-center mt-10">
            {loading ? (
              <div className="skeleton bg-gray-300 h-12 w-48 mx-auto rounded-md"></div>
            ) : (
              <Link href="/services">
                <button className="px-16 py-3 border border-primary hover:bg-primary text-primary hover:text-white font-bold text-xl capitalize leading-none font-urbanist rounded-md transition duration-400 cursor-pointer">
                  See All Mechanics
                </button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}