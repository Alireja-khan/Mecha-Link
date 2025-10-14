"use client";
import {
  CheckCircle,
  Shield,
  Wrench,
  Zap,
  Clock,
  MapPin,
  DollarSign,
  ThumbsUp,
} from "lucide-react";
import { useState, useEffect } from "react";

const reasons = [
  {
    title: "Verified Mechanics",
    description:
      "All our mechanics are background-checked and certified, ensuring trustworthy service every time.",
    icon: <CheckCircle className="w-7 h-7" />,
  },
  {
    title: "Expert Repairs",
    description:
      "From routine maintenance to emergency breakdowns, our skilled experts handle it with care.",
    icon: <Wrench className="w-7 h-7" />,
  },
  {
    title: "Fast Response",
    description:
      "Book a mechanic instantly and get quick assistance whenever and wherever you need it.",
    icon: <Zap className="w-7 h-7" />,
  },
  {
    title: "Secure & Transparent",
    description:
      "Enjoy upfront pricing, secure payments, and full transparency with every service booked.",
    icon: <Shield className="w-7 h-7" />,
  },
  {
    title: "24/7 Availability",
    description:
      "Need help at midnight or early morning? Our mechanics are available round the clock.",
    icon: <Clock className="w-7 h-7" />,
  },
  {
    title: "Nearby Assistance",
    description:
      "Easily find mechanics closest to your location for faster service and reduced waiting time.",
    icon: <MapPin className="w-7 h-7" />,
  },
  {
    title: "Affordable Pricing",
    description:
      "Get competitive, upfront pricing without hidden costs. Pay only for what you need.",
    icon: <DollarSign className="w-7 h-7" />,
  },
  {
    title: "Customer Satisfaction",
    description:
      "Thousands of happy customers rely on MechaLink. Your satisfaction is our top priority.",
    icon: <ThumbsUp className="w-7 h-7" />,
  },
];

const WhyChooseUs = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Skeleton Components
  const ReasonCardSkeleton = ({ featured = false, wide = false }) => (
    <div className={`
      group rounded-2xl p-8 shadow-md border border-gray-200 flex flex-col items-center text-center relative overflow-hidden animate-pulse
      ${featured ? "lg:col-span-2 lg:row-span-2 justify-center" : ""} 
      ${wide ? "lg:col-span-2" : ""} 
    `}>
      {/* Icon Skeleton */}
      <div className="skeleton bg-gray-200 w-14 h-14 rounded-full mb-6"></div>

      {/* Content Skeleton */}
      <div className={`${featured ? "max-w-md" : "w-full"} z-10`}>
        {/* Title Skeleton */}
        <div className={`skeleton bg-gray-200 h-7 rounded mb-3 ${featured ? "w-48 mx-auto" : "w-32"}`}></div>
        
        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
          <div className="skeleton bg-gray-200 h-4 w-5/6 mx-auto rounded"></div>
        </div>
      </div>

      {/* Decorative underline skeleton */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-200 rounded-full"></div>
    </div>
  );

  const SectionHeaderSkeleton = () => (
    <div className="text-center mb-20 max-w-2xl mx-auto animate-pulse">
      <div className="skeleton bg-gray-300 h-12 w-80 mx-auto rounded-lg mb-4"></div>
      <div className="skeleton bg-gray-300 h-5 w-full rounded mb-2"></div>
      <div className="skeleton bg-gray-300 h-5 w-5/6 mx-auto rounded"></div>
    </div>
  );

  if (loading) {
    return (
      <section className="py-24 relative">
        <div className="container mx-auto px-6 lg:px-8">
          <SectionHeaderSkeleton />
          
          {/* Reasons Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-5 xl:gap-10 auto-rows-[minmax(200px,auto)]">
            <ReasonCardSkeleton featured={true} />
            <ReasonCardSkeleton />
            <ReasonCardSkeleton />
            <ReasonCardSkeleton wide={true} />
            <ReasonCardSkeleton />
            <ReasonCardSkeleton />
            <ReasonCardSkeleton />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24  relative">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Why Choose <span className="text-primary">MechaLink</span>
          </h2>
          <p className="text-lg md:text-xl  mt-4">
            A smarter, faster, and safer way to connect with trusted mechanics
            near you.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-5 xl:gap-10 auto-rows-[minmax(200px,auto)]">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className={`
    group rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-primary hover:border-primary flex flex-col items-center text-center relative overflow-hidden
    ${
      index === 0
        ? "lg:col-span-2 lg:row-span-2 text-white border-0 justify-center"
        : ""
    } 
    ${index === 3 ? "lg:col-span-2" : ""} 
  `}
              style={
                index === 0
                  ? {
                      backgroundImage:
                        "url('https://i.ibb.co/27q6jVgM/christian-buehner-Fd6osy-Vbt-G4-unsplash.jpg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : {}
              }
            >
              {/* Overlay for readability */}
              {index === 0 && (
                <div className="absolute inset-0 bg-black/40 z-0"></div>
              )}

              {/* Icon */}
              <div className="p-4 mb-6 rounded-full bg-orange-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-inner z-10">
                {reason.icon}
              </div>

              {/* Wrap text for max-width on first card */}
              <div className={`${index === 0 ? "max-w-md" : "w-full"} z-10`}>
                {/* Title */}
                <h3 className="text-xl font-semibold mb-3  group-hover:text-primary transition-colors">
                  {reason.title}
                </h3>

                {/* Description */}
                <p className=" text-sm leading-relaxed">{reason.description}</p>
              </div>

              {/* Decorative underline */}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary rounded-full group-hover:w-16 transition-all duration-300 z-10"></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;