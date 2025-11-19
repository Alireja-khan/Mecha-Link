"use client";

import RegisterFrom from "./components/RegisterFrom";
import Image from "next/image";
import Link from "next/link";
import { FaGear } from "react-icons/fa6";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/Gear-Image-7.jpeg"
          alt="Gear mechanism background"
          fill
          className="object-cover ml-200 object-center"
          priority
        />
        {/* Overlay for better readability */}
        <div className="absolute inset-0 backdrop-blur-md"></div>
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-screen-xl bg-white rounded-3xl overflow-hidden shadow-lg">

        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-10 py-12">
          {/* Logo / Title with Gear Icon */}
          <Link href="/" className="flex items-center gap-3 mb-10 group">
            <FaGear className="text-2xl text-gray-700 group-hover:rotate-90 transition-transform duration-300" />
            <h1 className="text-3xl  tracking-[0.4em] text-gray-800 text-center">
              MECHALINK
            </h1>
          </Link>

          {/* Form Box */}
          <div className="w-full max-w-sm">
            <RegisterFrom />
          </div>
        </div>

        {/* Right Side - Gear Image */}
        <div className="hidden md:block md:w-full relative">
          <Image
            src="/Gear-Image-7.jpeg"
            alt="Gear mechanism"
            fill
            className="object-cover ml-50 mt-5 object-top"
            priority
          />
          {/* Overlay for better contrast */}
          <div className="absolute inset-0"></div>
        </div>
      </div>
    </div>
  );
}