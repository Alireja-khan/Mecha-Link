"use client";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import { ShoppingCart, Eye, Tag, CheckCircle } from "lucide-react"; // Imported CheckCircle
import axios from "axios";
import toast from "react-hot-toast";
import useUser from "@/hooks/useUser";
import { io } from "socket.io-client";

const SOCKET_URL = 'http://localhost:3001';
let socket;

function SpareCard({ part, RatingStars }) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  // NEW STATES
  const [isInCart, setIsInCart] = useState(false);
  const [cartItemQuantity, setCartItemQuantity] = useState(0);
  const [checkingCartStatus, setCheckingCartStatus] = useState(true);

  const { user, status } = useUser();
  const userEmail = user?.email;
  const defaultQuantity = 1;

  // --- Cart Status Check Function (Memoized for efficiency) ---
  const checkIfPartInCart = useCallback(async () => {
    if (!part || !userEmail) {
      setIsInCart(false);
      setCartItemQuantity(0);
      setCheckingCartStatus(false);
      return;
    }

    try {
      setCheckingCartStatus(true);
      const response = await axios.get(`/api/cart?userEmail=${userEmail}`);
      const cart = response.data;
      const existingItem = cart.find(item => item.partId === part._id);

      if (existingItem) {
        setIsInCart(true);
        // Display actual quantity in cart
        setCartItemQuantity(existingItem.quantity); 
      } else {
        setIsInCart(false);
        setCartItemQuantity(0);
      }
    } catch (error) {
      console.error("Failed to check cart status for card:", error);
      setIsInCart(false);
    } finally {
      setCheckingCartStatus(false);
    }
  }, [part, userEmail]);

  // --- Socket Initialization and Listener ---
  useEffect(() => {
    if (!socket) {
      socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    }

    const handleCartUpdate = (data) => {
      // Re-check only if the update is relevant to the current user
      if (data.userEmail === userEmail) {
        // Debounce or optimize if this causes excessive re-renders in a large list
        checkIfPartInCart();
      }
    };

    if (socket) {
      socket.on('cartUpdate', handleCartUpdate);
    }

    return () => {
      if (socket) {
        socket.off('cartUpdate', handleCartUpdate);
      }
    }
  }, [userEmail, checkIfPartInCart]);

  // --- Initial Cart Status Check on Load/User Change ---
  useEffect(() => {
    if (part && status === 'authenticated') {
        checkIfPartInCart();
    }
    // If status becomes unauthenticated, reset cart state
    if (status === 'unauthenticated') {
        setIsInCart(false);
        setCartItemQuantity(0);
        setCheckingCartStatus(false);
    }
  }, [part, status, checkIfPartInCart]);

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

    // Use the first image if it's an array, otherwise use the string
    const finalSrc = Array.isArray(src) ? src[0] : src;

    return (
      <img src={finalSrc || imgSrc} alt={alt} className={className} onError={handleError} />
    );
  };

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigating if the card is wrapped in a link

    if (!userEmail || status !== 'authenticated') {
        toast.error("Please log in to add items to your cart.");
        return;
    }

    if (!part || isAddingToCart || part.quantity === 0) return;

    try {
      setIsAddingToCart(true);

      const imageToSend = Array.isArray(part.images) ? part.images[0] : part.images;
      const finalPrice = part.price;
      const quantity = defaultQuantity; // Always adds 1 by default on the card

      const cartItem = {
        userEmail: user.email,
        partId: part._id,
        partsName: part.partsName,
        price: finalPrice,
        quantity: quantity,
        image: imageToSend || "",
        brand: part.brands,
        category: part.category,
        couponApplied: undefined,
        couponDiscount: 0,
      };

      const response = await axios.post('/api/cart', cartItem);
      const { action, newQuantity, message } = response.data;


      if (response.data.success) {
        const qty = newQuantity || (action === "add" ? quantity : (cartItemQuantity + quantity));

        if (action === "update") {
          toast.success(`Quantity updated! You now have ${qty}x ${part.partsName} in your cart.`);
        } else {
          toast.success(`Added ${quantity} ${part.partsName} to cart!`);
        }
        
        // Update local state and trigger re-check via socket
        setIsInCart(true);
        setCartItemQuantity(qty);

        if (socket && socket.connected) {
          socket.emit('cartUpdate', { userEmail: user.email, action });
        }

      } else {
        toast.error(message || "Failed to add to cart");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to add item to cart due to a server error.";
      toast.error(errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const getStockStatus = () => {
    const quantity = part.quantity || 0;

    if (quantity > 10) {
      return { text: "IN STOCK", className: "bg-success text-white" };
    } else if (quantity > 0 && quantity <= 10) {
      return { text: "LOW STOCK", className: "bg-warning text-white" };
    } else {
      return { text: "OUT OF STOCK", className: "bg-error text-white" };
    }
  };

  const stockStatus = getStockStatus();
  const isOutOfStock = part.quantity === 0;
  const isButtonDisabled = isAddingToCart || isOutOfStock || status === "unauthenticated" || checkingCartStatus;

  // --- Conditional Button Content ---
  let cartButtonContent;
  let cartButtonClass = 'p-2 border rounded-lg transition-colors tooltip tooltip-bottom';
  
  if (checkingCartStatus) {
    cartButtonContent = <div className="animate-spin w-5 h-5 border-2 border-base-content border-t-transparent rounded-full"></div>;
    cartButtonClass += ' text-base-content/50 border-base-300 bg-base-300 cursor-wait';
  } else if (isAddingToCart) {
    cartButtonContent = <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full"></div>;
    cartButtonClass += ' bg-base-300 border-base-300 text-primary';
  } else if (isInCart) {
    cartButtonContent = <CheckCircle className="w-5 h-5" />;
    cartButtonClass += ' text-success border-success/50 bg-success/10 hover:bg-success/20';
  } else {
    cartButtonContent = <ShoppingCart className="w-5 h-5" />;
    cartButtonClass += ' text-base-content border-base-300 hover:bg-base-300 hover:border-primary';
  }

  const CardContent = (
    <div className="p-5 flex flex-col justify-between h-full bg-base-200">
      <div className="mb-3">
        <div className="flex items-center justify-between text-base-content/70 text-xs font-medium mb-1">
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span className="font-poppins uppercase tracking-wider">{part.brands || "Generic"}</span>
          </div>
          {RatingStars && <RatingStars rating={part.rating} />}
        </div>

        <h3 className="font-urbanist text-xl font-bold leading-tight text-base-content line-clamp-2 mt-1">
          {part.partsName || "Not Found"}
        </h3>

        <p className="text-sm text-base-content/60 font-poppins mt-1 line-clamp-1">
          {part.category || "N/A"} • {part.subCategory || "N/A"}
        </p>
      </div>

      <div className="pt-3 border-t border-base-200">
        <div className="flex items-center justify-between">

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-urbanist text-primary">
              ${Number(part.price || 0).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Conditional Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className={cartButtonClass}
            >
              {cartButtonContent}
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

  return (
    <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden hover:shadow-2xl hover:border-primary/50 transition-all duration-300 group flex flex-col">
      <div className="relative">
        <ImageWithFallback
          src={part.images} 
          alt={part.partsName}
          className="w-full h-56 object-contain group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider font-urbanist ${stockStatus.className}`}>
            {stockStatus.text}
          </span>
        </div>
      </div>

      {CardContent}
    </div>
  );
}

export default SpareCard;