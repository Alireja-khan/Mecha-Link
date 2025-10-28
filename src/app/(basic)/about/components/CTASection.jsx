import React from "react";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-amber-600 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Join the MechaLink Revolution
        </h2>
        <p className="text-xl mb-10 max-w-3xl mx-auto">
          Whether you're a vehicle owner seeking reliable service or a mechanic looking to grow your business, MechaLink offers the perfect platform to connect, transact, and thrive.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-white text-primary font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 transition transform hover:-translate-y-1">
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
  );
};

export default CTASection;