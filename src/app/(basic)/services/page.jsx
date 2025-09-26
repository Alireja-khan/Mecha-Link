"use client";

import React, { useEffect, useState } from "react";
import ServiceBanner from "./ServiceBanner";
import ServiceCard from "@/app/Components/ServiceCard";
// import ServiceCard from "../../Components/ServiceCard";

export default function Services() {
  const [totalData, setTotalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/shops?search=${searchTerm}&sort=${sortOrder}&limit=${itemsPerPage}&page=${currentPage}`
    )
      .then((res) => res.json())
      .then((data) => {
        setTotalData(data);
        setLoading(false);
      });
  }, [searchTerm, sortOrder, itemsPerPage, currentPage]);
  const { result: services, totalDocs, totalPage } = totalData;

  console.log(services);

  // ===== Handlers =====
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
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
              Explore <span className="text-primary">MechaLink Services</span>
            </h2>
            <p className="text-md max-w-2xl mx-auto md:text-xl mt-3">
              Discover professional services for all your needs and manage
              bookings effortlessly with MechaLink.
            </p>
          </div>

          {/* Search & Sort */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            {/* Search */}
            <div className="flex-1">
              <div className="flex items-center gap-3 bg-primary rounded-lg px-4 py-1 shadow-sm">
                <label htmlFor="search" className="text-white font-medium">
                  Search
                </label>
                <input
                  type="search"
                  id="search"
                  placeholder="Shop, mechanic, or location"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="flex-1 bg-white  placeholder-gray-800 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                className="px-3 py-2  rounded-md border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option className="text-black" value="htl">
                  Rating: High to Low
                </option>
                <option className="text-black" value="lth">
                  Rating: Low to High
                </option>
              </select>
            </div>
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
                  className="px-3 py-2 border-2 rounded-lg border-primary focus:outline-none"
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
                className="px-5 py-1 border border-primary rounded-md hover:bg-primary hover:text-white transition duration-400 cursor-pointer"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Prev
              </button>

              {Array.from({ length: totalPage }, (_, i) => (
                <button
                  key={i}
                  className={`px-5 py-1 border rounded-md transition duration-400 cursor-pointer ${
                    currentPage === i + 1
                      ? "bg-primary text-white border-primary"
                      : "border-primary hover:bg-primary hover:text-white"
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="px-5 py-1 border border-primary rounded-md hover:bg-primary hover:text-white transition duration-400 cursor-pointer"
                disabled={currentPage === totalPage}
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
