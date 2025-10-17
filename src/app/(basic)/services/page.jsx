"use client";

import React, { useEffect, useState } from "react";
import ServiceCard from "@/app/Components/ServiceCard";
import { Search, Filter, Star, MapPin, Users, Award, Shield, Sparkles } from "lucide-react";
import Loading from "../../Components/Loading"

const Services = () => {
  const [totalData, setTotalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    topRated: 0,
    certified: 0,
    active: 0
  });

  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/shops?search=${searchTerm}&sort=${sortOrder}&limit=${itemsPerPage}&page=${currentPage}`
    )
      .then((res) => res.json())
      .then((data) => {
        setTotalData(data);
        // Calculate stats from data
        if (data.result) {
          const shops = data.result;
          setStats({
            total: shops.length,
            topRated: shops.filter(shop => shop.rating >= 4.5).length,
            certified: shops.filter(shop => shop.isCertified).length,
            active: shops.filter(shop => shop.isActive).length
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching shops:", error);
        setLoading(false);
      });
  }, [searchTerm, sortOrder, itemsPerPage, currentPage]);

  const { result: services = [], totalDocs, totalPage } = totalData;

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


  const PaginationSkeleton = () => (
    <div className="flex flex-col md:flex-row justify-between mt-8 items-center gap-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="skeleton bg-gray-200 h-4 w-24 rounded"></div>
        <div className="skeleton bg-gray-200 h-10 w-20 rounded-lg"></div>
      </div>
      <div className="flex justify-center items-center gap-2">
        <div className="skeleton bg-gray-200 h-10 w-24 rounded-lg"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton bg-gray-200 h-10 w-10 rounded-lg"></div>
        ))}
        <div className="skeleton bg-gray-200 h-10 w-20 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Banner for Shops - Same color theme and height */}
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

      <section>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 -mt-8 pb-10 relative z-20">
          {/* Search & Sort Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Search */}
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="search"
                    placeholder="Search shops, mechanics, or locations..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full bg-gray-50 placeholder-gray-500 pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter className="text-gray-600 w-5 h-5" />
                <select
                  value={sortOrder}
                  onChange={handleSort}
                  className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 w-full md:w-auto"
                >
                  <option value="">All Shops</option>
                  <option value="htl">Rating: High to Low</option>
                  <option value="lth">Rating: Low to High</option>
                  <option value="certified">Certified Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <ServiceCardSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && services.length === 0 && (
            <div className="text-center py-16 rounded-2xl shadow-lg border border-gray-200 bg-white">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-12 h-12 text-orange-500" />
              </div>
              <p className="text-2xl text-orange-500 font-bold mb-2">
                No Shops Found
              </p>
              <p className="text-gray-500 max-w-md mx-auto">
                We couldn't find any service shops matching your criteria. Try adjusting your search filters.
              </p>
            </div>
          )}

          {/* Services Grid */}
          {!loading && services.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {services.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>

              {/* Pagination & Items per page */}
              <div className="flex flex-col md:flex-row justify-between mt-8 items-center gap-4">
                {/* Items per page */}
                <div className="flex items-center gap-3">
                  <label htmlFor="itemsPerPage" className="text-gray-600 font-medium">
                    Show per page:
                  </label>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPage}
                    className="px-4 py-2 bg-white rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                  >
                    <option value="12">12</option>
                    <option value="24">24</option>
                    <option value="36">36</option>
                    <option value="48">48</option>
                  </select>
                </div>

                {/* Page buttons */}
                <div className="flex justify-center items-center gap-2">
                  <button
                    className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPage }, (_, i) => (
                    <button
                      key={i}
                      className={`px-4 py-2 border rounded-lg transition-all duration-300 ${currentPage === i + 1
                          ? "bg-orange-500 text-white border-orange-500"
                          : "border-gray-300 text-gray-600 hover:bg-orange-50 hover:border-orange-500"
                        }`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage === totalPage}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Pagination Skeleton for loading state */}
          {loading && <PaginationSkeleton />}
        </div>
      </section>
    </div>
  );
};

export default Services;