"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Eye, Heart } from "lucide-react";
import Link from "next/link";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/api/blogs");
        // Take first 3 blogs as they come
        setBlogs(res.data.slice(0, 3));
      } catch (error) {
        console.error("❌ Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="py-16 text-center text-text">
        <p>Loading latest blogs...</p>
      </section>
    );
  }

  if (blogs.length === 0) {
    return (
      <section className="py-16 text-center text-text">
        <p>No blogs found.</p>
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

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post) => (
            <div
              key={post._id}
              className="group flex flex-col rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-base-100"
            >
              {/* Blog Image */}
              {post.image && (
                <div className="flex-shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Blog Content */}
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase px-3 py-1 rounded-full bg-primary text-white">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-4 text-text/70 text-sm">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" /> {post.likes || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" /> {post.views || 0}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold font-urbanist group-hover:text-primary transition-colors duration-300 truncate">
                    {post.title}
                  </h3>

                  <p className="text-sm text-text/70 mt-3">{post.description.slice(0,100)}</p>
                </div>

                <div className="mt-6 flex items-center justify-between text-sm md:text-base text-text/70">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-xs">{post.date}</span>
                  </div>

                  {/* View Details Button */}
                  <Link
                    href={`/blogs/${post._id}`}
                    className="text-primary font-semibold hover:underline"
                  >
                    View Details →
                  </Link>
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
