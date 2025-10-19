"use client";
import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/forumConstants";
import { Heart, MessageCircle, Share, Flag, MoreVertical, Clock, User, Trash2, Edit } from "lucide-react";

const PostCard = ({ post, onUpdate, currentUser }) => {
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [showOptions, setShowOptions] = useState(false);

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

    // Format relative time
    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="bg-base-100 rounded-3xl p-6 border border-neutral shadow-xl hover:shadow-2xl transition-all duration-300">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                        {post.authorImage ? (
                            <img
                                src={post.authorImage}
                                alt={post.authorName}
                                className="w-12 h-12 rounded-2xl object-cover border-2 border-primary/20"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary to-orange-600 text-white font-bold text-lg ${post.authorImage ? 'hidden' : 'flex'}`}>
                            {getInitial(post.authorName)}
                        </div>
                        
                        {/* Online indicator */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-base-100"></div>
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-bold text-lg text-base-content">{post.authorName}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                post.authorRole === 'admin' 
                                ? 'bg-error/10 text-error border border-error/20' 
                                : 'bg-primary/10 text-primary border border-primary/20'
                            }`}>
                                {post.authorRole}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-base-content/60 mt-1">
                            <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>{formatRelativeTime(post.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <User size={14} />
                                <span>{post.authorRole}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right side - Category and Options */}
                <div className="flex items-center gap-3">
                    {/* Category Badge */}
                    {post.category && post.category !== 'general' && (
                        <span className={`px-4 py-2 rounded-xl text-sm font-medium ${getCategoryColor(post.category)} border`}>
                            {CATEGORIES.find(cat => cat.value === post.category)?.label || post.category}
                        </span>
                    )}
                    
                    {/* Options Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowOptions(!showOptions)}
                            className="p-2 bg-base-200 rounded-xl border border-neutral hover:bg-base-300 transition-colors duration-200"
                        >
                            <MoreVertical size={18} />
                        </button>
                        
                        {showOptions && (
                            <div className="absolute right-0 top-12 bg-base-100 rounded-xl border border-neutral shadow-2xl z-10 min-w-32">
                                {currentUser?.role === 'admin' && (
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-2 w-full px-4 py-3 text-error hover:bg-error/10 rounded-xl transition-colors duration-200"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                )}
                                <button className="flex items-center gap-2 w-full px-4 py-3 text-base-content hover:bg-base-200 rounded-xl transition-colors duration-200">
                                    <Flag size={16} />
                                    Report
                                </button>
                                <button className="flex items-center gap-2 w-full px-4 py-3 text-base-content hover:bg-base-200 rounded-xl transition-colors duration-200">
                                    <Share size={16} />
                                    Share
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Post Content - Render Markdown */}
            <div className="mb-6">
                <div data-color-mode="light">
                    <MDEditor.Markdown 
                        source={post.content} 
                        style={{ 
                            backgroundColor: 'transparent',
                            padding: 0,
                            fontSize: '16px',
                            lineHeight: '1.6'
                        }}
                    />
                </div>
            </div>

            {/* Post Stats */}
            <div className="flex items-center gap-6 text-sm text-base-content/60 mb-6">
                <div className="flex items-center gap-2">
                    <Heart size={16} className={isLiked ? "text-error fill-error" : ""} />
                    <span>{post.likes.length} likes</span>
                </div>
                <div className="flex items-center gap-2">
                    <MessageCircle size={16} />
                    <span>{post.comments.length} comments</span>
                </div>
            </div>

            {/* Post Actions */}
            <div className="flex items-center gap-2 border-t border-b border-neutral py-4 mb-6">
                <button
                    onClick={handleLike}
                    disabled={!currentUser}
                    className={`flex items-center gap-2 flex-1 justify-center py-3 rounded-xl transition-all duration-300 ${
                        isLiked 
                        ? "bg-error/10 text-error border border-error/20" 
                        : "bg-base-200 text-base-content hover:bg-base-300 border border-transparent"
                    } ${!currentUser ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
                >
                    <Heart size={18} className={isLiked ? "fill-current" : ""} />
                    {isLiked ? "Liked" : "Like"}
                </button>
                
                <button
                    onClick={() => setShowCommentForm(!showCommentForm)}
                    disabled={!currentUser}
                    className={`flex items-center gap-2 flex-1 justify-center py-3 rounded-xl transition-all duration-300 ${
                        showCommentForm
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "bg-base-200 text-base-content hover:bg-base-300 border border-transparent"
                    } ${!currentUser ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
                >
                    <MessageCircle size={18} />
                    Comment
                </button>
                
                <button
                    disabled={!currentUser}
                    className="flex items-center gap-2 flex-1 justify-center py-3 bg-base-200 text-base-content rounded-xl hover:bg-base-300 border border-transparent transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Share size={18} />
                    Share
                </button>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
                {post.comments.map((comment) => (
                    <div key={comment._id} className="flex gap-4 p-4 bg-base-200 rounded-2xl border border-neutral/50 hover:bg-base-300 transition-colors duration-200">
                        {/* Comment Avatar */}
                        <div className="flex-shrink-0">
                            {comment.userImage ? (
                                <img
                                    src={comment.userImage}
                                    alt={comment.userName}
                                    className="w-8 h-8 rounded-xl object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                                    {getInitial(comment.userName)}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-sm text-base-content">{comment.userName}</p>
                                <span className="text-xs text-base-content/50">
                                    {formatRelativeTime(comment.createdAt)}
                                </span>
                            </div>
                            <p className="text-base-content/80 text-sm leading-relaxed">{comment.text}</p>
                        </div>
                    </div>
                ))}

                {/* Comment Form */}
                {showCommentForm && (
                    <form onSubmit={handleComment} className="flex gap-4 p-4 bg-base-200 rounded-2xl border border-neutral/50">
                        {/* Current User Avatar */}
                        <div className="flex-shrink-0">
                            {currentUser?.profileImage ? (
                                <img
                                    src={currentUser.profileImage}
                                    alt={currentUser.name}
                                    className="w-8 h-8 rounded-xl object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                                    {getInitial(currentUser?.name)}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex-1">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write your comment..."
                                className="w-full px-4 py-3 bg-base-100 border border-neutral rounded-xl focus:outline-none focus:border-primary/50 focus:bg-base-50 text-base-content placeholder-base-content/40"
                                required
                            />
                            <div className="flex justify-end gap-2 mt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCommentForm(false)}
                                    className="px-4 py-2 text-base-content/60 hover:text-base-content transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-primary text-primary-content px-6 py-2 rounded-xl font-semibold hover:bg-orange-700 transition-all duration-300 hover:scale-105"
                                >
                                    Post Comment
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PostCard;