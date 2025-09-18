import React from "react";
import ServiceBanner from "./ServiceBanner";
import ServiceCard from "../Components/ServiceCard";

export default function Services() {
  const services = [
    {
      id: 1,
      name: "AutoFix Garage",
      category: "Automobile",
      location: "Dhaka, Bangladesh",
      workingHour: "9:00 AM - 8:00 PM",
      weekend: "Friday",
      rating: 4,
      image: "https://i.ibb.co.com/twWwK13q/pexels-olly-3817756.jpg",
    },
    {
      id: 2,
      name: "Home Essentials",
      category: "Household",
      location: "Chittagong, Bangladesh",
      workingHour: "10:00 AM - 9:00 PM",
      weekend: "Sunday",
      rating: 3,
      image: "https://i.ibb.co.com/j96BjHkM/pexels-olly-3846508.jpg",
    },
    {
      id: 3,
      name: "Speedy Motors",
      category: "Automobile",
      location: "Khulna, Bangladesh",
      workingHour: "8:00 AM - 7:00 PM",
      weekend: "Friday",
      rating: 5,
      image: "https://i.ibb.co.com/d0xkrYqh/pexels-gustavo-fring-6870320.jpg",
    },
    {
      id: 4,
      name: "Daily Needs Store",
      category: "Household",
      location: "Rajshahi, Bangladesh",
      workingHour: "9:30 AM - 8:30 PM",
      weekend: "Saturday",
      rating: 2,
      image: "https://i.ibb.co.com/ds3m107k/pexels-centre-for-ageing-better-55954677-7849743.jpg",
    },
    {
      id: 5,
      name: "Elite Auto Care",
      category: "Automobile",
      location: "Sylhet, Bangladesh",
      workingHour: "9:00 AM - 6:00 PM",
      weekend: "Friday",
      rating: 4,
      image: "https://i.ibb.co.com/1G6K3BDg/pexels-gustavo-fring-4173282.jpg",
    },
    {
      id: 6,
      name: "City Home Mart",
      category: "Household",
      location: "Barisal, Bangladesh",
      workingHour: "10:00 AM - 9:00 PM",
      weekend: "Sunday",
      rating: 3,
      image: "https://i.ibb.co.com/279cNcqV/pexels-cottonbro-4489732.jpg",
    },
    {
      id: 7,
      name: "Prime Car Service",
      category: "Automobile",
      location: "Rangpur, Bangladesh",
      workingHour: "9:00 AM - 8:00 PM",
      weekend: "Friday",
      rating: 5,
      image: "https://i.ibb.co.com/0pFykFJ7/pexels-sergey-sergeev-2153675005-32845697.jpg",
    },
    {
      id: 8,
      name: "Family Needs",
      category: "Household",
      location: "Mymensingh, Bangladesh",
      workingHour: "10:00 AM - 8:00 PM",
      weekend: "Saturday",
      rating: 2,
      image: "https://i.ibb.co.com/CsMCdKgP/pexels-cottonbro-4489748.jpg",
    },
    {
      id: 9,
      name: "Super Auto Hub",
      category: "Automobile",
      location: "Dhaka, Bangladesh",
      workingHour: "8:00 AM - 7:00 PM",
      weekend: "Friday",
      rating: 4,
      image: "https://i.ibb.co.com/N6kYLt4S/pexels-olly-3822843.jpg",
    },
    {
      id: 10,
      name: "Happy Home Store",
      category: "Household",
      location: "Chittagong, Bangladesh",
      workingHour: "9:00 AM - 8:30 PM",
      weekend: "Sunday",
      rating: 3,
      image: "https://i.ibb.co.com/JFqMFR8y/pexels-olly-3807120.jpg",
    },
    {
      id: 11,
      name: "Metro Car Clinic",
      category: "Automobile",
      location: "Sylhet, Bangladesh",
      workingHour: "9:00 AM - 7:00 PM",
      weekend: "Friday",
      rating: 5,
      image: "https://i.ibb.co.com/4Rvr6PFS/pexels-pixabay-279949.jpg",
    },
    {
      id: 12,
      name: "Smart Living",
      category: "Household",
      location: "Rajshahi, Bangladesh",
      workingHour: "10:00 AM - 9:00 PM",
      weekend: "Saturday",
      rating: 2,
      image: "https://i.ibb.co.com/zTn519zm/kato-blackmore-qc-F-19-Bv-Vi-E-unsplash.jpg",
    },
  ];



  return (
    <>
      <ServiceBanner></ServiceBanner>
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-center">
              Service <span className="text-primary">Directory</span>
            </h2>
            <p className="text-lg">Browse through our wide range of professional services.</p>
          </div>
          <div className="flex justify-between">
            <div className="w-1/2">
              <div className="flex items-center gap-3">
                <label htmlFor="search">Search</label>
                <input
                  type="search"
                  placeholder="Search with shop name, mechanic name, location"
                  className="px-3 py-2 border-1 rounded-lg border-gray-300 w-3/4 focus:outline-none"
                />
              </div>
            </div>
            <div className="w-1/2 flex justify-end">
              <div className="flex items-center gap-3">
                <label htmlFor="sort">Sort by Rating</label>
                <select
                  name="sort"
                  id="sort"
                  className="px-3 py-2 border-1 rounded-lg border-gray-300 focus:outline-none"
                >
                  <option value="htl">High to Low</option>
                  <option value="lth">Low to High</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service}></ServiceCard>
            ))}
          </div>
          <div className="flex justify-between mt-8">
            <div>
              <div className="flex items-center gap-3">
                <label htmlFor="sort">Show on page</label>
                <select
                  name="sort"
                  id="sort"
                  className="px-3 py-2 border-1 rounded-lg border-gray-300 focus:outline-none"
                >
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="36">36</option>
                  <option value="48">48</option>
                </select>
              </div>
            </div>
            <div className="flex justify-center space-x-2">
              <button className="px-5 shrink-0 py-1 leading-none border border-primary rounded-md hover:bg-primary hover:text-white transition duration-400 cursor-pointer">Prev</button>

              <button className="px-5 shrink-0 py-1 leading-none border border-primary rounded-md hover:bg-primary hover:text-white transition duration-400 cursor-pointer">1</button>

              <button className="px-5 shrink-0 py-1 leading-none border border-primary rounded-md hover:bg-primary hover:text-white transition duration-400 cursor-pointer">2</button>

              <button className="px-5 shrink-0 py-1 leading-none border border-primary rounded-md hover:bg-primary hover:text-white transition duration-400 cursor-pointer">3</button>

              <button className="px-5 shrink-0 py-1 leading-none border border-primary rounded-md hover:bg-primary hover:text-white transition duration-400 cursor-pointer">Next</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
