"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ServiceCard from "@/app/Components/ServiceCard";
import { MapPin, Loader2, Sparkles, Search, Filter } from "lucide-react";
import Pagination from "@/app/Components/pagination";


export default function Category(){
    const searchParams = useSearchParams();
  const category = decodeURIComponent(searchParams.get("category") || "");

  const [allServices, setAllServices] = useState([]); // All services from the category
  const [filteredServices, setFilteredServices] = useState([]); // Services after search/filter
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Initial load - get all category data
  useEffect(() => {
    if (!category) return;
    setLoading(true);
    fetch(`/api/shops?category=${encodeURIComponent(category)}`)
      .then((res) => res.json())
      .then((data) => {
        const services = data.result || [];
        setAllServices(services);
        setFilteredServices(services); // Initially show all services
        setLoading(false);
        setCurrentPage(1); // Reset to first page when category changes
      })
      .catch(() => setLoading(false));
  }, [category]);

  // Apply search and filters locally
  useEffect(() => {
    if (allServices.length === 0) return;

    let result = [...allServices];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(service => 
        service.shop?.shopName?.toLowerCase().includes(searchLower) ||
        service.ownerName?.toLowerCase().includes(searchLower) ||
        service.shop?.address?.city?.toLowerCase().includes(searchLower) ||
        service.shop?.address?.country?.toLowerCase().includes(searchLower) ||
        service.shop?.services?.some(serviceItem => 
          serviceItem.serviceName?.toLowerCase().includes(searchLower) ||
          serviceItem.description?.toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply sort
    if (sortOrder === "htl") {
      result.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    } else if (sortOrder === "lth") {
      result.sort((a, b) => (a.avgRating || 0) - (b.avgRating || 0));
    } 

    setFilteredServices(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [allServices, searchTerm, sortOrder]);

  // Calculate paginated services
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  // Search handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Sort handler
  const handleSort = (e) => {
    setSortOrder(e.target.value);
  };

  // Page change handler
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Optional: Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Items per page change handler
  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <section className="min-h-screen bg-base-200">
        <section className="relative bg-gradient-to-r from-primary via-orange-600 to-red-600 py-16 overflow-hidden">
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
                  <span className="block text-orange-100">{category} <span className="text-white">shops</span></span>
                </h1>

                <p className="text-xl text-orange-100 mb-8 leading-relaxed max-w-2xl">
                  Connect with certified mechanics and service shops in {category}. Browse ratings, services, and locations to find the perfect match for your needs.
                </p>
              </div>

              {/* Right Illustration/Content */}
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-3xl border-2 border-white/20 flex items-center justify-center">
                    <div className="text-center p-8">
                      <MapPin className="w-16 h-16 text-white mx-auto mb-4" />
                      <h3 className="text-white text-xl font-semibold mb-2">{category}</h3>
                      <p className="text-orange-100 text-sm">
                        Find trusted {category.toLowerCase()} providers in your area with verified reviews and ratings
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

      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 -mt-8 pb-10 relative z-20">
        {/* Search & Sort Card */}
        <div className="bg-base-100 rounded-2xl shadow-xl p-6 mb-8 border border-base-300">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search */}
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-5 h-5" />
                <input
                  type="search"
                  placeholder={`Search ${category} shops, mechanics, or locations...`}
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full bg-base-200 placeholder-base-content/70 pl-10 pr-4 py-3 rounded-xl border-2 border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Filter className="text-base-content/70 w-5 h-5" />
              <select
                value={sortOrder}
                onChange={handleSort}
                className="px-4 py-3 bg-base-200 rounded-xl border-2 border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 w-full md:w-auto"
              >
                <option value="">{category} Shops</option>
                <option value="htl">Rating: High to Low</option>
                <option value="lth">Rating: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-base-content/70">
            {!loading && filteredServices.length > 0 
              ? `Showing ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredServices.length)} of ${filteredServices.length} ${filteredServices.length === 1 ? 'shop' : 'shops'}`
              : `Browse trusted ${category.toLowerCase()} providers`
            }
            {(searchTerm || sortOrder) && " with current filters"}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <span className="ml-2 text-base-content">Loading {category} shops...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredServices.length === 0 && (
          <div className="text-center py-16 rounded-2xl shadow-lg border border-base-300 bg-base-100">
            <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-12 h-12 text-primary" />
            </div>
            <p className="text-2xl text-primary font-bold mb-2">
              No {category} Shops Found
            </p>
            <p className="text-base-content/70 max-w-md mx-auto">
              {searchTerm || sortOrder 
                ? `We couldn't find any ${category} shops matching "${searchTerm}". Try adjusting your search.`
                : `We couldn't find any service shops in ${category}. Try browsing other categories.`
              }
            </p>
          </div>
        )}

        {/* Service Cards Grid */}
        {!loading && filteredServices.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {currentServices.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </>
        )}
      </div>
    </section>
  );
}