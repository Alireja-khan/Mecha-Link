import { Calendar, User, Clock, Star, Quote } from "lucide-react";

const BlogSection = () => {
    const blogPosts = [
        {
            title: "The Future of Web Development: Trends to Watch in 2024",
            excerpt:
                "Explore the latest trends shaping the web development landscape, from AI integration to progressive web apps and beyond.",
            author: "Sarah Chen",
            date: "Mar 15, 2024",
            readTime: "5 min read",
            category: "Technology",
            image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd0VIVwddC4GiDxFuphtCOSUzqOCsKjq-FxA&s",
        },
        {
            title: "Building Scalable React Applications with Modern Architecture",
            excerpt:
                "Learn how to structure React applications for maximum scalability and maintainability using the latest architectural patterns.",
            author: "Mike Rodriguez",
            date: "Mar 12, 2024",
            readTime: "8 min read",
            category: "Development",
            image: "/api/placeholder/400/300",
        },
        {
            title: "Mastering CSS Grid: A Complete Guide for Modern Layouts",
            excerpt:
                "Discover the power of CSS Grid and how it revolutionizes the way we create complex, responsive web layouts.",
            author: "Emma Thompson",
            date: "Mar 10, 2024",
            readTime: "6 min read",
            category: "CSS",
            image: "/api/placeholder/400/300",
        },
        {
            title: "Performance Optimization Strategies for Web Applications",
            excerpt:
                "Comprehensive guide to optimizing your web applications for speed, covering everything from bundling to caching strategies.",
            author: "David Kim",
            date: "Mar 8, 2024",
            readTime: "7 min read",
            category: "Performance",
            image: "/api/placeholder/400/300",
        },
    ];

    const reviews = [
        {
            name: "Alex Johnson",
            role: "Lead Developer",
            company: "TechCorp",
            review:
                "Incredible insights and practical examples. This blog has become my go-to resource for staying updated with the latest development trends.",
            rating: 3,
        },
        {
            name: "Maria Garcia",
            role: "Frontend Engineer",
            company: "StartupXYZ",
            review:
                "The tutorials are well-structured and easy to follow. I've learned so much about React and modern CSS techniques.",
            rating: 5,
        },
        {
            name: "James Wilson",
            role: "Full Stack Developer",
            company: "DevStudio",
            review:
                "Outstanding content quality. The performance optimization guide helped me improve my app's loading time by 40%.",
            rating: 4,
        },
        {
            name: "Lisa Park",
            role: "UI/UX Designer",
            company: "DesignLab",
            review:
                "Even as a designer, I find the technical articles accessible and valuable for understanding implementation details.",
            rating: 5,
        },
    ];

    return (
        <section className="py-16 min-h-screen font-roboto">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-roboto-con">
                        Latest{" "}
                        <span className="text-purple font-caveat inline-block">Insights</span>
                    </h1>
                    <p className="text-xl text-dark-purple/70 max-w-2xl mx-auto font-nunito-sans">
                        Discover the latest trends, tutorials, and insights in web development
                    </p>
                </div>

                {/* Main Layout */}
                <div className="space-y-8">
                    {/* Blog Posts */}
                    <div className="lg:col-span-2 space-y-8">
                        {blogPosts.map((post, index) => (
                            <div
                                key={index}
                                className="group flex flex-col md:flex-row bg-white border border-gray/50 rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                            >
                                {post.image && (
                                    <div className="md:w-1/3 flex-shrink-0">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}
                                <div className="md:w-2/3 px-8 py-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-semibold uppercase px-3 py-1 rounded-full bg-purple/80 text-white">
                                                {post.category}
                                            </span>
                                            <div className="flex items-center text-dark-purple/70 text-sm">
                                                <Clock className="w-4 h-4 mr-1" /> {post.readTime}
                                            </div>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold group-hover:text-dark-purple transition-colors duration-300">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm md:text-base text-dark-purple/70 mt-3">
                                            {post.excerpt}
                                        </p>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between text-sm md:text-base text-dark-purple/70">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gray rounded-full flex items-center justify-center mr-3">
                                                <User className="w-5 h-5 text-dark-purple" />
                                            </div>
                                            <p className="font-medium">{post.author}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2" /> {post.date}
                                        </div>
                                    </div>

                                    <button className="mt-6 self-start px-6 py-3 rounded-lg text-base font-semibold bg-purple text-white hover:bg-dark-purple transition-colors cursor-pointer">
                                        Read More
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Reviews */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                                {reviews.map((review, index) => (
                                    <div
                                        key={index}
                                        className="bg-white border border-gray/50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                    >
                                        <div className="px-6 pt-6 pb-3 flex items-start space-x-4">
                                            <div className="w-12 h-12 rounded-full bg-purple flex items-center justify-center font-semibold text-white text-lg">
                                                {review.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-dark-purple text-lg">
                                                    {review.name}
                                                </h4>
                                                <p className="text-sm text-dark-purple/70">
                                                    {review.role} at {review.company}
                                                </p>
                                                <div className="flex items-center mt-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            strokeWidth={2}
                                                            className={`w-5 h-5 ${i < review.rating
                                                                    ? "text-purple fill-[#55338A]"
                                                                    : "text-gray/70"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-6 pb-6 pt-0">
                                            <Quote className="w-5 h-5 text-purple mb-2" />
                                            <p className="text-sm md:text-base leading-relaxed text-dark-purple italic">
                                                {review.review}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
