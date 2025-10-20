"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import useUser from "@/hooks/useUser";
import { Store } from "lucide-react";

export default function HeroModern() {
  const [loading, setLoading] = useState(true);
  // Assuming useUser returns { user: null | { role: 'admin' | 'mechanic' | 'user', ... } }
  const { user: loggedInUser } = useUser();

  useEffect(() => {
    // Simulate a slight loading delay (e.g., for fetching user data or assets)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get role-specific buttons
  const getRoleBasedButtons = () => {
    if (loading) {
      return (
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Link href="/services">
            <button className="bg-primary text-white px-8 py-4 rounded-xl hover:bg-secondary transition-all duration-300 w-full sm:w-auto font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Find a Mechanic
            </button>
          </Link>
          {/* Secondary Action: Post a Request (encouraging registration/login) */}
          <Link href="/dashboard/user/addServiceRequest" className="border-2 border-primary text-primary hover:bg-accent px-8 py-4 rounded-xl hover:border-primary hover:text-primary transition-all duration-300 w-full sm:w-auto font-medium shadow-sm hover:shadow-md text-center">
            Post Your Problem
          </Link>
        </div>
      );
    }

    if (!loggedInUser) {
      return (
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Link href="/services">
            <button className="bg-primary text-white px-8 py-4 rounded-xl hover:bg-secondary transition-all duration-300 w-full sm:w-auto font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Mechanic Shops
            </button>
          </Link>
          <Link href="/login" className="border-2 border-primary text-primary hover:bg-primary/10 hover:-translate-y-1 px-8 py-4 rounded-xl hover:border-primary hover:text-primary transition-all duration-300 w-full sm:w-auto font-medium shadow-sm hover:shadow-md text-center">
            Join Us
          </Link>
        </div>
      );
    }

    // Role-specific buttons
    switch (loggedInUser.role) {
      case "admin":
        return (
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/dashboard/admin/manageShops">
              <button className="bg-primary text-white px-8 py-4 rounded-xl hover:bg-secondary transition-all duration-300 w-full sm:w-auto font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Manage Mechanic Shops
              </button>
            </Link>
            <Link href="/dashboard/admin/manageUsers" className="border-2 border-primary text-primary hover:bg-primary/10 hover:-translate-y-1 px-8 py-4 rounded-xl hover:border-primary hover:text-primary transition-all duration-300 w-full sm:w-auto font-medium shadow-sm hover:shadow-md text-center">
              Manage Users
            </Link>
          </div>
        );

      case "mechanic":
        return (
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/serviceReq">
              <button className="bg-primary text-white px-8 py-4 rounded-xl hover:bg-secondary transition-all duration-300 w-full sm:w-auto font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Explore Requests
              </button>
            </Link>
            <Link href="/dashboard/mechanic/AddMechanicShop" className="border-2 border-primary text-primary hover:bg-primary/10 hover:-translate-y-1 px-8 py-4 rounded-xl hover:border-primary hover:text-primary transition-all duration-300 w-full sm:w-auto font-medium shadow-sm hover:shadow-md text-center">
              Register Your Shop
            </Link>
          </div>
        );

      case "user":
      default: // Fallback for 'user' and any other roles
        return (
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/services">
              <button className="bg-primary text-white px-8 py-4 rounded-xl hover:bg-secondary transition-all duration-300 w-full sm:w-auto font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Find a Mechanic
              </button>
            </Link>
            <Link href="/dashboard/user/addServiceRequest" className="border-2 border-primary text-primary hover:bg-primary/10 hover:-translate-y-1 px-8 py-4 rounded-xl hover:border-primary hover:text-primary transition-all duration-300 w-full sm:w-auto font-medium shadow-sm hover:shadow-md text-center">
              Post Your Problem
            </Link>
          </div>
        );
    }
  };


  // Hero Skeleton Component (unchanged for responsiveness)
  const HeroSkeleton = () => (
    <section className="relative py-20 md:py-20 "> {/* Added overflow-hidden for safety */}
      <div className="lg:container mx-auto px-6 lg:px-12 flex flex-col-reverse lg:flex-row items-center gap-16 max-w-7xl">
        {/* Text Content Skeleton */}
        <div className="flex-1 text-center lg:text-left animate-pulse w-full"> {/* Added w-full */}
          {/* Main Title Skeleton */}
          <div className="space-y-4 mb-6">
            <div className="skeleton bg-gray-300 h-10 sm:h-12 w-3/4 mx-auto lg:mx-0 rounded-lg"></div> {/* Adjusted height for better mobile look */}
            <div className="skeleton bg-gray-300 h-10 sm:h-12 w-4/5 mx-auto lg:mx-0 rounded-lg"></div> {/* Adjusted height for better mobile look */}
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2 mb-10 max-w-xl lg:max-w-none mx-auto"> {/* Added max-w-xl mx-auto for better centering on small screens */}
            <div className="skeleton bg-gray-300 h-4 w-full rounded"></div>
            <div className="skeleton bg-gray-300 h-4 w-5/6 rounded"></div>
            <div className="skeleton bg-gray-300 h-4 w-4/6 rounded"></div>
          </div>

          {/* Buttons Skeleton */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <div className="skeleton bg-gray-300 h-12 w-full sm:w-40 rounded-xl"></div> {/* w-full on small screens */}
            <div className="skeleton bg-gray-300 h-12 w-full sm:w-48 rounded-xl"></div> {/* w-full on small screens */}
          </div>

          {/* Trust Indicators Skeleton */}
          <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6">
            <div className="flex items-center">
              <div className="flex -space-x-3 mr-2">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="skeleton bg-gray-300 h-8 w-8 rounded-full border-2 border-white"
                  ></div>
                ))}
              </div>
              <div className="skeleton bg-gray-300 h-4 w-32 rounded"></div>
            </div>
            <div className="skeleton bg-gray-300 h-4 w-px hidden sm:block"></div> {/* Hide separator on tiny screens */}
            <div className="skeleton bg-gray-300 h-4 w-40 rounded"></div>
          </div>
        </div>

        {/* Image Skeleton */}
        <div className="flex-1 relative w-full">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
            <div className="skeleton bg-gray-300 w-full h-80 md:h-96 rounded-2xl"></div>
            {/* Overlay card skeleton */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 flex items-center gap-3 sm:gap-4"> {/* Adjusted padding and position for mobile */}
              <div className="skeleton bg-gray-300 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl"></div> {/* Adjusted size */}
              <div className="space-y-1">
                <div className="skeleton bg-gray-300 h-3 w-20 rounded"></div> {/* Adjusted size */}
                <div className="skeleton bg-gray-300 h-3 w-28 rounded"></div> {/* Adjusted size */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Background Elements Skeleton (unchanged) */}
      <div className="absolute top-15 right-0 w-72 h-72 bg-gray-300 rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gray-300 rounded-full blur-3xl opacity-30 -z-10"></div>
    </section>
  );

  if (loading) {
    return <HeroSkeleton />;
  }

  return (
    <section className="relative py-16 md:py-20">
      <div className="lg:container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12 sm:gap-16 max-w-7xl"> {/* Adjusted gap */}

        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight"> {/* Refined text scaling for better mobile fit */}
            Connect with <span className="text-primary">Trusted Mechanics</span>{" "}
            <br className="hidden sm:block" /> Anytime, Anywhere
          </h1>

          {/* Dynamic Role-Based Buttons */}
          {getRoleBasedButtons()}

          {/* Trust Indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm"> {/* Adjusted font size and gap */}
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
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 border-base-100 object-cover" // Adjusted size
                  />
                ))}
              </div>
              <span className="min-w-max">20k+ happy customers</span> {/* min-w-max prevents wrapping */}
            </div>
            <div className="h-4 w-px bg-gray-300 hidden sm:block"></div> {/* Hide separator on small screens */}
            <div className="min-w-max">Trusted by 1,000+ garages</div> {/* min-w-max prevents wrapping */}
          </div>
        </div>

        {/* Image / Illustration */}
        <div className="flex-1 relative w-full max-w-2xl mx-auto lg:max-w-none"> {/* Added max-w-xl and mx-auto for better mobile/tablet centering */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-base-200 transform hover:scale-[1.02] transition-all duration-500">
            <Image
              src="https://i.ibb.co.com/1fnb83Qs/pexels-chevanon-1108101.jpg"
              alt="Mechanic working illustration"
              width={600}
              height={400}
              className="object-cover w-full h-full min-h-60 sm:min-h-80" // Ensure a minimum height on small screens
              priority
            />
            {/* Overlay card */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-base-100/90 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 flex items-center gap-3 sm:gap-4"> {/* Adjusted padding and position for mobile */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center"> {/* Adjusted size */}
                <Store className="text-white"></Store>
              </div>
              <div>
                <h4 className="font-semibold text-base-content text-sm">Live Booking</h4>
                <p className="text-xs sm:text-sm text-base-content/80">Instant mechanic availability</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Background Elements (unchanged) */}
      <div className="absolute top-15 right-0 w-72 h-72 bg-secondary rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full blur-3xl opacity-30 -z-10"></div>
    </section>
  );
}