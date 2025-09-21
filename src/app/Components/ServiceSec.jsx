import React from "react";
import ServiceCard from "./ServiceCard";
import Link from "next/link";

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
      image: "https://i.ibb.co.com/twWwK13q/pexels-olly-3817756.jpg",
    },
    {
      id: 2,
      name: "Home Essentials",
      category: "Household",
      location: "Chittagong, Bangladesh",
      workingHour: "10:00 AM - 9:00 PM",
      weekend: "Sunday",
      rating: 3,
      image: "https://i.ibb.co.com/j96BjHkM/pexels-olly-3846508.jpg",
    },
    {
      id: 3,
      name: "Speedy Motors",
      category: "Automobile",
      location: "Khulna, Bangladesh",
      workingHour: "8:00 AM - 7:00 PM",
      weekend: "Friday",
      rating: 5,
      image: "https://i.ibb.co.com/d0xkrYqh/pexels-gustavo-fring-6870320.jpg",
    },
    {
      id: 4,
      name: "Daily Needs Store",
      category: "Household",
      location: "Rajshahi, Bangladesh",
      workingHour: "9:30 AM - 8:30 PM",
      weekend: "Saturday",
      rating: 2,
      image: "https://i.ibb.co.com/ds3m107k/pexels-centre-for-ageing-better-55954677-7849743.jpg",
    },
    {
      id: 5,
      name: "Elite Auto Care",
      category: "Automobile",
      location: "Sylhet, Bangladesh",
      workingHour: "9:00 AM - 6:00 PM",
      weekend: "Friday",
      rating: 4,
      image: "https://i.ibb.co.com/1G6K3BDg/pexels-gustavo-fring-4173282.jpg",
    },
    {
      id: 6,
      name: "City Home Mart",
      category: "Household",
      location: "Barisal, Bangladesh",
      workingHour: "10:00 AM - 9:00 PM",
      weekend: "Sunday",
      rating: 3,
      image: "https://i.ibb.co.com/279cNcqV/pexels-cottonbro-4489732.jpg",
    },
  ];
  return (
    <>
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-5xl font-bold text-center">
              Trusted <span className="text-primary">Mechanics</span> Near You
            </h2>
            <p className="text-lg text-gray-600 mt-4">
              MechaLink connects you with verified mechanics nearby – making vehicle
              repairs and services faster, easier, and more reliable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service}></ServiceCard>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href='/services'>
              <button className="px-16  py-3 bg-white border border-primary hover:bg-primary  text-primary hover:text-white font-bold text-xl capitalize leading-none font-urbanist rounded-md transition duration-400 cursor-pointer">
                See All Mechanics
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
