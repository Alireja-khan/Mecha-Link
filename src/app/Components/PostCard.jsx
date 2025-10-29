"use client";
import { useState, useCallback, useMemo } from "react";
import MDEditor from "@uiw/react-md-editor";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/forumConstants";
import { Heart, MessageCircle, ThumbsDown, MoreVertical, Clock, Trash2, Plus, X } from "lucide-react";
import Swal from "sweetalert2";

// Mock Modal Component
const ImageModal = ({ images, isOpen, onClose, onImageClick }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md p-4" onClick={onClose}>
            <div className="bg-base-200 rounded-2xl p-6 max-w-4xl max-h-[60vh] overflow-y-auto w-full relative" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4 text-base-content">All Images ({images.length})</h3>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-xl font-bold text-base-content hover:text-primary transition-colors"
                    aria-label="Close modal"
                >
                    &times;
                </button>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Post image ${index + 1}`}
                            className="w-full h-50 object-cover rounded-xl cursor-pointer border border-neutral hover:ring-2 hover:ring-primary/50 transition-all duration-200"
                            onClick={() => onImageClick(image)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Full Screen Viewer
const FullScreenViewer = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;

    return (
        <div className="fixed inset-0 z-[9999] p-6 flex items-center justify-center bg-black/90" onClick={onClose}>
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-4xl font-bold text-white hover:text-error transition-colors z-10"
                aria-label="Close full screen viewer"
            >
                <X></X>
            </button>
            <div className="w-150 rounded-lg overflow-hidden border-4 border-primary">
                <img
                    src={imageUrl}
                    alt="Full screen view"
                    className="object-contain max-w-full max-h-full"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
};

const PostCard = ({ post, onUpdate, currentUser }) => {
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showAllImagesModal, setShowAllImagesModal] = useState(false);
    const [fullScreenImageUrl, setFullScreenImageUrl] = useState(null);

    // SweetAlert2 Configuration
    const swalOptions = {
        confirmButtonColor: 'var(--color-success)',
        background: 'var(--color-base-100)',
        color: 'var(--color-base-content)',
        cancelButtonColor: 'var(--color-error)',
    };

    const showSuccessAlert = (title, message) => {
        Swal.fire({
            ...swalOptions,
            title: title,
            text: message,
            icon: 'success',
            iconColor: 'var(--color-success)'
        });
    };

    const showErrorAlert = (title, message) => {
        Swal.fire({
            ...swalOptions,
            title: title,
            text: message,
            icon: 'error',
            iconColor: 'var(--color-error)'
        });
    };

    const showConfirmDialog = (title, text, confirmButtonText = 'Yes, proceed') => {
        return Swal.fire({
            ...swalOptions,
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            iconColor: 'var(--color-warning)'
        });
    };

    const showLoadingAlert = (title, text) => {
        Swal.fire({
            ...swalOptions,
            title: title,
            text: text,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
    };

    // Check if current user can delete the post
    const canDeletePost = useMemo(() => {
        if (!currentUser) return false;
        // Users can delete their own posts OR admins can delete any post
        return currentUser._id === post.authorId || currentUser.role === 'admin';
    }, [currentUser, post.authorId]);

    // Handlers for Post Actions
    const handleLike = async () => {
        if (!currentUser) return;
        try {
            const res = await fetch("/api/forum", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId: post._id, action: "like", userId: currentUser._id }),
            });
            if (res.ok) { onUpdate(); }
            else { showErrorAlert("Oops!", "Failed to like post."); }
        } catch (error) {
            console.error("Error liking post:", error);
            showErrorAlert("Error", "Could not connect to the server.");
        }
    };

    const handleDislike = async () => {
        if (!currentUser) return;
        try {
            const res = await fetch("/api/forum", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId: post._id, action: "dislike", userId: currentUser._id }),
            });
            if (res.ok) { onUpdate(); }
            else { showErrorAlert("Oops!", "Failed to dislike post."); }
        } catch (error) {
            console.error("Error disliking post:", error);
            showErrorAlert("Error", "Could not connect to the server.");
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !currentUser) return;
        try {
            const res = await fetch("/api/forum", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
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
            } else {
                showErrorAlert("Oops!", "Failed to post comment.");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            showErrorAlert("Error", "Could not connect to the server.");
        }
    };

    const handleDelete = async () => {
        if (!canDeletePost) return;

        const result = await showConfirmDialog(
            'Are you sure?',
            currentUser._id === post.authorId 
                ? "This will permanently delete your post."
                : "You are about to delete this post as an admin. This action cannot be undone.",
            currentUser._id === post.authorId ? 'Yes, delete my post' : 'Yes, delete as admin'
        );

        if (result.isConfirmed) {
            try {
                showLoadingAlert('Deleting...', 'Please wait while we delete the post');

                const res = await fetch(`/api/forum?id=${post._id}&userId=${currentUser._id}`, {
                    method: "DELETE",
                });

                const data = await res.json();
                if (data.success) {
                    Swal.close();
                    await showSuccessAlert(
                        'Deleted!', 
                        currentUser._id === post.authorId 
                            ? 'Your post has been deleted.'
                            : 'The post has been deleted by admin.'
                    );
                    onUpdate();
                } else {
                    Swal.close();
                    await showErrorAlert('Error!', data.message || 'Failed to delete post');
                }
            } catch (error) {
                console.error("Error deleting post:", error);
                Swal.close();
                await showErrorAlert('Error!', 'Error deleting post');
            }
        }
    };

    const toggleComments = () => {
        if (!showComments) {
            setShowComments(true);
            setShowCommentForm(true);
        } else {
            setShowComments(false);
            setShowCommentForm(false);
        }
    };

    // Image Handlers
    const handleImageClick = useCallback((imageUrl) => {
        setFullScreenImageUrl(imageUrl);
        setShowAllImagesModal(false);
    }, []);

    const handleFullScreenClose = useCallback(() => {
        setFullScreenImageUrl(null);
    }, []);

    // Computed Values
    const isLiked = post.likes.includes(currentUser?._id);
    const isDisliked = post.dislikes?.includes(currentUser?._id);

    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    const getCategoryColor = (category) => {
        return CATEGORY_COLORS[category] || CATEGORY_COLORS.general;
    };

    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
        return date.toLocaleDateString();
    };

    // Dynamic Image Grid Logic
    const allImages = post.images || [];
    const imageCount = allImages.length;
    const showMoreButton = imageCount > 2;
    const maxImagesToRender = 2;
    const actualImagesToShow = showMoreButton
        ? allImages.slice(0, maxImagesToRender)
        : allImages.slice(0, 3);
    const remainingImagesCount = imageCount - actualImagesToShow.length;
    const imageToBlurUrl = showMoreButton && actualImagesToShow[actualImagesToShow.length - 1];

    const commentsContainerHeight = "200px";

    return (
        <div className="bg-base-200 rounded-3xl p-4 sm:p-6 border border-neutral transition-all duration-300">
            {/* Post Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                {/* Author Info (Left Side) */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
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

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-bold text-lg text-base-content truncate">{post.authorName}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize flex-shrink-0 ${post.authorRole === 'admin'
                                ? 'bg-error/10 text-error border border-error/20'
                                : post.authorRole === 'mechanic'
                                    ? 'bg-info/10 text-info border border-info/20'
                                    : 'bg-primary/10 text-primary border border-primary/20'
                                }`}>
                                {post.authorRole}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-base-content/60 mt-1">
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <Clock size={14} />
                                <span>{formatRelativeTime(post.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Category and Options */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {/* Category Badge */}
                    {post.category && post.category !== 'general' && (
                        <span className={`px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium flex-shrink-0 ${getCategoryColor(post.category)} border`}>
                            {CATEGORIES.find(cat => cat.value === post.category)?.label || post.category}
                        </span>
                    )}

                    {/* Options Menu - Only show if user can delete */}
                    {canDeletePost && (
                        <div className="relative flex-shrink-0">
                            <button
                                onClick={() => setShowOptions(!showOptions)}
                                className="p-2 bg-base-100 rounded-xl border border-neutral hover:bg-base-300 transition-colors duration-200"
                                aria-expanded={showOptions}
                                aria-label="More options"
                            >
                                <MoreVertical size={18} />
                            </button>

                            {showOptions && (
                                <div className="absolute right-0 top-12 bg-base-200 rounded-xl border border-neutral shadow-2xl z-10 min-w-32 origin-top-right animate-in fade-in-0 zoom-in-95">
                                    <button
                                        onClick={() => {
                                            handleDelete();
                                            setShowOptions(false);
                                        }}
                                        className="flex items-center gap-2 w-full px-4 py-3 text-error hover:bg-error/10 rounded-xl transition-colors duration-200"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Post Content - Render Markdown */}
            <div className="mb-6 prose max-w-none">
                <div data-color-mode="light">
                    <MDEditor.Markdown
                        source={post.content}
                        style={{
                            backgroundColor: 'transparent',
                            color: 'var(--base-content)',
                            padding: 0,
                            fontSize: '16px',
                            lineHeight: '1.6',
                            wordBreak: 'break-word',
                        }}
                    />
                </div>
            </div>

            {/* Post Images - Dynamic Grid and "More" Button Logic */}
            {imageCount > 0 && (
                <div className="mb-6">
                    <div className={`flex gap-3 items-center justify-center`}>
                        {/* Render the actual images that fit in the grid */}
                        {actualImagesToShow.map((image, index) => (
                            <div
                                key={index}
                                className={`relative flex items-center justify-center h-64 sm:h-80 md:h-100 w-90 overflow-hidden 
                                    ${showMoreButton && index >= 1 ? 'hidden xl:flex' : 'flex'}
                                `}
                            >
                                <img
                                    src={image}
                                    alt={`Post image ${index + 1}`}
                                    className="w-full h-full rounded-2xl object-cover border border-neutral shadow-lg transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                                    onClick={() => handleImageClick(image)}
                                />
                            </div>
                        ))}

                        {/* Render the 'More' button as the last grid item if needed */}
                        {showMoreButton && imageToBlurUrl && (
                            <div
                                className="relative flex items-center justify-center h-64 sm:h-80 md:h-100 w-90 overflow-hidden rounded-2xl border border-neutral shadow-lg cursor-pointer"
                                onClick={() => setShowAllImagesModal(true)}
                            >
                                <img
                                    src={imageToBlurUrl}
                                    alt="More images preview"
                                    className="w-full h-full object-cover filter blur-xs scale-105"
                                />

                                <div
                                    className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center transition-all duration-300 hover:bg-black/50 rounded-2xl"
                                >
                                    <Plus size={32} className="text-white mb-2" />
                                    <span className="text-white text-xl font-bold">+{remainingImagesCount} more</span>
                                    <span className="text-sm text-white/80">View all images</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Post Stats */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-base-content/60 mb-6 pt-4">
                <div className="flex items-center gap-2">
                    <Heart size={16} className={isLiked ? "text-error fill-error" : ""} />
                    <span>{post.likes.length} likes</span>
                </div>
                <div className="flex items-center gap-2">
                    <ThumbsDown size={16} className={isDisliked ? "text-blue-500 fill-blue-500" : ""} />
                    <span>{post.dislikes?.length || 0} dislikes</span>
                </div>
                <div className="flex items-center gap-2">
                    <MessageCircle size={16} />
                    <span>{post.comments.length} comments</span>
                </div>
            </div>

            {/* Post Actions - YouTube Style Like/Dislike */}
            <div className="flex flex-col sm:flex-row items-center gap-2 border-t border-b border-neutral py-4 mb-6">
                <button
                    onClick={handleLike}
                    disabled={!currentUser}
                    className={`flex items-center gap-2 w-full sm:flex-1 justify-center py-3 rounded-xl transition-all duration-300 ${isLiked
                        ? "bg-error/10 text-error border border-error/20"
                        : "bg-base-100 text-base-content hover:bg-base-300 border border-transparent"
                        } ${!currentUser ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] sm:hover:scale-105"}`}
                >
                    <Heart size={18} className={isLiked ? "fill-current" : ""} />
                    Like
                </button>

                <button
                    onClick={handleDislike}
                    disabled={!currentUser}
                    className={`flex items-center gap-2 w-full sm:flex-1 justify-center py-3 rounded-xl transition-all duration-300 ${isDisliked
                        ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                        : "bg-base-100 text-base-content hover:bg-base-300 border border-transparent"
                        } ${!currentUser ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] sm:hover:scale-105"}`}
                >
                    <ThumbsDown size={18} className={isDisliked ? "fill-current" : ""} />
                    Dislike
                </button>

                <button
                    onClick={toggleComments}
                    disabled={!currentUser}
                    className={`flex items-center gap-2 w-full sm:flex-1 justify-center py-3 rounded-xl transition-all duration-300 ${showComments
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-base-100 text-base-content hover:bg-base-300 border border-transparent"
                        } ${!currentUser ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] sm:hover:scale-105"}`}
                >
                    <MessageCircle size={18} />
                    {showComments ? "Hide" : "Comment"} ({post.comments.length})
                </button>
            </div>

            {/* Comments Section */}
            {(showComments || showCommentForm) && (
                <div className="space-y-4 pt-2">
                    {/* Comments List with Scrollable Container */}
                    {post.comments.length > 0 && (
                        <div
                            className="space-y-4 overflow-y-auto pr-2"
                            style={{ maxHeight: commentsContainerHeight }}
                        >
                            {post.comments.map((comment) => (
                                <div key={comment._id} className="flex gap-3 p-3 sm:p-4 bg-base-100 rounded-2xl border border-neutral hover:bg-base-300 transition-colors duration-200">
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
                                        <div className="flex flex-wrap items-center gap-x-2 mb-1">
                                            <p className="font-semibold text-sm text-base-content truncate">{comment.userName}</p>
                                            <span className="text-xs text-base-content/50 flex-shrink-0">
                                                {formatRelativeTime(comment.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-base-content/80 text-sm leading-relaxed break-words">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Comment Form */}
                    {showCommentForm && (
                        <form onSubmit={handleComment} className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 bg-base-100 rounded-2xl border border-neutral">
                            {/* Current User Avatar */}
                            <div className="flex-shrink-0 hidden sm:block">
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

                            <div className="flex-1 w-full">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write your comment..."
                                    className="w-full px-4 py-3 bg-base-200 border border-neutral rounded-xl focus:outline-none focus:border-primary/50 focus:bg-base-50 text-base-content placeholder-base-content/40"
                                    required
                                />
                                <div className="flex justify-end gap-2 mt-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCommentForm(false);
                                            if (post.comments.length === 0) {
                                                setShowComments(false);
                                            }
                                        }}
                                        className="px-4 py-2 text-base-content/60 hover:text-base-content transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-primary text-primary-content px-6 py-2 rounded-xl font-semibold hover:bg-orange-700 transition-all duration-300"
                                        aria-label="Post Comment"
                                    >
                                        Post Comment
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Show Comment Form Button when comments are visible but form isn't */}
                    {showComments && post.comments.length > 0 && !showCommentForm && (
                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowCommentForm(true)}
                                className="bg-primary text-primary-content px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all duration-300 hover:scale-[1.02]"
                            >
                                Add a Comment
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Image Modal Component */}
            <ImageModal
                images={allImages}
                isOpen={showAllImagesModal}
                onClose={() => setShowAllImagesModal(false)}
                onImageClick={handleImageClick}
            />

            {/* Full Screen Viewer */}
            <FullScreenViewer
                imageUrl={fullScreenImageUrl}
                onClose={handleFullScreenClose}
            />
        </div>
    );
};

export default PostCard;