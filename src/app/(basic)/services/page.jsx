"use client";

import React, {useEffect, useState} from "react";
import ServiceCard from "@/app/Components/ServiceCard";
import Pagination from "@/app/Components/pagination";
import {Search, Filter, MapPin, Sparkles} from "lucide-react";

const Services = () => {
  const [totalData, setTotalData] = useState({
    result: [],
    totalDocs: 0,
    totalPage: 1,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRestored, setIsRestored] = useState(false);
  // get from local storage
  useEffect(() => {
    const savedPage = localStorage.getItem("mechanicShops_currentPage");
    const savedItems = localStorage.getItem("mechanicShops_itemsPerPage");

    if (savedPage) setCurrentPage(Number(savedPage));
    if (savedItems) setItemsPerPage(Number(savedItems));
    setIsRestored(true);
  }, []);

  //  Save to local storage
  useEffect(() => {
    localStorage.setItem("mechanicShops_currentPage", currentPage);
    localStorage.setItem("mechanicShops_itemsPerPage", itemsPerPage);
  }, [currentPage, itemsPerPage]);

  // Fetch data from API whenever search, sort, page, or itemsPerPage changes
  useEffect(() => {
    setLoading(true);
    if (!isRestored) return;
    const apiUrl = `/api/shops?search=${searchTerm}&sort=${sortOrder}&limit=${itemsPerPage}&page=${currentPage}`;

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setTotalData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching shops:", err);
        setTotalData({result: [], totalDocs: 0, totalPage: 1});
        setLoading(false);
      });
  }, [searchTerm, sortOrder, itemsPerPage, currentPage, isRestored]);

  const {result: services = [], totalDocs = 0, totalPage = 1} = totalData;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPage = (num) => {
    setItemsPerPage(num);
    setCurrentPage(1); // Reset page to 1 whenever items per page changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const ServiceCardSkeleton = () => (
    <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 p-6 animate-pulse">
      <div className="skeleton bg-base-300 h-48 w-full rounded-2xl mb-4"></div>
      <div className="skeleton bg-base-300 h-6 w-3/4 rounded mb-3"></div>
      <div className="flex items-center gap-2 mb-3">
        <div className="skeleton bg-base-300 h-5 w-5 rounded-full"></div>
        <div className="skeleton bg-base-300 h-4 w-16 rounded"></div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className="skeleton bg-base-300 h-4 w-4 rounded"></div>
        <div className="skeleton bg-base-300 h-4 w-32 rounded"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="skeleton bg-base-300 h-3 w-full rounded"></div>
        <div className="skeleton bg-base-300 h-3 w-5/6 rounded"></div>
        <div className="skeleton bg-base-300 h-3 w-4/6 rounded"></div>
      </div>
      <div className="skeleton bg-base-300 h-10 w-full rounded-xl"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary via-orange-600 to-red-600 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

        <div className="lg:container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-white text-sm font-semibold">
                  Trusted Service Providers
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Find Your Perfect
                <span className="block text-orange-100">Service Partner</span>
              </h1>
              <p className="text-xl text-orange-100 mb-8 leading-relaxed max-w-2xl">
                Connect with certified mechanics and service shops. Browse
                ratings, services, and locations to find the perfect match for
                your needs.
              </p>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-3xl border-2 border-white/20 flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin className="w-16 h-16 text-white mx-auto mb-4" />
                    <h3 className="text-white text-xl font-semibold mb-2">
                      Local Experts
                    </h3>
                    <p className="text-orange-100 text-sm">
                      Find trusted service providers in your area with verified
                      reviews and ratings
                    </p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400/20 rounded-full backdrop-blur-sm border border-yellow-300/30"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400/20 rounded-full backdrop-blur-sm border border-green-300/30"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section>
        <div className="lg:container mx-auto px-4 md:px-6 lg:px-8 -mt-8 pb-10 relative z-20">
          {/* Search & Sort */}
          <div className="bg-base-100 rounded-2xl shadow-xl p-6 mb-8 border border-base-300 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-5 h-5" />
              <input
                type="search"
                placeholder="Search shops, mechanics, or locations..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full bg-base-200 placeholder-base-content/70 pl-10 pr-4 py-3 rounded-xl border-2 border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Filter className="text-base-content/70 w-5 h-5" />
              <select
                value={sortOrder}
                onChange={handleSort}
                className="px-4 py-3 bg-base-200 rounded-xl border-2 border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 w-full md:w-auto"
              >
                <option value="">All Shops</option>
                <option value="htl">Rating: High to Low</option>
                <option value="lth">Rating: Low to High</option>
              </select>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(itemsPerPage)].map((_, index) => (
                <ServiceCardSkeleton key={index} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && services.length === 0 && (
            <div className="text-center py-16 rounded-2xl shadow-lg border border-base-300 bg-base-100">
              <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-12 h-12 text-primary" />
              </div>
              <p className="text-2xl text-primary font-bold mb-2">
                No Shops Found
              </p>
              <p className="text-base-content/70 max-w-md mx-auto">
                We couldn't find any service shops matching your criteria. Try
                adjusting your search filters.
              </p>
            </div>
          )}

          {/* Services Grid & Pagination */}
          {!loading && services.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-300">
                {services.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPage}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPage}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;
