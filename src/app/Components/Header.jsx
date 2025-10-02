"use client";

import useUser from "@/hooks/useUser";
import { User as UserIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaGear } from "react-icons/fa6";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [theme, setTheme] = useState("light");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user: loggedInUser, status } = useUser();

  console.log(loggedInUser, status);
  // drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rotating, setRotating] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // gear toggle handler
  const handleGearClick = () => {
    if (rotating) return;
    setRotating(true);
    setTimeout(() => {
      setRotating(false);
      setDrawerOpen(!drawerOpen);
    }, 600);
  };

  const navigation = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Mechanic Shops" },
    { href: "/serviceReq", label: "Service requests" },
    { href: "/about", label: "About" },
  ];

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? theme === "dark"
            ? "bg-[#343434]/95 backdrop-blur-md shadow-sm py-2"
            : "bg-white/95 backdrop-blur-md shadow-sm py-2"
          : theme === "dark"
          ? "bg-[#343434]/90 backdrop-blur-sm py-4"
          : "bg-white/90 backdrop-blur-sm py-4"
      }`}
    >
      <div className="container mx-auto px-2 md:px-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="z-50">
          <button className="flex gap-2 lg:gap-3 items-center cursor-pointer">
            <FaGear
              className={`h-6 w-6 lg:h-12 lg:w-12 transition-transform duration-500 ${
                rotating && (drawerOpen ? "-rotate-90" : "rotate-90")
              }`}
            />
            <h1 className="text-2xl lg:text-3xl font-bold">
              Mecha<span className="text-primary">Link</span>
            </h1>
          </button>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative text-base lg:text-lg font-medium transition-colors hover:text-primary ${
                pathname === item.href ? "text-primary" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex gap-2 items-center">
        <div className="flex items-center">
          {/* Theme Switch */}
          <label className="swap swap-rotate absolute top-25 right-0 p-3 bg-primary rounded-l-2xl">
            <input
              type="checkbox"
              className="theme-controller"
              onChange={() => setTheme(theme === "light" ? "dark" : "light")}
              checked={theme === "dark"}
            />

            <svg
              className="swap-off h-8 w-8 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              role="img"
              aria-label="gear icon (light mode)"
            >
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
              className="swap-on h-8 w-8 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              role="img"
              aria-label="piston icon (dark mode)"
            >
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

          {
            status === "loading" && !loggedInUser ? (
              <span className="loading loading-spinner loading-xs"></span>

            ) : status === "authenticated" && !loggedInUser ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : loggedInUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuOpen(!userMenuOpen);
                }}
              >
                <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  {loggedInUser?.profileImage ? (
                    <img
                      src={loggedInUser.profileImage}
                      alt={loggedInUser.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    userMenuOpen ? "rotate-180" : ""
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

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-1 z-50 border border-gray-100">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium">{loggedInUser?.name}</p>
                    <p className="text-xs truncate">{loggedInUser?.email}</p>
                  </div>
                  <Link
                    href={`dashboard/${loggedInUser?.role}/profile`}
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href={
                      loggedInUser?.role === "admin"
                        ? "/dashboard/admin"
                        : loggedInUser?.role === "mechanic"
                        ? "/dashboard/mechanic"
                        : "/dashboard/user"
                    }
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    type="button"
                    className="cursor-pointer block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => {
                      signOut();
                      setUserMenuOpen(false);
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-md font-medium border-2 py-1 px-3 rounded-md border-primary text-primary hover:text-white hover:bg-primary transition-colors lg:mr-2"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="hidden lg:flex bg-primary border-2 border-primary hover:bg-white hover:text-primary text-white px-3 py-1 rounded-md text-md font-medium transition-colors shadow-sm"
              >
                Sign up
              </Link>
            </>
          )}
          
        </div>
        <div className="md:hidden" onClick={handleGearClick}>
          {
          drawerOpen ? <AiOutlineMenuFold size={40}/> : <AiOutlineMenuUnfold size={40}/>
        }
        </div>
        </div>
      </div>

      {/* Drawer */}
      <div
        className={`fixed md:hidden top-0 left-0 h-full w-64 transform transition-transform duration-500 z-40 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative p-4 top-14 left-0 bg-white">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-2 py-2 rounded hover:bg-gray-100 text-black ${
                    pathname === item.href ? "text-primary font-semibold" : ""
                  }`}
                  onClick={() => setDrawerOpen(false)} 
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
