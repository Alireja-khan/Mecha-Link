"use client";

import useUser from "@/hooks/useUser";
import { User as UserIcon, ChevronDown, Menu, X, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaGear } from "react-icons/fa6";
import ToggleTheme from "../shared/ToggleTheme";
import CartIcon from "../shared/cartIcon";

const MobileDrawerBackdrop = ({ isOpen, onClick }) => {
  return (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-[9999] lg:hidden ${isOpen ? "block" : "hidden"}`}
      onClick={onClick}
    />
  );
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user: loggedInUser, status } = useUser();
  const [drawerOpen, setDrawerOpen] = useState(false);


  // Effect to handle sticky header scroll state
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Effect to handle clicking outside the user dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Effect to prevent body scrolling when the drawer is open
  useEffect(() => {
    if (drawerOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [drawerOpen]);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const navigation = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Mechanic Shops" },
    { href: "/serviceReq", label: "Service Requests" },
    { href: "/about", label: "About" },
    { href: "/forum", label: "Forum" },
    { href: "/market", label: "Market"}
  ];

  const dashboardLink =
    loggedInUser?.role === "admin"
      ? "/dashboard/admin"
      : loggedInUser?.role === "mechanic"
        ? "/dashboard/mechanic"
        : "/dashboard/user";

  return (
    <>
      <header
        className={`sticky top-0 w-full z-50 transition-all duration-300 ${scrolled
          ? "bg-base-100 backdrop-blur-sm shadow-md py-3"
          : "bg-transparent backdrop-blur-sm py-4"
          }`}
      >
        <div className="xl:container mx-auto px-6 flex justify-between items-center text-base-content">
          <Link href="/" className="z-[9999]">
            <button className="flex gap-2 items-center cursor-pointer">
              <FaGear
                className={`h-8 w-8 transition-transform duration-500 text-primary ${scrolled ? "h-6 w-6" : ""
                  }`}
              />
              <h1 className="text-2xl font-extrabold tracking-tight">
                Mecha<span className="text-primary">Link</span>
              </h1>
            </button>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-base font-medium transition-colors hover:text-primary ${pathname === item.href
                  ? "text-primary"
                  : "text-base-content/80 hover:text-primary"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex gap-4 items-center">
            <CartIcon />
            {/* Desktop/Tablet Theme Toggle */}
            <div className="hidden md:block">
              <ToggleTheme />
            </div>

            <div className="flex items-center gap-3">
              {status === "loading" && (
                <span className="loading loading-spinner loading-xs"></span>
              )}
              {status === "authenticated" && !loggedInUser && (
                <span className="loading loading-spinner loading-xs"></span>
              )}

              {/* Logged-in User Dropdown (Desktop Only) */}
              {loggedInUser && (
                <div className="relative hidden lg:block" ref={dropdownRef}>
                  <button
                    className="flex items-center space-x-1 p-1 rounded-full hover:bg-base-200 transition-colors focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserMenuOpen(!userMenuOpen);
                    }}
                  >
                    <div className="w-9 h-9 rounded-full bg-base-300 overflow-hidden flex items-center justify-center border-2 border-primary">
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
                      className={`w-4 h-4 transition-transform duration-300 text-primary ${userMenuOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-base-100 text-base-content rounded-lg shadow-xl py-1 z-[9999] border border-base-300 transform origin-top-right animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-3 border-b border-base-300">
                        <p className="text-sm font-semibold truncate">
                          {loggedInUser?.name}
                        </p>
                        <p className="text-xs truncate opacity-70">
                          {loggedInUser?.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm hover:bg-base-200 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                            <Settings className="w-4 h-4 opacity-70" />
                            <span>Profile</span>
                        </div>
                      </Link>
                      <Link
                        href={dashboardLink}
                        className="block px-4 py-2 text-sm hover:bg-base-200 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 opacity-70" />
                            <span>Dashboard</span>
                        </div>
                      </Link>
                      <div className="border-t border-base-300 my-1"></div>
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 text-sm text-error font-medium hover:bg-base-200 transition-colors flex items-center gap-2"
                        onClick={() => {
                          signOut();
                          setUserMenuOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Auth Links (Desktop/Tablet) */}
              {status === "unauthenticated" && (
                <>
                  <Link
                    href="/login"
                    className="text-md font-medium border-2 py-1 px-3 rounded-lg border-primary text-primary hover:bg-primary hover:text-primary-content transition-colors hidden sm:block"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="bg-primary border-2 border-primary hover:bg-base-100 hover:text-primary text-primary-content px-3 py-1 rounded-lg text-md font-medium transition-colors shadow-sm hidden lg:flex"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Theme Toggle */}
            <div className="md:hidden">
              <ToggleTheme />
            </div>

            {/* Mobile Drawer Toggle Button */}
            <button
              className="lg:hidden text-primary p-2 transition-colors hover:bg-base-200 rounded-lg"
              onClick={handleDrawerToggle}
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
            >
              {drawerOpen ? (
                <X size={32} className="text-error" />
              ) : (
                <Menu size={32} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      <MobileDrawerBackdrop isOpen={drawerOpen} onClick={() => setDrawerOpen(false)} />

      {/* Mobile Drawer Content */}
      <div
        className={`fixed lg:hidden top-0 left-0 h-screen w-64 z-[9999] transform transition-transform duration-300 bg-base-100 shadow-2xl flex flex-col justify-between ${drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-4 overflow-y-auto">
          {/* Logo in Drawer */}
          <div className="border-b mb-4 border-base-300 flex justify-between items-center">
            <Link href="/" className="z-[9999]">
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex gap-2 mb-3 items-center cursor-pointer"
              >
                <FaGear
                  className={`h-7 w-7 transition-transform duration-500 text-primary ${scrolled ? "h-6 w-6" : ""
                    }`}
                />
                <h1 className="text-2xl font-extrabold tracking-tight">
                  Mecha<span className="text-primary">Link</span>
                </h1>
              </button>
            </Link>
          </div>

          {/* Drawer Navigation Links */}
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-4 py-3 text-base rounded-lg transition-colors ${pathname === item.href
                    ? "bg-primary text-primary-content font-bold shadow-md"
                    : "hover:bg-base-200"
                    }`}
                  onClick={() => setDrawerOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth Links (Mobile) */}
          {status === "unauthenticated" && (
            <div className="mt-6 space-y-3 border-t pt-4 border-base-300">
              <Link
                href="/login"
                className="block w-full text-center py-2 px-4 rounded-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-content transition-colors"
                onClick={() => setDrawerOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="block w-full text-center bg-primary border-2 border-primary hover:bg-base-100 hover:text-primary text-primary-content py-2 px-4 rounded-lg font-semibold transition-colors shadow-sm"
                onClick={() => setDrawerOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Logged-in User Info & Controls (Mobile Drawer Footer) */}
        {loggedInUser && (
          <div className="border-t border-base-300 p-4 bg-base-200/50">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-base-300 overflow-hidden flex items-center justify-center border-2 border-primary">
                  {loggedInUser?.profileImage ? (
                    <img
                      src={loggedInUser.profileImage}
                      alt={loggedInUser.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-6 h-6 text-base-content/70" />
                  )}
                </div>
                <div>
                  <p className="text-base font-semibold truncate">
                    {loggedInUser?.name}
                  </p>
                  <p className="text-xs opacity-70 truncate">
                    {loggedInUser?.email}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-3 text-base rounded-lg hover:bg-base-200 transition-colors"
                  onClick={() => setDrawerOpen(false)}
                >
                  <Settings className="w-5 h-5 opacity-70" />
                  <span>Profile</span>
                </Link>
                <Link
                  href={dashboardLink}
                  className="flex items-center gap-2 px-4 py-3 text-base rounded-lg hover:bg-base-200 transition-colors"
                  onClick={() => setDrawerOpen(false)}
                >
                  <UserIcon className="w-5 h-5 opacity-70" />
                  <span>Dashboard</span>
                </Link>

              </div>
            </div>
            <div className="border-t border-neutral pt-1 mt-1">
              <button
                type="button"
                className="flex items-center gap-2 w-full text-left px-4 py-3 text-base rounded-lg text-error font-medium hover:bg-base-200 transition-colors"
                onClick={() => {
                  signOut();
                  setDrawerOpen(false);
                }}
              >
                <LogOut className="w-5 h-5" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}