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

  const ReasonCardSkeleton = ({ featured = false, wide = false }) => (
    <div className={`
      group rounded-2xl p-6 sm:p-8 shadow-md border border-gray-200 flex flex-col items-center text-center relative overflow-hidden animate-pulse
      ${
        // The featured card takes 2 columns in the grid starting from sm, and 2 rows on lg
        featured ? "sm:col-span-2 lg:col-span-2 lg:row-span-2 justify-center h-[300px] sm:h-full" : ""
      } 
      ${wide ? "sm:col-span-2" : ""} 
      ${!featured && !wide ? "h-[220px] sm:h-full" : ""}
    `}>
      <div className="skeleton bg-gray-200 w-12 h-12 sm:w-14 sm:h-14 rounded-full mb-4 sm:mb-6"></div>

      <div className={`${featured ? "max-w-md" : "w-full"} z-10`}>
        <div className={`skeleton bg-gray-200 h-6 rounded mb-2 sm:mb-3 ${featured ? "w-48 mx-auto" : "w-32"}`}></div>
        
        <div className="space-y-2 text-sm">
          <div className="skeleton bg-gray-200 h-3 w-full rounded"></div>
          <div className="skeleton bg-gray-200 h-3 w-5/6 mx-auto rounded"></div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-200 rounded-full"></div>
    </div>
  );

  const SectionHeaderSkeleton = () => (
    <div className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto animate-pulse px-4">
      <div className="skeleton bg-gray-300 h-10 w-3/4 sm:w-80 mx-auto rounded-lg mb-3 sm:mb-4"></div>
      <div className="skeleton bg-gray-300 h-4 w-full rounded mb-2"></div>
      <div className="skeleton bg-gray-300 h-4 w-5/6 mx-auto rounded"></div>
    </div>
  );

  if (loading) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 relative">
        <div className="lg:container mx-auto px-6">
          <SectionHeaderSkeleton />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-5 xl:gap-10 auto-rows-[minmax(200px,auto)]">
            {/* Note: Adjusting the skeleton arrangement to match the final grid */}
            <ReasonCardSkeleton featured={true} />
            <ReasonCardSkeleton />
            <ReasonCardSkeleton />
            <ReasonCardSkeleton />
            <ReasonCardSkeleton wide={true} />
            <ReasonCardSkeleton />
            <ReasonCardSkeleton />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative">
      <div className="lg:container mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Why Choose <span className="text-primary">MechaLink</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl mt-3 sm:mt-4">
            A smarter, faster, and safer way to connect with trusted mechanics
            near you.
          </p>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-5 xl:gap-10 auto-rows-[minmax(200px,auto)]">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className={`
                group rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-neutral hover:border-primary flex flex-col items-center text-center relative overflow-hidden
                ${
                  index === 0
                    ? "sm:col-span-2 lg:col-span-2 lg:row-span-2 text-white justify-center h-[300px] sm:h-full w-full"
                    : "h-full"
                } 
                ${index === 3 ? "sm:col-span-1 lg:col-span-2" : "sm:col-span-1 lg:col-span-1"}
                ${index === 7 ? "lg:col-span-1 sm:col-span-2" : "sm:col-span-1 lg:col-span-1"}
                ${index === 0 ? "shadow-2xl" : "bg-base-200"}
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
              
              {index === 0 && (
                <div className="absolute inset-0 bg-black/40 z-0 rounded-2xl"></div>
              )}

              
              <div 
                className={`p-4 mb-4 sm:mb-6 rounded-full text-primary shadow-inner z-10 transition-colors duration-300
                  ${index === 0 
                    ? "bg-white/10 text-base-content group-hover:bg-white/20" 
                    : "bg-primary/20 group-hover:bg-primary group-hover:text-base-content"
                  }
                `}>
                {reason.icon}
              </div>

              
              <div className={`${index === 0 ? "max-w-md" : "w-full"} z-10`}>
                
                <h3 className={`text-lg sm:text-xl font-semibold mb-2 sm:mb-3 transition-colors 
                  ${index === 0 ? "text-white" : "text-base-content group-hover:text-primary"}
                `}>
                  {reason.title}
                </h3>

                
                <p className={`text-xs sm:text-sm leading-relaxed 
                  ${index === 0 ? "text-gray-200" : "text-base-content/80"}
                `}>
                  {reason.description}
                </p>
              </div>

              
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 rounded-full group-hover:w-16 transition-all duration-300 z-10
                ${index === 0 ? "bg-white" : "bg-primary"}
              `}></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;