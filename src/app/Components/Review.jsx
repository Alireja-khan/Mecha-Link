"use client";

import React, { useRef, useState, useEffect } from "react";
// Swiper core and modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Lucide React icons
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

// The primary component
const ReviewSection = ({ shopId = null }) => {
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState({});
  const [shops, setShops] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Swiper Refs
  const swiperInstance = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);

  // --- Data Fetching Logic (Unchanged) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const reviewsUrl = shopId 
          ? `/api/reviews?shopId=${shopId}`
          : '/api/reviews';
        
        const [reviewsRes, usersRes, shopsRes] = await Promise.all([
          fetch(reviewsUrl),
          fetch("/api/users/dashboardUser"),
          fetch("/api/shops")
        ]);

        if (!reviewsRes.ok) throw new Error(`Failed to fetch reviews: ${reviewsRes.status}`);
        if (!usersRes.ok) throw new Error(`Failed to fetch users: ${usersRes.status}`);
        if (!shopsRes.ok) throw new Error(`Failed to fetch shops: ${shopsRes.status}`);

        const reviewsData = await reviewsRes.json();
        const usersData = await usersRes.json();
        const shopsData = await shopsRes.json();

        const usersLookup = {};
        usersData.forEach(user => { usersLookup[user._id] = user; });

        const shopsLookup = {};
        shopsData.result?.forEach(shop => { shopsLookup[shop._id] = shop; });

        setReviews(reviewsData || []);
        setUsers(usersLookup);
        setShops(shopsLookup);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shopId]);

  // --- Helper Functions (Unchanged) ---
  const getUserData = (review) => {
    const user = users[review.userId];
    if (user) {
      return {
        name: user.name || 'Unknown User',
        email: user.email || 'No email',
        profileImage: user.profileImage || `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=0ea5e9&color=fff`,
        phone: user.phone || 'Not available'
      };
    }
    return {
      name: review.userName || 'Anonymous',
      email: review.userEmail || 'No email',
      profileImage: `https://ui-avatars.com/api/?name=${review.userName || 'User'}&background=0ea5e9&color=fff`,
      phone: 'Not available'
    };
  };

  const getShopData = (review) => {
    const shop = shops[review.shopId];
    if (shop) {
      return {
        name: shop.shop?.shopName || 'Unknown Shop',
        city: shop.shop?.address?.city || 'Location not available',
        address: shop.shop?.address || {}
      };
    }
    return {
      name: 'Unknown Shop',
      city: 'Location not available',
      address: {}
    };
  };

  // --- Swiper Init/Update (Unchanged but critical for functionality) ---
  useEffect(() => {
    if (
      swiperInstance.current &&
      prevRef.current &&
      nextRef.current &&
      paginationRef.current
    ) {
      // Set navigation/pagination refs for Swiper
      swiperInstance.current.params.navigation.prevEl = prevRef.current;
      swiperInstance.current.params.navigation.nextEl = nextRef.current;
      swiperInstance.current.navigation.init();
      swiperInstance.current.navigation.update();

      swiperInstance.current.params.pagination.el = paginationRef.current;
      swiperInstance.current.pagination.init();
      swiperInstance.current.pagination.render();
      swiperInstance.current.pagination.update();
    }
  }, [reviews, loading]);

  // --- Skeleton, Empty, Error States (Unchanged) ---
  const ReviewCardSkeleton = () => (
    <div className="flex flex-col border border-gray-200 bg-white rounded-xl shadow-md p-6 h-full animate-pulse">
      {/* User Profile Skeleton */}
      <div className="flex items-center mb-4">
        <div className="skeleton bg-gray-200 w-12 h-12 rounded-full mr-4"></div>
        <div className="space-y-2">
          <div className="skeleton bg-gray-200 h-4 w-32 rounded"></div>
          <div className="skeleton bg-gray-200 h-3 w-24 rounded"></div>
        </div>
      </div>

      {/* Rating Skeleton */}
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton bg-gray-200 w-5 h-5 mr-1 rounded"></div>
        ))}
      </div>

      {/* Review Text Skeleton */}
      <div className="space-y-2 mb-4 flex-1">
        <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
        <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
        <div className="skeleton bg-gray-200 h-4 w-3/4 rounded"></div>
        <div className="skeleton bg-gray-200 h-4 w-1/2 rounded"></div>
      </div>

      {/* Quote Icon Skeleton */}
      <div className="flex justify-end mt-auto">
        <div className="skeleton bg-gray-200 w-10 h-10 rounded"></div>
      </div>
    </div>
  );

  const SectionHeaderSkeleton = () => (
    <div className="lg:container mx-auto px-6 text-center mb-10 animate-pulse">
      <div className="skeleton bg-gray-300 h-12 w-80 mx-auto rounded-lg mb-4"></div>
      <div className="skeleton bg-gray-300 h-5 w-96 mx-auto rounded"></div>
    </div>
  );

  const EmptyReviewsState = () => (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <Quote className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">
        No Reviews Yet
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        {shopId 
          ? "This shop doesn't have any reviews yet. Be the first to share your experience!"
          : "No reviews available at the moment. Check back later!"
        }
      </p>
    </div>
  );

  const ErrorState = () => (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <Quote className="w-12 h-12 text-red-400" />
      </div>
      <h3 className="text-xl font-semibold text-red-600 mb-2">
        Failed to Load Reviews
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        {error || "Something went wrong while loading reviews. Please try again later."}
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  // --- Loading State Render (Unchanged) ---
  if (loading) {
    return (
      <section className="relative">
        <SectionHeaderSkeleton />
        <div className="relative py-20 bg-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative lg:container mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
              {[...Array(3)].map((_, index) => (
                <ReviewCardSkeleton key={index} />
              ))}
            </div>
            
            <div className="flex items-center mt-8 w-fit mx-auto space-x-4">
              <div className="skeleton bg-gray-300 w-10 h-10 rounded-full"></div>
              <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="skeleton bg-gray-300 w-3 h-3 rounded-full"></div>
                ))}
              </div>
              <div className="skeleton bg-gray-300 w-10 h-10 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --- Error/Empty State Renders (Unchanged) ---
  if (error) {
    return (
      <section className="relative">
        <div className="lg:container mx-auto px-6 text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-urbanist">
            What Our <span className="text-primary inline-block">Users Say</span>
          </h2>
        </div>
        <div className="relative py-12 md:py-20 bg-gray-100">
          <div className="relative lg:container mx-auto px-6">
            <ErrorState />
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="relative">
        <div className="lg:container mx-auto px-6 text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-urbanist">
            What Our <span className="text-primary inline-block">Users Say</span>
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto font-poppins">
            Real stories from car owners, drivers, and businesses who trust MechaLink
            for reliable auto services.
          </p>
        </div>
        <div className="relative py-12 md:py-20 bg-gray-100">
          <div className="relative lg:container mx-auto px-6">
            <EmptyReviewsState />
          </div>
        </div>
      </section>
    );
  }

  // --- Main Render ---
  return (
    <section className="relative mb-15">
      {/* Title + Description */}
      <div className="lg:container mx-auto px-6 text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 font-urbanist">
          What Our <span className="text-primary inline-block">Users Say</span>
        </h2>
        <p className="text-base md:text-lg max-w-2xl mx-auto font-poppins">
          {shopId 
            ? `Customer reviews for this shop (${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'})`
            : "Real stories from car owners, drivers, and businesses who trust MechaLink for reliable auto services."
          }
        </p>
      </div>

      {/* Background + Slider */}
      <div
        className="relative py-12 md:py-20 bg-fixed bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/3mHvXnzq/jeff-caron-robert-0-CCVIu-Aj-ORE-unsplash.jpg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative lg:container mx-auto px-6">
          <Swiper
            modules={[Navigation, Pagination, A11y, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            loop={reviews.length > 1}
            autoplay={
              reviews.length > 1 ? {
                delay: 3000,
                disableOnInteraction: false,
              } : false
            }
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            pagination={{
              clickable: true,
              el: paginationRef.current,
              bulletClass:
                "swiper-pagination-bullet w-3 h-3 rounded-full bg-orange-400 transition-colors duration-200 mx-1 cursor-pointer",
              bulletActiveClass: "swiper-pagination-bullet-active bg-primary",
            }}
            onSwiper={(swiper) => {
              swiperInstance.current = swiper;
            }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 15 },
              640: { slidesPerView: reviews.length >= 2 ? 2 : 1, spaceBetween: 20 },
              1024: { slidesPerView: reviews.length >= 3 ? 3 : reviews.length >= 2 ? 2 : 1, spaceBetween: 25 },
              1280: { slidesPerView: reviews.length >= 3 ? 3 : reviews.length >= 2 ? 2 : 1, spaceBetween: 30 },
            }}
            className="pb-16"
          >
            {reviews.slice(0, 8).map((review) => {
              const userData = getUserData(review);
              const shopData = getShopData(review);
              
              return (
                <SwiperSlide key={review._id}>
                  <div className="group flex flex-col border border-neutral bg-base-200 rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 p-5 w-full min-h-[340px] overflow-hidden">
                    
                    {/* User Profile */}
                    <div className="flex items-center mb-3">
                      <div className="relative">
                        <img
                          src={userData.profileImage}
                          alt={userData.name}
                          className="w-12 h-12 rounded-full border border-primary mr-4 object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${userData.name}&background=0ea5e9&color=fff`;
                          }}
                        />
                      </div>
                      <div className="text-base-content overflow-hidden">
                        <p className="font-medium font-urbanist text-sm sm:text-base truncate">{userData.name}</p>
                        <p className="text-xs sm:text-sm truncate">{userData.email}</p>
                        {shopId === null && (
                          <p className="text-xs text-base-content/60 mt-1 truncate">
                            {shopData.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 sm:w-5 sm:h-5 mr-1 ${i < review.rating ? "text-primary fill-current" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="ml-2 text-xs sm:text-sm font-medium text-base-content">
                        ({review.rating}.0)
                      </span>
                    </div>

                    {/* Review Text - Now enforced to a max of 4 lines to fit the fixed height card */}
                    <p className="text-sm sm:text-base text-base-content/80 italic flex-1 leading-relaxed mb-4 line-clamp-4">
                      "
                      {review.comment || review.feedback || review.reviewText || "Great service, highly recommended!"}
                      "
                    </p>

                    {/* Additional Info */}
                    <div className="mt-2 text-xs text-base-content/50">
                      {review.createdAt && (
                        <p>Reviewed on {new Date(review.createdAt).toLocaleDateString()}</p>
                      )}
                    </div>

                    {/* Quote Icon */}
                    <div className="flex justify-end mt-auto">
                      <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Navigation + Pagination */}
          {reviews.length > 1 && (
            <div className="flex items-center mt-8 w-fit mx-auto space-x-4">
              <button
                ref={prevRef}
                className="bg-base-200 text-primary hover:bg-primary hover:text-white p-2 rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 active:scale-95"
                aria-label="Previous Review"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div ref={paginationRef} className="flex space-x-2"></div>

              <button
                ref={nextRef}
                className="bg-base-200 text-primary hover:bg-primary hover:text-white p-2 rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 active:scale-95"
                aria-label="Next Review"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;