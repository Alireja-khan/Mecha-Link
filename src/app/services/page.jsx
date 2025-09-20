"use client";

import React, { useState } from "react";
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
      image: "https://i.ibb.co/twWwK13q/pexels-olly-3817756.jpg",
    },
    {
      id: 2,
      name: "Home Essentials",
      category: "Household",
      location: "Chittagong, Bangladesh",
      workingHour: "10:00 AM - 9:00 PM",
      weekend: "Sunday",
      rating: 3,
      image: "https://i.ibb.co/j96BjHkM/pexels-olly-3846508.jpg",
    },
    {
      id: 3,
      name: "Speedy Motors",
      category: "Automobile",
      location: "Khulna, Bangladesh",
      workingHour: "8:00 AM - 7:00 PM",
      weekend: "Friday",
      rating: 5,
      image: "https://i.ibb.co/d0xkrYqh/pexels-gustavo-fring-6870320.jpg",
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
    {
      id: 7,
      name: "Prime Car Service",
      category: "Automobile",
      location: "Rangpur, Bangladesh",
      workingHour: "9:00 AM - 8:00 PM",
      weekend: "Friday",
      rating: 5,
      image: "https://i.ibb.co.com/0pFykFJ7/pexels-sergey-sergeev-2153675005-32845697.jpg",
    },
    {
      id: 8,
      name: "Family Needs",
      category: "Household",
      location: "Mymensingh, Bangladesh",
      workingHour: "10:00 AM - 8:00 PM",
      weekend: "Saturday",
      rating: 2,
      image: "https://i.ibb.co.com/CsMCdKgP/pexels-cottonbro-4489748.jpg",
    },
    {
      id: 9,
      name: "Super Auto Hub",
      category: "Automobile",
      location: "Dhaka, Bangladesh",
      workingHour: "8:00 AM - 7:00 PM",
      weekend: "Friday",
      rating: 4,
      image: "https://i.ibb.co.com/N6kYLt4S/pexels-olly-3822843.jpg",
    },
    {
      id: 10,
      name: "Happy Home Store",
      category: "Household",
      location: "Chittagong, Bangladesh",
      workingHour: "9:00 AM - 8:30 PM",
      weekend: "Sunday",
      rating: 3,
      image: "https://i.ibb.co.com/JFqMFR8y/pexels-olly-3807120.jpg",
    },
    {
      id: 11,
      name: "Metro Car Clinic",
      category: "Automobile",
      location: "Sylhet, Bangladesh",
      workingHour: "9:00 AM - 7:00 PM",
      weekend: "Friday",
      rating: 5,
      image: "https://i.ibb.co.com/4Rvr6PFS/pexels-pixabay-279949.jpg",
    },
    {
      id: 12,
      name: "Smart Living",
      category: "Household",
      location: "Rajshahi, Bangladesh",
      workingHour: "10:00 AM - 9:00 PM",
      weekend: "Saturday",
      rating: 2,
      image: "https://i.ibb.co.com/zTn519zm/kato-blackmore-qc-F-19-Bv-Vi-E-unsplash.jpg",
    },
  ];

  // ===== State =====
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("htl"); // htl = High to Low
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  // ===== Filter & Sort =====
  const filteredServices = services
    .filter((service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "htl" ? b.rating - a.rating : a.rating - b.rating
    );

  // ===== Pagination =====
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const displayedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ===== Handlers =====
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleSort = (e) => {
    setSortOrder(e.target.value);
  };

  const handleItemsPerPage = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <ServiceBanner />
      <section className="py-20">
        <div className="container">
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center">
              Explore <span className="text-orange-500">MechaLink Services</span>
            </h2>
            <p className="text-md max-w-2xl mx-auto md:text-xl mt-3">
              Discover professional services for all your needs and manage bookings effortlessly with MechaLink.
            </p>
          </div>

          {/* Search & Sort */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            {/* Search */}
            <div className="flex-1">
              <div className="flex items-center gap-3 bg-orange-500 rounded-lg px-4 py-1 shadow-sm">
                <label htmlFor="search" className="text-white font-medium">
                  Search
                </label>
                <input
                  type="search"
                  id="search"
                  placeholder="Shop, mechanic, or location"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="flex-1 bg-white text-gray-900 placeholder-gray-800 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="font-medium">
                Sort by
              </label>
              <select
                name="sort"
                id="sort"
                value={sortOrder}
                onChange={handleSort}
                className="px-3 py-2 bg-white rounded-md border-2 border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="htl">Rating: High to Low</option>
                <option value="lth">Rating: Low to High</option>
              </select>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {displayedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {/* Pagination & Items per page */}
          <div className="flex justify-between mt-8 items-center">
            {/* Items per page */}
            <div>
              <div className="flex items-center gap-3">
                <label htmlFor="itemsPerPage">Show on page</label>
                <select
                  name="itemsPerPage"
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={handleItemsPerPage}
                  className="px-3 py-2 border-2 rounded-lg border-orange-500 focus:outline-none"
                >
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="36">36</option>
                  <option value="48">48</option>
                </select>
              </div>
            </div>

            {/* Page buttons */}
            <div className="flex justify-center space-x-2">
              <button
                className="px-5 py-1 border border-orange-500 rounded-md hover:bg-orange-500 hover:text-white transition duration-400 cursor-pointer"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-5 py-1 border rounded-md transition duration-400 cursor-pointer ${
                    currentPage === i + 1
                      ? "bg-orange-500 text-white border-orange-500"
                      : "border-orange-500 hover:bg-orange-500 hover:text-white"
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="px-5 py-1 border border-orange-500 rounded-md hover:bg-orange-500 hover:text-white transition duration-400 cursor-pointer"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
