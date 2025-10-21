"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import useUser from "@/hooks/useUser";
import { Store } from "lucide-react";
import Button from "../shared/Button";

export default function HeroModern() {
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState([]);
  const { user: loggedInUser } = useUser();
console.log(ads);
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

  // Fallback: Original hero content (shown when no approved ads)
  const DefaultHero = () => (
    <section className="relative py-16 md:py-20">
      <div className="lg:container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12 sm:gap-16 max-w-7xl">
        {/* Text Section */}
        <div className="flex-1 text-center lg:text-left w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight">
            Connect with <span className="text-primary">Trusted Mechanics</span>{" "}
            <br className="hidden sm:block" /> Anytime, Anywhere
          </h1>

          {/* Role-based Buttons */}
          {getRoleBasedButtons()}

          {/* Trust Indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center">
              <div className="flex -space-x-3 mr-2">
                {[
                  "https://i.ibb.co/0yVKz028/pexels-olly-733872.jpg",
                  "https://i.ibb.co/b5MfnjHK/pexels-newman-photographs-234743505-31040032.jpg",
                  "https://i.ibb.co/whxJD9y2/pexels-olly-839586.jpg",
                  "https://i.ibb.co/4nPGtgF2/pexels-behrouz-sasani-3568050-5636811-2.jpg",
                ].map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`customer ${index + 1}`}
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 border-base-100 object-cover"
                  />
                ))}
              </div>
              <span className="min-w-max">20k+ happy customers</span>
            </div>
            <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
            <div className="min-w-max">Trusted by 1,000+ garages</div>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex-1 relative w-full max-w-2xl mx-auto lg:max-w-none">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-base-200 transform hover:scale-[1.02] transition-all duration-500">
            <Image
              src="https://i.ibb.co.com/1fnb83Qs/pexels-chevanon-1108101.jpg"
              alt="Mechanic working illustration"
              width={600}
              height={400}
              className="object-cover w-full h-full min-h-60 sm:min-h-80"
              priority
            />
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-base-100/90 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                <Store className="text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-base-content text-sm">
                  Live Booking
                </h4>
                <p className="text-xs sm:text-sm text-base-content/80">
                  Instant mechanic availability
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Role-based buttons (same logic as before)
  const getRoleBasedButtons = () => {
    if (!loggedInUser) {
      return (
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Link href="/services">
            <button className="btn btn-primary text-white px-8 py-4 rounded-xl w-full sm:w-auto font-medium shadow-lg hover:shadow-xl">
              Mechanic Shops
            </button>
          </Link>
          <Link
            href="/login"
            className="btn btn-outline border-primary text-primary px-8 py-4 rounded-xl w-full sm:w-auto font-medium shadow-sm hover:shadow-md"
          >
            Join Us
          </Link>
        </div>
      );
    }

    switch (loggedInUser.role) {
      case "admin":
        return (
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/dashboard/admin/manageShops" className="btn btn-primary">
              Manage Mechanic Shops
            </Link>
            <Link href="/dashboard/admin/manageUsers" className="btn btn-outline border-primary text-primary">
              Manage Users
            </Link>
          </div>
        );

      case "mechanic":
        return (
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/serviceReq" className="btn btn-primary">
              Explore Requests
            </Link>
            <Link href="/dashboard/mechanic/AddMechanicShop" className="btn btn-outline border-primary text-primary">
              Register Your Shop
            </Link>
          </div>
        );

      default:
        return (
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"> <Link href="/services"> <button className="bg-primary text-white px-8 py-4 rounded-xl hover:bg-secondary transition-all duration-300 w-full sm:w-auto font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"> Find a Mechanic </button> </Link> <Link href="/dashboard/user/addServiceRequest" className="border-2 border-primary text-primary hover:bg-primary/10 hover:-translate-y-1 px-8 py-4 rounded-xl hover:border-primary hover:text-primary transition-all duration-300 w-full sm:w-auto font-medium shadow-sm hover:shadow-md text-center"> Post Your Problem </Link> </div>
        );
    }
  };

  // If still loading, show skeleton
  if (loading) return <div className="skeleton w-full h-[500px] rounded-2xl" />;

  // If no approved ads → show your old hero
  if (ads.length === 0) return <DefaultHero />;

  // ✅ If ads exist → show Swiper carousel
  return (
    <section className="relative py-12 md:py-15">
      <div className="container mx-auto px-6 max-w-6xl">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="rounded-3xl overflow-hidden shadow-xl"
        >
          {ads.map((ad) => (
            <SwiperSlide key={ad._id}>
              <div className="relative w-full h-[400px] sm:h-[500px] flex items-center justify-center text-center">
                <Image
                  src={ad.bannerImage}
                  alt={ad.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-6">
                  <h2 className="text-3xl sm:text-5xl font-bold mb-4">
                    {ad.title}
                  </h2>
                  <p className="max-w-2xl text-sm sm:text-lg opacity-90">
                    {ad.description}
                  </p>
                  <Link
  href={ad.shopId ? `/services/${ad.shopId}` : "/services"}
  className="mt-4"
>
  <Button>Visit Shop</Button>
</Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
