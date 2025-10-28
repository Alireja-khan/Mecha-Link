
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

export default function SpecificServices() {

  const categories = [
    {
      name: "Car Service & Repair",
      slug: "Car Service & Repair",
      icon: <Car className="w-8 h-8 text-primary" />, // 🚗 Car repair related
    },
    {
      name: "Motorcycle Service & Repair",
      slug: "Motorcycle Service & Repair",
      icon: <Bike className="w-8 h-8 text-primary" />, // 🏍️ Motorcycle repair
    },
    {
      name: "Truck/Commercial Vehicle Service",
      slug: "Truck/Commercial Vehicle Service",
      icon: <Truck className="w-8 h-8 text-primary" />, // 🚚 Truck or heavy vehicle
    },
    {
      name: "Home Appliance Repair",
      slug: "Home Appliance Repair",
      icon: <Wrench className="w-8 h-8 text-primary" />, // 🧰 Tools / repair
    },
    {
      name: "HVAC & Cooling Specialist",
      slug: "HVAC & Cooling Specialist",
      icon: <Fan className="w-8 h-8 text-primary" />, // 🌬️ Air / cooling system
    },
    {
      name: "Car Detailing & Accessories",
      slug: "Car Detailing & Accessories",
      icon: <Sparkles className="w-8 h-8 text-primary" />, // ✨ Clean / detailing
    },
  ]


  return (
    <section className="mb-26 py-10">
      <div className="lg:container px-6 mx-auto text-center">
        <h2 className="text-5xl font-bold mb-5">
          Explore by <span className="text-primary">Category</span>
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-12">
          Find the right mechanic shop for your needs — explore by category and connect with trusted experts easily.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
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
          ))}
        </div>
      </div>
    </section>
  )
}