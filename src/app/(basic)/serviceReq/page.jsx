"use client";

import { useEffect, useState } from "react";
import ServiceReqCard from "./components/ServiceReqCard";

// Fallback image URL
const BACKGROUND_IMAGE_URL =
  "https://images.unsplash.com/photo-1570129476815-ba368ac77013?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const OrangeSpinner = () => (
  <div className="flex justify-center items-center h-48">
    <div
      className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

const ServiceReq = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/service-request");

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
          setRequests(data.data);
        } else {
          console.error("❌ API response indicated failure:", data.message);
        }
      } catch (error) {
        console.error("❌ Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 1. HERO BANNER SECTION */}
      <section
        className="relative bg-cover bg-center"
        style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>

        <div className="container relative z-10 flex flex-col items-center justify-center text-center text-white py-40 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase mb-6 tracking-wide">
            Reliable Services, Anytime
          </h1>
          <p className="text-lg md:text-xl font-medium max-w-2xl mb-8">
            Browse trusted mechanics and service providers to keep your
            vehicle running smoothly without the stress.
          </p>

          {/* CTA Button */}
          <button className="px-8 py-3 bg-primary hover:bg-secondary text-white font-semibold rounded-full shadow-lg transition-all duration-300">
            Browse Services
          </button>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 -mt-8 pb-10">

        {/* Secondary Title/Description block */}
        <div className="text-center mt-18">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center">
            Welcome to <span className="text-primary">MechaLink</span>
          </h2>
          <p className="text-md max-w-2xl mx-auto md:text-xl mt-3">
            Explore our service requests, connect with skilled mechanics, and
            manage all your automotive needs in one place.
          </p>
        </div>

        {loading && (
          <div className="pt-10">
            <OrangeSpinner />
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className="text-center py-16 rounded-xl shadow-lg border border-gray-200">
            <p className="text-2xl text-orange-500 font-bold mb-2">
              No Requests Found
            </p>
            <p className="text-gray-500">
              You’re all caught up! There are currently no pending service
              requests.
            </p>
          </div>
        )}

        {!loading && requests.length > 0 && (
          <div className="space-y-6 pt-10">
            {requests.map((req) => (
              <ServiceReqCard key={req._id} request={req} mode="summary" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceReq;
