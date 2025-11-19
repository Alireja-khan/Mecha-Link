"use client";

import React, { useState, useEffect, useRef } from "react";
import useUser from "@/hooks/useUser";
import { ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { io } from "socket.io-client";

const SOCKET_URL = 'https://socket-server-0r34.onrender.com/';

let socket;

export default function CartIcon() {
  const { user } = useUser();
  const userEmail = user?.email;

  const [cartItems, setCartItems] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0);
  const dropdownRef = useRef(null);

  // Helper function to extract timestamp from MongoDB ObjectID (_id)
  const getTimestampFromId = (id) => {
    if (typeof id !== 'string' || id.length < 24) return 0;
    // The first 8 hexadecimal characters of a MongoDB ID are the timestamp
    return parseInt(id.substring(0, 8), 16) * 1000;
  };

  const fetchCartData = async () => {
    if (!userEmail) {
      setCartItems([]);
      setIsInitialLoading(false);
      setIsUpdating(false);
      return;
    }

    if (!isInitialLoading) {
      setIsUpdating(true); 
    }
    
    try {
      const res = await fetch(`/api/cart?userEmail=${userEmail}`);
      const data = await res.json();

      if (res.ok) {
        let items = data || [];
        
        // **FIX: Sort the items by timestamp to ensure the latest is last (or first for descending)**
        // We sort in descending order based on the item's ID timestamp
        items.sort((a, b) => getTimestampFromId(b._id) - getTimestampFromId(a._id));
        
        setCartItems(items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      setCartItems([]);
    } finally {
      setIsInitialLoading(false); 
      setIsUpdating(false);     
    }
  };

  // 1. Initial Data Fetch / Trigger Listen
  useEffect(() => {
    fetchCartData();
  }, [userEmail, user, cartUpdateTrigger]);

  // 2. Socket Connection and Listener
  useEffect(() => {
    if (!socket) {
      socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    }

    if (!userEmail) return;

    const handleCartUpdated = (data) => {
      if (data.userEmail === userEmail) {
        setCartUpdateTrigger(prev => prev + 1);
      }
    };

    socket.on('cartUpdated', handleCartUpdated);

    return () => {
      socket.off('cartUpdated', handleCartUpdated);
    };
  }, [userEmail]);

  // 3. Click outside handler
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


  const itemCount = cartItems.length;
  const totalItemCountDisplay = itemCount > 99 ? '99+' : itemCount;

  const subtotal = cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const subtotalDisplay = subtotal.toFixed(2);

  // **FIX: Since the items are sorted descending by time, the first element is the latest.**
  const lastItem = cartItems.length > 0 ? cartItems[0] : null;

  
  if (isInitialLoading) {
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
    <div
      className="relative inline-block text-left"
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={handleToggle}
        className={`p-2 rounded-full text-base-content hover:text-primary transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-100 ${isUpdating ? 'animate-pulse opacity-80' : ''}`}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />

          {itemCount > 0 && (
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
          <div className="border-b pb-3 border-base-300">
            <span className="font-bold text-lg text-base-content">
              {itemCount} Items
            </span>
            <span className="text-sm text-secondary block">
              Subtotal: ${subtotalDisplay}
            </span>
          </div>

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

          {itemCount === 0 && (
            <p className="text-sm text-base-content/70 py-4 text-center">Your cart is empty.</p>
          )}

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
  )
}