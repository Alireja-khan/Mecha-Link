"use client";

import React, { useEffect, useState } from "react";
import ServiceReqCard from "./components/ServiceReqCard";
import { Search, Filter, AlertTriangle, TrendingUp, Users, Clock, Grid, List } from "lucide-react";
import Pagination from "@/app/Components/pagination";

const ServiceReq = () => {
  const [loading, setLoading] = useState(true);
  const [totalData, setTotalData] = useState({ result: [], totalDocs: 0, totalPage: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  // Fetch service requests whenever relevant params change
  useEffect(() => {
    setLoading(true);

    fetch(`/api/service-request?search=${searchTerm}&sort=${sortOrder}&limit=${itemsPerPage}&page=${currentPage}`)
      .then((res) => res.json())
      .then((data) => {
        setTotalData(data || { result: [], totalDocs: 0, totalPage: 1 });

        if (data.result) {
          const requests = data.result;
          setStats({
            total: data.totalDocs || 0,
            pending: requests.filter(req => req.status === 'pending').length,
            inProgress: requests.filter(req => req.status === 'in-progress').length,
            completed: requests.filter(req => req.status === 'completed').length,
          });
        } else {
          setStats({ total: 0, pending: 0, inProgress: 0, completed: 0 });
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching service requests:", error);
        setLoading(false);
      });
  }, [searchTerm, itemsPerPage, currentPage, sortOrder]);

  const { result: requests = [], totalDocs = 0, totalPage = 1 } = totalData;

  // Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // reset page on search
  };

  const handleSort = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1); // reset page on sort
  };

  const handleItemsPerPage = (num) => {
    setItemsPerPage(num);
    setCurrentPage(1); // reset page when changing items per page
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  // Skeleton components
  const StatsSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-pulse">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-base-100/90 backdrop-blur-sm rounded-xl p-4 border border-base-300">
          <div className="skeleton bg-base-200 w-8 h-8 mx-auto mb-2 rounded-full"></div>
          <div className="skeleton bg-base-200 h-7 w-12 mx-auto mb-1 rounded"></div>
          <div className="skeleton bg-base-200 h-4 w-16 mx-auto rounded"></div>
        </div>
      ))}
    </div>
  );

  const ServiceReqCardSkeleton = ({ compact = false }) => (
    <div className={`bg-base-200 rounded-2xl shadow-lg border border-neutral p-6 animate-pulse ${compact ? '' : 'mb-4'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="skeleton bg-base-300 h-6 w-3/4 rounded mb-3"></div>
          <div className="flex items-center gap-4 mb-3">
            <div className="skeleton bg-base-300 h-5 w-24 rounded-full"></div>
            <div className="skeleton bg-base-300 h-5 w-20 rounded-full"></div>
          </div>
        </div>
        <div className="skeleton bg-base-300 h-8 w-20 rounded-full"></div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="skeleton bg-base-300 h-4 w-full rounded"></div>
        <div className="skeleton bg-base-300 h-4 w-5/6 rounded"></div>
        {!compact && <div className="skeleton bg-base-300 h-4 w-4/6 rounded"></div>}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="skeleton bg-base-300 h-4 w-4 rounded"></div>
          <div className="skeleton bg-base-300 h-4 w-32 rounded"></div>
        </div>
        <div className="skeleton bg-base-300 h-5 w-24 rounded"></div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-neutral">
        <div className="flex items-center gap-4">
          <div className="skeleton bg-base-300 h-8 w-8 rounded-full"></div>
          <div className="skeleton bg-base-300 h-4 w-20 rounded"></div>
        </div>
        <div className="skeleton bg-base-300 h-10 w-28 rounded-xl"></div>
      </div>
    </div>
  );

  const PaginationSkeleton = () => (
    <div className="flex flex-col md:flex-row justify-between mt-8 items-center gap-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="skeleton bg-base-300 h-4 w-24 rounded"></div>
        <div className="skeleton bg-base-300 h-10 w-20 rounded-lg"></div>
      </div>
      <div className="flex justify-center items-center gap-2">
        <div className="skeleton bg-base-300 h-10 w-20 rounded-lg"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton bg-base-300 h-10 w-10 rounded-lg"></div>
        ))}
        <div className="skeleton bg-base-300 h-10 w-20 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="relative bg-gradient-to-r from-primary via-orange-600 to-red-600 py-16 overflow-hidden">
        <div className="lg:container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Available Service Jobs
            <span className="block text-2xl md:text-3xl font-semibold text-orange-100 mt-2">
              Find Your Next Repair Assignment
            </span>
          </h1>
          <p className="text-xl text-orange-100 mb-8 leading-relaxed">
            Browse urgent repair requests, accept jobs that match your expertise, and grow your service business
          </p>
          {loading ? <StatsSkeleton /> : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-base-100/90 rounded-xl p-4 border border-neutral text-base-content">
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm opacity-90">Total Requests</div>
              </div>
              <div className="bg-base-100/90 rounded-xl p-4 border border-neutral text-base-content">
                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.pending}</div>
                <div className="text-sm opacity-90">Pending</div>
              </div>
              <div className="bg-base-100/90 rounded-xl p-4 border border-neutral text-base-content">
                <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.inProgress}</div>
                <div className="text-sm opacity-90">In Progress</div>
              </div>
              <div className="bg-base-100/90 rounded-xl p-4 border border-neutral text-base-content">
                <AlertTriangle className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.completed}</div>
                <div className="text-sm opacity-90">Completed</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Search & Filters */}
      <section>
        <div className="lg:container mx-auto px-6 -mt-8 pb-10 relative z-20">
          <div className="bg-base-200 rounded-2xl shadow-xl p-6 mb-8 border border-neutral">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60 w-5 h-5" />
                <input
                  type="search"
                  placeholder="Search by title, type, or location..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full bg-base-100 placeholder-base-content/60 pl-10 pr-4 py-3 rounded-xl border-2 border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                />
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-base-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all duration-300 ${viewMode === "grid"
                      ? "bg-base-200 text-primary shadow-sm"
                      : "text-base-content/50 hover:text-primary"}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all duration-300 ${viewMode === "list"
                      ? "bg-base-200 text-primary shadow-sm"
                      : "text-base-content/50 hover:text-primary"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <Filter className="text-base-content/60 w-5 h-5" />
                  <select
                    value={sortOrder}
                    onChange={handleSort}
                    className="px-4 py-3 bg-base-100 rounded-xl border-2 border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 w-full md:w-auto"
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

          {/* Service Cards */}
          {loading ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 xl:grid-cols-2 gap-6" : "space-y-6"}>
              {[...Array(itemsPerPage)].map((_, index) => (
                <ServiceReqCardSkeleton key={index} compact={viewMode === "grid"} />
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-16 rounded-2xl shadow-lg border border-neutral bg-base-200">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-12 h-12 text-primary" />
              </div>
              <p className="text-2xl text-primary font-bold mb-2">No Requests Found</p>
              <p className="text-base-content/50 max-w-md mx-auto">
                You're all caught up! There are currently no pending service requests matching your criteria.
              </p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 xl:grid-cols-2 gap-6" : "space-y-6"}>
              {requests.map(req => (
                <ServiceReqCard key={req._id} request={req} compact={viewMode === "grid"} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {loading ? (
            <PaginationSkeleton />
          ) : (
            requests.length > 0 && totalPage > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPage}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPage}
              />
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default ServiceReq;
