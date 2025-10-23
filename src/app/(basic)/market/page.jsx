"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Car,
  Filter,
  Star,
  RotateCw,
  X,
  Search,
  AlertTriangle,
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
} from "lucide-react";
import SpareCard from "@/app/Components/SpareCard";

export default function SpareMarketplace() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("newest");
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: "all",
    subCategory: "all",
    brand: "all"
  });

  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    brands: []
  });

  const stats = {
    totalParts: totalCount,
    uniqueBrands: filterOptions.brands.length,
    majorCategories: filterOptions.categories.length,
    featured: 120,
  };

  const fetchFilterOptions = useCallback(async () => {
    try {
      // NOTE: This API endpoint is assumed to be correct based on usage: /api/spareParts?filters=true
      const response = await axios.get("/api/spareParts?filters=true");
      setFilterOptions(response.data);
    } catch (error) {
    }
  }, []);

  const fetchParts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sortBy: sortOrder,
        searchTerm: searchTerm,
        // Only include filters if they are not "all"
        ...(filters.category !== "all" && { category: filters.category }),
        ...(filters.subCategory !== "all" && { subCategory: filters.subCategory }),
        ...(filters.brand !== "all" && { brand: filters.brand })
      });

      // NOTE: This API endpoint is assumed to be correct based on usage: /api/spareParts?...
      const res = await axios.get(`/api/spareParts?${params}`);

      setParts(res.data.spareParts || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalCount(res.data.totalCount || 0);
    } catch (err) {
      setError("Failed to fetch spare parts");
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, sortOrder, filters, searchTerm]);

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  // Fetch parts whenever filters, sort, page, limit, or search term changes
  useEffect(() => {
    fetchParts();
  }, [currentPage, itemsPerPage, filters, sortOrder, searchTerm, fetchParts]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [filterType]: value };
      if (filterType === "category") {
        // Reset subCategory when main category changes
        newFilters.subCategory = "all";
      }
      return newFilters;
    });
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSort = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleItemsPerPage = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page on limit change
  };

  const handlePageChange = (page) => {
    // Only change if page is a number and is different from current page
    if (typeof page === 'number' && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const getSubcategoriesForSelectedCategory = () => {
    if (filters.category === "all") return [];

    const selectedCategory = filterOptions.categories.find(
      cat => cat.name === filters.category
    );
    return selectedCategory?.subCategories || [];
  };

  const resetAllFilters = () => {
    setFilters({
      category: "all",
      subCategory: "all",
      brand: "all"
    });
    setSearchTerm("");
    setSortOrder("newest");
    setCurrentPage(1);
    setShowFilters(false);
  };

  // =========================================================================
  // UI Components
  // =========================================================================

  const Button = ({ children, onClick, className = '', variant = 'primary', size = 'default', disabled = false, type = 'button' }) => {
    let baseStyle = "flex items-center justify-center font-poppins font-semibold transition-all duration-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";

    if (size === 'sm') baseStyle += ' px-4 py-2 text-sm';
    else if (size === 'block') baseStyle += ' w-full py-3 text-base';
    else baseStyle += ' px-6 py-3 text-sm';

    if (variant === 'primary') baseStyle += ' bg-primary text-primary-content hover:bg-primary/90 focus:ring-primary';
    else if (variant === 'secondary') baseStyle += ' bg-secondary text-secondary-content hover:bg-secondary/90 focus:ring-secondary';
    else if (variant === 'outline') baseStyle += ' bg-transparent border border-primary text-primary hover:bg-primary/10 focus:ring-primary';
    else if (variant === 'neutral') baseStyle += ' bg-base-300 text-base-content hover:bg-base-300/80 focus:ring-base-300';
    else if (variant === 'clear') baseStyle += ' bg-transparent text-primary hover:text-primary/80 focus:ring-transparent';

    if (disabled) baseStyle += ' opacity-50 cursor-not-allowed';

    return (
      <button
        type={type} // <-- Added type="button" by default
        onClick={onClick}
        className={`${baseStyle} ${className}`}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };

  const RatingStars = ({ rating }) => {
    if (!rating) return <span className="text-base-content/60 text-xs italic font-poppins">Not yet rated</span>;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((starIdx) => {
          if (starIdx <= fullStars) {
            return <Star key={starIdx} className="text-warning fill-warning h-3 w-3" />;
          }
          // Note: Full implementation would handle half stars with a different icon,
          // but for simplicity and using only the imported Star icon, we'll mark the rest as empty.
          return <Star key={starIdx} className="text-base-300 stroke-base-300 h-3 w-3" />;
        })}
      </div>
    );
  };

  const FilterSection = ({ title, children }) => (
    <div className="border-b border-base-300 pb-5 mb-5 last:border-b-0 last:mb-0">
      <h4 className="font-urbanist font-bold text-base-content mb-3 text-sm uppercase tracking-wider">
        {title}
      </h4>
      {children}
    </div>
  );

  const ChevronDown = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );

  const StyledSelect = ({ value, onChange, children, className = '' }) => (
    <div className={`relative w-full ${className}`}>
      <select
        value={value}
        onChange={onChange}
        className="w-full border-2 border-base-300 rounded-xl px-4 py-3 text-sm text-base-content font-poppins appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-base-100"
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/70 pointer-events-none" />
    </div>
  );

  const StatsSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-pulse">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-base-100/90 backdrop-blur-sm rounded-xl p-4 border border-base-300">
          <div className="w-10 h-10 flex mb-2 items-center justify-center rounded-full bg-secondary/15 mx-auto">
            <div className="bg-base-300 h-6 w-6 rounded-full"></div>
          </div>
          <div className="bg-base-300 h-6 w-1/3 mx-auto mb-1 rounded"></div>
          <div className="bg-base-300 h-4 w-2/3 mx-auto rounded"></div>
        </div>
      ))}
    </div>
  );

  const PaginationSkeleton = () => (
    <div className="flex flex-col md:flex-row justify-between mt-8 items-center gap-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="bg-base-300 h-4 w-24 rounded"></div>
        <div className="bg-base-300 h-10 w-20 rounded-lg"></div>
      </div>
      <div className="flex justify-center items-center gap-2">
        <div className="bg-base-300 h-10 w-10 rounded-lg"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-base-300 h-10 w-10 rounded-lg"></div>
        ))}
        <div className="bg-base-300 h-10 w-10 rounded-lg"></div>
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

  const visiblePages = getVisiblePages(totalPages, currentPage);

  const getPageClass = (page) => {
    if (page === '...') {
      return '';
    }

    // Add hidden class for pages not currently visible on small screens
    if (page !== 1 && page !== totalPages && page !== currentPage) {
      return 'hidden sm:inline-block';
    }

    return '';
  };

  return (
    <div className="bg-base-100 min-h-screen font-poppins">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary via-orange-600 to-red-600 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-urbanist text-4xl md:text-6xl font-extrabold text-white mb-6">
              Spare Parts Marketplace
              <span className="block text-2xl md:text-3xl font-semibold text-primary-content mt-2">
                Find Genuine Parts for Your Vehicle
              </span>
            </h1>

            <p className="font-poppins text-xl text-primary-content/80 mb-8 leading-relaxed">
              Browse millions of certified parts from trusted suppliers and manufacturers globally.
            </p>

            {loading ? (
              <StatsSkeleton />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-base-100/90 backdrop-blur-sm rounded-xl p-4 border border-base-300 text-base-content">
                  <div className="h-10 w-10 flex mb-2 items-center justify-center rounded-full bg-secondary/15 mx-auto">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold font-urbanist">{stats.totalParts}</div>
                  <div className="text-sm opacity-90 font-poppins">Total Parts</div>
                </div>
                <div className="bg-base-100/90 backdrop-blur-sm rounded-xl p-4 border border-base-300 text-base-content">
                  <div className="h-10 w-10 flex mb-2 items-center justify-center rounded-full bg-secondary/15 mx-auto">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold font-urbanist">{stats.uniqueBrands}</div>
                  <div className="text-sm opacity-90 font-poppins">Unique Brands</div>
                </div>
                <div className="bg-base-100/90 backdrop-blur-sm rounded-xl p-4 border border-base-300 text-base-content">
                  <div className="h-10 w-10 flex mb-2 items-center justify-center rounded-full bg-secondary/15 mx-auto">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold font-urbanist">{stats.majorCategories}</div>
                  <div className="text-sm opacity-90 font-poppins">Categories</div>
                </div>
                <div className="bg-base-100/90 backdrop-blur-sm rounded-xl p-4 border border-base-300 text-base-content">
                  <div className="h-10 w-10 flex mb-2 items-center justify-center rounded-full bg-secondary/15 mx-auto">
                    <AlertTriangle className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold font-urbanist">{stats.featured}</div>
                  <div className="text-sm opacity-90 font-poppins">Featured Deals</div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => { setFilters(prev => ({ ...prev, brand: 'Toyota' })); setCurrentPage(1); }}
                className="bg-primary-content text-primary px-6 py-3 rounded-full font-semibold hover:bg-white transition-all duration-300 flex items-center gap-2"
                variant="neutral"
              >
                <Car className="w-5 h-5" />
                Shop Toyota Parts
              </Button>
              <Button
                onClick={() => { setSortOrder('price-high'); setCurrentPage(1); }}
                className="bg-orange-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-800 transition-all duration-300 flex items-center gap-2"
                variant="primary"
              >
                <TrendingUp className="w-5 h-5" />
                Highest Price
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar */}
      <section>
        <div className="container mx-auto px-6 -mt-8 pb-10 relative z-20">

          {/* Search and Sort Bar */}
          <div className="bg-base-200 rounded-2xl shadow-xl p-6 mb-8 border border-neutral">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60 w-5 h-5" />
                  <input
                    type="search"
                    placeholder="Search by part name, VIN, or category..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full bg-base-100 placeholder-base-content/60 pl-10 pr-4 py-3 rounded-xl border-2 border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">

                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex-shrink-0"
                  variant="neutral"
                  size="sm"
                >
                  <Filter className="w-4 h-4 mr-1" />
                  More
                </Button>

                <div className="flex items-center gap-2">
                  <Filter className="text-base-content/60 w-5 h-5" />
                  <StyledSelect
                    value={sortOrder}
                    onChange={handleSort}
                    className="w-[180px]"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </StyledSelect>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-72 bg-base-200 border border-base-300 rounded-2xl shadow-lg p-6 h-fit sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="text-primary h-6 w-6" />
                <h3 className="font-urbanist text-xl font-bold text-base-content">Filters</h3>
              </div>

              <div className="space-y-4">
                <FilterSection title="Category">
                  <StyledSelect
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {filterOptions.categories.map(category => (
                      <option key={category._id || category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </StyledSelect>
                </FilterSection>

                {filters.category !== "all" && (
                  <FilterSection title="Subcategory">
                    <StyledSelect
                      value={filters.subCategory}
                      onChange={(e) => handleFilterChange('subCategory', e.target.value)}
                    >
                      <option value="all">All Subcategories</option>
                      {getSubcategoriesForSelectedCategory().map(subCategory => (
                        <option key={subCategory} value={subCategory}>
                          {subCategory}
                        </option>
                      ))}
                    </StyledSelect>
                  </FilterSection>
                )}

                <FilterSection title="Brand">
                  <StyledSelect
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                  >
                    <option value="all">All Brands</option>
                    {filterOptions.brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </StyledSelect>
                </FilterSection>

                <Button
                  onClick={resetAllFilters}
                  className="mt-6 font-poppins"
                  variant="neutral"
                  size="block"
                >
                  Clear All Filters
                </Button>
              </div>
            </aside>

            {/* Main Parts Display Area */}
            <main className="flex-1">

              {/* Result Count Header */}
              <div className="py-2 mb-4 border-b border-base-300">
                <p className="text-base-content/80 text-base font-medium font-poppins">
                  Showing <span className="font-bold text-base-content">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalCount)}</span> of{" "}
                  <span className="font-bold text-base-content">{totalCount}</span> results
                </p>
              </div>

              {/* Content Area (Error, Loading, No Results, or Parts Grid) */}
              {error ? (
                <div className="text-center py-16 rounded-2xl shadow-lg border border-neutral bg-base-200">
                  <div className="w-24 h-24 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-12 h-12 text-error" />
                  </div>
                  <p className="text-2xl text-error font-bold font-urbanist mb-2">
                    Data Error
                  </p>
                  <p className="text-base-content/50 max-w-md mx-auto font-poppins">
                    Failed to fetch parts. Please check your API connection.
                  </p>
                  <Button
                    onClick={fetchParts}
                    className="mt-6"
                    variant="primary"
                    size="sm"
                  >
                    <RotateCw className="w-4 h-4 mr-2" /> Try Again
                  </Button>
                </div>
              ) : loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(itemsPerPage)].map((_, index) => (
                    <div key={index} className="bg-base-200 rounded-xl shadow-md border border-neutral p-5 animate-pulse h-64">
                      <div className="bg-base-300 h-40 w-full rounded-lg mb-4"></div>
                      <div className="bg-base-300 h-5 w-3/4 rounded mb-2"></div>
                      <div className="bg-base-300 h-4 w-1/4 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : parts.length === 0 ? (
                <div className="text-center py-16 rounded-2xl shadow-lg border border-neutral bg-base-200">
                  <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-12 h-12 text-primary" />
                  </div>
                  <p className="text-2xl text-primary font-bold font-urbanist mb-2">
                    No Parts Found
                  </p>
                  <p className="text-base-content/50 max-w-md mx-auto font-poppins">
                    Try adjusting your filters, searching for a different term, or clearing all filters.
                  </p>
                  <Button
                    onClick={resetAllFilters}
                    className="mt-6"
                    variant="clear"
                  >
                    Clear All Filters <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {parts.map((part) => (
                    // SpareCard is assumed to be a functional component from the import
                    <SpareCard
                      RatingStars={RatingStars}
                      key={part._id}
                      part={part}
                    />
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {loading ? (
                <PaginationSkeleton />
              ) : (
                parts.length > 0 && totalPages > 1 && (
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
                        <option value="12">12</option>
                        <option value="24">24</option>
                        <option value="36">36</option>
                        <option value="48">48</option>
                        <option value="60">60</option>
                      </select>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-2">
                      {/* Previous Page Button */}
                      <button
                        type="button" // ⬅️ IMPORTANT: Prevents full page reload
                        className="md:h-10 md:w-10 h-10 w-10 flex items-center justify-center border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                      </button>

                      {/* Page Number Buttons */}
                      {visiblePages.map((page, index) =>
                        page === '...' ? (
                          <span key={`ellipsis-${index}`} className={`p-1.5 text-base-content ${getPageClass(page)}`}>...</span>
                        ) : (
                          <button
                            key={page}
                            type="button" // ⬅️ IMPORTANT: Prevents full page reload
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

                      {/* Next Page Button */}
                      <button
                        type="button" // ⬅️ IMPORTANT: Prevents full page reload
                        className="md:h-10 md:w-10 h-10 w-10 flex items-center justify-center border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              )}
            </main>
          </div>

        </div>
      </section>

      {/* Mobile Filters Modal/Sidebar */}
      {showFilters && (
        <div
          className="lg:hidden fixed inset-0 z-50 transition-opacity duration-300 bg-black bg-opacity-50"
          onClick={() => setShowFilters(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-80 bg-base-100 overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-base-300 flex justify-between items-center sticky top-0 bg-base-100 z-10">
              <h3 className="font-urbanist text-xl font-bold">Filters</h3>
              <button
                type="button" // Added type="button"
                onClick={() => setShowFilters(false)}
                className="text-base-content hover:text-primary p-2 rounded-full hover:bg-base-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-6">

              <div>
                <label className="block font-poppins font-semibold mb-2 text-sm text-base-content/80">Sort By</label>
                <StyledSelect
                  value={sortOrder}
                  onChange={handleSort}
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </StyledSelect>
              </div>

              <div>
                <label className="block font-poppins font-semibold mb-2 text-sm text-base-content/80">Category</label>
                <StyledSelect
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {filterOptions.categories.map(category => (
                    <option key={category._id || category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </StyledSelect>
              </div>

              {filters.category !== "all" && (
                <div>
                  <label className="block font-poppins font-semibold mb-2 text-sm text-base-content/80">Subcategory</label>
                  <StyledSelect
                    value={filters.subCategory}
                    onChange={(e) => handleFilterChange('subCategory', e.target.value)}
                  >
                    <option value="all">All Subcategories</option>
                    {getSubcategoriesForSelectedCategory().map(subCategory => (
                      <option key={subCategory} value={subCategory}>
                        {subCategory}
                      </option>
                    ))}
                  </StyledSelect>
                </div>
              )}

              <div>
                <label className="block font-poppins font-semibold mb-2 text-sm text-base-content/80">Brand</label>
                <StyledSelect
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                >
                  <option value="all">All Brands</option>
                  {filterOptions.brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </StyledSelect>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  onClick={resetAllFilters}
                  variant="neutral"
                  size="block"
                >
                  Clear Filters
                </Button>
                <Button
                  onClick={() => setShowFilters(false)}
                  variant="primary"
                  size="block"
                >
                  Show Results
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}