import { Calendar, User, Clock } from "lucide-react";
import Image from "next/image";

const blogPosts = [
    {
        title: "The Future of Web Development: Trends to Watch in 2024",
        excerpt:
            "Explore the latest trends shaping the web development landscape, from AI integration to progressive web apps and beyond.",
        author: "Sarah Chen",
        date: "Mar 15, 2024",
        readTime: "5 min read",
        category: "Technology",
        image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&q=80&w=2940&auto=format&fit=crop",
        userImage: "https://i.pravatar.cc/150?img=1",
    },
    {
        title: "Building Scalable React Applications with Modern Architecture",
        excerpt:
            "Learn how to structure React applications for maximum scalability and maintainability using the latest architectural patterns.",
        author: "Mike Rodriguez",
        date: "Mar 12, 2024",
        readTime: "8 min read",
        category: "Development",
        image: "https://images.unsplash.com/photo-1593720216508-3075c3f912a7?ixlib=rb-4.0.3&q=80&w=2940&auto=format&fit=crop",
        userImage: "https://i.pravatar.cc/150?img=2",
    },
    {
        title: "Mastering CSS Grid: A Complete Guide for Modern Layouts",
        excerpt:
            "Discover the power of CSS Grid and how it revolutionizes the way we create complex, responsive web layouts.",
        author: "Emma Thompson",
        date: "Mar 10, 2024",
        readTime: "6 min read",
        category: "CSS",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&q=80&w=2940&auto=format&fit=crop",
        userImage: "https://i.pravatar.cc/150?img=3",
    },
    {
        title: "Performance Optimization Strategies for Web Applications",
        excerpt:
            "Comprehensive guide to optimizing your web applications for speed, covering everything from bundling to caching strategies.",
        author: "David Kim",
        date: "Mar 8, 2024",
        readTime: "7 min read",
        category: "Performance",
        image: "https://images.unsplash.com/photo-1579403159955-442b0059b56f?ixlib=rb-4.0.3&q=80&w=2940&auto=format&fit=crop",
        userImage: "https://i.pravatar.cc/150?img=4",
    },
    {
        title: "Introduction to TypeScript: Strongly Typed JavaScript",
        excerpt:
            "Learn how TypeScript can help you write more maintainable and error-free JavaScript applications with ease.",
        author: "Linda Park",
        date: "Mar 5, 2024",
        readTime: "6 min read",
        category: "TypeScript",
        image: "https://images.unsplash.com/photo-1627398242436-d748ad0a72c1?ixlib=rb-4.0.3&q=80&w=2940&auto=format&fit=crop",
        userImage: "https://i.pravatar.cc/150?img=5",
    },
    {
        title: "Accessibility in Web Design: Best Practices",
        excerpt:
            "Understand the key principles of accessible web design and how to make your websites usable for everyone.",
        author: "James Wilson",
        date: "Mar 2, 2024",
        readTime: "5 min read",
        category: "Design",
        image: "https://images.unsplash.com/photo-1559128010-7c1ad6e6bdf8?ixlib=rb-4.0.3&q=80&w=2942&auto=format&fit=crop",
        userImage: "https://i.pravatar.cc/150?img=6",
    },
];

const BlogSection = () => {
    return (
        <section className="py-16 bg-background text-text">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 font-urbanist">
                        Latest <span className="text-primary inline-block">Articles</span>
                    </h2>
                    <p className="text-xl text-text/70 max-w-2xl mx-auto font-poppins">
                        Explore our latest insights, tutorials, and deep dives into web development.
                    </p>
                </div>

                {/* Blog Posts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post, index) => (
                        <div
                            key={index}
                            className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer"
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
                                        <Image src={post.userImage} alt="user" width={50} height={50}></Image>
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
