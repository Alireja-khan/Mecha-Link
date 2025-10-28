"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  CheckCircle,
  Info,
  Ruler,
  PackageOpen,
  XCircle,
  MessageSquareText,
  UserCircle,
  Send,
  Tag,
  DollarSign,
  Warehouse,
  ClipboardList,
  MessageSquare,
  InfoIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Image from "next/image";
import useUser from "@/hooks/useUser";
import Loader from "../../loading";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

const SOCKET_URL = 'http://localhost:3001';
let socket;

const RatingStars = ({ rating = 0, reviewCount = 0 }) => {
  if (reviewCount === 0) return <span className="text-base-content/70 text-sm">No reviews yet</span>;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-0.5 text-warning text-base">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} className="w-4 h-4 fill-current" />;
          } else if (i === fullStars && hasHalfStar) {
            return <Star key={i} className="w-4 h-4 opacity-50 fill-current" />;
          } else {
            return <Star key={i} className="text-base-300 w-4 h-4" />;
          }
        })}
      </div>
      <span className="text-base-content font-semibold text-sm">
        {rating.toFixed(1)}
      </span>
      <span className="text-base-content/70 text-sm">
        ({reviewCount.toLocaleString()} reviews)
      </span>
    </div>
  );
};

const ReviewCard = ({ review, currentUserEmail, onDelete }) => {
  const reviewDate = new Date(review.createdAt).toLocaleDateString();
  const hasUserImage = review.userProfileImage && review.userProfileImage.trim() !== '';
  const isAuthor = currentUserEmail && currentUserEmail === review.userEmail;

  return (
    <div className="p-5 bg-base-100 rounded-lg shadow-md border border-base-300 transition-shadow duration-300 hover:shadow-lg relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {hasUserImage ? (
            <Image
              src={review.userProfileImage}
              alt={review.userName || 'User Avatar'}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover border border-base-200"
            />
          ) : (
            <UserCircle className="w-8 h-8 text-primary" />
          )}
          <span className="font-semibold text-base-content">{review.userName || review.userEmail}</span>
        </div>
        <div className="flex items-center space-x-1 text-warning text-sm">
          {[...Array(5)].map((_, i) => (
            i < review.rating ? <Star key={i} className="w-4 h-4 fill-current" /> : <Star key={i} className="w-4 h-4 text-base-300" />
          ))}
        </div>
      </div>
      <p className="text-base-content/90 mb-3 leading-relaxed text-base">{review.comment}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-base-content/50">Reviewed on {reviewDate}</span>
        {isAuthor && (
          <button
            onClick={() => onDelete(review._id)}
            className="text-error hover:text-error/80 transition-colors flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-full bg-error/10 hover:bg-error/20"
            title="Delete your review"
          >
            <XCircle className="w-4 h-4" />
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};

const ReviewsTab = ({ partId, reviews, fetchReviews, loadingReviews }) => {
  const { user, status } = useUser();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to post a review.");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    try {
      setSubmitting(true);
      const reviewData = {
        userEmail: user.email,
        userName: user.name || user.email,
        userProfileImage: user.profileImage || '',
        rating,
        comment,
      };

      const response = await axios.post(`/api/spareParts/${partId}/reviews`, reviewData);

      if (response.data.success) {
        toast.success(response.data.message);
        setRating(0);
        setComment('');
        fetchReviews();
      } else {
        toast.error(response.data.message || "Failed to submit review.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!user) {
      toast.error("You must be logged in to delete a review.");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#fff",
    });

    if (!result.isConfirmed) return;

    try {
      toast.loading("Deleting review...", { id: reviewId });

      const response = await axios.delete(`/api/spareParts/${partId}/reviews`, {
        data: {
          reviewId,
          userEmail: user.email,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message, { id: reviewId });
        fetchReviews();
      } else {
        toast.error(response.data.message || "Failed to delete review.", { id: reviewId });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred during deletion.";
      toast.error(errorMessage, { id: reviewId });
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-base-content border-b border-base-300 pb-3 mb-6">Submit Your Review</h3>
      {status === 'authenticated' ? (
        <form onSubmit={handleSubmitReview} className="bg-base-200 p-6 rounded-xl shadow-inner border border-base-300 space-y-4">
          <div className="flex items-center space-x-4">
            <label className="text-base-content/80 font-medium whitespace-nowrap">Your Rating:</label>
            <div className="flex items-center space-x-1 text-2xl">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <button
                  type="button"
                  key={starValue}
                  onClick={() => handleRatingChange(starValue)}
                  className={`transition-colors duration-200 ${starValue <= rating ? 'text-warning fill-warning' : 'text-base-300 hover:text-warning hover:fill-warning'}`}
                >
                  <Star className={`${starValue <= rating ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts on this part"
            rows={4}
            className="w-full p-3 border border-base-300 rounded-lg bg-base-100 text-base-content resize-none focus:ring-primary focus:border-primary transition-all duration-300 placeholder-base-content/50 focus:outline-none"
            required
            disabled={submitting}
          ></textarea>
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="w-full flex items-center justify-center space-x-2 bg-primary text-white py-3 rounded-lg text-lg font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {submitting ? (
              <>
                <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" /> <span>Post Review</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="p-4 bg-info/10 border-l-4 border-info text-info rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <Info className="min-w-6 min-h-6 text-info" />
            <span className="text-sm text-base-content/90">
              <Link href="/login" className="font-bold underline text-info hover:text-info/80 transition-colors">Log in</Link> to submit a review for this part.
            </span>
          </div>
        </div>
      )}

      <h3 className="text-2xl font-bold text-base-content border-b border-base-300 pb-3 mb-6 pt-4">Customer Reviews</h3>
      <div className="space-y-6">
        {loadingReviews ? (
          <div className="text-center p-8 bg-base-100 rounded-xl border border-base-300 text-base-content/70 shadow-sm">
            <div className="flex justify-center items-center space-x-2">
              <span className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
              <p className="text-lg font-medium text-base-content/80">Loading reviews...</p>
            </div>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map(review => (
            <ReviewCard
              key={review._id}
              review={review}
              currentUserEmail={user?.email}
              onDelete={handleDeleteReview}
            />
          ))
        ) : (
          <div className="text-center p-8 bg-base-100 rounded-xl border border-base-300 text-base-content/70 shadow-sm">
            <MessageSquare className="w-8 h-8 mx-auto mb-3 text-primary" />
            <p className="text-lg">Be the first to review this part!</p>
          </div>
        )}
      </div>
    </div>
  );
};


const ProductTabs = ({ part, reviews, fetchReviews, loadingReviews }) => {
  const [activeTab, setActiveTab] = useState("description");
  const tabs = [
    { id: "description", label: "Description", icon: ClipboardList, content: <DescriptionTab part={part} /> },
    { id: "details", label: "Specifications", icon: Ruler, content: <DetailsTab part={part} /> },
    { id: "reviews", label: `Reviews (${reviews.length})`, icon: MessageSquareText, content: <ReviewsTab partId={part._id} reviews={reviews} fetchReviews={fetchReviews} loadingReviews={loadingReviews} /> },
  ];
  return (
    <div className="w-full mt-12 bg-base-100 rounded-xl shadow-lg border border-base-300 p-6">
      <div className="flex border-b border-base-300 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 py-3 px-6 text-lg font-semibold transition-all duration-300 whitespace-nowrap focus:outline-none ${activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-base-content/70 hover:text-base-content"
              }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="pt-4">{tabs.find(t => t.id === activeTab)?.content}</div>
    </div>
  );
};

const DescriptionTab = ({ part }) => (
  <div className="text-base-content max-w-none">
    <p className="leading-relaxed text-base">
      {part.description || "No detailed description is available for this part yet. Please refer to the specifications for more information."}
    </p>
  </div>
);

const DetailsTab = ({ part }) => (
  <div className="space-y-4">
    <DetailItem label="Category" value={part.category} icon={PackageOpen} />
    <DetailItem label="Subcategory" value={part.subCategory || "General"} icon={PackageOpen} />
    <DetailItem label="Brand" value={part.brands} icon={Tag} />
    <DetailItem label="Part ID" value={part._id} icon={Ruler} />
    <DetailItem label="Available Stock" value={`${part.quantity || 0} units`} icon={InfoIcon} />
  </div>
);

const DetailItem = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between py-3 border-b border-base-200 hover:bg-base-200 transition-colors px-3 -mx-3 rounded-lg">
    <span className="text-base-content/80 flex items-center space-x-3 font-medium">
      <Icon className="w-5 h-5 text-primary" />
      <span>{label}</span>
    </span>
    <span className="font-semibold text-base-content">{value}</span>
  </div>
);

export default function PartDetailPage() {
  const params = useParams();
  const id = params.id;
  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const [isInCart, setIsInCart] = useState(false);
  const [cartItemQuantity, setCartItemQuantity] = useState(0);
  const [checkingCartStatus, setCheckingCartStatus] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const { user, status } = useUser();
  const userEmail = user?.email;

  useEffect(() => {
    if (!socket) {
      socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    }

    const handleCartUpdate = (data) => {
      if (data.userEmail === userEmail && part?._id) {
        checkIfPartInCart(part._id, userEmail);
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
  }, [userEmail, part?._id]);

  const checkIfPartInCart = async (partId, email) => {
    if (!partId || !email) {
      setCheckingCartStatus(false);
      return;
    }

    const maxStock = part?.quantity || 0;

    try {
      setCheckingCartStatus(true);

      const response = await axios.get(`/api/cart?userEmail=${email}`);
      const cart = response.data;
      const existingItem = cart.find(item => item.partId === partId);

      if (existingItem) {
        setIsInCart(true);
        const initialQuantity = Math.min(existingItem.quantity, maxStock);
        setCartItemQuantity(initialQuantity);
        setQuantity(initialQuantity);
      } else {
        setIsInCart(false);
        setCartItemQuantity(0);
        setQuantity(maxStock > 0 ? 1 : 0);
      }
    } catch (error) {
      console.error("Failed to check cart status:", error);
      setIsInCart(false);
    } finally {
      setCheckingCartStatus(false);
    }
  };

  const fetchReviews = async () => {
    if (!id) return;
    try {
      setLoadingReviews(true);
      const response = await axios.get(`/api/spareParts/${id}/reviews`);
      setReviews(response.data.reviews || []);
      setAverageRating(response.data.averageRating || 0);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setReviews([]);
      setAverageRating(0);
    } finally {
      setLoadingReviews(false);
    }
  };


  const fetchPart = async () => {
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
      fetchReviews();
    }
  }, [id]);

  useEffect(() => {
    if (part && userEmail) {
      checkIfPartInCart(part._id, userEmail);
    }
    else if (part) {
      const maxStock = part.quantity || 0;

      if (maxStock > 0) {
        setQuantity(1);
      } else {
        setQuantity(0);
      }
      setCheckingCartStatus(false);
    }
  }, [part, userEmail]);

  const partImages = useMemo(() =>
    Array.isArray(part?.images)
      ? part.images
      : (part?.images ? [part.images] : []),
    [part?.images]
  );

  const selectedImage = partImages[selectedImageIndex];
  const finalPrice = useMemo(() => part ? part.price : 0, [part]);

  const handleAddToCart = async () => {
    if (!part || !userEmail) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    try {
      setAddingToCart(true);

      const imageToSend = Array.isArray(part.images) ? part.images[0] : part.images;

      const cartItem = {
        userEmail: user.email,
        partId: part._id,
        partsName: part.partsName,
        price: finalPrice,
        quantity: quantity,
        image: imageToSend || "",
        brand: part.brands,
        category: part.category,
      };

      const response = await axios.post('/api/cart', cartItem);
      const { action, newQuantity, message } = response.data;

      if (response.data.success) {
        const qty = response.data.newQuantity || quantity;
        setCartItemQuantity(qty);
        setQuantity(qty);
        setIsInCart(true);

        toast.success(
          action === "update"
            ? `Quantity updated! You now have ${qty}x ${part.partsName} in your cart.`
            : `Added ${qty} ${part.partsName} to cart!`
        );

        socket?.emit('cartUpdate', { userEmail: user.email, action });
      } else {
        toast.error(message || "Failed to add to cart");
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

    if (!user) {
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

  const getStockStatus = () => {
    const qty = part?.quantity || 0;
    if (qty > 10) {
      return {
        text: `In Stock (${qty} available)`,
        className: 'bg-success/10 text-success',
        icon: CheckCircle,
        isAvailable: true
      };
    } else if (qty > 0) {
      return {
        text: `Low Stock (${qty} available)`,
        className: 'bg-warning/15 text-warning',
        icon: Info,
        isAvailable: true
      };
    } else {
      return {
        text: "Out of Stock",
        className: 'bg-error/10 text-error',
        icon: XCircle,
        isAvailable: false
      };
    }
  };

  if (loading || status === 'loading' || checkingCartStatus || !user) {
    return (
      <Loader />
    );
  }

  if (error || !part) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="text-error text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-base-content mb-2">
            Part Not Found
          </h1>
          <p className="text-base-content/80 mb-6">
            {error ||
              "The part you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href="/market"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center space-x-2 font-semibold shadow-md"
          >
            <ArrowLeft />
            <span>Back to Marketplace</span>
          </Link>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus();
  const isOutOfStock = !stockStatus.isAvailable;
  const displayQuantity = isOutOfStock ? 0 : quantity;

  let cartButtonContent;
  let cartButtonDisabled = addingToCart || isOutOfStock || (status === 'unauthenticated');
  let cartButtonClass = "flex-1 py-4 rounded-full font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5";

  if (addingToCart) {
    cartButtonContent = (
      <>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span>Adding...</span>
      </>
    );
    cartButtonClass += ' bg-success text-white';
  } else if (isOutOfStock) {
    cartButtonContent = (
      <>
        <XCircle className="text-xl" /> <span>Out of Stock</span>
      </>
    );
    cartButtonClass += ' bg-error text-white';
  } else if (isInCart) {
    cartButtonContent = (
      <>
        <ShoppingCart className="text-xl text-white" /> <span className="text-white">Update Cart (Qty: {cartItemQuantity})</span>
      </>
    );
    cartButtonClass += ' bg-warning text-white hover:bg-warning/90';
  } else {
    cartButtonContent = (
      <>
        <ShoppingCart className="text-xl" /> <span>Add to Cart</span>
      </>
    );
    cartButtonClass += ' bg-success text-white hover:bg-success/90';
  }

  return (
    <div className="min-h-screen bg-base-100 pb-20">
      <div className="container mx-auto px-4 py-10">
        <Link
          href="/market"
          className="text-base-content/70 hover:text-primary mb-8 inline-flex items-center space-x-2 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all parts</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-20">
              <div className="p-4 sm:p-8 bg-base-100 rounded-2xl shadow-xl border border-base-300">

                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-base-200 transition-all duration-300 transform hover:scale-[1.01]">
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

                {partImages.length > 1 && (
                  <div className="flex space-x-4 mt-6 justify-center">
                    {partImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-14 h-14 sm:w-20 sm:h-20 border-3 rounded-xl overflow-hidden relative transition-all duration-200 transform hover:scale-105 ${selectedImageIndex === index
                            ? "border-primary ring-4 ring-primary/40 border-4"
                            : "border border-base-300 hover:border-base-content/50"
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

          <div className="lg:col-span-3">
            <div className="p-4 sm:p-8 bg-base-100 rounded-2xl shadow-xl border border-base-300">

              <div className="mb-6 pb-4 border-b border-base-200">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-base-content mb-3 leading-tight">
                  {part.partsName}
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-4">
                  <span className="text-xl font-semibold text-base-content/90">
                    <span className="text-base-content/70 font-normal">Brand:</span> <span className="text-primary">{part.brands}</span>
                  </span>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center space-x-2 ${stockStatus.className}`}>
                    <stockStatus.icon className="text-base" />
                    <span>{stockStatus.text}</span>
                  </span>
                </div>

                <RatingStars rating={averageRating} reviewCount={reviews.length} />
              </div>

              {isInCart && (
                <div className="p-4 bg-info/10 border-l-4 border-info text-info rounded-lg shadow-sm mb-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="min-w-5 min-h-5 text-info" />
                    <span className="font-semibold text-xs md:text-sm text-base-content/90">
                      This item is **already in your cart**! Current Quantity: {cartItemQuantity}. Use the selector below to update the quantity.
                    </span>
                  </div>
                </div>
              )}

              <div className="mb-8 p-4 bg-base-200 rounded-xl shadow-md border border-base-300">
                <div className="flex items-end justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-6xl font-extrabold text-primary transition-colors duration-300">
                      <DollarSign className="inline w-12 h-12 align-bottom mr-1" />
                      {finalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-base-300 flex items-center space-x-6">
                  <label className="text-lg font-medium text-base-content/80 whitespace-nowrap">
                    Quantity:
                  </label>
                  <div className="flex items-stretch border-2 border-base-300 rounded-full overflow-hidden flex-grow max-w-40">
                    <button
                      onClick={decreaseQuantity}
                      disabled={displayQuantity <= 1 || isOutOfStock}
                      className="px-4 py-3 text-xl text-base-content/80 hover:bg-base-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none"
                    >
                      -
                    </button>
                    <span className="flex-grow px-2 py-3 text-xl font-bold min-w-16 text-center bg-base-100 text-base-content border-x border-base-300">
                      {displayQuantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      disabled={displayQuantity >= part.quantity || isOutOfStock}
                      className="px-4 py-3 text-xl text-base-content/80 hover:bg-base-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-base-content/70">
                    {isOutOfStock ? "Max: 0" : `Max: ${part.quantity}`}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={cartButtonDisabled}
                  className={cartButtonClass}
                >
                  {cartButtonContent}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="flex-1 bg-primary text-white py-4 rounded-full font-extrabold uppercase tracking-wider hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>

            </div>

            <div>
              {(part.description || part.subCategory) && <ProductTabs part={part} reviews={reviews} fetchReviews={fetchReviews} loadingReviews={loadingReviews} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}