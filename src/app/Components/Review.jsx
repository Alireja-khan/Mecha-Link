"use client";

import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Star, Quote, ChevronLeft, ChevronRight, User } from "lucide-react";

const ReviewSection = ({ shopId = null }) => {
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState({});
  const [shops, setShops] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const swiperInstance = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);

  // Fetch all data including reviews, users, and shops
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build API URLs
        const reviewsUrl = shopId 
          ? `/api/reviews?shopId=${shopId}`
          : '/api/reviews';
        
        // Fetch all data in parallel
        const [reviewsRes, usersRes, shopsRes] = await Promise.all([
          fetch(reviewsUrl),
          fetch("/api/users/dashboardUser"),
          fetch("/api/shops")
        ]);

        if (!reviewsRes.ok) {
          throw new Error(`Failed to fetch reviews: ${reviewsRes.status}`);
        }
        if (!usersRes.ok) {
          throw new Error(`Failed to fetch users: ${usersRes.status}`);
        }
        if (!shopsRes.ok) {
          throw new Error(`Failed to fetch shops: ${shopsRes.status}`);
        }

        const reviewsData = await reviewsRes.json();
        const usersData = await usersRes.json();
        const shopsData = await shopsRes.json();

        // Create lookup objects for users and shops
        const usersLookup = {};
        usersData.forEach(user => {
          usersLookup[user._id] = user;
        });

        const shopsLookup = {};
        shopsData.result?.forEach(shop => {
          shopsLookup[shop._id] = shop;
        });

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

  // Get user data for a review
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

  // Get shop data for a review
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

  useEffect(() => {
    if (
      swiperInstance.current &&
      prevRef.current &&
      nextRef.current &&
      paginationRef.current
    ) {
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

  // Review Card Skeleton
  const ReviewCardSkeleton = () => (
    <div className="flex flex-col border border-gray-200 bg-white rounded-xl shadow-md p-6 h-full md:h-[360px] animate-pulse">
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

  // Section Header Skeleton
  const SectionHeaderSkeleton = () => (
    <div className="container mx-auto px-4 text-center mb-10 animate-pulse">
      <div className="skeleton bg-gray-300 h-12 w-80 mx-auto rounded-lg mb-4"></div>
      <div className="skeleton bg-gray-300 h-5 w-96 mx-auto rounded"></div>
    </div>
  );

  // Empty State Component
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

  // Error State Component
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

  if (loading) {
    return (
      <section className="relative">
        <SectionHeaderSkeleton />
        <div className="relative py-20 bg-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
              {[...Array(3)].map((_, index) => (
                <ReviewCardSkeleton key={index} />
              ))}
            </div>
            
            {/* Navigation Skeleton */}
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

  if (error) {
    return (
      <section className="relative">
        <div className="container mx-auto px-4 text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-urbanist">
            What Our <span className="text-primary inline-block">Users Say</span>
          </h2>
        </div>
        <div className="relative py-20 bg-gray-100">
          <div className="relative container mx-auto px-4">
            <ErrorState />
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="relative">
        <div className="container mx-auto px-4 text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-urbanist">
            What Our <span className="text-primary inline-block">Users Say</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto font-poppins">
            Real stories from car owners, drivers, and businesses who trust MechaLink
            for reliable auto services.
          </p>
        </div>
        <div className="relative py-20 bg-gray-100">
          <div className="relative container mx-auto px-4">
            <EmptyReviewsState />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative">
      {/* Title + Description */}
      <div className="container mx-auto px-4 text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-urbanist">
          What Our <span className="text-primary inline-block">Users Say</span>
        </h2>
        <p className="text-lg max-w-2xl mx-auto font-poppins">
          {shopId 
            ? `Customer reviews for this shop (${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'})`
            : "Real stories from car owners, drivers, and businesses who trust MechaLink for reliable auto services."
          }
        </p>
      </div>

      {/* Background + Slider */}
      <div
        className="relative py-20 bg-fixed bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/3mHvXnzq/jeff-caron-robert-0-CCVIu-Aj-ORE-unsplash.jpg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative container mx-auto px-4">
          <Swiper
            modules={[Navigation, Pagination, A11y, Autoplay]}
            spaceBetween={50}
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
              640: { slidesPerView: 1, spaceBetween: 10 },
              768: { slidesPerView: reviews.length >= 2 ? 2 : 1, spaceBetween: 15 },
              1024: { slidesPerView: reviews.length >= 3 ? 3 : reviews.length >= 2 ? 2 : 1, spaceBetween: 15 },
            }}
            className="pb-16"
          >
            {reviews.map((review) => {
              const userData = getUserData(review);
              const shopData = getShopData(review);
              
              return (
                <SwiperSlide key={review._id}>
                  <div className="group flex flex-col border border-primary bg-white rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 p-6 h-full md:h-[360px]">
                    {/* User Profile */}
                    <div className="flex items-center mb-4">
                      <div className="relative">
                        <img
                          src={userData.profileImage}
                          alt={userData.name}
                          className="w-12 h-12 rounded-full border border-primary mr-4 object-cover"
                          onError={(e) => {
                            // Fallback to UI avatar if image fails to load
                            e.target.src = `https://ui-avatars.com/api/?name=${userData.name}&background=0ea5e9&color=fff`;
                          }}
                        />
                      </div>
                      <div className="text-black">
                        <p className="font-medium font-urbanist">{userData.name}</p>
                        <p className="text-sm">{userData.email}</p>
                        {shopId === null && (
                          <p className="text-xs text-gray-500 mt-1">
                            {shopData.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 mr-1 ${i < review.rating ? "text-primary fill-current" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-600">
                        ({review.rating}.0)
                      </span>
                    </div>

                    {/* Review */}
                    <p className="text-gray-700 italic flex-1 leading-relaxed mb-4 min-h-[120px]">
                      "
                      {review.comment || review.feedback || review.reviewText || "Great service!"}
                      "
                    </p>

                    {/* Additional Info */}
                    <div className="mt-2 text-xs text-gray-500">
                      {review.createdAt && (
                        <p>Reviewed on {new Date(review.createdAt).toLocaleDateString()}</p>
                      )}
                    </div>

                    {/* Quote Icon */}
                    <div className="flex justify-end mt-auto">
                      <Quote className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Navigation + Pagination - Only show if there are multiple reviews */}
          {reviews.length > 1 && (
            <div className="flex items-center mt-8 w-fit mx-auto space-x-4">
              <button
                ref={prevRef}
                className="bg-white p-2 rounded-full shadow-lg hover:shadow-xl hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary text-black"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <div ref={paginationRef} className="flex space-x-2"></div>

              <button
                ref={nextRef}
                className="bg-white p-2 rounded-full shadow-lg hover:shadow-xl hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary text-black"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;