"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  FaStar,
  FaRegStar,
  FaShoppingCart,
  FaArrowLeft,
  FaCheckCircle,
  FaInfoCircle,
  FaRulerCombined,
  FaBox,
  FaTicketAlt,
  FaTimesCircle,
} from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Image from "next/image";
import useUser from "@/hooks/useUser";
import Loader from "../../loading";

// --- Helper Components ---
// NOTE: Colors adjusted to use DaisyUI semantic classes (e.g., text-base-content, text-warning/success/error)
const RatingStars = ({ rating = 4.5, reviewCount = 124 }) => {
  if (!rating) return <span className="text-base-content/50">Not rated</span>;

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5 text-base">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            // Using DaisyUI's warning color for a standard star rating gold/yellow
            return <FaStar key={i} className="text-warning w-4 h-4" />; 
          } else if (i === fullStars && hasHalfStar) {
            return <FaRegStar key={i} className="text-warning w-4 h-4 opacity-50" />;
          } else {
            return <FaRegStar key={i} className="text-base-300 w-4 h-4" />;
          }
        })}
      </div>
      <span className="text-base-content font-medium text-sm">
        {rating.toFixed(1)}
      </span>
      <span className="text-base-content/70 text-sm">
        ({reviewCount.toLocaleString()} reviews)
      </span>
    </div>
  );
};

const ProductTabs = ({ part }) => {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description", icon: FaInfoCircle, content: <DescriptionTab part={part} /> },
    { id: "details", label: "Specifications", icon: FaRulerCombined, content: <DetailsTab part={part} /> },
  ];

  return (
    // Base colors from DaisyUI
    <div className="w-full mt-12 bg-base-200 rounded-xl shadow-lg border border-base-300 p-6">
      <div className="flex border-b border-base-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-3 px-6 text-lg font-semibold transition-all duration-300 ${
              activeTab === tab.id
                // Primary color for active tab
                ? "text-primary border-b-2 border-primary"
                : "text-base-content/60 hover:text-base-content/90"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-4">{tabs.find(t => t.id === activeTab)?.content}</div>
    </div>
  );
};

const DescriptionTab = ({ part }) => (
  <div className="prose max-w-none">
    <p className="text-base-content leading-relaxed text-base">
      {part.description || "No detailed description is available for this part yet. Please refer to the specifications for more information."}
    </p>
  </div>
);

const DetailsTab = ({ part }) => (
  <div className="space-y-4">
    <DetailItem label="Category" value={part.category} icon={FaBox} />
    <DetailItem label="Subcategory" value={part.subCategory || "General"} icon={FaBox} />
    <DetailItem label="Brand" value={part.brands} icon={FaInfoCircle} />
    <DetailItem label="Part ID" value={part._id} icon={FaRulerCombined} />
    <DetailItem label="Available Stock" value={`${part.quantity} units`} icon={FaCheckCircle} />
  </div>
);

const DetailItem = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between py-3 border-b border-base-200 hover:bg-base-200 transition-colors px-3 -mx-3 rounded-lg">
    <span className="text-base-content/80 flex items-center gap-3 font-medium">
      <Icon className="w-5 h-5 text-primary/70" />
      {label}
    </span>
    <span className="font-semibold text-base-content">{value}</span>
  </div>
);
// -------------------------

export default function PartDetailPage() {
  const params = useParams();
  const id = params.id;
  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  
  // State for Coupon
  const [couponCode, setCouponCode] = useState("");
  const [activeCoupon, setActiveCoupon] = useState(null); // Stores the applied coupon object
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Use the useUser hook to get current user
  const { user, status } = useUser();
  const isAuthenticated = status === "authenticated" && !!user;

  const fetchPart = async () => {
    // ... (fetch logic remains the same)
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`/api/spareParts/${id}`);
      setPart(response.data);
    } catch (error) {
      setError("Failed to load part details");
      toast.error("Failed to load part details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPart();
    }
  }, [id]);

  const partImages = useMemo(() => 
    Array.isArray(part?.images)
      ? part.images
      : (part?.images ? [part.images] : []),
    [part?.images]
  );
  
  const selectedImage = partImages[selectedImageIndex];
  
  // Calculate discount rate (e.g., 10 for 10%)
  const discountRate = activeCoupon ? activeCoupon.discount / 100 : 0;
  
  // Calculate discounted price
  const discountedPrice = useMemo(() => {
    if (!part) return 0;
    return part.price * (1 - discountRate);
  }, [part, discountRate]);

  /**
   * Fetches coupons and validates the entered code against the API.
   */
  const handleApplyCoupon = async () => {
    const code = couponCode.toUpperCase().trim();
    if (!code) {
      toast.error("Please enter a coupon code.");
      return;
    }

    setIsApplyingCoupon(true);
    setActiveCoupon(null); // Clear any existing coupon

    try {
      // 1. Fetch all coupons from the API
      const response = await axios.get('/api/coupons');
      const coupons = response.data;
      
      // 2. Find the matching coupon
      const coupon = coupons.find(c => c.code === code);
      
      if (!coupon) {
        toast.error(`Coupon code "${code}" is invalid.`);
        return;
      }
      
      // 3. Basic Client-side Validation
      const now = new Date();
      const expiry = new Date(coupon.expiryDate);

      if (coupon.status !== "active") {
        toast.error(`Coupon code "${code}" is not active.`);
        return;
      }

      if (expiry < now) {
        toast.error(`Coupon code "${code}" has expired.`);
        return;
      }
      
      // 4. Apply the coupon
      setActiveCoupon(coupon);
      toast.success(`Coupon **${code}** applied! You received ${coupon.discount}% off.`);

    } catch (error) {
      toast.error("An error occurred while applying the coupon.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed.");
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // NOTE: Using daisyui error color for toast
      toast.error("Please login to add items to cart");
      return;
    }

    if (!part) return;

    try {
      setAddingToCart(true);

      const imageToSend = Array.isArray(part.images) ? part.images[0] : part.images;
      const finalPrice = discountedPrice; 

      const cartItem = {
        userEmail: user.email,
        partId: part._id,
        partsName: part.partsName,
        price: finalPrice, 
        quantity: quantity,
        image: imageToSend || "",
        brand: part.brands,
        category: part.category,
        couponApplied: activeCoupon ? activeCoupon.code : undefined, 
        couponDiscount: activeCoupon ? activeCoupon.discount : 0,
      };

      const response = await axios.post('/api/cart', cartItem);

      if (response.data.success) {
        if (response.data.action === "update") {
          const newTotal = response.data.newQuantity || quantity;
          toast.success(`Quantity updated! You now have ${newTotal}x ${part.partsName} in your cart.`);
        } else {
          toast.success(`Added ${quantity} ${part.partsName} to cart!`);
        }
      } else {
        toast.error(response.data.message || "Failed to add to cart");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to add item to cart due to a server error.";
      toast.error(errorMessage);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!part) return;
    if (!isAuthenticated) {
      toast.error("Please login to proceed to checkout");
      return;
    }
    toast.success(`Redirecting to checkout for ${quantity}x ${part.partsName}...`);
  };

  const increaseQuantity = () => {
    if (part && quantity < part.quantity) {
      setQuantity(q => q + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  if (loading) {
    return (
      <Loader/>
    );
  }

  if (error || !part) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaStar className="text-error text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-base-content mb-2">
            Part Not Found
          </h1>
          <p className="text-base-content/70 mb-6">
            {error ||
              "The part you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href="/market"
            // Primary colors
            className="bg-primary text-primary-content px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <FaArrowLeft />
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = part.quantity === 0;

  // --- Main Render (Dynamic Colors Applied) ---
  return (
    <div className="min-h-screen bg-base-100 pb-20"> {/* Use base-200 for page background */}
      <div className="container mx-auto px-4 py-10">
        {/* Back Link */}
        <Link
          href="/market"
          className="text-base-content/70 hover:text-primary mb-8 inline-flex items-center gap-2 transition-colors text-sm font-medium"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to all parts
        </Link>

        {/* Main Content - Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left Column: Image Gallery (Sticky on large screens) */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-20">
              <div className="p-4 sm:p-8 bg-base-200 rounded-2xl shadow-xl border border-base-300">
                
                {/* Main Image Container */}
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-base-100 transition-all duration-300 transform hover:scale-[1.01]">
                  <Image
                    src={selectedImage || `/placeholder-image.svg`}
                    alt={part.partsName}
                    layout="fill"
                    objectFit="contain"
                    className="p-6 transition-opacity duration-500 object-cover w-full h-full"
                    onError={(e) => {
                      e.target.src = `/placeholder-image.svg`;
                      e.target.style.objectFit = 'cover';
                    }}
                    unoptimized={!selectedImage} 
                  />
                </div>

                {/* Image Thumbnails */}
                {partImages.length > 1 && (
                  <div className="flex gap-4 mt-6 justify-center">
                    {partImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-14 h-14 sm:w-20 sm:h-20 border-3 rounded-xl overflow-hidden relative transition-all duration-200 transform hover:scale-105 ${selectedImageIndex === index
                            ? "border-primary ring-4 ring-primary/30"
                            : "border-base-300 hover:border-base-content/50"
                          }`}
                      >
                        <Image
                          height={500}
                          width={500}
                          src={image}
                          alt={`${part.partsName} thumbnail ${index + 1}`}
                          className="object-cover w-full h-full"
                          priority={index === 0}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Product Details & Actions */}
          <div className="lg:col-span-3">
            <div className="p-4 sm:p-8 bg-base-200 rounded-2xl shadow-xl border border-base-300">
              
              {/* Header Details */}
              <div className="mb-6 pb-4 border-b border-base-200">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-base-content mb-3 leading-tight">
                  {part.partsName}
                </h1>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-4">
                  <span className="text-xl font-semibold text-base-content/80">
                    <span className="text-base-content/50 font-normal">Brand:</span> <span className="text-primary">{part.brands}</span>
                  </span>
                  {/* Status badge: Use DaisyUI success/error colors */}
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${isOutOfStock ? 'bg-error/20 text-error' : 'bg-success/20 text-success'}`}>
                    <FaCheckCircle className="text-base" />
                    {isOutOfStock ? "Out of Stock" : `In Stock (${part.quantity} available)`}
                  </span>
                </div>
                
                <RatingStars rating={4.5} reviewCount={124} />
              </div>

              {/* Price and Actions */}
              <div className="mb-8 p-4 bg-base-100 rounded-xl z-10 shadow-lg"> {/* Base-200 for a subtle container color */}
                <div className="flex items-end justify-between mb-4">
                    <div className="flex flex-col">
                        {/* Display original price with strikethrough only if a discount is applied */}
                        {activeCoupon && (
                            <span className="text-2xl font-bold text-base-content/50 line-through">
                                ${part.price.toFixed(2)}
                            </span>
                        )}
                        <span className="text-6xl font-extrabold text-primary transition-colors duration-300">
                            ${discountedPrice.toFixed(2)}
                        </span>
                    </div>
                    {/* Display discount percentage with DaisyUI success colors */}
                    {activeCoupon && (
                        <span className="text-lg font-semibold text-success bg-success/20 px-3 py-1 rounded-full">
                            {`${activeCoupon.discount}% OFF!`}
                        </span>
                    )}
                </div>
                
                {/* Coupon Field */}
                <div className="mt-4 pt-4 border-t border-base-300">
                    <h3 className="text-lg font-bold text-base-content mb-3 flex items-center gap-2">
                        <FaTicketAlt className="text-primary" /> Apply Coupon
                    </h3>
                    
                    {activeCoupon ? (
                        <div className="flex items-center justify-between bg-success/10 p-3 rounded-xl border border-success/30">
                            <p className="text-success font-bold">
                                Coupon **{activeCoupon.code}** applied!
                            </p>
                            <button
                                onClick={handleRemoveCoupon}
                                className="text-error hover:text-error/80 transition-colors p-1 rounded-full"
                            >
                                <FaTimesCircle className="inline-block mr-1 w-5 h-5" />
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter coupon code (e.g., SAVE15)"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                // Input styles using base and primary colors
                                className="flex-grow p-3 border border-base-300 rounded-l-xl focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 bg-base-200 text-base-content"
                                disabled={isApplyingCoupon || isOutOfStock}
                            />
                            <button
                                onClick={handleApplyCoupon}
                                disabled={isApplyingCoupon || isOutOfStock}
                                // Primary colors
                                className="bg-primary text-primary-content px-5 py-3 rounded-r-xl font-semibold hover:bg-primary/90 transition-colors duration-150 disabled:opacity-50"
                            >
                                {isApplyingCoupon ? "Applying..." : "Apply"}
                            </button>
                        </div>
                    )}
                </div>

                {/* Quantity Selector */}
                <div className="mt-6 pt-4 border-t border-base-300 flex items-center gap-6">
                  <label className="text-lg font-medium text-base-content/80 whitespace-nowrap">
                    Quantity:
                  </label>
                  <div className="flex items-stretch border-2 border-base-300 rounded-full overflow-hidden flex-grow max-w-40">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="px-4 py-3 text-xl text-base-content/70 hover:bg-base-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      -
                    </button>
                    <span className="flex-grow px-2 py-3 text-xl font-bold min-w-16 text-center bg-base-100 text-base-content border-x border-base-200">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      disabled={quantity >= part.quantity || isOutOfStock}
                      className="px-4 py-3 text-xl text-base-content/70 hover:bg-base-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-base-content/50">
                    {isOutOfStock ? "Zero Stock" : `Max: ${part.quantity}`}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || status === "loading" || isOutOfStock}
                  // Secondary colors
                  className="flex-1 bg-secondary text-white py-4 rounded-full font-extrabold uppercase tracking-wider hover:bg-secondary/90 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {addingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neutral"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <FaShoppingCart className="text-xl" />
                      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  // Primary colors
                  className="flex-1 bg-primary text-primary-content py-4 rounded-full font-extrabold uppercase tracking-wider hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>

            </div>
            
            {/* Tabbed Description and Specifications Section */}
            <div>
              {(part.description || part.subCategory) && <ProductTabs part={part} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}