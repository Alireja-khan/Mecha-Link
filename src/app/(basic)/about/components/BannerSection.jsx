import React from "react";
import { Users, Heart, Wrench, Star, Rocket, Sparkles } from "lucide-react";
import CountUp from "react-countup";

const BannerSection = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

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
                <StatCard icon={Users} number={500} suffix="+" label="Verified Mechanics" />
                <StatCard icon={Heart} number={10000} suffix="+" label="Happy Customers" />
                <StatCard icon={Wrench} number={15000} suffix="+" label="Services Done" />
                <StatCard icon={Star} number={95} suffix="%" label="Satisfaction" />
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

const StatCard = ({ icon: Icon, number, suffix, label }) => (
  <div className="bg-base-100/90 backdrop-blur-sm rounded-xl p-4 border border-neutral text-base-content">
    <Icon className="w-6 h-6 mx-auto mb-2" />
    <div className="text-xl font-bold">
      <CountUp end={number} suffix={suffix} duration={5} />
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

export default BannerSection;