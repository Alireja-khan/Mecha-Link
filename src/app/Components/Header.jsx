"use client";

import { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserIcon } from "lucide-react";
import { FaGear } from "react-icons/fa6";

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const pathname = usePathname();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    //theme toggle
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const shakeVariants = {
    hover: {
      x: [0, -5, 5, -5, 5, 0], // horizontal shake
      transition: { duration: 0.5 },
    },
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
        ? theme === "dark"
          ? "bg-[#343434]/95 backdrop-blur-md shadow-sm py-2"
          : "bg-white/95 backdrop-blur-md shadow-sm py-2"
        : theme === "dark"
          ? "bg-[#343434]/90 backdrop-blur-sm py-4"
          : "bg-white/90 backdrop-blur-sm py-4"
        }`}
    >

      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex gap-5 items-center z-50">
          <FaGear className="h-12  w-12" />
          <h1 className="text-3xl font-bold">Mecha<span className="text-primary">Link</span></h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative text-lg font-medium transition-colors hover:text-primary ${pathname === item.href ? "text-primary" : ""
                }`}
            >
              {item.label}
              {pathname === item.href && (
                <span></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side Auth / User Menu */}
        <div className="hidden md:flex items-center space-x-4">


          <label className="swap swap-rotate">
            {/* this hidden checkbox controls the state */}
            <input type="checkbox" className="theme-controller" value="synthwave"
              onChange={() => setTheme(theme === "light" ? "dark" : "light")}
              checked={theme === "dark"}
            />

            {/* sun icon */}
            {/* gear icon (mechanical) */}
            <svg
              className="swap-off h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              role="img"
              aria-label="gear icon (light mode)">
              <title>Gear</title>

              {/* gear teeth: 8 small rectangles rotated around center */}
              <g fill="currentColor">
                <rect x="11" y="0.5" width="2" height="3" rx="0.3" transform="rotate(0 12 12)" />
                <rect x="11" y="0.5" width="2" height="3" rx="0.3" transform="rotate(45 12 12)" />
                <rect x="11" y="0.5" width="2" height="3" rx="0.3" transform="rotate(90 12 12)" />
                <rect x="11" y="0.5" width="2" height="3" rx="0.3" transform="rotate(135 12 12)" />
                <rect x="11" y="0.5" width="2" height="3" rx="0.3" transform="rotate(180 12 12)" />
                <rect x="11" y="0.5" width="2" height="3" rx="0.3" transform="rotate(225 12 12)" />
                <rect x="11" y="0.5" width="2" height="3" rx="0.3" transform="rotate(270 12 12)" />
                <rect x="11" y="0.5" width="2" height="3" rx="0.3" transform="rotate(315 12 12)" />
                {/* inner hub */}
                <circle cx="12" cy="12" r="3.5" />
                {/* small center hole */}
                <circle cx="12" cy="12" r="1.1" fill="#000" opacity="0.12" />
              </g>
            </svg>

            {/* piston icon (mechanical/dark) */}
            <svg
              className="swap-on h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              role="img"
              aria-label="piston icon (dark mode)">
              <title>Piston</title>

              <g fill="currentColor" stroke="none">
                {/* piston head */}
                <rect x="6" y="2" width="12" height="4" rx="1" ry="1" />
                {/* shaft */}
                <rect x="10" y="6" width="4" height="8" rx="0.6" />
                {/* connecting rod */}
                <rect x="11.2" y="14" width="1.6" height="5.5" rx="0.4" transform="rotate(8 12 16.75)" />
                {/* big bottom circle (crank) */}
                <circle cx="12" cy="20.5" r="2.2" />
                {/* detail notch on head */}
                <rect x="8" y="3.2" width="8" height="0.7" rx="0.35" opacity="0.12" />
              </g>
            </svg>

          </label>


          {!user ? (
            <>
              <Link
                href="/login"
                className="text-md font-medium border-2 py-2 px-4 rounded-md border-primary text-primary hover:text-white hover:bg-primary transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-primary border-2 border-primary hover:bg-white hover:text-primary text-white px-4 py-2 rounded-md text-md font-medium transition-colors shadow-sm"
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuOpen(!userMenuOpen);
                }}
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  {user?.avatar ? (
                    <UserIcon className="w-5 h-5 " />
                  ) : (
                    <UserIcon className="w-5 h-5 " />
                  )}
                </div>
                <span className="text-lg font-medium ">
                  {user.name}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${userMenuOpen ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium ">{user.name}</p>
                    <p className="text-xs  truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm  hover:bg-gray-50"
                  >
                    Profile
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm  hover:bg-gray-50"
                    onClick={() => {
                      setUser(null); // logout
                      setUserMenuOpen(false);
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
