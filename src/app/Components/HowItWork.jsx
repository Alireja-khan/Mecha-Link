"use client";

import {
  ArrowRight,
  BarChart,
  CalendarCheck,
  CreditCard,
  MapPin,
  MessageCircle,
  Star,
  User,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const HowToWork = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      title: "Find Mechanics",
      description:
        "Search trusted mechanics by category, location, and rating. Utilize smart filters to pinpoint the perfect match for your specific vehicle repair needs.",
      icon: <MapPin className="w-6 h-6" />,
      image: "/Step-1.png",
    },
    {
      title: "Check Profiles",
      description:
        "View comprehensive mechanic profiles, verify their skills, and review past work portfolios before making a service request. Transparency builds trust.",
      icon: <User className="w-6 h-6" />,
      image: "/Step-2.png",
    },
    {
      title: "Book Service",
      description:
        "Easily schedule a convenient time slot that fits your busy calendar, based on the mechanic's real-time availability. Confirm your booking instantly.",
      icon: <CalendarCheck className="w-6 h-6" />,
      image: "/Step-3.png",
    },
    {
      title: "Chat with Mechanics",
      description:
        "Communicate directly and securely with the mechanic to clarify job details, get estimated quotes, or share necessary updates throughout the service process.",
      icon: <MessageCircle className="w-6 h-6" />,
      image: "/Step-4.png",
    },
    {
      title: "Secure Payment",
      description:
        "Pay safely online using our supported secure gateways. Benefit from exclusive discounts and receive a transparent, itemized invoice for the services rendered.",
      icon: <CreditCard className="w-6 h-6" />,
      image: "/Step-5.png",
    },
    {
      title: "Rate & Review",
      description:
        "Once the service is complete, provide valuable feedback by rating and reviewing the mechanic. Your input helps maintain quality and guides other users.",
      icon: <Star className="w-6 h-6" />,
      image: "/Step-6.png",
    },
  ];

  const ActiveStepContent = ({ step, index, totalSteps, isActive }) => {
    const contentRef = useRef(null);
    const [height, setHeight] = useState('0px');

    useEffect(() => {
      if (contentRef.current) {
        setHeight(isActive ? `${contentRef.current.scrollHeight}px` : '0px');
      }
    }, [isActive, step]);

    return (
      <div
        ref={contentRef}
        style={{ maxHeight: height }}
        className="overflow-hidden transition-[max-height] duration-500 ease-in-out lg:hidden"
      >
        <div className="mt-4 p-4 border-t border-gray-200">
          <div className="mb-4">
            <p className="text-sm leading-relaxed mb-4 text-gray-700">
              {step.description}
            </p>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-100">
            <div className="aspect-video flex items-center justify-center bg-gray-50 p-4">
              <Image
                src={step.image}
                alt={step.title}
                width={600}
                height={400}
                className="w-full h-auto rounded-md object-cover max-w-[300px] sm:max-w-[400px]"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <span className="text-primary text-xs font-semibold">
              Step {index + 1} of {totalSteps}
            </span>
            <div className="w-3/4 bg-orange-300/30 rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((index + 1) / totalSteps) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StepSkeleton = () => (
    <div className=" rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-gray-300 w-12 h-12 rounded-full"></div>
        <div className="bg-gray-300 h-6 w-32 rounded"></div>
      </div>
      <div className="bg-gray-200 h-4 w-full rounded mb-2"></div>
      <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
    </div>
  );

  const SectionHeaderSkeleton = () => (
    <div className="text-center mb-16 animate-pulse">
      <div className="bg-gray-300 h-12 w-80 mx-auto rounded-lg mb-4"></div>
      <div className="bg-gray-300 h-5 w-96 mx-auto rounded"></div>
    </div>
  );

  if (loading) {
    return (
      <section className="py-16 font-roboto bg-gradient-to-br from-orange-50 to-white relative overflow-hidden">
        <div className="lg:container mx-auto px-4 relative z-10">
          <SectionHeaderSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <StepSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 font-roboto relative overflow-hidden">
      <div className="lg:container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <BarChart className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold text-sm uppercase tracking-wide">
              Simple Process
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-roboto-con">
            How <span className="text-primary font-caveat inline-block transform rotate-2">MechaLink</span> Works
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto font-nunito-sans leading-relaxed">
            Get your vehicle serviced in 6 simple steps. From finding the right mechanic to leaving reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl transition-all bg-base-200 duration-300 ${isActive
                      ? "shadow-xl border-l-4 border-primary transform lg:-translate-y-1"
                      : "shadow-md border border-neutral hover:shadow-lg hover:lg:-translate-y-0.5"
                    }`}
                >
                  <button
                    onClick={() => setActiveStep(isActive ? -1 : index)}
                    className={`w-full text-left p-6 transition-all duration-300 ${isActive && 'pb-4 lg:pb-6'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                            ? "bg-primary text-white shadow-lg scale-110"
                            : "bg-orange-100 text-primary group-hover:bg-orange-200"
                          }`}
                      >
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3
                            className={`text-xl font-bold transition-colors duration-300 ${isActive ? "text-primary" : ""
                              }`}
                          >
                            {step.title}
                          </h3>
                          <div
                            className={`flex items-center gap-2 transition-all duration-300 ${isActive
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-2"
                              }`}
                          >
                            <span className="text-sm font-semibold text-primary bg-orange-100 px-2 py-1 rounded-full">
                              Step {index + 1}
                            </span>
                            <ArrowRight className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                        <p
                          className={`text-sm leading-relaxed transition-colors duration-300 text-base-content/60 hidden lg:block`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </button>

                  <ActiveStepContent
                    step={step}
                    index={index}
                    totalSteps={steps.length}
                    isActive={isActive}
                  />
                </div>
              );
            })}
          </div>

          <div className="hidden lg:block lg:sticky lg:top-8 flex-1">
            <div className=" rounded-3xl shadow-2xl overflow-hidden border border-neutral">
              <div className="bg-primary p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-orange-100 text-sm font-semibold uppercase tracking-wide">
                      Current Step
                    </span>
                    <h3 className="text-2xl font-bold mt-1">
                      {steps[activeStep].title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-100">
                      {activeStep + 1}
                    </div>
                    <div className="text-orange-200 text-sm">of {steps.length}</div>
                  </div>
                </div>

                <div className="mt-4 w-full bg-orange-300/30 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${((activeStep + 1) / steps.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <div className="text-primary">
                      {steps[activeStep].icon}
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-center mb-3">
                    {steps[activeStep].title}
                  </h4>
                  <p className=" text-center leading-relaxed text-base-content/60">
                    {steps[activeStep].description}
                  </p>
                </div>

                <div className="relative rounded-2xl overflow-hidden">
                  <div className="aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <Image
                        src={steps[activeStep].image}
                        alt={steps[activeStep].title}
                        width={600}
                        height={400}
                        className="w-600 h-100 rounded-md object-cover"
                      />
                      <p className="text-primary font-semibold mt-3">
                        Step {activeStep + 1} Preview
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-2 mt-8">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveStep(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${activeStep === index
                          ? "bg-primary scale-125"
                          : "bg-base-200 hover:bg-base-300"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button className="bg-primary text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center gap-2">
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToWork;