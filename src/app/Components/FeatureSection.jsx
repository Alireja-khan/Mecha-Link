"use client";

import {
  CalendarCheck,
  Clock,
  ListChecks,
  MapPin,
  Star,
  Car,
  Bell,
  Headphones,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import CountUp from "react-countup";
import { useState, useEffect } from "react";

export default function FeaturesSection() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: "Online Service Booking",
      desc: "Users can book services online with preferred date, time, and garage.",
      icon: CalendarCheck,
    },
    {
      title: "Real-Time Availability",
      desc: "See when mechanics or garages are available and avoid busy hours.",
      icon: Clock,
    },
    {
      title: "Service List & Categories",
      desc: "View separate categories with details for SUVs, Vans, Motorcycles, Cars, etc.",
      icon: ListChecks,
    },
    {
      title: "Geo-Location & Nearby Garage Finder",
      desc: "Find nearby garages integrated with Google Maps for directions.",
      icon: MapPin,
    },
    {
      title: "Customer Reviews & Ratings",
      desc: "Read feedback and ratings from other customers before booking.",
      icon: Star,
    },
    {
      title: "Service History & Vehicle Profile",
      desc: "Track past services, costs, and get personalized recommendations.",
      icon: Car,
    },
    {
      title: "Appointment Reminder",
      desc: "Get SMS/email reminders before bookings and notifications for next service.",
      icon: Bell,
    },
    {
      title: "24/7 Customer Support",
      desc: "Access live chat, call support, and roadside assistance anytime.",
      icon: Headphones,
    },
  ];

  const stats = [
    { value: 50000, suffix: "+", label: "Happy Customers" },
    { value: 10000, suffix: "+", label: "Services Booked" },
    { value: 2000, suffix: "+", label: "Partner Garages" },
    { value: 24, suffix: "/7", label: "Customer Support" },
  ];

  const FeatureCardSkeleton = () => (
    <div className="bg-white text-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 h-[210px] sm:h-[230px] flex flex-col justify-between animate-pulse">
      <div className="flex flex-col items-center">
        <div className="skeleton bg-gray-200 w-12 h-12 sm:w-14 sm:h-14 rounded-full mb-3 sm:mb-4"></div>
        <div className="skeleton bg-gray-200 h-5 w-24 sm:w-32 rounded mb-2"></div>
        <div className="skeleton bg-gray-200 h-3 w-full rounded mb-1"></div>
        <div className="skeleton bg-gray-200 h-3 w-5/6 rounded"></div>
      </div>
    </div>
  );

  const StatsSkeleton = () => (
    <div className="grid grid-cols-2 gap-4 my-8 sm:my-12 lg:my-0 text-center lg:text-left animate-pulse">
      {[...Array(4)].map((_, idx) => (
        <div key={idx} className="flex flex-col items-center lg:items-start">
          <div className="skeleton bg-gray-300 h-8 w-20 sm:h-12 sm:w-24 rounded mb-1 sm:mb-2"></div>
          <div className="skeleton bg-gray-300 h-4 w-24 sm:w-32 rounded"></div>
        </div>
      ))}
    </div>
  );

  const SectionHeaderSkeleton = () => (
    <div className="lg:container mx-auto px-6 text-center mb-8 sm:mb-10 animate-pulse">
      <div className="skeleton bg-gray-300 h-10 w-48 sm:h-12 sm:w-64 mx-auto rounded-lg mb-3 sm:mb-4"></div>
      <div className="skeleton bg-gray-300 h-4 w-64 sm:w-80 mx-auto rounded"></div>
    </div>
  );

  if (loading) {
    return (
      <section className="relative mt-12 sm:mt-16">
        <SectionHeaderSkeleton />
        <div className="relative py-16 sm:py-20 lg:py-24 bg-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative lg:container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              <div className="relative order-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <FeatureCardSkeleton key={index} />
                  ))}
                </div>
                <div className="mt-8 flex justify-center gap-4">
                  <div className="skeleton bg-gray-300 w-10 h-10 rounded-full"></div>
                  <div className="skeleton bg-gray-300 w-10 h-10 rounded-full"></div>
                </div>
              </div>

              <div className="order-2">
                <StatsSkeleton />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative mb-5 mt-12 sm:mt-16">
      <div className="lg:container mx-auto px-6 text-center mb-8 sm:mb-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-urbanist">
          Our <span className="text-primary">Features</span>
        </h2>
        <p className="text-base sm:text-lg mt-2 max-w-2xl mx-auto font-poppins">
          Find trusted mechanics, book instant services, get real-time updates, and enjoy transparent pricing—all in one platform.
        </p>
      </div>

      <div
        className="relative py-16 sm:py-20 lg:py-24 bg-cover bg-center bg-fixed text-white"
        style={{
          backgroundImage:
            "url('https://i.ibb.co.com/nMqyZrF5/anton-savinov-OTM6-L4-U-n-Ts-unsplash.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60 "></div>

        <div className="relative lg:container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div className="relative order-1">
              <Swiper
                spaceBetween={16}
                slidesPerView={1}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                navigation={{ nextEl: ".swiper-next", prevEl: ".swiper-prev" }}
                breakpoints={{
                  480: { slidesPerView: 2, spaceBetween: 20 },
                  768: { slidesPerView: 2, spaceBetween: 24 },
                  1024: { slidesPerView: 1, spaceBetween: 30 },
                  1280: { slidesPerView: 2, spaceBetween: 30 },
                }}
                modules={[Autoplay, Navigation]}
                loop={true}
              >
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <SwiperSlide key={index}>
                      <div className="bg-base-200 text-base-content p-4 sm:p-6 rounded-xl shadow-lg border border-primary h-[210px] sm:h-[230px] flex flex-col justify-between">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-3 sm:mb-4">
                            <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-primary font-urbanist text-center">
                            {feature.title}
                          </h3>
                          <p className="mt-2 text-xs sm:text-sm font-poppins text-center px-1">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              <div className="mt-8 flex justify-center gap-4">
                <button className="swiper-prev w-10 h-10 rounded-full bg-base-200 text-primary shadow hover:bg-primary hover:text-white transition text-2xl flex items-center justify-center">
                  <ChevronLeft />
                </button>
                <button className="swiper-next w-10 h-10 rounded-full bg-base-200 text-primary shadow hover:bg-primary hover:text-white transition text-2xl flex items-center justify-center">
                  <ChevronRight />
                </button>
              </div>
            </div>

            <div className="order-2">
              <div className="grid grid-cols-2 gap-4 sm:gap-8 my-8 sm:my-12 lg:my-0 lg:ml-8 xl:ml-20 text-center lg:text-left">
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col items-center lg:items-center">
                    <h3 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-primary">
                      <CountUp end={stat.value} duration={10} suffix={stat.suffix} />
                    </h3>
                    <p className="text-gray-200 text-sm sm:text-lg font-poppins mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}