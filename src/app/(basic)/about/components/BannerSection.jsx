"use client";

import React, { useEffect, useState } from "react";
import { Users, Heart, Wrench, Star, Rocket, Sparkles } from "lucide-react";
import CountUp from "react-countup";

const BannerSection = () => {
  const [stats, setStats] = useState({
    mechanics: 0,
    customers: 0,
    services: 0,
    satisfaction: 0
  });
  const [loading, setLoading] = useState(true);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const [usersRes, shopsRes, requestsRes, reviewsRes] = await Promise.all([
        fetch("/api/users/dashboardUser"),
        fetch("/api/shops"),
        fetch("/api/service-request"),
        fetch("/api/reviews")
      ]);

      const usersData = await usersRes.json();
      const shopsData = await shopsRes.json();
      const requestsData = await requestsRes.json();
      const reviewsData = await reviewsRes.json();

      // Calculate total mechanics from shops
      const calculateTotalMechanics = (shopsArray) => {
        if (!shopsArray?.result || !Array.isArray(shopsArray.result)) return 0;
        return shopsArray.result.reduce((total, shop) => {
          const count = shop.shop?.mechanicCount || 0;
          return total + count;
        }, 0);
      };

      // Calculate total users (all registered users)
      const calculateTotalUsers = (usersArray) => {
        if (!Array.isArray(usersArray)) return 10000;
        return usersArray.length;
      };

      // Calculate satisfaction rate from reviews
      const calculateSatisfactionRate = (reviewsArray) => {
        if (!reviewsArray || !Array.isArray(reviewsArray) || reviewsArray.length === 0) return 95;
        
        const totalRatings = reviewsArray.reduce((total, review) => {
          return total + (review.rating || 0);
        }, 0);
        
        const averageRating = totalRatings / reviewsArray.length;
        // Convert 5-star rating to percentage
        const satisfactionRate = Math.min(100, Math.max(80, (averageRating / 5) * 100));
        return Math.round(satisfactionRate);
      };

      const totalMechanics = calculateTotalMechanics(shopsData);
      const totalUsers = calculateTotalUsers(usersData);
      const totalServices = requestsData?.result?.length || 0;
      const satisfactionRate = calculateSatisfactionRate(reviewsData);

      setStats({
        mechanics: totalMechanics,
        customers: totalUsers,
        services: totalServices,
        satisfaction: satisfactionRate
      });

    } catch (error) {
      console.error("Failed to fetch stats for banner:", error);
      // Fallback to default values if API fails
      setStats({
        mechanics: 500,
        customers: 10000,
        services: 15000,
        satisfaction: 95
      });
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, []);

  const StatCard = ({ icon: Icon, number, suffix, label }) => (
    <div className="bg-base-100/90 backdrop-blur-sm rounded-xl p-4 border border-neutral text-base-content">
      <Icon className="w-6 h-6 mx-auto mb-2" />
      <div className="text-xl font-bold">
        {loading ? (
          <span className="text-lg">...</span>
        ) : (
          <CountUp end={number} suffix={suffix} duration={3} />
        )}
      </div>
      <div className="text-xs opacity-90">{label}</div>
    </div>
  );

  const IllustrationCard = () => (
    <div className="flex-1 flex justify-center">
      <div className="relative">
        <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-3xl border-2 border-white/20 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Innovation Driven</h3>
            <p className="text-orange-100 text-sm">
              Combining cutting-edge technology with automotive expertise to transform service experiences
            </p>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400/20 rounded-full backdrop-blur-sm border border-yellow-300/30"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400/20 rounded-full backdrop-blur-sm border border-green-300/30"></div>
      </div>
    </div>
  );

  return (
    <section className="relative bg-gradient-to-r from-primary via-primary to-red-600 py-16 overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

      <div className="lg:container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard 
                  icon={Users} 
                  number={stats.mechanics} 
                  suffix="+" 
                  label="Verified Mechanics" 
                />
                <StatCard 
                  icon={Heart} 
                  number={stats.customers} 
                  suffix="+" 
                  label="Happy Customers" 
                />
                <StatCard 
                  icon={Wrench} 
                  number={stats.services} 
                  suffix="+" 
                  label="Services Done" 
                />
                <StatCard 
                  icon={Star} 
                  number={stats.satisfaction} 
                  suffix="%" 
                  label="Satisfaction" 
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => scrollToSection('mission-section')}
                  className="bg-gradient-to-r from-primary to-secondary hover:bg-white text-white px-6 py-3 rounded-md font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
                >
                  <Rocket className="w-5 h-5" />
                  Our Mission
                </button>
                <button 
                  onClick={() => scrollToSection('team-section')}
                  className="border-2 border-white hover:text-white bg-white text-primary px-6 py-3 rounded-md font-semibold hover:bg-primary/10 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  Meet The Team
                </button>
              </div>
            </div>

            <IllustrationCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;