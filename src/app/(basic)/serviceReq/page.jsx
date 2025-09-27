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
  const [loading, setLoading] = useState(true);
  const [totalData, setTotalData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/service-request?search=${searchTerm}&sort=${sortOrder}&limit=${itemsPerPage}&page=${currentPage}`
    )
      .then((res) => res.json())
      .then((data) => {
        setTotalData(data);
        setLoading(false);
      });
  }, [searchTerm, itemsPerPage, currentPage, sortOrder]);
  const { result: requests = [], totalDocs, totalPage } = totalData;

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
    <div className="min-h-screen ">
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
            Browse trusted mechanics and service providers to keep your vehicle
            and electrionic heavy gadgets running smoothly without the stress.
          </p>
        </div>
      </section>

      <section>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 -mt-8 pb-10">
          <div className="text-center mt-18 mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center">
              Welcome to <span className="text-primary">MechaLink</span>
            </h2>
            <p className="text-md max-w-2xl mx-auto md:text-xl mt-3">
              Explore our service requests, find the request which is best with
              your shop category.
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
                  placeholder="Title, Type, or Location"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="flex-1 bg-white  placeholder-gray-800 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="font-medium">
                Sort by Priority:
              </label>
              <select
                name="sort"
                id="sort"
                value={sortOrder}
                onChange={handleSort}
                className="px-3 py-2  rounded-md border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option className="text-black" value="">
                  All
                </option>
                <option className="text-black" value="high">
                  High
                </option>
                <option className="text-black" value="low">
                  Low
                </option>
                <option className="text-black" value="emergency">
                  Emergency
                </option>
              </select>
            </div>
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
                You're all caught up! There are currently no pending service
                requests.
              </p>
            </div>
          )}

          {!loading && requests.length > 0 && (
            <div className="space-y-6 ">
              {requests.map((req) => (
                <ServiceReqCard key={req._id} request={req} />
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
                  <option value="12">10</option>
                  <option value="24">20</option>
                  <option value="36">30</option>
                  <option value="48">40</option>
                  <option value="48">50</option>
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
    </div>
  );
};

export default ServiceReq;
