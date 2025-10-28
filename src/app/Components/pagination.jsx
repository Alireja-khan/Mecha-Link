"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

const Pagination = ({ totalPages, currentPage, onPageChange, itemsPerPage, onItemsPerPageChange }) => {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsSmall(window.innerWidth < 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const getVisiblePages = (totalPages, currentPage) => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages = new Set();
    const range = isSmall ? 0 : 1; // small devices show only the current page

    pages.add(1);
    pages.add(totalPages);

    for (let i = -range; i <= range; i++) {
      const pageNum = currentPage + i;
      if (pageNum > 1 && pageNum < totalPages) pages.add(pageNum);
    }

    const sortedPages = Array.from(pages).sort((a, b) => a - b);
    const result = [];
    let lastPage = 0;

    for (const page of sortedPages) {
      if (page > lastPage + 1) result.push("...");
      result.push(page);
      lastPage = page;
    }

    return result;
  };

  const visiblePages = getVisiblePages(totalPages, currentPage);

  return (
    <div className="flex flex-col md:flex-row justify-between mt-8 items-center gap-4">
      {/* Items per page */}
      <div className="flex items-center gap-3">
        <label htmlFor="itemsPerPage" className="text-base-content/70 font-medium">
          Show per page:
        </label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="px-4 py-2 bg-base-100 rounded-lg border-2 border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
        >
          {[12, 24, 36, 50].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Page buttons */}
      <div className="flex flex-wrap justify-center items-center gap-2">
        <button
          className="w-10 h-10 flex items-center justify-center border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>

        {visiblePages.map((page, idx) =>
          page === "..." ? (
            <span key={idx} className="px-3 py-2 text-base-content/70">
              ...
            </span>
          ) : (
            <button
              key={idx}
              className={`w-10 h-10 flex items-center justify-center border rounded-lg transition-all duration-300 ${
                page === currentPage
                  ? "bg-primary text-white border-primary"
                  : "border-neutral text-base-content hover:bg-primary/10 hover:border-primary"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        )}

        <button
          className="w-10 h-10 flex items-center justify-center border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
