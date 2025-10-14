"use client";
import React, { useState, useEffect } from "react";
import {
  Users, Rocket, Target, Star, Heart, Wrench, MapPin, Shield, MessageCircle, Clock, TrendingUp, Award, Zap, Calendar, CreditCard, Globe, Sparkles
} from "lucide-react";
import CountUp from "react-countup";
import Lottie from "lottie-react";
import storyAnimation from "../../../../public/assets/ourStory/Welcome.json";

const AboutPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for the about page
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Skeleton Components
  const BannerSkeleton = () => (
    <section className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 py-16 overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content Skeleton */}
            <div className="flex-1 text-center lg:text-left animate-pulse">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <div className="skeleton bg-white/30 w-5 h-5 rounded-full"></div>
                <div className="skeleton bg-white/30 h-4 w-48 rounded"></div>
              </div>
              
              <div className="skeleton bg-white/30 h-16 w-3/4 rounded-lg mb-6 mx-auto lg:mx-0"></div>
              <div className="skeleton bg-white/30 h-6 w-full rounded mb-4"></div>
              <div className="skeleton bg-white/30 h-6 w-5/6 rounded mb-8"></div>

              {/* Stats Skeleton */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white">
                    <div className="skeleton bg-gray-300 w-6 h-6 mx-auto mb-2 rounded-full"></div>
                    <div className="skeleton bg-gray-300 h-7 w-12 mx-auto mb-1 rounded"></div>
                    <div className="skeleton bg-gray-300 h-4 w-16 mx-auto rounded"></div>
                  </div>
                ))}
              </div>

              {/* Buttons Skeleton */}
              <div className="flex flex-wrap gap-4">
                <div className="skeleton bg-white/30 h-12 w-40 rounded-full"></div>
                <div className="skeleton bg-white/30 h-12 w-40 rounded-full"></div>
              </div>
            </div>

            {/* Right Illustration Skeleton */}
            <div className="flex-1 flex justify-center animate-pulse">
              <div className="relative">
                <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-3xl border-2 border-white/20 flex items-center justify-center">
                  <div className="text-center p-8 w-full">
                    <div className="skeleton bg-white/30 w-16 h-16 rounded-full mx-auto mb-4"></div>
                    <div className="skeleton bg-white/30 h-6 w-32 mx-auto mb-2 rounded"></div>
                    <div className="skeleton bg-white/30 h-4 w-full rounded mb-1"></div>
                    <div className="skeleton bg-white/30 h-4 w-5/6 mx-auto rounded"></div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400/20 rounded-full backdrop-blur-sm border border-yellow-300/30"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400/20 rounded-full backdrop-blur-sm border border-green-300/30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const SectionHeaderSkeleton = ({ titleWidth = "w-48", descriptionWidth = "w-64" }) => (
    <div className="text-center md:mb-16 animate-pulse">
      <div className={`skeleton bg-gray-200 h-10 ${titleWidth} mx-auto mb-4 rounded`}></div>
      <div className="skeleton bg-orange-500 h-1 w-20 mx-auto"></div>
      <div className={`skeleton bg-gray-200 h-4 ${descriptionWidth} mx-auto mt-4 rounded`}></div>
    </div>
  );

  const StorySectionSkeleton = () => (
    <section className="container mx-auto px-6 py-5 lg:py-20">
      <SectionHeaderSkeleton titleWidth="w-32" descriptionWidth="w-96" />
      <div className="grid xl:grid-cols-2 gap-16 items-center">
        <div className="w-full lg:w-full lg:flex items-center justify-center animate-pulse">
          <div className="skeleton bg-gray-200 h-80 md:h-[400px] lg:h-[500px] w-full rounded-2xl"></div>
        </div>
        <div className="animate-pulse">
          <div className="skeleton bg-gray-200 h-8 w-3/4 rounded mb-6"></div>
          <div className="space-y-4 mb-6">
            <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
            <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
            <div className="skeleton bg-gray-200 h-4 w-5/6 rounded"></div>
            <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
            <div className="skeleton bg-gray-200 h-4 w-4/6 rounded"></div>
          </div>
          <div className="skeleton bg-gray-200 h-24 w-full rounded-xl"></div>
        </div>
      </div>
    </section>
  );

  const MissionVisionSkeleton = () => (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <SectionHeaderSkeleton titleWidth="w-56" />
        <div className="grid md:grid-cols-2 gap-10 animate-pulse">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="skeleton bg-gray-200 w-16 h-16 rounded-2xl mb-6"></div>
              <div className="skeleton bg-gray-200 h-7 w-40 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
                <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
                <div className="skeleton bg-gray-200 h-4 w-3/4 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const FeaturesSkeleton = () => (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <SectionHeaderSkeleton titleWidth="w-64" descriptionWidth="w-96" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="p-6 rounded-xl border border-gray-200">
              <div className="skeleton bg-gray-200 w-12 h-12 rounded-xl mb-4"></div>
              <div className="skeleton bg-gray-200 h-6 w-40 rounded mb-2"></div>
              <div className="space-y-2">
                <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
                <div className="skeleton bg-gray-200 h-4 w-5/6 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const TechnologySkeleton = () => (
    <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-6">
        <SectionHeaderSkeleton titleWidth="w-40" descriptionWidth="w-80" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center animate-pulse">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="p-6 bg-white/5 rounded-xl backdrop-blur-sm">
              <div className="skeleton bg-gray-400 h-8 w-24 mx-auto mb-2 rounded"></div>
              <div className="skeleton bg-gray-400 h-4 w-32 mx-auto rounded"></div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center animate-pulse">
          <div className="skeleton bg-gray-400 h-6 w-48 mx-auto rounded"></div>
        </div>
      </div>
    </section>
  );

  const FounderSkeleton = () => (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <SectionHeaderSkeleton titleWidth="w-56" descriptionWidth="w-96" />
        <div className="grid md:grid-cols-2 gap-10 items-center animate-pulse">
          <div className="border-2 border-gray-200 p-8 rounded-2xl shadow-md">
            <div className="flex items-center mb-6">
              <div className="skeleton bg-gray-200 w-20 h-20 rounded-full mr-6"></div>
              <div className="flex-1">
                <div className="skeleton bg-gray-200 h-7 w-40 rounded mb-2"></div>
                <div className="skeleton bg-gray-200 h-5 w-32 rounded mb-3"></div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton bg-gray-200 w-4 h-4 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
              <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
              <div className="skeleton bg-gray-200 h-4 w-3/4 rounded"></div>
            </div>
            <div className="flex space-x-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton bg-gray-200 w-10 h-10 rounded-full"></div>
              ))}
            </div>
          </div>
          <div>
            <div className="skeleton bg-gray-200 h-8 w-48 rounded mb-6"></div>
            <div className="space-y-4 mb-6">
              <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
              <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
              <div className="skeleton bg-gray-200 h-4 w-5/6 rounded"></div>
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="skeleton bg-gray-200 w-5 h-5 mr-2 rounded"></div>
                  <div className="skeleton bg-gray-200 h-4 w-40 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const TeamMemberSkeleton = ({ featured = false }) => (
    <div className={`group rounded-2xl overflow-hidden shadow-md border-2 ${featured ? 'border-orange-500' : 'border-gray-200'} animate-pulse`}>
      <div className="skeleton bg-gray-200 h-72 w-full"></div>
      <div className="p-6 text-center">
        {featured && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="skeleton bg-orange-500 h-6 w-20 rounded-full"></div>
          </div>
        )}
        <div className="skeleton bg-gray-200 h-6 w-32 mx-auto mb-2 rounded"></div>
        <div className="skeleton bg-gray-200 h-4 w-40 mx-auto mb-4 rounded"></div>
        <div className="flex justify-center items-center space-x-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton bg-gray-200 w-6 h-6 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );

  const TeamSkeleton = () => (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <SectionHeaderSkeleton titleWidth="w-32" descriptionWidth="w-80" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TeamMemberSkeleton featured={true} />
          {[...Array(5)].map((_, index) => (
            <TeamMemberSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );

  const CTASkeleton = () => (
    <section className="py-20 bg-gradient-to-r from-orange-500 to-amber-600 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center animate-pulse">
        <div className="skeleton bg-white/30 h-10 w-80 mx-auto mb-6 rounded"></div>
        <div className="space-y-3 mb-10">
          <div className="skeleton bg-white/30 h-5 w-full max-w-3xl mx-auto rounded"></div>
          <div className="skeleton bg-white/30 h-5 w-5/6 max-w-3xl mx-auto rounded"></div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <div className="skeleton bg-white/30 h-12 w-48 rounded-full"></div>
          <div className="skeleton bg-white/30 h-12 w-48 rounded-full"></div>
        </div>
        <div className="skeleton bg-white/30 h-4 w-48 mx-auto rounded"></div>
      </div>
    </section>
  );

  if (loading) {
    return (
      <div className="min-h-screen">
        <BannerSkeleton />
        <StorySectionSkeleton />
        <MissionVisionSkeleton />
        <FeaturesSkeleton />
        <TechnologySkeleton />
        <FounderSkeleton />
        <TeamSkeleton />
        <CTASkeleton />
      </div>
    );
  }

  return (
    <div className="">
      {/* Modern Interactive Banner - Matching Other Components */}
      <section className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span className="text-white text-sm font-semibold">Revolutionizing Automotive Services</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  About MechaLink
                </h1>
                
                <p className="text-xl text-orange-100 mb-8 leading-relaxed max-w-2xl">
                  The next-generation platform connecting vehicle owners with trusted mechanics through innovative technology and seamless user experiences.
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white text-black">
                    <Users className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-xl font-bold">
                      <CountUp end={500} suffix="+" duration={5} />
                    </div>
                    <div className="text-xs opacity-90">Verified Mechanics</div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white text-black">
                    <Heart className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-xl font-bold">
                      <CountUp end={10000} suffix="+" duration={5} />
                    </div>
                    <div className="text-xs opacity-90">Happy Customers</div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white text-black">
                    <Wrench className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-xl font-bold">
                      <CountUp end={15000} suffix="+" duration={5} />
                    </div>
                    <div className="text-xs opacity-90">Services Done</div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white text-black">
                    <Star className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-xl font-bold">
                      <CountUp end={95} suffix="%" duration={5} />
                    </div>
                    <div className="text-xs opacity-90">Satisfaction</div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-4">
                  <button className="bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-orange-50 transition-all duration-300 flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Our Mission
                  </button>
                  <button className="bg-orange-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-800 transition-all duration-300 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Meet The Team
                  </button>
                </div>
              </div>

              {/* Right Illustration/Content */}
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-3xl border-2 border-white/20 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Wrench className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-white text-xl font-semibold mb-2">Innovation Driven</h3>
                      <p className="text-orange-100 text-sm">
                        Combining cutting-edge technology with automotive expertise to transform service experiences
                      </p>
                    </div>
                  </div>
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400/20 rounded-full backdrop-blur-sm border border-yellow-300/30"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400/20 rounded-full backdrop-blur-sm border border-green-300/30"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of your existing content */}
      <section className="container mx-auto px-6 py-5 lg:py-20">
        <div className="text-center md:mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Story</h2>
          <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
          <p className="max-w-2xl mx-auto mt-4 text-gray-400">
            How a simple idea transformed into a revolutionary platform for automotive services
          </p>
        </div>

        <div className="grid xl:grid-cols-2 gap-16 items-center">
          <div className="w-full lg:w-full lg:flex items-center justify-center">
            <Lottie
              animationData={storyAnimation}
              loop={true}
              className="h-80 md:h-[400px] lg:h-[500px] w-auto"
            />
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-6">
              Bridging the Gap Between Mechanics and Customers
            </h3>
            <p className="text-lg leading-relaxed mb-6">
              MechaLink was founded in 2023 with a vision to transform the automotive service industry. We recognized that both mechanics and vehicle owners faced significant challenges in connecting and transacting efficiently.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Our platform combines the best elements of modern technology with deep industry knowledge to create a seamless experience. From intuitive booking systems to secure payment processing, we've built every component with both mechanics and customers in mind.
            </p>
            <div className="p-6 rounded-xl border-l-4 border-orange-500 shadow-2xl">
              <p className="font-medium">
                "Our mission is to empower mechanics with better tools and provide customers with transparency, quality service, and peace of mind."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Core Philosophy</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-6">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
              <p className="">
                To create a reliable bridge between mechanics and customers by offering transparency, trust, and convenience in every service. We're committed to elevating the standard of automotive repairs through technology and community.
              </p>
            </div>

            <div className="p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-6">
                <Rocket className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
              <p className="">
                To become the global leader in automotive service technology, redefining customer experience with innovation and care. We envision a world where finding quality automotive service is as easy as ordering food delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose MechaLink?</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
            <p className="max-w-2xl mx-auto mt-4 text-gray-400">
              Our platform offers unique advantages for both mechanics and customers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl hover:shadow-md transition border border-primary">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Verified Professionals
              </h3>
              <p className="text-gray-400">
                Every mechanic on our platform undergoes a rigorous verification process to ensure quality and reliability.
              </p>
            </div>

            <div className="p-6 rounded-xl hover:shadow-md transition border border-primary">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Location-Based Search
              </h3>
              <p className="text-gray-400">
                Find the nearest available mechanics with our advanced mapping technology.
              </p>
            </div>

            <div className="p-6 rounded-xl hover:shadow-md transition border border-primary">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Secure Payments
              </h3>
              <p className="text-gray-400">
                Enjoy hassle-free transactions with multiple payment options and protection policies.
              </p>
            </div>

            <div className="p-6 rounded-xl hover:shadow-md transition border border-primary">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
                <MessageCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Real-Time Communication
              </h3>
              <p className="text-gray-400">
                Chat directly with mechanics to discuss service details and get updates.
              </p>
            </div>

            <div className="p-6 rounded-xl hover:shadow-md transition border border-primary">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Service Tracking
              </h3>
              <p className="text-gray-400">
                Monitor your service request status from booking to completion in real-time.
              </p>
            </div>

            <div className="p-6 rounded-xl hover:shadow-md transition border border-primary">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Business Growth
              </h3>
              <p className="text-gray-400">
                Mechanics can grow their business with our marketing tools and customer reach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Technology</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
            <p className="max-w-2xl mx-auto mt-4 text-gray-300">
              Built with cutting-edge technologies for performance, security, and scalability
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm">
              <div className="text-2xl font-bold text-orange-500 mb-2">
                Next.js
              </div>
              <p className="text-gray-300">
                React framework for server-side rendering
              </p>
            </div>

            <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm">
              <div className="text-2xl font-bold text-orange-500 mb-2">
                Node.js
              </div>
              <p className="text-gray-300">
                Runtime environment for backend services
              </p>
            </div>

            <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm">
              <div className="text-2xl font-bold text-orange-500 mb-2">
                MongoDB
              </div>
              <p className="text-gray-300">
                NoSQL database for flexible data storage
              </p>
            </div>

            <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm">
              <div className="text-2xl font-bold text-orange-500 mb-2">
                Firebase
              </div>
              <p className="text-gray-300">
                Authentication and real-time database
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button className="inline-flex items-center text-orange-500 font-semibold group">
              View Technical Documentation
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2 group-hover:translate-x-1 transition"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Leadership Team</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
            <p className="max-w-2xl mx-auto mt-4 text-gray-400">
              Passionate individuals driving innovation in the automotive service industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="border-2 border-primary p-8 rounded-2xl shadow-md">
              <div className="flex items-center mb-6">
                <img
                  src="https://i.ibb.co.com/PvHZ1B8w/Jhankar-Vai.jpg"
                  alt="Founder"
                  className="w-20 h-20 rounded-full object-cover mr-6 border-4 border-white shadow"
                />
                <div>
                  <h3 className="text-2xl font-semibold">
                    Jhankar Mahbub
                  </h3>
                  <p className="text-orange-600">Founder & Lead Developer</p>
                  <div className="flex mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-400 mb-6">
                With a passion for technology and innovation, Alireja founded MechaLink to bridge the gap between skilled mechanics and customers seeking reliable services. His vision drives the project forward with excellence and dedication.
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-orange-500 text-black transition hover:animate-spin"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-orange-500 text-black hover:animate-spin transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-orange-500 text-black hover:animate-spin transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6">
                From Vision to Reality
              </h3>
              <p className="text-lg text-gray-400 mb-6">
                Jhankar assembled a team of passionate developers and industry experts to bring MechaLink to life. His leadership has fostered a culture of innovation and excellence that continues to drive the platform forward.
              </p>
              <div className="flex items-center text-gray-400">
                <Award className="w-5 h-5 text-orange-500 mr-2" />
                <span>10+ Years in Software Development</span>
              </div>
              <div className="flex items-center text-gray-400 mt-2">
                <Zap className="w-5 h-5 text-orange-500 mr-2" />
                <span>Expert in React & Next.js Ecosystems</span>
              </div>
              <div className="flex items-center text-gray-400 mt-2">
                <Calendar className="w-5 h-5 text-orange-500 mr-2" />
                <span>Founded MechaLink in 2023</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Team</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
            <p className="max-w-2xl mx-auto mt-4 text-gray-400">
              Talented individuals working together to revolutionize automotive services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Alireja Khan",
                role: "Team Leader & UI/UX Designer",
                image: "https://i.ibb.co.com/BK7jhQh5/Gemini-Generated-Image-ddddlp1lddlp1lddlp.png",
                featured: true,
                facebook_profile: "https://www.facebook.com/alirejaa.khan",
                github_profile: "https://github.com/Alireja-khan",
                linkedin_profile: "https://www.linkedin.com/in/alireja-khan/",
                portfolio: "https://ali-reja-4b7b7.web.app/",
              },
              {
                name: "Omar Faruk",
                role: "Full Stack Developer",
                image: "https://i.ibb.co.com/bMP4QbVX/Gemini-Generated-Image-i0r1rti0r1rti0r1.png",
                facebook_profile: "https://www.facebook.com/omarfaruk56305",
                github_profile: "https://github.com/omarfaruk-pro",
                linkedin_profile: "https://www.linkedin.com/in/omarfaruk56305",
                portfolio: "https://faruks-portfolio2.netlify.app/",
              },
              {
                name: "Abrar Karim Rupu",
                role: "Fronted Developer",
                image: "https://i.ibb.co.com/39GVXc3Q/Gemini-Generated-Image-z472a4z472a4z472.png",
                facebook_profile: "https://www.facebook.com/abrarkarim.rupu.3",
                github_profile: "https://github.com/rupu10",
                linkedin_profile: "https://www.linkedin.com/in/abrar-karim-rupu10/",
                portfolio: "https://abrar-karim-rupu-portfolio-ok39rkneg-rupu10s-projects.vercel.app/",
              },
              {
                name: "MD. Rahimul Haq",
                role: "Backend Engineer",
                image: "https://i.ibb.co.com/JjgLYt6d/IMG-20250927-214815.jpg",
                facebook_profile: "https://www.facebook.com/mdrhtahsin/",
                github_profile: "https://github.com/mdrahimultahsin",
                linkedin_profile: "https://www.linkedin.com/in/rahimultahsin/",
                portfolio: "https://rahimul-portfolio.vercel.app/",
              },
              {
                name: "Raheel Arfeen Rahat",
                role: "Frontend Developer",
                image: "https://i.ibb.co.com/5X6mGPm2/550733568-1845540119507626-4770195972697828670-n.png",
                facebook_profile: "https://www.facebook.com/RaheelArfeen",
                github_profile: "https://github.com/RaheelArfeen",
                linkedin_profile: "https://www.linkedin.com/in/Raheelarfeen/",
                portfolio: "https://raheelarfeen.com/",
              },
              {
                name: "MD. Shahan Al Munim",
                role: "Backend Engineer",
                image: "https://i.ibb.co.com/d0CJLhYw/formal-image.jpg",
                facebook_profile: "https://www.facebook.com/munim9munim",
                github_profile: "https://github.com/MMunim90",
                linkedin_profile: "https://www.linkedin.com/in/m-munim/",
                portfolio: "https://mmunim.netlify.app/",
              },
            ].map((person, i) => (
              <div
                key={i}
                className={`group rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition transform hover:-translate-y-2 ${person.featured ? "md:order-first border-2 border-orange-500" : "border-2 border-orange-500"}`}
              >
                <div className="h-118 overflow-hidden">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-6 text-center relative">
                  {person.featured && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Team Lead
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-1">{person.name}</h3>
                  <p className="text-gray-400 mb-4">{person.role}</p>
                  <div className="flex justify-center items-center space-x-3">
                    <a href={person.facebook_profile} target="_blank" className="cursor-pointer hover:text-orange-500 transition">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href={person.linkedin_profile} target="_blank" className="hover:text-orange-500 transition">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11.75 19h-3v-9h3v9zm-1.5-10.25c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.25 10.25h-3v-4.75c0-1.133-.022-2.591-1.578-2.591-1.578 0-1.818 1.231-1.818 2.503v4.838h-3v-9h2.879v1.233h.041c.401-.762 1.381-1.563 2.842-1.563 3.037 0 3.598 2 3.598 4.599v5.731z" />
                      </svg>
                    </a>
                    <a href={person.github_profile} target="_blank" className="hover:text-orange-500 transition">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href={person.portfolio} target="_blank" className="hover:text-orange-500 transition">
                      <Globe size={24} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Join the MechaLink Revolution
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Whether you're a vehicle owner seeking reliable service or a mechanic looking to grow your business, MechaLink offers the perfect platform to connect, transact, and thrive.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-orange-600 font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 transition transform hover:-translate-y-1">
              Sign Up as Customer
            </button>
            <button className="bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition">
              Register as Mechanic
            </button>
          </div>
          <p className="mt-8 text-orange-100">
            Have questions?{" "}
            <a href="https://www.facebook.com/alirejaa.khan" target="_blank" className="text-white font-semibold underline">
              Contact our team
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;