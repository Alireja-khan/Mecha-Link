"use client";

import React, { useEffect, useState } from "react";
import ServiceReqCard from "./components/ServiceReqCard";
import { Search, Filter, AlertTriangle, TrendingUp, Users, Clock, ArrowRight, Grid, List } from "lucide-react";

const ServiceReq = () => {
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [totalData, setTotalData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });

  useEffect(() => {
    if (firstLoad) {
      setLoading(true);
    }

    fetch(
      `/api/service-request?search=${searchTerm}&sort=${sortOrder}&limit=${itemsPerPage}&page=${currentPage}`
    )
      .then((res) => res.json())
      .then((data) => {
        setTotalData(data);
        if (data.result) {
          const requests = data.result;
          setStats({
            total: data.totalDocs || 0,
            pending: requests.filter(req => req.status === 'pending').length,
            inProgress: requests.filter(req => req.status === 'in-progress').length,
            completed: requests.filter(req => req.status === 'completed').length
          });
        } else {
          setStats({ total: 0, pending: 0, inProgress: 0, completed: 0 });
        }
        setLoading(false);
        setFirstLoad(false);
      })
      .catch((error) => {
        console.error("Error fetching service requests:", error);
        setLoading(false);
        setFirstLoad(false);
      });
  }, [searchTerm, itemsPerPage, currentPage, sortOrder, firstLoad]);

  const { result: requests = [], totalDocs = 0, totalPage = 1 } = totalData;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
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
        {!compact && (
          <div className="skeleton bg-base-300 h-4 w-4/6 rounded"></div>
        )}
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

  const getVisiblePages = (totalPages, currentPage) => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = new Set();
    const range = 1;

    pages.add(1);
    pages.add(totalPages);

    for (let i = -range; i <= range; i++) {
      const pageNum = currentPage + i;
      if (pageNum > 1 && pageNum < totalPages) {
        pages.add(pageNum);
      }
    }

    const sortedPages = Array.from(pages).sort((a, b) => a - b);
    const result = [];
    let lastPage = 0;

    for (const page of sortedPages) {
      if (page > lastPage + 1) {
        result.push('...');
      }
      result.push(page);
      lastPage = page;
    }

    return result;
  };

  const getPageClass = (page) => {
    if (page === '...') {
      return '';
    }
    
    if (page === 1 || page === totalPage || page === currentPage) {
      return ''; 
    }
    
    return 'hidden md:inline-block';
  };

  const visiblePages = getVisiblePages(totalPage, currentPage);

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-r from-primary via-orange-600 to-red-600 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

        <div className="lg:container mx-auto px-6 relative z-10">
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

            {loading ? (
              <StatsSkeleton />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-base-100/90 backdrop-blur-sm rounded-xl p-4 border border-neutral text-base-content">
                  <div className="h-10 w-10 flex mb-2 items-center justify-center rounded-full bg-secondary/15 mx-auto">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm opacity-90">Total Requests</div>
                </div>
                <div className="bg-base-100/90 backdrop-blur-sm rounded-xl p-4 border border-neutral text-base-content">
                  <div className="h-10 w-10 flex mb-2 items-center justify-center rounded-full bg-secondary/15 mx-auto">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{stats.pending}</div>
                  <div className="text-sm opacity-90">Pending</div>
                </div>
                <div className="bg-base-100/90 backdrop-blur-sm rounded-xl p-4 border border-neutral text-base-content">
                  <div className="h-10 w-10 flex mb-2 items-center justify-center rounded-full bg-secondary/15 mx-auto">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{stats.inProgress}</div>
                  <div className="text-sm opacity-90">In Progress</div>
                </div>
                <div className="bg-base-100/90 backdrop-blur-sm rounded-xl p-4 border border-neutral text-base-content">
                  <div className="h-10 w-10 flex mb-2 items-center justify-center rounded-full bg-secondary/15 mx-auto">
                    <AlertTriangle className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{stats.completed}</div>
                  <div className="text-sm opacity-90">Completed</div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => { setSortOrder('emergency'); setCurrentPage(1); }}
                className="bg-gray-200 text-primary px-6 py-3 rounded-full font-semibold hover:bg-orange-50 transition-all duration-300 flex items-center gap-2"
              >
                <AlertTriangle className="w-5 h-5" />
                Show Emergencies
              </button>
              <button
                onClick={() => { setSortOrder('high'); setCurrentPage(1); }}
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
        <div className="lg:container mx-auto px-6 -mt-8 pb-10 relative z-20">
          <div className="bg-base-200 rounded-2xl shadow-xl p-6 mb-8 border border-neutral">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60 w-5 h-5" />
                  <input
                    type="search"
                    placeholder="Search by title, type, or location..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full bg-base-100 placeholder-base-content/60 pl-10 pr-4 py-3 rounded-xl border-2 border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-base-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all duration-300 ${viewMode === "grid"
                      ? "bg-base-200 text-primary shadow-sm"
                      : "text-base-content/50 hover:text-primary"
                      }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all duration-300 ${viewMode === "list"
                      ? "bg-base-200 text-primary shadow-sm"
                      : "text-base-content/50 hover:text-primary"
                      }`}
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

          {loading && (
            <div className={
              viewMode === "grid"
                ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
                : "space-y-6"
            }>
              {[...Array(itemsPerPage)].map((_, index) => (
                <ServiceReqCardSkeleton
                  key={index}
                  compact={viewMode === "grid"}
                />
              ))}
            </div>
          )}

          {!loading && requests.length === 0 && (
            <div className="text-center py-16 rounded-2xl shadow-lg border border-neutral bg-base-200">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-12 h-12 text-primary" />
              </div>
              <p className="text-2xl text-primary font-bold mb-2">
                No Requests Found
              </p>
              <p className="text-base-content/50 max-w-md mx-auto">
                You're all caught up! There are currently no pending service requests matching your criteria.
              </p>
            </div>
          )}

          {!loading && requests.length > 0 && (
            <div className={
              viewMode === "grid"
                ? "grid grid-cols-1 xl:grid-cols-2 gap-6"
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

          {loading ? (
            <PaginationSkeleton />
          ) : (
            requests.length > 0 && totalPage > 1 && (
              <div className="flex flex-col md:flex-row justify-between mt-8 items-center gap-4">
                <div className="flex items-center gap-3">
                  <label htmlFor="itemsPerPage" className="text-base-content/60 font-medium">
                    Show per page:
                  </label>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPage}
                    className="px-4 py-2 bg-base-200 rounded-lg border-2 border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50</option>
                  </select>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-2">
                  <button
                    className="md:h-10 md:w-10 h-10 w-10 flex items-center justify-center border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>

                  {visiblePages.map((page, index) =>
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className={`p-1.5 text-base-content ${getPageClass(page)}`}>...</span>
                    ) : (
                      <button
                        key={page}
                        className={`
                          md:h-10 md:w-10 h-10 w-10 border rounded-lg transition-all duration-300 text-sm sm:text-base
                          ${page === currentPage
                            ? "bg-primary text-white border-primary"
                            : "border-neutral text-base-content hover:bg-primary/10 hover:border-primary"
                          }
                          ${getPageClass(page)}
                        `}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    className="md:h-10 md:w-10 h-10 w-10 flex items-center justify-center border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                    disabled={currentPage === totalPage}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
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