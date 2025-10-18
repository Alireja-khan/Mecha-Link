"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useUser from '@/hooks/useUser'; // Add this import

export default function ForumPage() {
    const { data: session, status } = useSession();
    const { user: currentUser, isLoading: userLoading } = useUser(); // Use your custom hook
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState("");
    const [showPostForm, setShowPostForm] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    // Add this useEffect to debug user data
    useEffect(() => {
        if (currentUser) {
            console.log("🔍 Current User Data:", currentUser);
            console.log("User ID:", currentUser._id || currentUser.userId);
            console.log("User Name:", currentUser.name);
            console.log("User Role:", currentUser.role);
            console.log("User Profile Image:", currentUser.profileImage);
        }
    }, [currentUser]);

    // Fetch posts
    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/forum");
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
    console.log(posts)
    useEffect(() => {
        if (status === "authenticated") {
            fetchPosts();
        }
    }, [status]);


    // Create new post - using user data from useUser hook
const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim() || !currentUser) return;

    try {
        console.log("📤 Sending Post Data:", {
            authorId: currentUser._id, // Use _id, not userIdFromNext
            authorName: currentUser.name,
            authorRole: currentUser.role,
            authorImage: currentUser.profileImage,
            content: newPostContent
        });

        const res = await fetch("/api/forum", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content: newPostContent,
                authorId: currentUser._id, // ✅ Use _id, not userIdFromNext
                authorName: currentUser.name,
                authorRole: currentUser.role,
                authorImage: currentUser.profileImage,
            }),
        });

        const data = await res.json();
        console.log("📥 API Response:", data);
        
        if (data.success) {
            setNewPostContent("");
            setShowPostForm(false);
            fetchPosts(); // Refresh posts
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
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
                    <button
                        onClick={() => setShowPostForm(!showPostForm)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        New Post
                    </button>
                </div>

                {/* Create Post Form */}
                {showPostForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
                        <form onSubmit={handleCreatePost}>
                            <textarea
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                placeholder="What's on your mind? Share your car issues, tips, or questions..."
                                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPostForm(false)}
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
                            <p className="text-gray-500 text-lg">No posts yet. Be the first to share!</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                onUpdate={fetchPosts}
                                currentUser={currentUser} // Pass the full user object
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

// Post Component - Updated to use currentUser
function PostCard({ post, onUpdate, currentUser }) {
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [commentText, setCommentText] = useState("");

    const handleLike = async () => {
    if (!currentUser) return;
    
    try {
        const res = await fetch("/api/forum", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                postId: post._id,
                action: "like",
                userId: currentUser._id, // ✅ Use _id
            }),
        });

        if (res.ok) {
            onUpdate();
        }
    } catch (error) {
        console.error("Error liking post:", error);
    }
};

    const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;

    try {
        const res = await fetch("/api/forum", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                postId: post._id,
                action: "comment",
                commentText: commentText,
                userId: currentUser._id, // ✅ Use _id
                userName: currentUser.name,
                userImage: currentUser.profileImage, // ✅ This should now work
            }),
        });

        if (res.ok) {
            setCommentText("");
            setShowCommentForm(false);
            onUpdate();
        }
    } catch (error) {
        console.error("Error adding comment:", error);
    }
};

    const isLiked = post.likes.includes(currentUser?._id); // ✅ Use _id

    // Get first letter for avatar fallback
    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {/* Post Header */}
            <div className="flex items-center gap-3 mb-4">
                {/* Avatar with image support */}
                {post.authorImage ? (
                    <img
                        src={post.authorImage}
                        alt={post.authorName}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 ${post.authorImage ? 'hidden' : 'flex'}`}>
                    <span className="font-semibold text-blue-600">
                        {getInitial(post.authorName)}
                    </span>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{post.authorName}</h3>
                    <p className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()} •
                        <span className={`ml-1 capitalize ${post.authorRole === 'admin' ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                            {post.authorRole}
                        </span>
                    </p>
                </div>
            </div>

            {/* Post Content */}
            <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

            {/* Post Image */}
            {post.image && (
                <div className="mb-4">
                    <img
                        src={post.image}
                        alt="Post attachment"
                        className="max-w-full h-auto rounded-lg"
                    />
                </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center gap-6 text-sm text-gray-600 border-t border-b py-3 mb-4">
                <button
                    onClick={handleLike}
                    disabled={!currentUser}
                    className={`flex items-center gap-2 transition-colors ${isLiked ? "text-red-500" : "hover:text-red-500"} ${!currentUser ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    ❤️ {post.likes.length} Likes
                </button>
                <button
                    onClick={() => setShowCommentForm(!showCommentForm)}
                    disabled={!currentUser}
                    className={`flex items-center gap-2 hover:text-blue-500 transition-colors ${!currentUser ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    💬 {post.comments.length} Comments
                </button>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
                {post.comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3">
                        {/* Comment Avatar with image support */}
                        {comment.userImage ? (
                            <img
                                src={comment.userImage}
                                alt={comment.userName}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 flex-shrink-0 ${comment.userImage ? 'hidden' : 'flex'}`}>
                            <span className="text-xs font-medium text-gray-600">
                                {getInitial(comment.userName)}
                            </span>
                        </div>
                        <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="font-medium text-sm text-gray-900">{comment.userName}</p>
                                <p className="text-gray-700 mt-1">{comment.text}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Comment Form */}
                {showCommentForm && (
                    <form onSubmit={handleComment} className="flex gap-3">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Post
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}