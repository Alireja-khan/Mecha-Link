'use client';

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribed with:", email);
    setEmail("");
  };

  return (
    <div className="w-9/12 mx-auto bg-[#cdd6e0] p-12 rounded-lg">
      <div className="relative w-full rounded-lg bg-[#1f2430] shadow-lg p-6 text-center">
        {/* Icon */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-purple-500 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
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

        {/* Close Button */}
        {/* <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-200">
          ✕
        </button> */}

        {/* Content */}
        <h2 className="mt-10 text-2xl font-semibold text-blue-400">Newsletter</h2>
        <p className="mt-2 text-sm text-gray-300">
          Stay up to date with our latest news and products.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex items-center rounded-lg bg-white overflow-hidden"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full px-4 py-2 text-gray-700 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 px-5 py-2 text-white font-medium hover:bg-blue-600 cursor-pointer"
          >
            SUBSCRIBE
          </button>
        </form>

        {/* Privacy Note */}
        <p className="mt-4 text-xs text-gray-400">
          Your email is safe with us, we don’t spam.
        </p>
      </div>
    </div>
  );
}