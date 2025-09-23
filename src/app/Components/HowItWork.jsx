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

const HowToWork = () => {
    const [activeStep, setActiveStep] = useState(null);
    
    const steps = [
        {
            title: "Discover Mechanics",
            description:
                "Search trusted mechanics by category, location, rating, and experience.",
            icon: <MapPin className="w-8 h-8" />,
        },
        {
            title: "View Profiles & Portfolios",
            description:
                "Check mechanic profiles, skills, shop details, and past work before requesting service.",
            icon: <User className="w-8 h-8" />,
        },
        {
            title: "Post Service Request",
            description:
                "Submit a detailed request describing your problem to selected mechanics.",
            icon: <CalendarCheck className="w-8 h-8" />,
        },
        {
            title: "Schedule & Book Service",
            description:
                "Choose a convenient time slot based on mechanic availability for your service.",
            icon: <CheckCircle className="w-8 h-8" />,
        },
        {
            title: "Track Request Status",
            description:
                "Receive real-time updates as your request moves from Pending → Accepted → Completed.",
            icon: <CheckCircle className="w-8 h-8" />,
        },
        {
            title: "Real-Time Chat",
            description:
                "Communicate directly with mechanics to clarify details or share updates.",
            icon: <MessageCircle className="w-8 h-8" />,
        },
        {
            title: "Make Secure Payment",
            description:
                "Pay safely online using supported gateways and apply coupons or discounts.",
            icon: <CreditCard className="w-8 h-8" />,
        },
        {
            title: "Rate & Review Mechanics",
            description:
                "Provide feedback after service completion and help others choose trusted mechanics.",
            icon: <Star className="w-8 h-8" />,
        },
        {
            title: "View Outcomes & Analytics",
            description:
                "Track results and performance insights for continuous improvement.",
            icon: <BarChart className="w-8 h-8" />,
        },
    ];

    return (
        <section className="py-16 font-roboto relative overflow-hidden">
            {/* Decorative elements */}
            {/* <div className="absolute top-0 left-0 w-72 h-72 bg-orange-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full translate-x-1/3 translate-y-1/3 opacity-40"></div> */}
            
            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 font-roboto-con">
                        How <span className="text-orange-500 font-caveat inline-block">MechaLink Works</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-nunito-sans">
                        Follow these steps to understand the complete workflow and get connected with trusted mechanics efficiently.
                    </p>
                </div>

                {/* Interactive Timeline Steps */}
                <div className="relative">
                    {/* Connecting line */}
                    <div className="absolute left-4 top-10 bottom-10 w-1 bg-gradient-to-b from-orange-400 to-blue-400 hidden md:block"></div>
                    
                    <div className="grid grid-cols-1 gap-10">
                        {steps.map((step, index) => (
                            <div 
                                key={index}
                                className="flex group"
                                onMouseEnter={() => setActiveStep(index)}
                                onMouseLeave={() => setActiveStep(null)}
                            >
                                {/* Step indicator */}
                                <div className="flex flex-col items-center mr-6">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 relative ${
                                        activeStep === index 
                                            ? "bg-orange-500 scale-110 ring-4 ring-orange-200" 
                                            : "bg-white border-2 border-orange-400"
                                    } transition-all duration-300`}>
                                        <div className={`${activeStep === index ? "text-white" : "text-orange-500"}`}>
                                            {step.icon}
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="flex-1 w-0.5 bg-orange-300 my-2 md:hidden"></div>
                                    )}
                                </div>
                                
                                {/* Content card with dynamic animation */}
                                <div className={`flex-1 bg-white rounded-2xl p-6 transform transition-all duration-300 ${
                                    activeStep === index 
                                        ? "shadow-xl -translate-y-1 border-l-4 border-orange-500" 
                                        : "shadow-md"
                                }`}>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="text-sm font-semibold text-orange-500 mb-1 block">
                                                Step {index + 1}
                                            </span>
                                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                            <p className="text-gray-600 text-sm">{step.description}</p>
                                        </div>
                                        <ArrowRight className={`w-5 h-5 text-orange-500 transition-transform duration-300 ${
                                            activeStep === index ? "translate-x-1" : ""
                                        }`} />
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