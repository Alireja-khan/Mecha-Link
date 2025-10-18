"use client";
import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/forumConstants";

const PostCard = ({ post, onUpdate, currentUser }) => {
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
                    userId: currentUser._id,
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
                    userId: currentUser._id,
                    userName: currentUser.name,
                    userImage: currentUser.profileImage,
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

    const handleDelete = async () => {
        if (!currentUser || currentUser.role !== 'admin') return;
        
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            const res = await fetch(`/api/forum?id=${post._id}&userId=${currentUser._id}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (data.success) {
                onUpdate();
            } else {
                alert(data.message || "Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Error deleting post");
        }
    };

    const isLiked = post.likes.includes(currentUser?._id);

    // Get first letter for avatar fallback
    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    // Get category color
    const getCategoryColor = (category) => {
        return CATEGORY_COLORS[category] || CATEGORY_COLORS.general;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
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
                
                {/* Category Badge */}
                {post.category && post.category !== 'general' && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                        {CATEGORIES.find(cat => cat.value === post.category)?.label || post.category}
                    </span>
                )}
            </div>

            {/* Post Content - Render Markdown */}
            <div className="mb-4">
                <div data-color-mode="light">
                    <MDEditor.Markdown 
                        source={post.content} 
                        style={{ 
                            backgroundColor: 'transparent',
                            padding: 0
                        }}
                    />
                </div>
            </div>

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
                {currentUser?.role === 'admin' && (
                    <button 
                        onClick={handleDelete}
                        className="flex items-center gap-2 hover:text-red-500 transition-colors"
                    >
                        🗑️ Delete
                    </button>
                )}
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
                {post.comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3">
                        {/* Comment Avatar */}
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
};

export default PostCard;