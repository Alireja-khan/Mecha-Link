"use client";

import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    name: "Alice Johnson",
    role: "Car Owner",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    comment:
      "MechaLink made finding a trusted mechanic so easy! I booked online, and the service was smooth and professional. Highly recommend to anyone tired of unreliable workshops.",
  },
  {
    name: "Mark Thompson",
    role: "Fleet Manager",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
    comment:
      "Managing multiple vehicles used to be a headache. Thanks to MechaLink, I can now track and book maintenance in one place. Great UI and reliable service network.",
  },
  {
    name: "Sophia Lee",
    role: "Ride-Share Driver",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    comment:
      "Time is money for drivers like me. With MechaLink, I quickly find nearby mechanics and get transparent pricing. It saves me hours every week.",
  },
  {
    name: "James White",
    role: "Truck Driver",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 4,
    comment:
      "Reliable support for my truck breakdowns. Wish there were even more emergency options, but overall, a fantastic platform for long-distance drivers.",
  },
  {
    name: "Emily Carter",
    role: "Small Business Owner",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 5,
    comment:
      "MechaLink has simplified how my business handles delivery vehicle maintenance. Fast booking, trusted partners, and real-time updates keep my business running smoothly.",
  },
  {
    name: "Daniel Kim",
    role: "Student",
    avatar: "https://randomuser.me/api/portraits/men/21.jpg",
    rating: 5,
    comment:
      "Affordable and reliable service! As a student, I don’t have time to search around, so this app is a lifesaver for quick fixes and maintenance scheduling.",
  },
  {
    name: "Olivia Brown",
    role: "Family Car Owner",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    rating: 4,
    comment:
      "I feel much safer knowing I can quickly find nearby help in case of car issues. MechaLink is user-friendly and gives me peace of mind.",
  },
];

const ReviewSection = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);

  useEffect(() => {
    if (
      swiperInstance &&
      prevRef.current &&
      nextRef.current &&
      paginationRef.current
    ) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();

      swiperInstance.params.pagination.el = paginationRef.current;
      swiperInstance.pagination.init();
      swiperInstance.pagination.render();
      swiperInstance.pagination.update();
    }
  }, [swiperInstance]);

  return (
    <section className="relative">
      {/* Title + Description OUTSIDE background image */}
      <div className="container mx-auto px-4 text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-urbanist">
          What Our <span className="text-primary inline-block">Users Say</span>
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto font-poppins">
          Real stories from car owners, drivers, and businesses who trust MechaLink
          for reliable auto services.
        </p>
      </div>

      {/* Background image + slider */}
      <div
        className="relative py-20 bg-fixed bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://i.ibb.co.com/3mHvXnzq/jeff-caron-robert-0-CCVIu-Aj-ORE-unsplash.jpg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative container mx-auto px-4">
          <Swiper
            modules={[Navigation, Pagination, A11y, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
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
            onSwiper={setSwiperInstance}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-16"
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={index}>
                <div className="group flex border border-primary flex-col bg-white rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 p-6 scale-80 h-full">
                  {/* User Profile */}
                  <div className="flex items-center mb-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-12 h-12 rounded-full border border-primary mr-4 object-cover"
                    />
                    <div>
                      <p className="font-medium font-urbanist">{review.name}</p>
                      <p className="text-sm text-gray-500">{review.role}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 mr-1 ${
                          i < review.rating ? "text-primary" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Description */}
                  <p className="text-gray-700 italic flex-1 leading-relaxed mb-4 min-h-[120px]">
                    "
                    {review.comment.split(" ").length > 30
                      ? review.comment.split(" ").slice(0, 30).join(" ") + "..."
                      : review.comment}
                    "
                  </p>

                  {/* Double Quote Icon */}
                  <div className="flex justify-end mt-auto">
                    <Quote className="w-10 h-10 text-primary" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation + Pagination */}
          <div className="flex items-center mt-8 w-fit mx-auto space-x-4">
            <button
              ref={prevRef}
              className="bg-white p-2 rounded-full shadow-lg hover:shadow-xl text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div ref={paginationRef} className="flex space-x-2"></div>

            <button
              ref={nextRef}
              className="bg-white p-2 rounded-full shadow-lg hover:shadow-xl text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
