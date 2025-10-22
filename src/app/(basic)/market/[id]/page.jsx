"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  FaStar,
  FaRegStar,
  FaShoppingCart,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function PartDetailPage() {
  const params = useParams();
  const id = params.id;
  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const fetchPart = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`/api/spareParts/${id}`);
      setPart(response.data);
    } catch (error) {
      console.error("Error fetching part:", error);
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

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} ${part.partsName} to cart`);
    // Add to cart logic here
  };

  const handleBuyNow = () => {
    toast.success(`Proceeding to checkout with ${quantity} ${part.partsName}`);
    // Buy now logic here
  };

  const increaseQuantity = () => {
    if (quantity < part.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Mock multiple images for demonstration
  const partImages = part?.images ? [part.images] : [];

  const RatingStars = ({ rating, size = "md" }) => {
    if (!rating) return <span className="text-gray-400">Not rated</span>;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) =>
          star <= rating ? (
            <FaStar key={star} className="text-yellow-400" />
          ) : (
            <FaRegStar key={star} className="text-gray-300" />
          )
        )}
        <span className="text-gray-600 ml-2 text-sm">
          {rating.toFixed(1)} (124 reviews)
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading part details...</p>
        </div>
      </div>
    );
  }

  if (error || !part) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaStar className="text-red-500 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Part Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error ||
              "The part you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href="/spare-parts"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <FaArrowLeft />
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Main Content - Image Gallery and Product Details Side by Side */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Image Gallery - Takes equal width */}
          <div className="lg:w-1/2">
            <div className="rounded-xl shadow-sm border border-gray-200 p-4 h-full">
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={partImages[selectedImage]}
                  alt={part.partsName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml;base64,${btoa(`
                      <svg width="600" height="600" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="#f3f4f6"/>
                        <text x="50%" y="50%" font-family="Arial" font-size="18" fill="#9ca3af" text-anchor="middle" dy=".3em">No Image Available</text>
                      </svg>
                    `)}`;
                  }}
                />
              </div>

              {/* Image Thumbnails */}
              {partImages.length > 1 && (
                <div className="flex gap-2 mt-4">
                  {partImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 border-2 rounded-lg overflow-hidden ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-gray-200"
                      }`}
                    >
                      <Image
                      height={500}
                      width={500}
                        src={image}
                        alt={`${part.partsName} ${index + 1}`}
                        className=" object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details - Takes equal width */}
          <div className="lg:w-1/2">
            <div className="rounded-xl shadow-sm border border-gray-200 p-6 h-full">
              {/* Title and Brand */}
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {part.partsName}
                </h1>
                <div className="flex items-center gap-4 mb-3">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {part.brands}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <FaCheckCircle className="text-sm" />
                    In Stock ({part.quantity} available)
                  </span>
                </div>
                {/* <RatingStars rating={part.rating} /> */}
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ${part.price}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-l border-r border-gray-300 min-w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      disabled={quantity >= part.quantity}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {part.quantity} available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-secondary text-white py-4 rounded-lg font-semibold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <FaShoppingCart />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-primary text-white py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Buy Now
                </button>
              </div>

              {/* Product Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Product Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium">{part.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Subcategory</span>
                      <span className="font-medium">
                        {part.subCategory || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Brand</span>
                      <span className="font-medium">{part.brands}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section - Full width at the bottom */}
        {part.description && (
          <div className="w-full rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Product Description
            </h3>
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed">
                {part.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}