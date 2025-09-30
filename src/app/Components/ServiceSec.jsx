"use client";
import React, { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import Link from "next/link";

export default function ServiceSec() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/shops?home=true`)
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      });
  }, []);
  return (
    <>
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-5xl font-bold text-center">
              Trusted <span className="text-primary">Mechanics</span> Near You
            </h2>
            <p className="text-lg  mt-4">
              MechaLink connects you with verified mechanics nearby – making
              vehicle repairs and services faster, easier, and more reliable.
            </p>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex w-full flex-col gap-4">
                  <div className="skeleton h-60 w-full"></div>
                  <div className="skeleton h-6 w-28"></div>
                  <div className="skeleton h-6 w-full"></div>
                  <div className="skeleton h-6 w-full"></div>
                  <div className="skeleton h-6 w-full"></div>
                  <div className="skeleton h-6 w-full"></div>
                </div>
              ))}
            </div>
          )}

          {/* Services Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link href="/services">
              <button className="px-16  py-3 border border-primary hover:bg-primary  text-primary hover:text-white font-bold text-xl capitalize leading-none font-urbanist rounded-md transition duration-400 cursor-pointer">
                See All Mechanics
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}