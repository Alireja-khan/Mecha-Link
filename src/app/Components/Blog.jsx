"use client";

import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const blogPosts = [
  {
    title: "Top 5 Car Maintenance Tips Every Driver Should Know",
    excerpt:
      "Keep your vehicle in top shape with these essential maintenance tips to improve safety and extend your car's lifespan.",
    author: "Alex Johnson",
    date: "Sep 10, 2024",
    readTime: "4 min read",
    category: "Maintenance",
    image: "https://i.ibb.co.com/B7gB3mt/pexels-lumierestudiomx-4116224.jpg",
    userImage: "https://i.pravatar.cc/150?img=11",
  },
  {
    title: "Why Regular Oil Changes are Crucial for Your Engine",
    excerpt:
      "Learn how timely oil changes keep your engine healthy, prevent breakdowns, and save money on costly repairs.",
    author: "Sophia Lee",
    date: "Sep 5, 2024",
    readTime: "5 min read",
    category: "Engine Care",
    image: "https://i.ibb.co.com/YTJ22bVk/pexels-19x14-8478268.jpg",
    userImage: "https://i.pravatar.cc/150?img=12",
  },
  {
    title: "How to Detect Common Brake Issues Early",
    excerpt:
      "Brakes are vital for your safety. Here's how to identify warning signs of brake problems before they get worse.",
    author: "Michael Brown",
    date: "Aug 28, 2024",
    readTime: "6 min read",
    category: "Safety",
    image: "https://i.ibb.co.com/r2WjqH8T/pexels-cottonbro-4489794-1.jpg",
    userImage: "https://i.pravatar.cc/150?img=13",
  },
  {
    title: "Benefits of Choosing Certified Mechanics for Your Car",
    excerpt:
      "Understand why certified mechanics provide reliable services, better diagnosis, and long-term vehicle performance.",
    author: "Emma Wilson",
    date: "Aug 20, 2024",
    readTime: "7 min read",
    category: "Expert Tips",
    image: "https://i.ibb.co.com/q3cwLVgR/pexels-gustavo-fring-6870300.jpg",
    userImage: "https://i.pravatar.cc/150?img=14",
  },
  {
    title: "How Smart Tools are Changing Vehicle Diagnostics",
    excerpt:
      "Explore how AI-powered tools and smart diagnostics are transforming the auto repair industry for better accuracy.",
    author: "Daniel Green",
    date: "Aug 15, 2024",
    readTime: "6 min read",
    category: "Technology",
    image:
      "https://i.ibb.co.com/QjXqMhQ4/pexels-daniel-andraski-197681005-13065690.jpg",
    userImage: "https://i.pravatar.cc/150?img=15",
  },
  {
    title: "When Should You Replace Your Car Battery?",
    excerpt:
      "Learn the signs of a weak battery and when it's the right time to replace it to avoid unexpected breakdowns.",
    author: "Olivia Martinez",
    date: "Aug 5, 2024",
    readTime: "5 min read",
    category: "Battery Care",
    image: "https://i.ibb.co.com/1tgq5y0c/pexels-maltelu-2244746-1.jpg",
    userImage: "https://i.pravatar.cc/150?img=16",
  },
];

const BlogSection = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Blog Card Skeleton
  const BlogCardSkeleton = () => (
    <div className="flex flex-col rounded-xl overflow-hidden shadow-md animate-pulse">
      {/* Image Skeleton */}
      <div className="skeleton bg-gray-200 w-full h-48"></div>
      
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          {/* Category and Read Time Skeleton */}
          <div className="flex items-center justify-between mb-3">
            <div className="skeleton bg-gray-200 h-6 w-20 rounded-full"></div>
            <div className="skeleton bg-gray-200 h-4 w-16 rounded"></div>
          </div>
          
          {/* Title Skeleton */}
          <div className="skeleton bg-gray-200 h-7 w-full rounded mb-3"></div>
          <div className="skeleton bg-gray-200 h-7 w-4/5 rounded mb-4"></div>
          
          {/* Excerpt Skeleton */}
          <div className="space-y-2">
            <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
            <div className="skeleton bg-gray-200 h-4 w-5/6 rounded"></div>
            <div className="skeleton bg-gray-200 h-4 w-3/4 rounded"></div>
          </div>
        </div>
        
        {/* Author Skeleton */}
        <div className="mt-6 flex items-center">
          <div className="skeleton bg-gray-200 w-10 h-10 rounded-full mr-3"></div>
          <div className="space-y-2">
            <div className="skeleton bg-gray-200 h-4 w-24 rounded"></div>
            <div className="skeleton bg-gray-200 h-3 w-20 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Section Header Skeleton
  const SectionHeaderSkeleton = () => (
    <div className="text-center mb-12 animate-pulse">
      <div className="skeleton bg-gray-300 h-12 w-80 mx-auto rounded-lg mb-4"></div>
      <div className="skeleton bg-gray-300 h-5 w-96 mx-auto rounded"></div>
    </div>
  );

  if (loading) {
    return (
      <section className="py-16 text-text">
        <div className="container mx-auto px-4">
          <SectionHeaderSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 text-text">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-urbanist">
            MechaLink{" "}
            <span className="text-primary inline-block">Insights</span>
          </h2>
          <p className="text-xl text-text/70 max-w-2xl mx-auto font-poppins">
            Explore expert advice, tips, and the latest updates to keep your
            vehicle running smoothly.
          </p>
        </div>

        {/* Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className="group flex flex-col rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              {post.image && (
                <div className="flex-shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase px-3 py-1 rounded-full bg-primary text-white">
                      {post.category}
                    </span>
                    <div className="flex items-center text-text/70 text-sm">
                      <Clock className="w-4 h-4 mr-1" /> {post.readTime}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold font-urbanist group-hover:text-primary transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-sm text-text/70 mt-3">{post.excerpt}</p>
                </div>
                <div className="mt-6 flex items-center text-sm md:text-base text-text/70">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-secondary/20 text-secondary overflow-hidden">
                    <Image
                      src={post.userImage}
                      alt="user"
                      width={50}
                      height={50}
                    ></Image>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium font-urbanist">{post.author}</p>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-xs">{post.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;