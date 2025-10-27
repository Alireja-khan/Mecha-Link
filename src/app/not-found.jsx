"use client";

import Link from "next/link";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-primary/5 px-6 text-center overflow-hidden">
      {/* Background Decorative Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

      {/* Main Card */}
      <div className="z-10 bg-base-100/90 backdrop-blur-md border border-base-300 shadow-2xl rounded-3xl p-12 max-w-md w-full">
        {/* Top Icon */}
        <div className="flex justify-center mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-2xl opacity-30 rounded-full"></div>
          <AlertTriangle className="relative text-primary w-16 h-16" />
        </div>

        {/* Heading */}
        <h1 className="text-6xl font-bold text-base-content mb-4">404</h1>
        <p className="text-lg text-base-content/70 mb-8 leading-relaxed">
          Oops! The page you’re looking for doesn’t exist.
        </p>

        {/* Go Home Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </section>
  );
}
