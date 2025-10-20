"use client";

import { useEffect, useState } from "react";
import ServiceReqCard from "./components/ServiceReqCard";
import { Search, Filter, AlertTriangle, TrendingUp, Users, Clock, ArrowRight, Grid, List } from "lucide-react";

// Fallback image URL
const BACKGROUND_IMAGE_URL =
  "https://images.unsplash.com/photo-1570129476815-ba368ac77013?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const ServiceReq = () => {
  const [loading, setLoading] = useState(true);
  const [totalData, setTotalData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });

  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/service-request?search=${searchTerm}&sort=${sortOrder}&limit=${itemsPerPage}&page=${currentPage}`
    )
      .then((res) => res.json())
      .then((data) => {
        setTotalData(data);
        // Calculate stats from data
        if (data.result) {
          const requests = data.result;
          setStats({
            total: requests.length,
            pending: requests.filter(req => req.status === 'pending').length,
            inProgress: requests.filter(req => req.status === 'in-progress').length,
            completed: requests.filter(req => req.status === 'completed').length
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching service requests:", error);
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

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  // Skeleton Components
  const StatsSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-pulse">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white">
          <div className="skeleton bg-gray-300 w-8 h-8 mx-auto mb-2 rounded-full"></div>
          <div className="skeleton bg-gray-300 h-7 w-12 mx-auto mb-1 rounded"></div>
          <div className="skeleton bg-gray-300 h-4 w-16 mx-auto rounded"></div>
        </div>
      ))}
    </div>
  );

  const ServiceReqCardSkeleton = ({ compact = false }) => (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-pulse ${compact ? '' : 'mb-4'}`}>
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="skeleton bg-gray-200 h-6 w-3/4 rounded mb-3"></div>
          <div className="flex items-center gap-4 mb-3">
            <div className="skeleton bg-gray-200 h-5 w-24 rounded-full"></div>
            <div className="skeleton bg-gray-200 h-5 w-20 rounded-full"></div>
          </div>
        </div>
        <div className="skeleton bg-gray-200 h-8 w-20 rounded-full"></div>
      </div>

      {/* Content Section */}
      <div className="space-y-3 mb-4">
        <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
        <div className="skeleton bg-gray-200 h-4 w-5/6 rounded"></div>
        {!compact && (
          <div className="skeleton bg-gray-200 h-4 w-4/6 rounded"></div>
        )}
      </div>

      {/* Location and Vehicle Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="skeleton bg-gray-200 h-4 w-4 rounded"></div>
          <div className="skeleton bg-gray-200 h-4 w-32 rounded"></div>
        </div>
        <div className="skeleton bg-gray-200 h-5 w-24 rounded"></div>
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <div className="skeleton bg-gray-200 h-8 w-8 rounded-full"></div>
          <div className="skeleton bg-gray-200 h-4 w-20 rounded"></div>
        </div>
        <div className="skeleton bg-gray-200 h-10 w-28 rounded-xl"></div>
      </div>
    </div>
  );

  const PaginationSkeleton = () => (
    <div className="flex flex-col md:flex-row justify-between mt-8 items-center gap-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="skeleton bg-gray-200 h-4 w-24 rounded"></div>
        <div className="skeleton bg-gray-200 h-10 w-20 rounded-lg"></div>
      </div>
      <div className="flex justify-center items-center gap-2">
        <div className="skeleton bg-gray-200 h-10 w-20 rounded-lg"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton bg-gray-200 h-10 w-10 rounded-lg"></div>
        ))}
        <div className="skeleton bg-gray-200 h-10 w-20 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Interactive Banner */}
      <section className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Available Service Jobs
              <span className="block text-2xl md:text-3xl font-semibold text-orange-100 mt-2">
                Find Your Next Repair Assignment
              </span>
            </h1>

            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              Browse urgent repair requests, accept jobs that match your expertise, and grow your service business
            </p>

            {/* Quick Stats */}
            {loading ? (
              <StatsSkeleton />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white text-black">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm opacity-90">Total Requests</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white text-black">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.pending}</div>
                  <div className="text-sm opacity-90">Pending</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white text-black">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.inProgress}</div>
                  <div className="text-sm opacity-90">In Progress</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white text-black">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.completed}</div>
                  <div className="text-sm opacity-90">Completed</div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setSortOrder('emergency')}
                className="bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-orange-50 transition-all duration-300 flex items-center gap-2"
              >
                <AlertTriangle className="w-5 h-5" />
                Show Emergencies
              </button>
              <button
                onClick={() => setSortOrder('high')}
                className="bg-orange-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-800 transition-all duration-300 flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                High Priority
              </button>
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
                    placeholder="Search by title, type, or location..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full bg-gray-50 placeholder-gray-500 pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                  />
                </div>
              </div>

              {/* View Mode Toggle and Sort */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all duration-300 ${viewMode === "grid"
                      ? "bg-white text-orange-500 shadow-sm"
                      : "text-gray-500 hover:text-orange-500"
                      }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all duration-300 ${viewMode === "list"
                      ? "bg-white text-orange-500 shadow-sm"
                      : "text-gray-500 hover:text-orange-500"
                      }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-3">
                  <Filter className="text-gray-600 w-5 h-5" />
                  <select
                    value={sortOrder}
                    onChange={handleSort}
                    className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 w-full md:w-auto"
                  >
                    <option value="">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="low">Low Priority</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className={
              viewMode === "grid"
                ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
                : "space-y-6"
            }>
              {[...Array(6)].map((_, index) => (
                <ServiceReqCardSkeleton 
                  key={index} 
                  compact={viewMode === "grid"}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && requests.length === 0 && (
            <div className="text-center py-16 rounded-2xl shadow-lg border border-gray-200 bg-white">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-12 h-12 text-orange-500" />
              </div>
              <p className="text-2xl text-orange-500 font-bold mb-2">
                No Requests Found
              </p>
              <p className="text-gray-500 max-w-md mx-auto">
                You're all caught up! There are currently no pending service requests matching your criteria.
              </p>
            </div>
          )}

          {/* Service Requests Grid/List */}
          {!loading && requests.length > 0 && (
            <div className={
              viewMode === "grid"
                ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
                : "space-y-6"
            }>
              {requests?.map((req) => (
                <ServiceReqCard
                  key={req._id}
                  request={req}
                  compact={viewMode === "grid"}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {loading ? (
            <PaginationSkeleton />
          ) : (
            requests.length > 0 && (
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
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50</option>
                  </select>
                </div>

                {/* Page buttons */}
                <div className="flex justify-center items-center gap-2">
                  <button
                    className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Prev
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
                    className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    disabled={currentPage === totalPage}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default ServiceReq;