'use client';

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribed with:", email);
    setEmail("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000); // hide message after 3s
  };

  return (
    <div className=" py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative  rounded-xl shadow-2xl border border-orange-500 p-8 text-center">
          
          {/* Icon */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="flex h-16 w-16 items-center justify-center border border-orange-500 rounded-full bg-white shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h2 className="mt-10 text-3xl sm:text-4xl md:text-5xl font-extrabold  font-urbanist">
            Newsle<span className="text-orange-500">tt</span>er
          </h2>
          <p className="mt-3 text-base sm:text-lg  font-poppins">
            Stay up to date with our latest news and products.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col sm:flex-row items-center rounded-full border border-orange-500 bg-white overflow-hidden max-w-lg mx-auto shadow-sm"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Email address"
              className="w-full px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-l-full sm:rounded-l-full sm:rounded-r-none transition"
              required
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="mt-2 sm:mt-0 sm:ml-0 sm:rounded-r-full px-6 py-3 bg-orange-500 text-white font-bold cursor-pointer hover:bg-orange-600 transition-colors duration-300"
            >
              SUBSCRIBE
            </button>
          </form>

          {/* Success Message */}
          {success && (
            <p className="mt-4 text-sm text-green-200 font-poppins">
              Thank you for subscribing!
            </p>
          )}

          {/* Privacy Note */}
          <p className="mt-4 text-sm  font-poppins">
            Your email is safe with us, we don’t spam.
          </p>
        </div>
      </div>
    </div>
  );
}
