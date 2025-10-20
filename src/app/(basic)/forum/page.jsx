"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useUser from '@/hooks/useUser';
import { Search, Filter, Image as ImageIcon, MessageSquare, Users, TrendingUp } from 'lucide-react';
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
    const [uploadedImages, setUploadedImages] = useState([]);

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

    // Modify the post submission to include images
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
                    images: uploadedImages, // Send ALL uploaded images
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
                setUploadedImages([]); // Clear uploaded images
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
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-bars loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Create Post Button - Facebook Style */}
                <div className="bg-base-100 rounded-2xl p-4 border border-neutral/50 shadow-sm mb-6">
                    <div className="flex items-center gap-4">
                        {/* User Avatar */}
                        <div className="flex-shrink-0">
                            {currentUser?.profileImage ? (
                                <img
                                    src={currentUser.profileImage}
                                    alt={currentUser.name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                                    {currentUser?.name?.charAt(0) || "U"}
                                </div>
                            )}
                        </div>
                        
                        {/* Create Post Input */}
                        <button
                            onClick={() => setShowPostForm(true)}
                            className="flex-1 text-left p-3 bg-base-200 rounded-full border border-neutral/30 hover:bg-base-300 transition-colors duration-200 text-base-content/60"
                        >
                            What's on your mind, {currentUser?.name?.split(' ')[0]}?
                        </button>
                    </div>
                </div>

                {/* Create Post Form */}
                {showPostForm && (
                    <div className="bg-base-100 rounded-2xl border border-neutral/50 shadow-lg mb-6">
                        <div className="p-4 border-b border-neutral/30">
                            <h2 className="text-xl font-bold text-base-content text-center">Create Post</h2>
                        </div>
                        <form onSubmit={handleCreatePost} className="p-4">
                            {/* User Info */}
                            <div className="flex items-center gap-3 mb-4">
                                {currentUser?.profileImage ? (
                                    <img
                                        src={currentUser.profileImage}
                                        alt={currentUser.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                                        {currentUser?.name?.charAt(0) || "U"}
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-base-content text-sm">{currentUser?.name}</p>
                                </div>
                            </div>

                            {/* Markdown Editor */}
                            <div className="mb-4">
                                <MarkdownEditor
                                    value={newPostContent}
                                    onChange={setNewPostContent}
                                    placeholder="What's on your mind?"
                                    onImagesChange={setUploadedImages}
                                />
                            </div>

                            {/* Image Preview */}
                            {/* {uploadedImages.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-2">Uploaded Images:</p>
                                    <div className="flex gap-2">
                                        {uploadedImages.map((image, index) => (
                                            <div key={index} className="relative">
                                                <img 
                                                    src={image} 
                                                    alt="Uploaded" 
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )} */}

                            {/* Category Selection */}
                            <div className="mb-4">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full p-3 border border-neutral/30 rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-primary/50 focus:outline-none text-base-content text-sm"
                                >
                                    <option value="all">Add Category</option>
                                    {CATEGORIES.map((category) => (
                                        <option key={category.value} value={category.value}>
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-4 border-t border-neutral/30">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPostForm(false);
                                        setNewPostContent("");
                                        setUploadedImages([]);
                                        setSelectedCategory("all");
                                    }}
                                    className="px-6 py-2 bg-base-200 text-base-content rounded-lg font-medium hover:bg-base-300 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-primary text-primary-content px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200"
                                    disabled={!newPostContent.trim()}
                                >
                                    Post
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Posts List */}
                <div className="space-y-4">
                    {posts.length === 0 ? (
                        <div className="bg-base-100 rounded-2xl p-8 text-center border border-neutral/50 shadow-sm">
                            <MessageSquare size={32} className="mx-auto text-base-content/30 mb-3" />
                            <p className="text-base-content/60 text-sm">No posts yet</p>
                            <p className="text-base-content/40 text-xs mt-1">Be the first to share something!</p>
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