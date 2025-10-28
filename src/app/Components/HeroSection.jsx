"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import useUser from "@/hooks/useUser";
import { Store, Star, MapPin, Clock, ShieldCheck } from "lucide-react";
import Button from "../shared/Button";

export default function HeroModern() {
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState([]);
  const { user: loggedInUser } = useUser();

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const { data } = await axios.get("/api/ads");
        const approvedAds = data?.filter((ad) => ad.status === "approved") || [];
        setAds(approvedAds);
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  // Enhanced skeleton loader
  if (loading) {
    return (
      <div className="relative py-16 md:py-20">
        <div className="lg:container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12 sm:gap-16 max-w-7xl">
          <div className="flex-1 space-y-6">
            <div className="skeleton h-12 w-3/4 rounded-2xl"></div>
            <div className="skeleton h-6 w-1/2 rounded-xl"></div>
            <div className="skeleton h-14 w-64 rounded-2xl mt-8"></div>
            <div className="skeleton h-6 w-56 rounded-xl mt-10"></div>
          </div>
          <div className="flex-1">
            <div className="skeleton w-full h-80 rounded-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Default Hero Component
  const DefaultHero = () => (
    <section className="relative py-12 md:py-18 bg-gradient-to-br from-base-100 via-base-100 to-primary/5">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="lg:container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12 sm:gap-20 max-w-7xl relative z-10">
        {/* Text Section */}
        <div className="flex-1 text-center lg:text-left w-full space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <ShieldCheck className="w-4 h-4" />
              Trusted Automotive Platform
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold ">
              Connect with{" "}
              <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
                Trusted Mechanics
              </span>{" "}
              Anytime, Anywhere
            </h1>

            <p className="text-lg sm:text-xl text-base-content/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Instant access to certified mechanics, transparent pricing, and reliable service 
              when you need it most.
            </p>
          </div>

          {/* Role-based Buttons */}
          {getRoleBasedButtons()}

          {/* Enhanced Trust Indicators */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">
            <div className="flex items-center gap-4 bg-base-100/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-base-300">
              <div className="flex -space-x-3">
                {[
                  "https://i.ibb.co/0yVKz028/pexels-olly-733872.jpg",
                  "https://i.ibb.co/b5MfnjHK/pexels-newman-photographs-234743505-31040032.jpg",
                  "https://i.ibb.co/whxJD9y2/pexels-olly-839586.jpg",
                  "https://i.ibb.co/4nPGtgF2/pexels-behrouz-sasani-3568050-5636811-2.jpg",
                ].map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`customer ${index + 1}`}
                      className="h-10 w-10 rounded-full border-2 border-base-100 object-cover shadow-sm"
                    />
                  </div>
                ))}
              </div>
              <div className="ml-2">
                <p className="font-semibold text-base-content">20k+ Happy Customers</p>
                <p className="text-sm text-base-content/60">Served with excellence</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-base-content/70">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="font-medium">Trusted by 1,000+ garages</span>
            </div>
          </div>
        </div>

        {/* Enhanced Image Section */}
        <div className="flex-1 relative w-full max-w-2xl mx-auto lg:max-w-none">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary rounded-3xl blur-lg opacity-20"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-base-100 transform hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl">
              <Image
                src="https://i.ibb.co.com/1fnb83Qs/pexels-chevanon-1108101.jpg"
                alt="Professional mechanic working on car"
                width={600}
                height={400}
                className="object-cover w-full h-full min-h-80 sm:min-h-96"
                priority
              />
              
              {/* Enhanced Live Booking Card */}
              <div className="absolute bottom-6 left-6 bg-base-100/95 backdrop-blur-md rounded-2xl shadow-xl p-4 flex items-center gap-4 border border-base-300">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <Store className="text-white w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base-content text-sm flex items-center gap-2">
                    Live Booking
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  </h4>
                  <p className="text-xs text-base-content/70">
                    Real-time mechanic availability
                  </p>
                </div>
              </div>

              {/* Floating Rating Badge */}
              <div className="absolute top-6 right-6 bg-base-100/95 backdrop-blur-md rounded-2xl shadow-lg p-3 text-center border border-base-300">
                <div className="text-2xl font-bold text-primary">4.9★</div>
                <div className="text-xs text-base-content/60">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Enhanced Role-based buttons
  const getRoleBasedButtons = () => {
    const baseButtonClass = "px-8 py-4 rounded-md font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl border-2";
    
    if (!loggedInUser) {
      return (
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Link href="/services">
            <button className={`${baseButtonClass} bg-gradient-to-r from-primary to-secondary text-white border-transparent hover:shadow-2xl`}>
              Find Mechanic Shops
            </button>
          </Link>
          <Link href="/login">
            <button className={`${baseButtonClass} border-primary text-primary hover:bg-primary/10 backdrop-blur-sm`}>
              Join Our Community
            </button>
          </Link>
        </div>
      );
    }

    switch (loggedInUser.role) {
      case "admin":
        return (
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/dashboard/admin/manageShops" className={`${baseButtonClass} bg-gradient-to-r from-primary to-secondary text-white border-transparent`}>
              Manage Shops
            </Link>
            <Link href="/dashboard/admin/manageUsers" className={`${baseButtonClass} border-primary text-primary hover:bg-primary/10`}>
              Manage Users
            </Link>
          </div>
        );

      case "mechanic":
        return (
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/serviceReq" className={`${baseButtonClass} bg-gradient-to-r from-primary to-secondary text-white border-transparent`}>
              Explore Service Requests
            </Link>
            <Link href="/dashboard/mechanic/AddMechanicShop" className={`${baseButtonClass} border-primary text-primary hover:bg-primary/10`}>
              Register Your Shop
            </Link>
          </div>
        );

      default:
        return (
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/services">
              <button className={`${baseButtonClass} bg-gradient-to-r from-primary to-secondary text-white border-transparent hover:shadow-2xl`}>
                Find a Mechanic
              </button>
            </Link>
            <Link href="/dashboard/user/addServiceRequest">
              <button className={`${baseButtonClass} border-primary text-primary hover:bg-primary/10 backdrop-blur-sm`}>
                Post Your Problem
              </button>
            </Link>
          </div>
        );
    }
  };

  // If no approved ads → show enhanced default hero
  if (ads.length === 0) return <DefaultHero />;

  // ✅ Enhanced Swiper Carousel with Modern Design
  return (
    <section className="relative py-12 md:py-14 bg-gradient-to-br from-base-100 to-primary/5 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
      
        

        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ 
            delay: 5000, 
            disableOnInteraction: false,
            pauseOnMouseEnter: true 
          }}
          pagination={{ 
            clickable: true,
            dynamicBullets: true,
            renderBullet: (index, className) => {
              return `<span class="${className} !w-3 !h-3 !bg-primary/80 hover:!bg-primary !transition-all !duration-300"></span>`;
            }
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          loop={true}
          speed={1000}
          className="rounded-3xl overflow-hidden shadow-2xl border border-base-300/50 hover:shadow-3xl transition-shadow duration-300"
        >
          {ads.map((ad) => (
            <SwiperSlide key={ad._id}>
              <div className="relative w-full h-[500px] sm:h-[600px] flex items-center">
                {/* Background Image with Gradient Overlay */}
                <Image
                  src={ad.bannerImage}
                  alt={ad.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
                
                {/* Multi-layer Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Content Container */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                  <div className="max-w-2xl">
                    {/* Shop Name Badge */}
                    {ad.shopName && (
                      <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/30">
                        <MapPin className="w-4 h-4" />
                        {ad.shopName}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                      {ad.title}
                    </h2>

                    {/* Description */}
                    <p className="text-lg sm:text-xl text-white/90 leading-relaxed mb-8 max-w-xl">
                      {ad.description}
                    </p>

                    {/* CTA Button */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <Link
                        href={ad.shopId ? `/services/${ad.shopId}` : "/services"}
                        className="inline-block"
                      >
                        <Button 
                          variant="primary" 
                          className="px-8 py-4 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-primary to-secondary border-0 text-white flex items-center"
                        >
                          <Store className="w-5 h-5 mr-2" />
                          Visit Shop 
                        </Button>
                      </Link>
                      
                      {/* Additional Info - Clean Version */}
                      <div className="flex items-center justify-center gap-4 text-white/80">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Limited Time</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                          <ShieldCheck className="w-4 h-4" />
                          <span className="text-sm">Verified Shop</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-8 right-8 bg-base-100/90 backdrop-blur-md rounded-2xl shadow-lg p-4 text-center border border-base-300">
                  <div className="flex items-center gap-1 text-yellow-500 mb-1 justify-center">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <div className="text-sm font-bold text-base-content">Premium Partner</div>
                  <div className="text-xs text-base-content/60">Trusted Service</div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button className="swiper-button-prev bg-base-100/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-base-300 hover:bg-base-100 transition-all duration-300 hover:scale-110 group">
            <div className="w-6 h-6 text-base-content group-hover:text-primary transition-colors">←</div>
          </button>
          <button className="swiper-button-next bg-base-100/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-base-300 hover:bg-base-100 transition-all duration-300 hover:scale-110 group">
            <div className="w-6 h-6 text-base-content group-hover:text-primary transition-colors">→</div>
          </button>
        </div>

        
      </div>
    </section>
  );
}