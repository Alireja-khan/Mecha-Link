"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useUser from '@/hooks/useUser';
import { Search, Filter, Image as ImageIcon } from 'lucide-react';
import MarkdownEditor from "@/app/components/MarkdownEditor";
import PostCard from "@/app/components/PostCard";
import { CATEGORIES } from "@/lib/forumConstants";

export default function ForumPage() {
    const { data: session, status } = useSession();
    const { user: currentUser, isLoading: userLoading } = useUser();
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState("");
    const [showPostForm, setShowPostForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    // Fetch posts with filters
    const fetchPosts = async () => {
        try {
            let url = "/api/forum";
            const params = new URLSearchParams();
            
            if (searchQuery) params.append("search", searchQuery);
            if (selectedCategory !== "all") params.append("category", selectedCategory);
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchPosts();
        }
    }, [status, searchQuery, selectedCategory]);

    // Create new post
    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostContent.trim() || !currentUser) return;

        try {
            const res = await fetch("/api/forum", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: newPostContent,
                    authorId: currentUser._id,
                    authorName: currentUser.name,
                    authorRole: currentUser.role,
                    authorImage: currentUser.profileImage,
                    category: selectedCategory !== "all" ? selectedCategory : "general",
                }),
            });

            const data = await res.json();
            if (data.success) {
                setNewPostContent("");
                setShowPostForm(false);
                setSelectedCategory("all");
                fetchPosts();
            }
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    if (status === "loading" || loading || userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
                    <button
                        onClick={() => setShowPostForm(!showPostForm)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <ImageIcon size={20} />
                        New Post
                    </button>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        
                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Filter size={20} />
                            Filters
                        </button>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedCategory("all")}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        selectedCategory === "all" 
                                        ? "bg-blue-600 text-white" 
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                >
                                    All Categories
                                </button>
                                {CATEGORIES.map((category) => (
                                    <button
                                        key={category.value}
                                        onClick={() => setSelectedCategory(category.value)}
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            selectedCategory === category.value 
                                            ? "bg-blue-600 text-white" 
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Create Post Form */}
                {showPostForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
                        <form onSubmit={handleCreatePost}>
                            {/* Category Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">Select a category</option>
                                    {CATEGORIES.map((category) => (
                                        <option key={category.value} value={category.value}>
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Markdown Editor */}
                            <div className="mb-4">
                                <MarkdownEditor
                                    value={newPostContent}
                                    onChange={setNewPostContent}
                                    placeholder="Share your thoughts, questions, or tips..."
                                />
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPostForm(false);
                                        setNewPostContent("");
                                        setSelectedCategory("all");
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Post
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Posts List */}
                <div className="space-y-6">
                    {posts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No posts found. Be the first to share!</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <PostCard 
                                key={post._id}
                                post={post}
                                onUpdate={fetchPosts}
                                currentUser={currentUser}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}