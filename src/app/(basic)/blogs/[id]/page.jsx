"use client";
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import axios from "axios";
import {Calendar, Heart, Eye} from "lucide-react";

export default function BlogDetailsPage() {
  const {id} = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blogs/${id}`);
        setBlog(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-base-100">
        <span className="loading loading-bars loading-xl text-orange-500"></span>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="py-16 text-center">
        <p>Blog not found.</p>
      </div>
    );
  }

  return (
    <section className="py-16 text-text">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-urbanist">
          {blog.title}
        </h1>

        {/* Category, Likes & Views */}
        <div className="flex items-center gap-4 mb-6 text-text/70 text-sm">
          <span className="px-3 py-1 rounded-full bg-primary text-white font-semibold uppercase">
            {blog.category}
          </span>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" /> {blog.likes || 0}
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" /> {blog.views || 0}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> {blog.date}
          </div>
        </div>

        {/* Image */}
        {blog.image && (
          <div className="mb-6">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        )}

        {/* Excerpt / Content */}
        <p className="text-lg text-text/80 leading-relaxed">{blog.description}</p>
      </div>
    </section>
  );
}
