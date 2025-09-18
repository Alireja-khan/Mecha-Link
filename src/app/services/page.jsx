import React from "react";
import ServiceBanner from "./ServiceBanner";
import ServiceCard from "../Components/ServiceCard";

export default function Services() {
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
    },
    {
      id: 7,
      name: "Prime Car Service",
      category: "Automobile",
      location: "Rangpur, Bangladesh",
      workingHour: "9:00 AM - 8:00 PM",
      weekend: "Friday",
      rating: 5,
      image: "https://placehold.co/600x400?text=Prime%20Car%20Service",
    },
    {
      id: 8,
      name: "Family Needs",
      category: "Household",
      location: "Mymensingh, Bangladesh",
      workingHour: "10:00 AM - 8:00 PM",
      weekend: "Saturday",
      rating: 2,
      image: "https://placehold.co/600x400?text=Family%20Needs",
    },
    {
      id: 9,
      name: "Super Auto Hub",
      category: "Automobile",
      location: "Dhaka, Bangladesh",
      workingHour: "8:00 AM - 7:00 PM",
      weekend: "Friday",
      rating: 4,
      image: "https://placehold.co/600x400?text=Super%20Auto%20Hub",
    },
    {
      id: 10,
      name: "Happy Home Store",
      category: "Household",
      location: "Chittagong, Bangladesh",
      workingHour: "9:00 AM - 8:30 PM",
      weekend: "Sunday",
      rating: 3,
      image: "https://placehold.co/600x400?text=Happy%20Home%20Store",
    },
    {
      id: 11,
      name: "Metro Car Clinic",
      category: "Automobile",
      location: "Sylhet, Bangladesh",
      workingHour: "9:00 AM - 7:00 PM",
      weekend: "Friday",
      rating: 5,
      image: "https://placehold.co/600x400?text=Metro%20Car%20Clinic",
    },
    {
      id: 12,
      name: "Smart Living",
      category: "Household",
      location: "Rajshahi, Bangladesh",
      workingHour: "10:00 AM - 9:00 PM",
      weekend: "Saturday",
      rating: 2,
      image: "https://placehold.co/600x400?text=Smart%20Living",
    },
  ];

  return (
    <>
      <ServiceBanner></ServiceBanner>
      <section className="py-20">
        <div className="container">
          <div className="flex justify-between">
            <div className="w-1/2">
              <div className="flex items-center gap-3">
                <label htmlFor="search">Search</label>
                <input
                  type="search"
                  placeholder="Search with shop name, mechanic name, location"
                  className="px-3 py-2 border-1 rounded-lg border-gray-300 w-3/4 focus:outline-none"
                />
              </div>
            </div>
            <div className="w-1/2 flex justify-end">
              <div className="flex items-center gap-3">
                <label htmlFor="sort">Sort by Rating</label>
                <select
                  name="sort"
                  id="sort"
                  className="px-3 py-2 border-1 rounded-lg border-gray-300 focus:outline-none"
                >
                  <option value="htl">High to Low</option>
                  <option value="lth">Low to High</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service}></ServiceCard>
            ))}
          </div>
          <div className="flex justify-between mt-8">
            <div>
              <div className="flex items-center gap-3">
                <label htmlFor="sort">Show on page</label>
                <select
                  name="sort"
                  id="sort"
                  className="px-3 py-2 border-1 rounded-lg border-gray-300 focus:outline-none"
                >
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="36">36</option>
                  <option value="48">48</option>
                </select>
              </div>
            </div>
            <div className="flex justify-center space-x-2">
              <button className="px-3 py-1 border rounded-md ">
                Prev
              </button>
              <button className="px-3 py-1 border rounded-md  ">
                1
              </button>
              <button className="px-3 py-1 border rounded-md">
                2
              </button>
              <button className="px-3 py-1 border rounded-md">
                3
              </button>
              <button className="px-3 py-1 border rounded-md">
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
