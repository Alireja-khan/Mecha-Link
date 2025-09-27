"use client";

import {
    CheckCircle,
    ArrowRight,
    MapPin,
    User,
    CalendarCheck,
    MessageCircle,
    CreditCard,
    Star,
    BarChart
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const HowToWork = () => {
    const [activeStep, setActiveStep] = useState(null);

    const steps = [
        {
            title: "Find Mechanics",
            description:
                "Search trusted mechanics by category, location, and rating. Utilize smart filters to pinpoint the perfect match for your specific vehicle repair needs.",
            icon: <MapPin className="w-6 h-6" />,
            image: "https://placehold.co/500x300/FFA500/FFFFFF/png?text=Search+by+Map",
        },
        {
            title: "Check Profiles",
            description:
                "View comprehensive mechanic profiles, verify their skills, and review past work portfolios before making a service request. Transparency builds trust.",
            icon: <User className="w-6 h-6" />,
            image: "https://placehold.co/500x300/FFA500/FFFFFF/png?text=Mechanic+Profile",
        },
        {
            title: "Book Service",
            description:
                "Easily schedule a convenient time slot that fits your busy calendar, based on the mechanic's real-time availability. Confirm your booking instantly.",
            icon: <CalendarCheck className="w-6 h-6" />,
            image: "https://placehold.co/500x300/FFA500/FFFFFF/png?text=Booking+Calendar",
        },
        {
            title: "Chat with Mechanics",
            description:
                "Communicate directly and securely with the mechanic to clarify job details, get estimated quotes, or share necessary updates throughout the service process.",
            icon: <MessageCircle className="w-6 h-6" />,
            image: "https://placehold.co/500x300/FFA500/FFFFFF/png?text=Secure+Chat",
        },
        {
            title: "Secure Payment",
            description:
                "Pay safely online using our supported secure gateways. Benefit from exclusive discounts and receive a transparent, itemized invoice for the services rendered.",
            icon: <CreditCard className="w-6 h-6" />,
            image: "https://placehold.co/500x300/FFA500/FFFFFF/png?text=Secure+Payment",
        },
        {
            title: "Rate & Review",
            description:
                "Once the service is complete, provide valuable feedback by rating and reviewing the mechanic. Your input helps maintain quality and guides other users.",
            icon: <Star className="w-6 h-6" />,
            image: "https://placehold.co/500x300/FFA500/FFFFFF/png?text=Rate+and+Review",
        },
    ];

    return (
        <section className="py-16 font-roboto relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 font-roboto-con">
                        How <span className="text-primary font-caveat inline-block">MechaLink Works</span>
                    </h2>
                    <p className="text-base md:text-xl max-w-2xl mx-auto font-nunito-sans">
                        Follow these steps to understand the complete workflow and get connected with trusted mechanics efficiently.
                    </p>
                </div>

                {/* Interactive Timeline Steps */}
                <div className="relative">
                    {/* Connecting line */}
                    <div className="absolute left-4 top-10 bottom-45 w-1 bg-orange-400 hidden md:block"></div>

                    <div className="grid grid-cols-1 gap-10">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="flex md:flex-row flex-col items-start md:gap-0 gap-4 group"
                                onMouseEnter={() => setActiveStep(index)}
                                onMouseLeave={() => setActiveStep(null)}
                            >
                                {/* Step indicator (unchanged) */}
                                <div className="flex flex-col items-center mr-6">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 relative right-0.5 ${activeStep === index
                                        ? "bg-primary  scale-110 ring-4 ring-orange-200 "
                                        : " border-2 border-orange-400 bg-white"
                                        } transition-all duration-300`}>
                                        <div className={` ${activeStep === index ? "text-white" : "text-primary"}`}>
                                            {step.icon}
                                        </div>
                                    </div>
                                </div>

                                {/* Content card with dynamic animation and IMAGE */}
                                <div className={`flex-1 rounded-2xl p-6 transform transition-all duration-300 ${activeStep === index
                                    ? "shadow-xl -translate-y-1 border-l-4 border-primary bg-white"
                                    : "shadow-md border border-gray-100"
                                    }`}>
                                    <div className="flex flex-col md:flex-row items-center gap-6"> {/* Added flex-row for image and text layout */}
                                        {/* Image on the left (or top on small screens) */}
                                        <div className="md:w-1/3 w-full h-40 flex-shrink-0">
                                            {/* Using Next.js Image component for optimization */}
                                            <Image
                                                src={step.image}
                                                alt={step.title}
                                                width={500} // Example width
                                                height={300} // Example height, adjust as needed
                                                className="rounded-lg object-cover w-full h-full shadow-sm"
                                            />
                                        </div>

                                        {/* Text content on the right (or bottom on small screens) */}
                                        <div className="md:w-2/3 w-full">
                                            {/* Step Number Badge and Arrow */}
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="font-semibold text-white bg-primary py-1 px-3 rounded-full inline-block shadow-md">
                                                    Step {index + 1}
                                                </span>
                                                <ArrowRight className={`w-5 h-5 text-primary transition-transform duration-300 ${activeStep === index ? "translate-x-1" : ""
                                                    }`} />
                                            </div>

                                            <hr className="mb-3 border-t border-gray-200" /> {/* Separator Line */}

                                            {/* Title and Description */}
                                            <div>
                                                <h3 className="text-3xl font-bold mb-2 text-gray-800">{step.title}</h3>
                                                <p className="text-base text-gray-600 leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowToWork;