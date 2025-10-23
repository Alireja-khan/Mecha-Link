"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaCar, 
  FaFilter, 
  FaStar, 
  FaRegStar, 
  FaShoppingCart,
  FaHeart,
  FaShare,
  FaSyncAlt
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight, FiSliders } from "react-icons/fi";
import SpareCard from "@/app/Components/SpareCard";

export default function SpareMarketplace() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    category: "all",
    subCategory: "all",
    brand: "all"
  });

  // Filter options from API
  const [filterOptions, setFilterOptions] = useState({
    categories: [], // Array of { _id, name, subCategories: [] }
    brands: []      // Array of brand names
  });

  const [sortBy, setSortBy] = useState("newest");

  // Fetch filter options (categories and brands)
  const fetchFilterOptions = async () => {
    try {
      console.log("🔄 Fetching filter options...");
      const response = await axios.get("/api/spareParts?filters=true");
      console.log("✅ Filter options response:", response.data);
      setFilterOptions(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch filter options:", error);
      setFilterOptions({
        categories: [],
        brands: []
      });
    }
  };

  // Fetch parts with filters
  const fetchParts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy: sortBy,
        ...(filters.category !== "all" && { category: filters.category }),
        ...(filters.subCategory !== "all" && { subCategory: filters.subCategory }),
        ...(filters.brand !== "all" && { brand: filters.brand })
      });

      console.log("📡 Fetching parts with params:", params.toString());
      const res = await axios.get(`/api/spareParts?${params}`);
      console.log("✅ Parts response:", res.data);
      
      setParts(res.data.spareParts || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalCount(res.data.totalCount || 0);
    } catch (err) {
      console.error("❌ Error fetching parts:", err);
      setError("Failed to fetch spare parts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchParts();
  }, [page, limit, filters, sortBy]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [filterType]: value };
      
      // Reset dependent filters when parent changes
      if (filterType === "category") {
        newFilters.subCategory = "all"; // Reset subcategory when category changes
      }
      
      return newFilters;
    });
    setPage(1); // Reset to first page when filters change
  };

  // Get subcategories for selected category
  const getSubcategoriesForSelectedCategory = () => {
    if (filters.category === "all") return [];
    
    const selectedCategory = filterOptions.categories.find(
      cat => cat.name === filters.category
    );
    
    return selectedCategory?.subCategories || [];
  };

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  const RatingStars = ({ rating, size = "sm" }) => {
    if (!rating) return <span className="text-gray-400 text-sm">Not rated</span>;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? 
            <FaStar key={star} className="text-yellow-400 text-xs" /> : 
            <FaRegStar key={star} className="text-gray-300 text-xs" />
        ))}
        <span className="text-gray-600 ml-1 text-xs">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  // Simple placeholder image component
  // const ImageWithFallback = ({ src, alt, className }) => {
  //   const [imgSrc, setImgSrc] = useState(src);
    
  //   const handleError = () => {
  //     setImgSrc(`data:image/svg+xml;base64,${btoa(`
  //       <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  //         <rect width="100%" height="100%" fill="#f3f4f6"/>
  //         <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">No Image</text>
  //       </svg>
  //     `)}`);
  //   };

  //   return (
  //     <img
  //       src={imgSrc}
  //       alt={alt}
  //       className={className}
  //       onError={handleError}
  //     />
  //   );
  // };

  const FilterSection = ({ title, children }) => (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0">
      <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
        {title}
      </h4>
      {children}
    </div>
  );

  return (
    <div className="">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Spare Parts Marketplace</h1>
            <p className="text-gray-600 mt-2">Find genuine parts for your vehicle</p>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              <FiSliders className="text-lg" />
              Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-80 bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-fit sticky top-6">
            <div className="flex items-center gap-2 mb-6">
              <FaFilter className="text-blue-600 text-lg" />
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            </div>

            <div className="space-y-4">
              {/* Category Filter */}
              <FilterSection title="Category">
                <select 
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {filterOptions.categories.map(category => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </FilterSection>

              {/* Subcategory Filter - Only show if category is selected */}
              {filters.category !== "all" && (
                <FilterSection title="Subcategory">
                  <select 
                    value={filters.subCategory}
                    onChange={(e) => handleFilterChange('subCategory', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Subcategories</option>
                    {getSubcategoriesForSelectedCategory().map(subCategory => (
                      <option key={subCategory} value={subCategory}>
                        {subCategory}
                      </option>
                    ))}
                  </select>
                </FilterSection>
              )}

              {/* Brand Filter */}
              <FilterSection title="Brand">
                <select 
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Brands</option>
                  {filterOptions.brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </FilterSection>

              {/* Reset Filters */}
              <button 
                onClick={() => setFilters({
                  category: "all",
                  subCategory: "all",
                  brand: "all"
                })}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
              >
                Reset All Filters
              </button>
            </div>
          </aside>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-transparent bg-opacity">
              <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700 text-xl">
                    ✕
                  </button>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Category */}
                    <div className="mb-4">
                      <label className="block font-medium mb-2">Category</label>
                      <select 
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="all">All Categories</option>
                        {filterOptions.categories.map(category => (
                          <option key={category._id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subcategory */}
                    {filters.category !== "all" && (
                      <div className="mb-4">
                        <label className="block font-medium mb-2">Subcategory</label>
                        <select 
                          value={filters.subCategory}
                          onChange={(e) => handleFilterChange('subCategory', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        >
                          <option value="all">All Subcategories</option>
                          {getSubcategoriesForSelectedCategory().map(subCategory => (
                            <option key={subCategory} value={subCategory}>
                              {subCategory}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Brand */}
                    <div className="mb-4">
                      <label className="block font-medium mb-2">Brand</label>
                      <select 
                        value={filters.brand}
                        onChange={(e) => handleFilterChange('brand', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="all">All Brands</option>
                        {filterOptions.brands.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>

                    <button 
                      onClick={() => setFilters({
                        category: "all",
                        subCategory: "all",
                        brand: "all"
                      })}
                      className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Info and Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-gray-600 text-sm">
                Showing <span className="font-semibold">{(page - 1) * limit + 1}-{Math.min(page * limit, totalCount)}</span> of{" "}
                <span className="font-semibold">{totalCount}</span> parts
                {filters.category !== "all" && ` in ${filters.category}`}
                {filters.subCategory !== "all" && ` > ${filters.subCategory}`}
                {filters.brand !== "all" && ` • ${filters.brand}`}
              </p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 whitespace-nowrap">Show:</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(parseInt(e.target.value));
                      setPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={36}>36</option>
                    <option value={48}>48</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Parts Grid - Same as before */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <FaSyncAlt className="mx-auto text-gray-400 text-4xl mb-4" />
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <button 
                  onClick={fetchParts}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : parts.length === 0 ? (
              <div className="text-center py-12">
                <FaCar className="mx-auto text-gray-400 text-4xl mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No parts found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <div className="">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {parts.map((part) => <SpareCard RatingStars={RatingStars} key={part._id} part={part}></SpareCard>
                )}
              </div>
              </div>
            )}

            {/* Pagination - Same as before */}
            {parts.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                <p className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="p-2 border border-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <FiChevronLeft className="text-lg" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          pageNum === page
                            ? 'bg-primary text-white border-primary'
                            : 'border-primary text-primary hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && (
                    <span className="px-2 text-primary">...</span>
                  )}
                  
                  <button
                    onClick={handleNext}
                    disabled={page === totalPages}
                    className="p-2 border border-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <FiChevronRight className="text-lg" />
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}