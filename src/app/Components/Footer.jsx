import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { FaGear } from "react-icons/fa6";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="bg-gray-900 text-gray-300">
      <div className="container mx-auto py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="flex flex-col items-start gap-3 max-w-xs">
          <div className="flex items-center gap-3">
            <Link href="/">
              <FaGear className="h-8 w-8 lg:h-12 lg:w-12 text-primary" />
            </Link>
            <h1 className="text-xl lg:text-4xl font-bold text-white">
              MechaLink
            </h1>
          </div>
          <p className="text-gray-400 text-xs font-poppins leading-relaxed">
            Connecting drivers with trusted mechanics and auto services.
          </p>
        </div>


        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-primary transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition">
                Services
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li>Online Booking</li>
            <li>Garage Finder</li>
            <li>Customer Reviews</li>
            <li>24/7 Support</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Subscribe</h3>
          <p className="text-sm text-gray-400 mb-3">
            Get updates on offers, tips, and news.
          </p>
          <form className="hidden lg:flex items-center bg-gray-800 rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 text-sm text-gray-200 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="bg-primary px-4 py-2 text-white text-sm font-medium hover:bg-primary/70 transition cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 container mx-auto">
        <div className="py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} MechaLink. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary transition">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-primary transition">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-primary transition">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-primary transition">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
