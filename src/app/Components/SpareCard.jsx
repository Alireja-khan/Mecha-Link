"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaShoppingCart, FaHeart, FaShare } from "react-icons/fa";

function SpareCard({ part, RatingStars }) {
  const ImageWithFallback = ({ src, alt, className }) => {
    const [imgSrc, setImgSrc] = useState(src);

    const handleError = () => {
      setImgSrc(
        `data:image/svg+xml;base64,${btoa(`
            <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="#f3f4f6"/>
              <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">No Image</text>
            </svg>
          `)}`
      );
    };

    return (
      <img src={imgSrc} alt={alt} className={className} onError={handleError} />
    );
  };

  return (
    <div className="border border-primary rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <ImageWithFallback
          src={part.images}
          alt={part.partsName}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            In Stock
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">
            {part.partsName}
          </h3>
          <span className="text-xs px-2 py-1 rounded whitespace-nowrap ml-2">
            {part.brands}
          </span>
        </div>

        <p className="text-sm mb-3 line-clamp-2">
          {part.category} • {part.subCategory}
        </p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">${part.price}</span>
          </div>

          <div className="flex gap-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FaShoppingCart />
            </button>
            {/* Updated: Pass part._id as route parameter */}
            <Link href={`/market/${part._id}`}>
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white hover:text-primary border border-primary transition-colors whitespace-nowrap cursor-pointer">
                View Details
              </button>
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpareCard;