"use client";

import React, { useState, useEffect, useRef } from "react";
import useUser from "@/hooks/useUser";
import { ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartIcon() {
  const { user } = useUser();
  const userEmail = user?.email;
  
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


  // --- Data Fetching Effect (Retained) ---
  useEffect(() => {
    if (!userEmail) {
      if (user !== undefined) {
        setCartItems([]);
        setIsLoading(false);
      }
      return;
    }

    const fetchCartData = async () => {
      setIsLoading(true);
      try {
        // NOTE: Keeping the original fetch structure for API consistency
        const res = await fetch(`/api/cart?userEmail=${userEmail}`);
        const data = await res.json();
        
        if (res.ok) {
          setCartItems(data || []); 
        } else {
          setCartItems([]);
        }
      } catch (error) {
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, [userEmail, user]);
  
  // --- Click outside handler (Retained) ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  // --- Derived Values (Retained) ---
  const itemCount = cartItems.length;
  const totalItemCountDisplay = itemCount > 99 ? '99+' : itemCount;
  
  const subtotal = cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const subtotalDisplay = subtotal.toFixed(2);
  
  const lastItem = cartItems.length > 0 ? cartItems[cartItems.length - 1] : null;

  
  if (isLoading) {
    // Uses text-base-content/50 for a dimmed look
    return (
      <div className="relative p-2 rounded-full text-base-content/50 animate-pulse">
        <ShoppingCart className="w-6 h-6" />
      </div>
    );
  }

  const handleToggle = () => {
      setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    // Custom Dropdown Container
    <div 
        className="relative inline-block text-left"
        ref={dropdownRef}
    >
      {/* 1. Icon/Toggle Button */}
      <button 
        type="button"
        onClick={handleToggle}
        // Tailwind classes using theme colors: text-base-content, ring-primary
        className={`p-2 rounded-full text-base-content hover:text-primary transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-100`}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />

          {itemCount > 0 && (
            // Custom Badge (Using Primary Color and primary-content text)
            <span 
              className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 
                         min-w-[1.25rem] h-5 px-1 flex items-center justify-center text-xs font-bold 
                         leading-none bg-primary text-primary-content rounded-full ring-2 ring-base-100"
            >
              {totalItemCountDisplay}
            </span>
          )}
        </div>
      </button>

      {/* 2. Dropdown Content (Cart Preview) */}
      <div
        className={`absolute right-0 mt-3 w-80 origin-top-right 
                    bg-base-200 shadow-xl ring-1 ring-base-300 
                    rounded-lg border border-base-300 z-10 
                    transform transition-all duration-300 ease-in-out
                    ${isDropdownOpen 
                        ? 'opacity-100 scale-100 pointer-events-auto' 
                        : 'opacity-0 scale-95 pointer-events-none'
                    }`}
      >
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="border-b pb-3 border-base-300">
              <span className="font-bold text-lg text-base-content">
                {itemCount} Items
              </span>
              {/* Using Info color for subtotal text */}
              <span className="text-sm text-secondary block">
                Subtotal: ${subtotalDisplay}
              </span>
          </div>
          
          {/* Last Saved Item Preview */}
          {lastItem && (
            <>
                <p className="text-xs text-base-content/70 mt-2">Recently Added:</p>
                <div className="flex items-center gap-3 py-3 border-t border-b border-base-300">
                    <div className="relative w-12 h-12 flex-shrink-0 bg-base-100 rounded-lg overflow-hidden">
                        <Image
                            src={lastItem.image || "/placeholder-image.svg"}
                            alt={lastItem.partsName}
                            layout="fill"
                            objectFit="cover"
                            className="p-1 roundedxl
                            "
                            unoptimized
                        />
                    </div>
                    <div>
                        <p className={`text-sm font-semibold truncate w-40 text-base-content`}>
                            {lastItem.partsName}
                        </p>
                        <p className={`text-xs text-base-content/70`}>
                            Qty: {lastItem.quantity} &times; ${lastItem.price.toFixed(2)}
                        </p>
                    </div>
                </div>
            </>
          )}
          
          {/* Empty State message */}
          {itemCount === 0 && (
             <p className="text-sm text-base-content/70 py-4 text-center">Your cart is empty.</p>
          )}

          {/* View All Items Button (Using Primary Color) */}
          <div className="pt-2">
            <Link
              href="/cart"
              className="w-full inline-flex items-center justify-center 
                         px-4 py-2 border border-transparent text-base font-bold 
                         rounded-md shadow-sm bg-primary text-primary-content 
                         hover:bg-opacity-90 transition duration-150 ease-in-out"
              onClick={() => setIsDropdownOpen(false)} 
            >
              View All Items <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}