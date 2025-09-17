"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import React, { useEffect, useState } from "react";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // Change after 50px scroll
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    
  ];
  return (
    <div
      className={`font-roboto fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/1 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="navbar container mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
            >
              <nav className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${
                      pathname === link.href
                        ? "border-b  border-b-[#030303]"
                        : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href={"/contact"} className="my-button px-2 py-1 my-1 md:hidden">Let's talk</Link>
              </nav>
              <div>
                <Image
                src={"/MechaLink-logo.png"}
                width={100}
                height={100}
                alt="MechaLink logo"
                />
              </div>
            </ul>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="flex gap-x-5 px-1">
            <nav className="flex gap-x-5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    pathname === link.href ? "border-b  border-b-[#000000]" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </ul>
        </div>
        <div className="navbar-end flex gap-x-2">
        </div>
      </div>
    </div>
  );
}

export default Header;
