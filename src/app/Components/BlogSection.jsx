"use client";

import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';

const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const BlogSection = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/blogs");

        if (Array.isArray(res.data)) {
          // Take the first 6 posts to display on this section
          setBlogs(res.data.slice(0, 3));
        } else {
          console.error("API response is not an array:", res.data);
          setBlogs([]);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleShowAllClick = () => {
    router.push('/blogs');
  };

  const handleViewDetailClick = (id) => {
    router.push(`/blogs/${id}`);
  };

  const BlogCardSkeleton = () => (
    <div className="flex flex-col rounded-xl overflow-hidden shadow-md animate-pulse">
      <div className="skeleton bg-gray-200 w-full h-48"></div>

      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="skeleton bg-gray-200 h-6 w-20 rounded-full"></div>
            <div className="skeleton bg-gray-200 h-4 w-16 rounded"></div>
          </div>

          <div className="skeleton bg-gray-200 h-7 w-full rounded mb-3"></div>
          <div className="skeleton bg-gray-200 h-7 w-4/5 rounded mb-4"></div>

          <div className="space-y-2">
            <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
            <div className="skeleton bg-gray-200 h-4 w-5/6 rounded"></div>
            <div className="skeleton bg-gray-200 h-4 w-3/4 rounded"></div>
          </div>
        </div>

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

  const SectionHeaderSkeleton = () => (
    <div className="text-center mb-12 animate-pulse">
      <div className="skeleton bg-gray-300 h-12 w-80 mx-auto rounded-lg mb-4"></div>
      <div className="skeleton bg-gray-300 h-5 w-96 mx-auto rounded"></div>
    </div>
  );

  if (loading) {
    const skeletonCount = 3;
    return (
      <section className="py-16 text-text">
        <div className="lg:container mx-auto px-4">
          <SectionHeaderSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(skeletonCount)].map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0 && !loading) {
    return (
      <section className="py-16 text-text">
        <div className="lg:container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-red-500 mb-4">
            No Blog Posts Found
          </h2>
          <p className="text-xl text-text/70">
            We were unable to load any blog posts at this time.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 text-text">
      <div className="lg:container mx-auto px-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post, index) => (
            <div
              key={index}
              className="group flex flex-col rounded-xl overflow-hidden bg-base-200 p-3 shadow-md hover:shadow-xl transition-shadow duration-300 border border-neutral"
            >
              {post.image && (
                <div
                  className="flex-shrink-0 cursor-pointer rounded-lg overflow-hidden"
                  onClick={() => handleViewDetailClick(post._id)}
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover aspect-[6/4] group-hover:scale-105 rounded-lg  transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-3 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase px-3 py-1 rounded-full bg-primary text-white">
                      {post.category}
                    </span>
                   
                  </div>
                  {/* Title and Excerpt are clickable */}
                  <div
                    className="cursor-pointer"
                    onClick={() => handleViewDetailClick(post._id)}
                  >
                    <h3 className="text-2xl font-bold font-urbanist group-hover:text-primary transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-sm text-text/70 mt-3">{post.excerpt}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-sm md:text-base text-text/70">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-secondary/20 text-secondary overflow-hidden">
                      {post.userImage ? (
                        <Image
                          src={post.userImage}
                          alt={post.author}
                          width={50}
                          height={50}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary/30 text-secondary font-semibold text-sm">
                          {post.author ? post.author.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium font-urbanist">{post.author}</p>
                      <div className="flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-xs">{post.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* View Detail Button */}
                  <button
                    onClick={() => handleViewDetailClick(post._id)}
                    className="ml-4 px-4 py-2 text-xs font-semibold text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition duration-200 whitespace-nowrap"
                  >
                    View Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {blogs.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={handleShowAllClick}
              className="px-8 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition duration-300 shadow-lg"
            >
              Show All Blogs
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;