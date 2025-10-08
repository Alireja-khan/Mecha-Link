"use client";

import useUser from "@/hooks/useUser";
import { User as UserIcon, ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaGear } from "react-icons/fa6";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import ToggleTheme from "../shared/ToggleTheme";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [theme, setTheme] = useState("light");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user: loggedInUser, status } = useUser();

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
    const handleScroll = () => setScrolled(window.scrollY > 0);
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
    { href: "/serviceReq", label: "Service Requests" },
    { href: "/about", label: "About" },
  ];

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${scrolled
          ? "bg-base-100/95 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent backdrop-blur-sm py-4"
        }`}
    >
      <div className="container mx-auto px-2 md:px-3 flex justify-between items-center text-base-content">
        {/* Logo */}
        <Link href="/" className="z-50">
          <button className="flex gap-2 lg:gap-3 items-center cursor-pointer">
            <FaGear
              className={`h-6 w-6 lg:h-12 lg:w-12 transition-transform duration-500 ${rotating && (drawerOpen ? "-rotate-90" : "rotate-90")
                } text-primary`}
            />
            <h1 className="text-2xl lg:text-3xl font-bold">
              Mecha<span className="text-primary">Link</span>
            </h1>
          </button>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-3 lg:space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative text-base lg:text-lg font-medium transition-colors hover:text-primary ${pathname === item.href ? "text-primary" : ""
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <ToggleTheme />
            </div>

            {status === "loading" && !loggedInUser ? (
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
                  <div className="flex items-center space-x-1">
                    <div className="w-9 h-9 rounded-full bg-base-300 overflow-hidden flex items-center justify-center">
                      {loggedInUser?.profileImage ? (
                        <img
                          src={loggedInUser.profileImage}
                          alt={loggedInUser.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-5 h-5 text-base-content/70" />
                      )}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${userMenuOpen ? "rotate-180" : ""
                        }`}
                    />
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-base-100 text-base-content rounded-md shadow-lg py-1 z-50 border border-base-300">
                    <div className="px-4 py-2 border-b border-base-300">
                      <p className="text-sm font-medium">{loggedInUser?.name}</p>
                      <p className="text-xs truncate opacity-80">
                        {loggedInUser?.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-base-200"
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
                      className="block px-4 py-2 text-sm hover:bg-base-200"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <div className="border-t border-base-300 my-1"></div>
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2 text-sm hover:bg-base-200"
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
                  className="text-md font-medium border-2 py-1 px-3 rounded-md border-primary text-primary hover:bg-primary hover:text-primary-content transition-colors lg:mr-2"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="hidden lg:flex bg-primary border-2 border-primary hover:bg-base-100 hover:text-primary text-primary-content px-3 py-1 rounded-md text-md font-medium transition-colors shadow-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <ToggleTheme />
          </div>

          <div className="lg:hidden text-primary" onClick={handleGearClick}>
            {drawerOpen ? (
              <AiOutlineMenuFold size={40} />
            ) : (
              <AiOutlineMenuUnfold size={40} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed lg:hidden top-0 left-0 h-full w-64 transform transition-transform duration-500 z-40 ${drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="relative p-4 top-14 left-0 bg-base-200 text-base-content border-r border-base-300">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-2 py-2 rounded hover:bg-base-300 ${pathname === item.href
                      ? "text-primary font-semibold"
                      : ""
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