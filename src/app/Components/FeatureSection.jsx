"use client"; // <--- must be at very top

import {
  CalendarCheck,
  Clock,
  ListChecks,
  MapPin,
  Star,
  Car,
  Bell,
  Headphones,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function FeaturesSection() {
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
    { value: "50K+", label: "Happy Customers" },
    { value: "10K+", label: "Services Booked" },
    { value: "2K+", label: "Partner Garages" },
    { value: "24/7", label: "Customer Support" },
  ];

  return (
    <section className="relative ">
      {/* Title + Description outside background image */}
      <div className="container mx-auto px-6 text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold font-urbanist">
          Our <span className="text-primary">Features</span>
        </h2>
        <p className="text-lg mt-2  max-w-2xl mx-auto font-poppins">
          Find trusted mechanics and book car services online—fast, easy, and reliable.
        </p>
      </div>

      {/* Background image section */}
      <div
        className="relative py-24 bg-cover bg-center bg-fixed text-white"
        style={{
          backgroundImage:
            "url('https://i.ibb.co.com/nMqyZrF5/anton-savinov-OTM6-L4-U-n-Ts-unsplash.jpg')",
        }}
      >
        {/* Glass / overlay effect */}
        <div className="absolute inset-0 bg-black/60 "></div>

        <div className="relative container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Feature Slider */}
            <div className="relative">
              <Swiper
                spaceBetween={20}
                slidesPerView={1}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                navigation={{ nextEl: ".swiper-next", prevEl: ".swiper-prev" }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                }}
                modules={[Autoplay, Navigation]}
              >
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <SwiperSlide key={index}>
                      <div className="bg-white text-gray-800 p-6 rounded-xl shadow-lg border border-primary h-[230px] flex flex-col justify-between">
                        <div className="flex flex-col items-center">
                          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                            <Icon className="h-7 w-7" />
                          </div>
                          <h3 className="text-lg font-bold text-primary font-urbanist text-center">
                            {feature.title}
                          </h3>
                          <p className="mt-2 text-sm  font-poppins text-center">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              {/* Arrow Buttons */}
              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex gap-4">
                <button className="swiper-prev w-10 h-10 rounded-full bg-white text-primary shadow hover:bg-primary hover:text-white transition">
                  ‹
                </button>
                <button className="swiper-next w-10 h-10 rounded-full bg-white text-primary shadow hover:bg-primary hover:text-white transition">
                  ›
                </button>
              </div>
            </div>

            {/* Right: Stats */}
            <div className="grid grid-cols-2 gap-8 m-20  text-center lg:text-left">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center lg:items-start">
                  <h3 className="text-4xl md:text-5xl font-extrabold text-primary">
                    {stat.value}
                  </h3>
                  <p className="text-gray-200 text-lg font-poppins">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

  );
}
