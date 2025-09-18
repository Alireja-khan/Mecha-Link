import React from "react";
import ServiceCard from "./ServiceCard";

export default function ServiceSec() {
  const services = [
    {
      id: 1,
      name: "AutoFix Garage",
      category: "Automobile",
      location: "Dhaka, Bangladesh",
      workingHour: "9:00 AM - 8:00 PM",
      weekend: "Friday",
      rating: 4,
      image: "https://placehold.co/600x400?text=AutoFix%20Garage",
    },
    {
      id: 2,
      name: "Home Essentials",
      category: "Household",
      location: "Chittagong, Bangladesh",
      workingHour: "10:00 AM - 9:00 PM",
      weekend: "Sunday",
      rating: 3,
      image: "https://placehold.co/600x400?text=Home%20Essentials",
    },
    {
      id: 3,
      name: "Speedy Motors",
      category: "Automobile",
      location: "Khulna, Bangladesh",
      workingHour: "8:00 AM - 7:00 PM",
      weekend: "Friday",
      rating: 5,
      image: "https://placehold.co/600x400?text=Speedy%20Motors",
    },
    {
      id: 4,
      name: "Daily Needs Store",
      category: "Household",
      location: "Rajshahi, Bangladesh",
      workingHour: "9:30 AM - 8:30 PM",
      weekend: "Saturday",
      rating: 2,
      image: "https://placehold.co/600x400?text=Daily%20Needs%20Store",
    },
    {
      id: 5,
      name: "Elite Auto Care",
      category: "Automobile",
      location: "Sylhet, Bangladesh",
      workingHour: "9:00 AM - 6:00 PM",
      weekend: "Friday",
      rating: 4,
      image: "https://placehold.co/600x400?text=Elite%20Auto%20Care",
    },
    {
      id: 6,
      name: "City Home Mart",
      category: "Household",
      location: "Barisal, Bangladesh",
      workingHour: "10:00 AM - 9:00 PM",
      weekend: "Sunday",
      rating: 3,
      image: "https://placehold.co/600x400?text=City%20Home%20Mart",
    }
  ];
  return (
    <>
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-center">
              Trusted <span>Mechanics</span> Near You
            </h2>
            <p className="text-lg">
              Connect with skilled professionals mechanics to solve you issue
              faster.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service}></ServiceCard>
            ))}
          </div>
          <div className="text-center mt-10">
            <button className="px-16  py-3 bg-primary border border-primary hover:bg-secondary hover:border-secondary text-white font-bold text-xl capitalize leading-none font-urbanist rounded-md transition duration-400 cursor-pointer">
              See All Mechanics
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
