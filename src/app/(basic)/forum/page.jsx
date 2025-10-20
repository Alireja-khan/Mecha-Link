"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useUser from '@/hooks/useUser';
import { Menu, X } from 'lucide-react';
import ForumSidebar from './ForumSidebar';
import ForumContent from './ForumContent';
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/forumConstants";

export default function ForumPage() {
    const { data: session, status } = useSession();
    const { user: currentUser, isLoading: userLoading } = useUser();
    const router = useRouter();
    
    // State management
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState("");
    const [showPostForm, setShowPostForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSort, setActiveSort] = useState("latest");
    const [stats, setStats] = useState({
        totalPosts: 0,
        totalComments: 0,
        activeUsers: 0,
        totalPages: 1,
        currentPage: 1
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        hasMore: true
    });

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    // Fetch posts with filters
    const fetchPosts = async (page = 1, append = false) => {
        try {
            if (!append) setLoading(true);
            
            let url = "/api/forum";
            const params = new URLSearchParams();
            
            if (searchQuery) params.append("search", searchQuery);
            if (selectedCategory !== "all") params.append("category", selectedCategory);
            if (activeSort) params.append("sort", activeSort);
            params.append("page", page);
            params.append("limit", pagination.limit);
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const res = await fetch(url);
            const data = await res.json();
            
            if (data.success) {
                if (append) {
                    setPosts(prev => [...prev, ...data.posts]);
                } else {
                    setPosts(data.posts);
                }
                
                // Update stats and pagination
                setStats(prev => ({
                    ...prev,
                    totalPosts: data.stats?.totalPosts || 0,
                    totalPages: data.stats?.totalPages || 1,
                    currentPage: data.stats?.currentPage || 1
                }));
                
                setPagination(prev => ({
                    ...prev,
                    page: data.stats?.currentPage || 1,
                    hasMore: data.stats?.hasNextPage || false
                }));
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate forum statistics from posts
    const calculateStats = (posts) => {
        const totalPosts = posts.length;
        const totalComments = posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);
        const uniqueAuthors = new Set(posts.map(post => post.authorId)).size;
        const totalLikes = posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
        
        setStats(prev => ({
            ...prev,
            totalPosts,
            totalComments,
            activeUsers: uniqueAuthors,
            totalLikes
        }));
    };

    // Fetch posts on component mount and when filters change
    useEffect(() => {
        if (status === "authenticated") {
            fetchPosts(1, false);
        }
    }, [status, searchQuery, selectedCategory, activeSort]);

    // Update stats when posts change
    useEffect(() => {
        calculateStats(posts);
    }, [posts]);

    // Handle post creation
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
                    images: uploadedImages,
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
                setUploadedImages([]);
                setShowPostForm(false);
                setSelectedCategory("all");
                fetchPosts(1, false); // Refresh posts
            }
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    // Load more posts
    const loadMorePosts = () => {
        if (pagination.hasMore && !loading) {
            fetchPosts(pagination.page + 1, true);
        }
    };

    // Popular categories with post counts
    const popularCategories = CATEGORIES.map(category => ({
        ...category,
        count: posts.filter(post => post.category === category.value).length,
        color: CATEGORY_COLORS[category.value] || CATEGORY_COLORS.general
    })).filter(cat => cat.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Recent active users - FIXED
    const recentUsers = Object.values(
        posts.reduce((acc, post) => {
        if (!acc[post.authorId]) {
            acc[post.authorId] = {
            id: post.authorId,
            name: post.authorName,
            image: post.authorImage,
            role: post.authorRole,
            postCount: posts.filter(p => p.authorId === post.authorId).length
            };
        }
        return acc;
        }, {})
    ).slice(0, 8);

    // Top contributors (users with most posts) - FIXED
    const topContributors = Object.entries(
        posts.reduce((acc, post) => {
        if (!acc[post.authorId]) {
            acc[post.authorId] = {
            id: post.authorId,
            name: post.authorName,
            image: post.authorImage,
            role: post.authorRole,
            postCount: 0
            };
        }
        acc[post.authorId].postCount++;
        return acc;
        }, {})
    )
    .map(([_, user]) => user)
    .sort((a, b) => b.postCount - a.postCount)
    .slice(0, 5);

    // Loading state
    if (status === "loading" || (userLoading && !currentUser)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <div className="text-center">
                    <span className="loading loading-bars loading-lg text-primary"></span>
                    <p className="mt-4 text-base-content/60">Loading forum...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200">
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="btn btn-square btn-primary shadow-lg"
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 h-screen flex gap-6">
                {/* Sidebar - Desktop */}
                <div className="hidden lg:block w-80 flex-shrink-0">
                    <ForumSidebar 
                        currentUser={currentUser}
                        stats={stats}
                        popularCategories={popularCategories}
                        recentUsers={recentUsers}
                        topContributors={topContributors}
                        onCategorySelect={setSelectedCategory}
                        selectedCategory={selectedCategory}
                        onCreatePost={() => setShowPostForm(true)}
                        onSortChange={setActiveSort}
                        activeSort={activeSort}
                    />
                </div>

                {/* Mobile Sidebar Overlay */}
                {mobileMenuOpen && (
                    <div className="lg:hidden fixed inset-0 z-40">
                        <div 
                            className="absolute inset-0 bg-black bg-opacity-50"
                            onClick={() => setMobileMenuOpen(false)}
                        ></div>
                        <div className="absolute left-0 top-0 h-full w-80 bg-base-100 overflow-y-auto">
                            <ForumSidebar 
                                currentUser={currentUser}
                                stats={stats}
                                popularCategories={popularCategories}
                                recentUsers={recentUsers}
                                topContributors={topContributors}
                                onCategorySelect={(category) => {
                                    setSelectedCategory(category);
                                    setMobileMenuOpen(false);
                                }}
                                selectedCategory={selectedCategory}
                                onCreatePost={() => {
                                    setShowPostForm(true);
                                    setMobileMenuOpen(false);
                                }}
                                onSortChange={setActiveSort}
                                activeSort={activeSort}
                            />
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <ForumContent
                  currentUser={currentUser}
                  posts={posts}
                  loading={loading}
                  newPostContent={newPostContent}
                  setNewPostContent={setNewPostContent}
                  showPostForm={showPostForm}
                  setShowPostForm={setShowPostForm}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                  uploadedImages={uploadedImages}
                  setUploadedImages={setUploadedImages}
                  activeSort={activeSort}
                  setActiveSort={setActiveSort}
                  stats={stats}
                  pagination={pagination}
                  handleCreatePost={handleCreatePost}
                  loadMorePosts={loadMorePosts}
                  fetchPosts={fetchPosts}
                />
            </div>
        </div>
    );
}