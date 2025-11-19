import Link from "next/link";
import react from "react";

import {
  Car,
  Bike,
  Truck,
  Wrench,
  Fan,
  Sparkles,
} from "lucide-react";

export default function SpecificServices({ loading }) {

  const categories = [
    {
      name: "Car Service & Repair",
      slug: "Car Service & Repair",
      icon: <Car className="w-8 h-8 text-primary" />, 
    },
    {
      name: "Motorcycle Service & Repair",
      slug: "Motorcycle Service & Repair",
      icon: <Bike className="w-8 h-8 text-primary" />, 
    },
    {
      name: "Truck/Commercial Vehicle Service",
      slug: "Truck/Commercial Vehicle Service",
      icon: <Truck className="w-8 h-8 text-primary" />, 
    },
    {
      name: "Home Appliance Repair",
      slug: "Home Appliance Repair",
      icon: <Wrench className="w-8 h-8 text-primary" />, 
    },
    {
      name: "HVAC & Cooling Specialist",
      slug: "HVAC & Cooling Specialist",
      icon: <Fan className="w-8 h-8 text-primary" />, 
    },
    {
      name: "Car Detailing & Accessories",
      slug: "Car Detailing & Accessories",
      icon: <Sparkles className="w-8 h-8 text-primary" />, 
    },
  ]

  return (
    <section className="mb-16 md:mb-25 py-10 ">
      <div className="lg:container px-6 mx-auto text-center">
        {/* Skeleton for title */}
        {loading ? (
          <div className="animate-pulse">
            <div className="h-10 bg-gray-300 rounded-lg w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-48 mx-auto"></div>
          </div>
        ) : (
          <>
            <h2 className="text-5xl font-bold ">
              Explore by <span className="text-primary">Category</span>
            </h2>
            <p className="md:text-lg text-medium mt-4 mb-10">Filter and discover what kind of mechanic are you looking for</p>
          </>
        )}

        {/* Skeleton for cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 p-3 md:p-6 rounded-2xl shadow-md border border-neutral bg-base-200 animate-pulse"
              >
                <div className="w-16 h-16 bg-gray-300 rounded-full border border-gray-400 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-400 rounded"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </div>
            ))
          ) : (
            categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category?category=${encodeURIComponent(cat.slug)}`}
                className=" flex flex-col items-center gap-3 p-3 md:p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-neutral bg-base-200"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-full border border-primary flex items-center justify-center">
                  {cat.icon}
                </div>
                <span className="font-semibold ">{cat.name}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  )
}