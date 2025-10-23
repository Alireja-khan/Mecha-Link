"use client";
import Link from "next/link";
import React, { useState } from "react";
import { ShoppingCart, Eye, Tag } from "lucide-react";

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

  const CardContent = (
    <div className="p-5 flex flex-col justify-between h-full bg-base-200">
      <div className="mb-3">
        {/* Brand and Rating */}
        <div className="flex items-center justify-between text-base-content/70 text-xs font-medium mb-1">
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span className="font-poppins uppercase tracking-wider">{part.brands || "Generic"}</span>
          </div>
          {RatingStars && <RatingStars rating={part.rating} />}
        </div>
        
        {/* Product Name */}
        <h3 className="font-urbanist text-xl font-bold leading-tight text-base-content line-clamp-2 mt-1">
          {part.partsName || "Engine Oil Filter"}
        </h3>
        
        {/* Category / Subcategory */}
        <p className="text-sm text-base-content/60 font-poppins mt-1 line-clamp-1">
          {part.category || "Engine"} • {part.subCategory || "Filtration"}
        </p>
      </div>

      <div className="pt-3 border-t border-base-200">
        <div className="flex items-center justify-between">
          
          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-urbanist text-primary">
              ${Number(part.price || 0).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            
            <button 
              className="p-2 border border-base-300 rounded-lg text-base-content hover:bg-base-200 hover:border-primary transition-colors tooltip tooltip-bottom"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            
            <Link href={`/market/${part._id}`} passHref legacyBehavior>
              <button
                className="flex items-center bg-primary text-primary-content px-3 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
  // --- Grid View ---
  return (
    <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden hover:shadow-2xl hover:border-primary/50 transition-all duration-300 group flex flex-col">
      <div className="relative">
        <ImageWithFallback
          src={part.images}
          alt={part.partsName}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-success text-success-content px-3 py-1 rounded-full text-xs font-semibold tracking-wider font-urbanist">
            IN STOCK
          </span>
        </div>
      </div>

      {CardContent}
    </div>
  );
}

export default SpareCard;