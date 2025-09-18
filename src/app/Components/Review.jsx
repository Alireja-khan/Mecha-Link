"use client";

import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Star, Quote } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
    {
        name: "Alice Johnson",
        role: "Frontend Developer",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        comment:
            "This platform has completely transformed the way I learn web development. The tutorials are comprehensive, the examples are clear, and the community support is amazing. I feel confident tackling real-world projects now, and I highly recommend this to anyone looking to improve their skills!",
    },
    {
        name: "Mark Thompson",
        role: "UX Designer",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 4,
        comment:
            "Clean design, intuitive UI, and great resources. It really helps me stay productive and keeps me motivated to learn every day. I particularly love the detailed examples and how the platform explains complex concepts in an easy-to-understand manner.",
    },
    {
        name: "Sophia Lee",
        role: "Fullstack Engineer",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        rating: 5,
        comment:
            "Amazing tutorials and examples. Everything is well-organized and easy to follow. The platform not only teaches technical skills but also emphasizes best practices, which has been incredibly helpful in building scalable projects efficiently.",
    },
    {
        name: "James White",
        role: "Backend Developer",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        rating: 4,
        comment:
            "Helpful guides and resources, but I wish there were more real-world projects. Overall, it’s an excellent learning platform that has improved my workflow and understanding of backend development. I appreciate the structured learning path and supportive community.",
    },
];

// Utility to truncate text after n words
const truncateWords = (text, wordLimit = 50) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
};

const ReviewSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [swiperInstance, setSwiperInstance] = useState(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const paginationRef = useRef(null);

    useEffect(() => {
        if (swiperInstance && prevRef.current && nextRef.current && paginationRef.current) {
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
        <section className="py-16 bg-gray-50 text-gray-900">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 font-urbanist">
                        What Our <span className="text-primary inline-block">Users Say</span>
                    </h2>
                    <p className="text-xl text-gray-700 max-w-2xl mx-auto font-poppins">
                        Hear from our satisfied users and their experiences with our platform.
                    </p>
                </div>

                {/* Swiper Carousel */}
                <div className="relative">
                    <Swiper
                        modules={[Navigation, Pagination, A11y]}
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={true}
                        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        pagination={{
                            clickable: true,
                            el: paginationRef.current,
                            bulletClass:
                                "swiper-pagination-bullet w-3 h-3 rounded-full bg-gray-300 transition-colors duration-200 mx-1 cursor-pointer",
                            bulletActiveClass: "swiper-pagination-bullet-active bg-primary",
                        }}
                        onSwiper={setSwiperInstance}
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="pb-16"
                    >
                        {reviews.map((review, index) => (
                            <SwiperSlide key={index}>
                                {({ isVisible }) => {
                                    // Determine middle slide dynamically
                                    let slidesPerView = swiperInstance?.params.slidesPerView || 1;
                                    slidesPerView = Math.floor(slidesPerView); // Ensure integer
                                    let middleIndexOffset = Math.floor(slidesPerView / 2);
                                    let activeIndex = (currentSlide + middleIndexOffset) % reviews.length;

                                    return (
                                        <div
                                            className={`group flex flex-col bg-white rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 p-6 ${index === activeIndex ? "scale-95 -translate-y-2" : "scale-95 translate-y-1"
                                                }`}
                                            style={{ minHeight: "320px" }} // Fixed height for all cards
                                        >
                                            {/* User Profile */}
                                            <div className="flex items-center mb-4">
                                                <img
                                                    src={review.avatar}
                                                    alt={review.name}
                                                    className="w-12 h-12 rounded-full mr-4 object-cover"
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
                                                        className={`w-5 h-5 mr-1 ${i < review.rating ? "text-yellow-400" : "text-gray-300"
                                                            }`}
                                                    />
                                                ))}
                                            </div>

                                            {/* Review Description */}
                                            <p className="text-gray-700 italic flex-1 leading-relaxed mb-4">
                                                "{review.comment.split(' ').length > 30
                                                    ? review.comment.split(' ').slice(0, 30).join(' ') + '...'
                                                    : review.comment}"
                                            </p>


                                            {/* Double Quote Icon */}
                                            <div className="flex justify-end">
                                                <Quote className="w-10 h-10 text-gray-300" />
                                            </div>
                                        </div>
                                    );
                                }}
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Buttons */}
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
