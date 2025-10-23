"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import { Menu, X } from "lucide-react";
import ForumSidebar from "./ForumSidebar";
import ForumContent from "./ForumContent";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/forumConstants";

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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSort, setActiveSort] = useState("latest");
    const [stats, setStats] = useState({
        totalPosts: 0,
        totalComments: 0,
        activeUsers: 0,
        totalPages: 1,
        currentPage: 1,
    });
    const [pagination, setPagination] = useState({ page: 1, limit: 10, hasMore: true });

    const [sidebarPadding, setSidebarPadding] = useState("py-8");

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    // Handle dynamic sidebar padding
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;

            if (scrollTop <= 15) {
                setSidebarPadding("pb-8");
            } else {
                setSidebarPadding("pt-8");
            }
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);
        handleScroll(); // initial check

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    // Fetch posts
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
            if (params.toString()) url += `?${params.toString()}`;

            const res = await fetch(url);
            const data = await res.json();

            if (data.success) {
                setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts));
                setStats((prev) => ({
                    ...prev,
                    totalPosts: data.stats?.totalPosts || 0,
                    totalPages: data.stats?.totalPages || 1,
                    currentPage: data.stats?.currentPage || 1,
                }));
                setPagination((prev) => ({
                    ...prev,
                    page: data.stats?.currentPage || 1,
                    hasMore: data.stats?.hasNextPage || false,
                }));
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") fetchPosts(1, false);
    }, [status, searchQuery, selectedCategory, activeSort]);

    // Calculate stats
    const calculateStats = (posts) => {
        const totalPosts = posts.length;
        const totalComments = posts.reduce((s, p) => s + (p.comments?.length || 0), 0);
        const uniqueAuthors = new Set(posts.map((p) => p.authorId)).size;
        const totalLikes = posts.reduce((s, p) => s + (p.likes?.length || 0), 0);
        setStats({ totalPosts, totalComments, activeUsers: uniqueAuthors, totalLikes });
    };

    useEffect(() => calculateStats(posts), [posts]);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostContent.trim() || !currentUser) return;

        try {
            const res = await fetch("/api/forum", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: newPostContent,
                    images: [],
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
                fetchPosts(1, false);
            }
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    const loadMorePosts = () => {
        if (pagination.hasMore && !loading) fetchPosts(pagination.page + 1, true);
    };

    // Derived sidebar data
    const popularCategories = CATEGORIES.map((c) => ({
        ...c,
        count: posts.filter((p) => p.category === c.value).length,
        color: CATEGORY_COLORS[c.value] || CATEGORY_COLORS.general,
    }))
        .filter((c) => c.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

    const recentUsers = Object.values(
        posts.reduce((acc, p) => {
            if (!acc[p.authorId]) {
                acc[p.authorId] = {
                    id: p.authorId,
                    name: p.authorName,
                    image: p.authorImage,
                    role: p.authorRole,
                    postCount: posts.filter((x) => x.authorId === p.authorId).length,
                };
            }
            return acc;
        }, {})
    ).slice(0, 8);

    const topContributors = Object.entries(
        posts.reduce((acc, p) => {
            if (!acc[p.authorId]) acc[p.authorId] = { id: p.authorId, name: p.authorName, image: p.authorImage, role: p.authorRole, postCount: 0 };
            acc[p.authorId].postCount++;
            return acc;
        }, {})
    )
        .map(([_, u]) => u)
        .sort((a, b) => b.postCount - a.postCount)
        .slice(0, 5);

    if (status === "loading" || (userLoading && !currentUser)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100">
                <div className="text-center">
                    <span className="loading loading-bars loading-lg text-primary"></span>
                    <p className="mt-4 text-base-content/60">Loading forum...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-base-100 scroll-smooth">
            {/* Mobile Menu Button - ADJUSTED: top-20 instead of top-4 */}
            {/* This ensures the button appears below a standard site header/navbar. */}
            <div className="lg:hidden fixed top-20 left-4 z-40">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="btn btn-square btn-primary shadow-lg transition-transform hover:scale-105"
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <div className="lg:container mx-auto px-6 py-6 flex gap-6">
                {/* Sidebar */}
                <div className="hidden lg:block w-80 flex-shrink-0 relative">
                    <div
                        className={`sticky top-15 max-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-base-200 transition-all [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden ${sidebarPadding}`}
                    >
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
                </div>

                {/* Mobile Sidebar */}
                {mobileMenuOpen && (
                    <div className="lg:hidden fixed inset-0 z-[9999] flex">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setMobileMenuOpen(false)}></div>
                        <div className="relative w-70 sm:w-80 bg-base-100 overflow-y-auto transition-transform duration-300 ease-in-out transform p-2 [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
                            <ForumSidebar
                                currentUser={currentUser}
                                stats={stats}
                                popularCategories={popularCategories}
                                recentUsers={recentUsers}
                                topContributors={topContributors}
                                onCategorySelect={(c) => {
                                    setSelectedCategory(c);
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
                    uploadedImages={[]}
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