"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
    User as UserIcon,
    Send,
    Trash2,
    MoreVertical,
    MessageSquare,
    Loader2,
    X,
    ArrowLeft,
    Check,
    CheckCheck,
    Image as ImageIcon,
    Edit,
    CornerDownLeft,
    Smile,
    Reply,
    Edit2
} from "lucide-react";
import Swal from "sweetalert2";
import useUser from "@/hooks/useUser";
import { uploadImageToImgbb } from "@/lib/uploadImgbb";

const SOCKET_URL = "http://localhost:3001";
const EMOJIS = ["👍", "❤️", "😂", "😢", "😮", "🙏"];

let socket;

const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};
const formatDateSeparator = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (isSameDay(date, now)) {
        return "Today";
    }
    if (isSameDay(date, yesterday)) {
        return "Yesterday";
    }
    return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
};
const formatMessageTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
const formatRelativeTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
        return "Just now";
    }
    if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    }
    if (diffInHours < 24) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diffInDays === 1) {
        return "Yesterday";
    }
    if (diffInDays < 7) {
        return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};
const useDebouncedCallback = (callback, delay) => {
    const timeoutRef = useRef(null);

    return useCallback((...args) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);
};

const isImageUrl = (url) => {
    if (typeof url !== 'string') return false;
    const trimmed = url.trim();
    return (
        (trimmed.startsWith('http://') || trimmed.startsWith('https://')) &&
        /\.(jpeg|jpg|png|gif|webp)$/i.test(trimmed.split('?')[0])
    );
};

const DateSeparator = ({ dateString }) => (
    <div className="flex items-center my-6">
        <div className="flex-grow border-t border-neutral"></div>
        <span className="flex-shrink mx-4 text-xs font-medium text-base-content bg-base-300/50 px-3 py-1 rounded-full shadow-sm">
            {formatDateSeparator(dateString)}
        </span>
        <div className="flex-grow border-t border-neutral"></div>
    </div>
);

const MessageBubble = ({ msg, isSender, time, isSeen, onReact, onReply, onEdit, onDelete, userId }) => {
    const isImage = msg.text && isImageUrl(msg.text);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const actionMenuRef = useRef(null);

    const isDeleted = msg.deletedBy !== undefined && msg.deletedBy !== null;
    const isSoftDeleted = isDeleted;

    const hasReactions = msg.reactions && msg.reactions.length > 0;
    const allReactions = msg.reactions || [];

    const isDeletable = isSender && !isSoftDeleted;
    const isEditable = isSender && !isImage && !isSoftDeleted;
    const isActionable = !isSoftDeleted;

    const alignmentClasses = isSender ? "ml-auto items-end" : "mr-auto items-start";
    const replyAlignmentClasses = isSender ? "ml-auto" : "mr-auto";
    const actionsAlignmentClasses = isSender ? "flex-row-reverse" : "flex-row";
    const emojiPickerAlignmentClasses = isSender ? "right-0" : "left-0";
    const moreOptionsAlignmentClasses = isSender ? "right-0" : "left-0";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
                setShowMoreOptions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const localFormatMessageTime = (time) => {
        const date = new Date(time);
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    if (isSoftDeleted) {
        return (
            <div className={`flex flex-col max-w-xs md:max-w-md break-words italic text-gray-500 transition-all duration-300 ease-in-out py-2 px-4 rounded-xl ${isSender ? "ml-auto" : "mr-auto"}`}>
                <span className="text-sm bg-base-300/30 px-3 py-1 rounded-lg">
                    Message deleted
                </span>
            </div>
        );
    }

    return (
        <div className={`flex flex-col group w-fit break-words transition-all duration-300 ease-in-out relative ${alignmentClasses}`}>
            <div className="relative flex flex-col w-fit " ref={actionMenuRef}>

                {msg.replyTo && (
                    <div className="pointer-events-none">
                        <div className={`bg-base-300 opacity-50 p-2 w-fit rounded-lg mb-2 text-sm max-w-full truncate overflow-hidden relative top-6 z-0 ${replyAlignmentClasses}`}>
                            <p className="text-base-content/70 truncate">{msg.replyTo.text}</p>
                        </div>
                    </div>
                )}

                <div className={`flex items-center gap-1 ${actionsAlignmentClasses} group`}>
                    <div className={`relative flex w-fit flex-col py-2 px-4 rounded-xl text-base ${isSender
                        ? "bg-primary text-white rounded-br-md shadow-lg shadow-primary/20"
                        : "bg-base-200 text-base-content rounded-tl-md shadow-sm border border-neutral"
                        }`}>
                        {isImage ? (
                            <img
                                src={msg.text}
                                alt="Shared image"
                                className="max-w-full rounded-lg object-contain cursor-pointer"
                                style={{ maxHeight: '300px' }}
                            />
                        ) : (
                            <span>{msg.text}</span>
                        )}
                    </div>

                    {hasReactions && (
                        <div className={`mt-8 z-50 bg-base-300 flex gap-1 p-0.5 rounded-full ${isSender ? '-mr-4' : '-ml-4 '}`}>
                            {allReactions.map(({ emoji, count, userEmails }) => (
                                <span
                                    key={emoji}
                                    className={`text-xs px-0.5 rounded-full bg-base-200/50`}
                                    title={userEmails?.join(', ')}
                                >
                                    {emoji} {count > 1 && count}
                                </span>
                            ))}
                        </div>
                    )}

                    {isActionable && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="relative">
                                <button
                                    onClick={() => setShowEmojiPicker(prev => !prev)}
                                    className="p-1 rounded-full text-base-content hover:bg-base-200 transition-colors"
                                    title="React"
                                >
                                    <Smile className="w-4 h-4" />
                                </button>
                                {showEmojiPicker && (
                                    <div className={`absolute bottom-full mb-2 p-2 bg-base-200 rounded-xl shadow-2xl border border-neutral flex gap-1 z-20 ${emojiPickerAlignmentClasses}`}>
                                        {EMOJIS.map(emoji => (
                                            <button
                                                key={emoji}
                                                onClick={() => { onReact(msg._id, emoji); setShowEmojiPicker(false); }}
                                                className="p-1 text-lg rounded-lg hover:bg-base-300 transition"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => onReply(msg)}
                                className="p-1 rounded-full text-base-content hover:bg-base-200 transition-colors"
                                title="Reply"
                            >
                                <Reply className="w-4 h-4" />
                            </button>

                            <div className="relative">
                                {isSender ? (
                                    <>
                                        <button
                                            onClick={() => setShowMoreOptions(prev => !prev)}
                                            className="p-1 rounded-full text-base-content hover:bg-base-200 transition-colors"
                                            title="More options"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>

                                        {showMoreOptions && (
                                            <div
                                                className={`absolute top-full mt-1 ${moreOptionsAlignmentClasses} bg-base-200 border border-neutral shadow-lg rounded-lg flex flex-col z-20`}
                                            >
                                                {isEditable && (
                                                    <button
                                                        onClick={() => {
                                                            onEdit(msg);
                                                            setShowMoreOptions(false);
                                                        }}
                                                        className="px-4 py-2 text-sm text-base-content hover:bg-base-300 transition-colors flex items-center gap-2 rounded-t-lg"
                                                    >
                                                        <Edit2 className="w-4 h-4" /> Edit
                                                    </button>
                                                )}

                                                {isDeletable && (
                                                    <button
                                                        onClick={() => {
                                                            onDelete(msg);
                                                            setShowMoreOptions(false);
                                                        }}
                                                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-500/10 transition-colors flex items-center gap-2 rounded-b-lg"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Delete
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : null}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className={`text-xs flex items-center gap-1 ${isSender ? "text-gray-300" : "text-gray-400"}`}>
                <span>{formatMessageTime(time)}</span>
                {isSender && (
                    <span className={isSeen ? "text-blue-300" : "text-gray-300"}>
                        {isSeen ? <CheckCheck className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </span>
                )}
            </div>
        </div>
    );
};

const Avatar = ({ src, alt, size = "large" }) => {
    const wH = size === "small" ? "w-10 h-10" : "w-12 h-12";
    const iconSize = size === "small" ? "w-5 h-5" : "w-6 h-6";

    return src ? (
        <img
            src={src}
            alt={alt}
            className={`${wH} rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-colors duration-200`}
        />
    ) : (
        <div className={`${wH} flex items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20`}>
            <UserIcon className={iconSize} />
        </div>
    );
};

const AvatarHeader = ({ src, alt, size = "large" }) => {
    const wH = size === "small" ? "w-10 h-10" : "w-12 h-12";
    const iconSize = size === "small" ? "w-6 h-6" : "w-6 h-6";

    return src ? (
        <img
            src={src}
            alt={alt}
            className={`${wH} rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-colors duration-200`}
        />
    ) : (
        <div className={`${wH} flex items-center justify-center rounded-full bg-white/10 text-white border border-white`}>
            <UserIcon className={iconSize} />
        </div>
    );
};

const ConversationListItem = ({ conv, userId, active, onSelect, onDeleteUser }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const otherUser = useMemo(() => {
        const otherParticipant = conv.participants.find(p => p.email !== userId);

        if (otherParticipant) {
            return {
                id: otherParticipant.userId,
                name: otherParticipant.name || "Unknown User",
                image: otherParticipant.profileImage || null,
            };
        }

        const isCurrentUserCustomer = conv.customerEmail === userId;

        return isCurrentUserCustomer
            ? {
                id: conv.mechanicId || conv.shopId,
                name: conv.mechanicName || conv.ShopName || "Unknown User",
                image: conv.mechanicProfileImage || conv.ShopLogo || null,
            }
            : {
                id: conv.customerId,
                name: conv.customerName || "Unknown User",
                image: conv.customerProfileImage || null,
            };
    }, [conv, userId]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDeleteUserClick = (e) => {
        e.stopPropagation();
        onDeleteUser(conv);
        setIsMenuOpen(false);
    };

    const timeDisplay = formatRelativeTime(conv.lastMessageAt);

    const getPreviewText = (preview) => {
        if (isImageUrl(preview)) {
            return "Image 🖼️";
        }
        return preview || "No messages yet";
    }

    // Check for unread status
    const hasUnreadMessages = conv.unreadCount > 0 && conv.lastMessageSenderEmail !== userId;

    return (
        <div
            onClick={() => onSelect(conv)}
            className={`group flex items-center gap-4 p-4 mx-3 my-1.5 rounded-lg border cursor-pointer transition-all duration-200 ease-in-out relative
                     ${active
                    ? "bg-primary/10 border-2 border-primary/20"
                    : "hover:bg-base-300/30 border-base-300/50"
                }`}
        >
            <Avatar src={otherUser.image} alt={otherUser.name} />

            <div className="flex-1 min-w-0">
                <p className="font-bold max-w-[200px] truncate text-base">{otherUser.name}</p>
                <p className={`text-sm mt-0.5 truncate max-w-[150px] ${active || hasUnreadMessages ? "text-primary font-medium" : "text-gray-500"}`}>
                    {getPreviewText(conv.lastMessagePreview)}
                </p>
            </div>

            <div className={`text-xs text-right flex-shrink-0 w-fit self-start mt-1 ${active || hasUnreadMessages ? "text-primary font-bold" : "text-gray-400"}`}>
                {timeDisplay}
            </div>
            <div className="relative z-20 flex-shrink-0" ref={menuRef} onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-1 rounded-full text-base-content hover:bg-primary/20 transition-colors"
                    aria-label="Conversation actions"
                >
                    <MoreVertical className="w-5 h-5" />
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-base-200 rounded-lg shadow-xl overflow-hidden border border-neutral z-30">
                        <button
                            onClick={handleDeleteUserClick}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Chat
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const TypingBubble = () => (
    <div className="flex items-center h-5">
        <div className="bg-base-100 p-3 rounded-xl rounded-tl-md flex items-center space-x-1.5 shadow-sm border border-base-content/10">
            <div
                className="w-2 h-2 bg-primary rounded-full animate-typing-dot-0"
                style={{ animationDelay: '0s' }}
            ></div>
            <div
                className="w-2 h-2 bg-primary rounded-full animate-typing-dot-15"
                style={{ animationDelay: '0.15s' }}
            ></div>
            <div
                className="w-2 h-2 bg-primary rounded-full animate-typing-dot-30"
                style={{ animationDelay: '0.3s' }}
            ></div>
        </div>
    </div>
);

function MessagePage() {
    const { user } = useUser();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [error, setError] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [isMessageLoading, setIsMessageLoading] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);

    const [replyingTo, setReplyingTo] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const [editInput, setEditInput] = useState("");


    const messagesEndRef = useRef(null);
    const messageContainerRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const fileInputRef = useRef(null);
    const chatMenuRef = useRef(null);
    const messageInputRef = useRef(null);
    const prevMessageCount = useRef(0);

    const [isMobileDevice, setIsMobileDevice] = useState(
        typeof window !== "undefined" ? window.innerWidth < 1024 : false
    );

    const debouncedStopTyping = useDebouncedCallback(() => {
        if (socket && activeConversation?._id) {
            socket.emit("stopTyping", activeConversation._id, user.email);
        }
        typingTimeoutRef.current = null;
    }, 1500);

    useEffect(() => {
        const handleResize = () => setIsMobileDevice(window.innerWidth < 1024);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (isMobileDevice && !activeConversation) {
            setShowChat(false);
        }
    }, [activeConversation, isMobileDevice]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatMenuRef.current && !chatMenuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatLastMessage = (msg, senderEmail, conv) => {
        if (!msg) return "";

        if (isImageUrl(msg)) return "Image 🖼️";

        const words = msg.split(" ");
        const truncated = words.length > 7 ? words.slice(0, 7).join(" ") + "..." : msg;

        const isSenderCurrentUser = senderEmail === user?.email;

        const otherName = conv.participants.find(p => p.email !== user?.email)?.name || "";

        const displayedName = isSenderCurrentUser ? "You" : (otherName?.split(" ")[0] || "Them");

        return isSenderCurrentUser ? `You: ${truncated}` : `${displayedName}: ${truncated}`;
    };

    // --- Fetch Conversations Effect ---
    useEffect(() => {
        if (!user?.email) return;

        const fetchChats = async () => {
            setError(null);
            setIsLoading(true);
            try {
                const res = await axios.get(`/api/chats?userEmail=${user.email}`);
                const allChats = res.data || [];

                const filteredChats = allChats.filter(chat =>
                    chat.participants.some(p => p.email === user.email)
                );

                const chatsWithLastMsg = await Promise.all(
                    filteredChats.map(async chat => {
                        let lastMsg = chat.lastMessage;
                        let lastMessageTime = lastMsg?.createdAt || chat.updatedAt || new Date().toISOString();

                        if (!lastMsg || !lastMsg.text) {
                            try {
                                const resMsg = await fetch(`/api/chats/${chat._id}/messages?limit=1`);
                                const data = await resMsg.json();
                                lastMsg = data?.[0];
                                if (lastMsg) {
                                    lastMessageTime = lastMsg.createdAt;
                                }
                            } catch (e) {
                                console.error(`Error fetching last message for chat ${chat._id}`, e);
                            }
                        }

                        const participants = chat.participants.map(p => ({
                            ...p,
                            profileImage: p.profileImage || "",
                        }));

                        const unreadCount = chat.participants.find(p => p.email === user.email)?.unreadCount || 0;

                        return {
                            ...chat,
                            participants,
                            lastMessagePreview: lastMsg
                                ? formatLastMessage(lastMsg.text, lastMsg.sender.email, chat)
                                : chat.serviceTitle || "No messages yet",
                            lastMessageAt: lastMessageTime,
                            unreadCount: unreadCount,
                            lastMessageSenderEmail: lastMsg?.sender?.email || null,
                        };
                    })
                );

                chatsWithLastMsg.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
                setConversations(chatsWithLastMsg);

            } catch (err) {
                setError("Failed to load conversations. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchChats();
    }, [user?.email]);

    // --- Socket.io and Message/Typing/Seen Handlers Effect ---
    useEffect(() => {
        if (!user?._id || !user?.email) return;

        // Disconnect existing socket if switching active convo or on cleanup
        if (socket) {
            socket.off("newMessage");
            socket.off("typing");
            socket.off("stopTyping");
            socket.off("messageSeenUpdate");
            socket.off("messageReact");
            socket.off("messageEdit");
            socket.off("messageDelete");
            socket.off("conversationSeen"); // New handler
            if (!activeConversation?._id) {
                socket.disconnect();
                socket = null;
            }
        }

        if (activeConversation?._id && (!isMobileDevice || (isMobileDevice && showChat))) {
            if (!socket) {
                socket = io(SOCKET_URL, {
                    transports: ["websocket"],
                    withCredentials: true,
                    reconnectionAttempts: 5,
                    timeout: 20000,
                });
            }

            socket.emit("joinChat", activeConversation._id);

            const fetchMessages = async () => {
                setIsMessageLoading(true);
                try {
                    const res = await fetch(`/api/chats/${activeConversation._id}/messages`);
                    const data = await res.json();
                    setMessages(data || []);
                } catch (err) {
                    console.error("Failed to fetch messages on room join:", err);
                } finally {
                    setIsMessageLoading(false);
                }
            };
            fetchMessages();

            const handleNewMessage = (msg) => {
                if (msg.chatId !== activeConversation._id) {
                    setConversations(prev => {
                        const updatedConvs = prev.map(conv =>
                            conv._id === msg.chatId
                                ? {
                                    ...conv,
                                    lastMessagePreview: formatLastMessage(msg.text, msg.sender.email, conv),
                                    lastMessageAt: msg.createdAt,
                                    unreadCount: conv.unreadCount + 1, // Increment unread count
                                    lastMessageSenderEmail: msg.sender.email
                                }
                                : conv
                        );
                        updatedConvs.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
                        return updatedConvs;
                    });
                    return;
                }

                setMessages(prev => {
                    const optimisticIndex = prev.findIndex(m => m._id === msg.optimisticId);
                    if (optimisticIndex !== -1) {
                        const updatedMessages = [...prev];
                        updatedMessages[optimisticIndex] = { ...msg, _id: msg._id, isSeen: false, optimisticId: undefined };
                        return updatedMessages;
                    }

                    if (prev.some(m => m._id === msg._id)) return prev;
                    return [...prev, msg];
                });

                if (msg.sender.email !== user.email) {
                    setIsOtherUserTyping(false);
                }

                setConversations(prev => {
                    const updatedConvs = prev.map(conv =>
                        conv._id === msg.chatId
                            ? {
                                ...conv,
                                lastMessagePreview: formatLastMessage(msg.text, msg.sender.email, conv),
                                lastMessageAt: msg.createdAt,
                                // If current user is the receiver, mark as unread
                                unreadCount: msg.sender.email !== user.email ? conv.unreadCount + 1 : 0,
                                lastMessageSenderEmail: msg.sender.email
                            }
                            : conv
                    );
                    updatedConvs.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
                    return updatedConvs;
                });
            };

            const updateMessageState = (messageId, updateFn) => {
                setMessages(prev =>
                    prev.map(msg => (msg._id === messageId ? updateFn(msg) : msg))
                );
            };

            const handleMessageReact = (chatId, messageId, reactions) => {
                if (chatId === activeConversation._id) {
                    updateMessageState(messageId, msg => ({ ...msg, reactions }));
                }
            };

            const handleMessageEdit = (chatId, messageId, newText) => {
                if (chatId === activeConversation._id) {
                    updateMessageState(messageId, msg => ({ ...msg, text: newText, isEdited: true }));
                }
            };

            const handleMessageDelete = (chatId, messageId, deletedBy) => {
                if (chatId === activeConversation._id) {
                    updateMessageState(messageId, msg => ({ ...msg, deletedBy }));
                }
            };


            const handleTyping = (chatId, senderEmail) => {
                if (chatId === activeConversation._id && senderEmail !== user.email) {
                    setIsOtherUserTyping(true);
                }
            };

            const handleStopTyping = (chatId, senderEmail) => {
                if (chatId === activeConversation._id && senderEmail !== user.email) {
                    setIsOtherUserTyping(false);
                }
            };

            const handleMessageSeenUpdate = (chatId, messageId, viewerEmail) => {
                if (chatId === activeConversation._id && viewerEmail !== user.email) {
                    updateMessageState(messageId, msg => ({ ...msg, isSeen: true }));
                }
            };

            // NEW: Instantly update all sender's messages as seen when the other user joins/views the chat
            const handleConversationSeen = (chatId, viewerEmail) => {
                if (chatId === activeConversation._id && viewerEmail !== user.email) {
                    setMessages(prev =>
                        prev.map(msg =>
                            msg.sender.email === user.email ? { ...msg, isSeen: true } : msg
                        )
                    );
                }
            };

            socket.on("newMessage", handleNewMessage);
            socket.on("typing", handleTyping);
            socket.on("stopTyping", handleStopTyping);
            socket.on("messageSeenUpdate", handleMessageSeenUpdate);
            socket.on("messageReact", handleMessageReact);
            socket.on("messageEdit", handleMessageEdit);
            socket.on("messageDelete", handleMessageDelete);
            socket.on("conversationSeen", handleConversationSeen); // New listener

            return () => {
                if (socket) {
                    socket.off("newMessage", handleNewMessage);
                    socket.off("typing", handleTyping);
                    socket.off("stopTyping", handleStopTyping);
                    socket.off("messageSeenUpdate", handleMessageSeenUpdate);
                    socket.off("messageReact", handleMessageReact);
                    socket.off("messageEdit", handleMessageEdit);
                    socket.off("messageDelete", handleMessageDelete);
                    socket.off("conversationSeen", handleConversationSeen); // Remove listener
                    if (isMobileDevice) socket.disconnect();
                }
            };
        }
    }, [activeConversation?._id, user?._id, user?.email, isMobileDevice, showChat]);

    // --- Message Seen Logic Effect ---
    useEffect(() => {
        if (!activeConversation?._id || !user?.email || isMessageLoading || messages.length === 0) return;
        if (!socket) return;

        const unseenMessages = Array.isArray(messages)
            ? messages.filter(
                (m) =>
                    m?.receiver?.email === user?.email &&
                    !m?.isSeen &&
                    !m?.isOptimistic
            )
            : [];

        if (unseenMessages.length === 0) {
            // If there are no unseen messages for the user in this active chat, 
            // ensure the unread count in the conversations list is 0.
            setConversations(prev => {
                return prev.map(conv =>
                    conv._id === activeConversation._id ? { ...conv, unreadCount: 0 } : conv
                );
            });
            return;
        }

        // Notify the server/other users that this entire conversation has been seen
        socket.emit("conversationSeen", activeConversation._id, user.email);

        // Mark individual messages as seen (simultaneously)
        unseenMessages.forEach(async (msg) => {
            try {
                await axios.patch(`/api/chats/${activeConversation._id}/messages`, {
                    action: "seen",
                    messageId: msg._id,
                    viewerEmail: user.email
                });

                socket.emit("messageSeen", activeConversation._id, msg._id, user.email);

                setMessages(prev =>
                    prev.map(m =>
                        m._id === msg._id ? { ...m, isSeen: true } : m
                    )
                );
            } catch (err) {
                console.error("Failed to mark message as seen:", err);
            }
        });

        // Final state update to zero the unread count locally on the active conversation
        setConversations(prev => {
            return prev.map(conv =>
                conv._id === activeConversation._id ? { ...conv, unreadCount: 0 } : conv
            );
        });

    }, [messages, activeConversation, user?.email, isMessageLoading]);

    // --- Scroll to Bottom Effect ---
    useEffect(() => {
        const messageCount = messages?.length || 0;

        // Scroll only when a new message is added (not when editing/reacting)
        if (messageCount > prevMessageCount.current) {
            const timeout = setTimeout(() => {
                if (messageContainerRef.current) {
                    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
            return () => clearTimeout(timeout);
        }

        prevMessageCount.current = messageCount;
    }, [messages, isOtherUserTyping, isMessageLoading]);

    // --- Message Separator Memo ---
    const messagesWithSeparators = useMemo(() => {
        if (messages.length === 0) return [];

        const processed = [];
        for (let i = 0; i < messages.length; i++) {
            const currentMsg = messages[i];
            const prevMsg = messages[i - 1];

            if (!prevMsg || !isSameDay(new Date(currentMsg.createdAt), new Date(prevMsg.createdAt))) {
                processed.push({
                    type: 'separator',
                    date: currentMsg.createdAt
                });
            }

            processed.push({
                type: 'message',
                data: currentMsg
            });
        }
        return processed;
    }, [messages]);

    // --- Interaction Handlers ---

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setInput("");
            setReplyingTo(null);
            setEditingMessage(null);
        }
    };

    const handleClearImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleClearInteraction = () => {
        setReplyingTo(null);
        setEditingMessage(null);
        setEditInput("");
        setInput("");
        handleClearImage();
        // **IMPORTANT:** Keep focus on input after clearing
        messageInputRef.current?.focus();
    };

    const handleSelectConversation = async conv => {
        if (activeConversation?._id === conv._id) {
            if (isMobileDevice) setShowChat(true);
            return;
        }

        if (socket && activeConversation?._id) {
            socket.emit("leaveChat", activeConversation._id);
        }

        setActiveConversation(conv);
        setMessages([]);
        setIsMenuOpen(false);
        setShowChat(true);
        setIsOtherUserTyping(false);
        handleClearInteraction();

        setIsMessageLoading(true);

        // **Optimization:** The message fetching is now handled inside the main socket useEffect 
        // which triggers when activeConversation changes.

        // Also update unread count optimistically right away
        setConversations(prev => {
            return prev.map(c =>
                c._id === conv._id ? { ...c, unreadCount: 0 } : c
            );
        });

    };

    const handleBackToConversations = () => {
        if (socket && activeConversation?._id) {
            socket.emit("leaveChat", activeConversation._id);

            if (isMobileDevice) {
                socket.disconnect();
            }
        }

        setShowChat(false);
        handleClearInteraction();
    };

    const handleInputChange = (e) => {
        const text = e.target.value;
        setInput(text);

        if (!socket || !activeConversation?._id || !user?.email || editingMessage) return;

        if (text.length > 0 && !typingTimeoutRef.current) {
            socket.emit("typing", activeConversation._id, user.email);
        }

        debouncedStopTyping();
    };

    const handleEditInputChange = (e) => {
        setEditInput(e.target.value);
    }

    const handleSend = async () => {
        // Prevent default form submission behavior on enter key
        if (window.event && window.event.type === 'keydown' && window.event.key === 'Enter') {
            window.event.preventDefault();
        }

        if (editingMessage) {
            await handleSaveEdit();
            return;
        }

        const text = input.trim();
        const hasText = text.length > 0;
        const hasImage = imageFile !== null;

        if (!hasText && !hasImage || !activeConversation?._id || !user?.email) return;

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        if (socket) {
            socket.emit("stopTyping", activeConversation._id, user.email);
        }

        let messageContent = text;
        const now = new Date().toISOString();
        const optimisticId = `optimistic-${Date.now()}-${Math.random()}`;

        // setIsMessageLoading(true); // Don't set true for simple send, let optimistic update handle UI

        try {
            if (hasImage) {
                const imageUrl = await uploadImageToImgbb(imageFile);
                if (!imageUrl) {
                    throw new Error("Failed to upload image.");
                }
                messageContent = imageUrl;
            }

            const otherParticipant = activeConversation.participants.find(p => p.email !== user?.email);

            const replyData = replyingTo ? {
                _id: replyingTo._id,
                senderName: replyingTo.senderName,
                text: replyingTo.text,
            } : null;

            const msgToSend = {
                sender: {
                    userId: user._id,
                    email: user.email,
                    name: user.name,
                    profileImage: user.photoURL || "",
                },
                receiver: otherParticipant
                    ? {
                        userId: otherParticipant.userId,
                        email: otherParticipant.email,
                        name: otherParticipant.name,
                        profileImage: otherParticipant.profileImage || "",
                    }
                    : {},
                text: messageContent,
                chatId: activeConversation._id,
                createdAt: now,
                optimisticId: optimisticId,
                replyTo: replyData,
            };

            const optimisticMsg = {
                ...msgToSend,
                _id: optimisticId,
                isSeen: false,
                isOptimistic: true,
            };

            setMessages(prev => [...prev, optimisticMsg]);
            handleClearInteraction(); // Clears input, keeps focus

            setConversations(prev => {
                const updatedConvs = prev.map(c =>
                    c._id === activeConversation._id
                        ? {
                            ...c,
                            lastMessagePreview: formatLastMessage(messageContent, user.email, c),
                            lastMessageAt: now,
                            unreadCount: 0, // Sender has read the message they just sent
                            lastMessageSenderEmail: user.email,
                        }
                        : c
                );
                updatedConvs.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
                return updatedConvs;
            });

            const res = await fetch(`/api/chats/${activeConversation._id}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(msgToSend),
            });

            if (!res.ok) throw new Error("Failed to post message to DB");

        } catch (err) {
            console.error("Failed to send message:", err);

            setMessages(prev => prev.filter(m => m._id !== optimisticId));

            Swal.fire({
                title: "Error",
                text: err.message || "Failed to send message. Please try again.",
                icon: "error",
            });
        } finally {
            // setIsMessageLoading(false); // Removed for better UX
            messageInputRef.current?.focus() // Ensure focus remains
        }
    };

    const handleDeleteChat = async (conv) => {
        if (!conv?._id) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete this conversation and all its messages for both parties.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            customClass: {
                container: 'z-30'
            }
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch(`/api/chats/${conv._id}/messages?deleteChat=true`, { method: "DELETE" });

            if (res.ok) {
                setConversations(prev => prev.filter(c => c._id !== conv._id));

                if (activeConversation?._id === conv._id) {
                    if (socket && activeConversation?._id) {
                        socket.emit("leaveChat", activeConversation._id);
                    }
                    setActiveConversation(null);
                    setMessages([]);
                }

                await Swal.fire({
                    title: "Deleted!",
                    text: "The chat has been removed successfully.",
                    icon: "success",
                });
            } else {
                const err = await res.json();

                await Swal.fire({
                    title: "Error",
                    text: err.error || "Failed to delete chat.",
                    icon: "error",
                });
            }
        } catch (err) {
            await Swal.fire({
                title: "Error",
                text: "An unexpected error occurred while deleting the chat.",
                icon: "error",
            });
        }
    };

    const handleDeleteMessage = async (msg) => {
        if (!activeConversation?._id || !msg?._id) return;

        try {
            const res = await axios.patch(`/api/chats/${activeConversation._id}/messages`, {
                action: "delete",
                messageId: msg._id,
                deleterEmail: user.email
            });

            if (res.status === 200) {
                setMessages(prev =>
                    prev.map(m => m._id === msg._id ? { ...m, deletedBy: user.email } : m)
                );
            } else {
                throw new Error(res.data.error || "Failed to delete message.");
            }
        } catch (err) {
            console.error("Failed to delete message:", err);
            Swal.fire({
                title: "Error",
                text: err.message || "Failed to delete message. Please try again.",
                icon: "error",
            });
        }
    };

    const handleClearChatHistory = async () => {
        if (!activeConversation?._id) return;
        setIsMenuOpen(false);

        const result = await Swal.fire({
            title: "Clear Chat History?",
            text: "This will delete all messages in this chat, but keep the conversation. This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, clear it!",
            cancelButtonText: "Cancel",
            customClass: {
                container: 'z-30'
            }
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch(`/api/chats/${activeConversation._id}/messages`, { method: "DELETE" });

            if (res.ok) {
                setMessages([]);
                setConversations(prev => {
                    const updatedConvs = prev.map(c =>
                        c._id === activeConversation._id ? { ...c, lastMessagePreview: "Chat cleared.", lastMessageAt: new Date().toISOString(), unreadCount: 0 } : c
                    );
                    updatedConvs.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
                    return updatedConvs;
                });


                await Swal.fire({
                    title: "Cleared!",
                    text: "All messages have been deleted.",
                    icon: "success",
                });
            } else {
                const err = await res.json();

                await Swal.fire({
                    title: "Error",
                    text: "Failed to clear chat: " + (err.error || "Unknown error"),
                    icon: "error",
                });
            }
        } catch (err) {
            await Swal.fire({
                title: "Error",
                text: "An unexpected error occurred while clearing the chat.",
                icon: "error",
            });
        }
    };

    const handleMessageReply = (msg) => {
        if (msg.deletedBy) return;
        setReplyingTo({
            _id: msg._id,
            senderName: msg.sender.name || "Unknown",
            text: isImageUrl(msg.text) ? "Image" : msg.text,
        });
        setEditingMessage(null);
        setInput("");
        document.getElementById("message-input").focus();
    };

    const handleMessageEdit = (msg) => {
        if (msg.deletedBy) return;
        setEditingMessage({
            _id: msg._id,
            text: msg.text,
        });
        setEditInput(msg.text);
        setReplyingTo(null);
        setInput("");
    };

    const handleSaveEdit = async () => {
        if (!editingMessage?._id || !editInput.trim()) return;

        const originalText = editingMessage.text;
        const newText = editInput.trim();
        const messageId = editingMessage._id;

        setMessages(prev =>
            prev.map(m => m._id === messageId ? { ...m, text: newText, isEdited: true } : m)
        );
        handleClearInteraction();
        setIsMessageLoading(true);

        try {
            const res = await axios.patch(`/api/chats/${activeConversation._id}/messages`, {
                action: "edit",
                messageId: messageId,
                newText: newText
            });

            if (res.status !== 200) {
                throw new Error("Failed to edit message.");
            }
        } catch (err) {
            console.error("Failed to edit message:", err);
            setMessages(prev =>
                prev.map(m => m._id === messageId ? { ...m, text: originalText, isEdited: false } : m)
            );
            Swal.fire({
                title: "Error",
                text: err.message || "Failed to edit message. Please try again.",
                icon: "error",
            });
        } finally {
            setIsMessageLoading(false);
            messageInputRef.current?.focus();
        }
    };

    const handleMessageReact = async (messageId, emoji) => {
        if (!activeConversation?._id || !user?.email) return;

        try {
            setMessages(prev => {
                return prev.map(m => {
                    if (m._id === messageId) {
                        const existingReactions = m.reactions || [];
                        let newReactions = [];
                        const userEmail = user.email;
                        let found = false;

                        newReactions = existingReactions.map(r => {
                            if (r.emoji === emoji) {
                                found = true;
                                const isReacted = r.userEmails?.includes(userEmail);

                                if (isReacted) {
                                    const filteredEmails = r.userEmails.filter(e => e !== userEmail);
                                    return { ...r, count: filteredEmails.length, userEmails: filteredEmails };
                                } else {
                                    return { ...r, count: (r.count || 0) + 1, userEmails: [...(r.userEmails || []), userEmail] };
                                }
                            }
                            return r;
                        }).filter(r => r.count > 0);

                        if (!found) {
                            newReactions.push({ emoji, count: 1, userEmails: [userEmail] });
                        }

                        return { ...m, reactions: newReactions };
                    }
                    return m;
                });
            });

            const res = await axios.patch(`/api/chats/${activeConversation._id}/messages`, {
                action: "react",
                messageId: messageId,
                emoji: emoji,
                userEmail: user.email
            });

            if (res.status !== 200) {
                throw new Error("Failed to update reaction.");
            }
        } catch (err) {
            console.error("Failed to react:", err);
        }
    };


    const otherUserForHeader = useMemo(() => {
        if (!activeConversation) return { name: "", image: null };

        const otherParticipant = activeConversation.participants.find(p => p.email !== user?.email);

        if (otherParticipant) {
            return {
                name: otherParticipant.name || "Unknown User",
                image: otherParticipant.profileImage || null,
            };
        }

        const isCurrentUserCustomer = activeConversation.customerEmail === user?.email;

        return isCurrentUserCustomer
            ? {
                name: activeConversation.mechanicName || activeConversation.ShopName || "Unknown User",
                image: activeConversation.mechanicProfileImage || activeConversation.ShopLogo || null,
            }
            : {
                name: activeConversation.customerName || "Unknown User",
                image: activeConversation.customerProfileImage || null,
            }
    }, [activeConversation, user?.email]);

    // --- Render ---

    return (
        <div className="flex w-full overflow-x-hidden h-full bg-base-200 mx-auto p-4 z-0">
            <style jsx global>{`
                    @keyframes typing-dot {
                        0%, 100% { transform: translateY(0); opacity: 0.5; }
                        50% { transform: translateY(-3px); opacity: 1; }
                    }
        
                    .animate-typing-dot-0 { animation: typing-dot 0.9s infinite ease-in-out; animation-delay: 0s; }
                    .animate-typing-dot-15 { animation: typing-dot 0.9s infinite ease-in-out; animation-delay: 0.15s; }
                    .animate-typing-dot-30 { animation: typing-dot 0.9s infinite ease-in-out; animation-delay: 0.3s; }
                    
                    .hide-scrollbar {
                        scrollbar-width: none;
                        -ms-overflow-style: none;
                    }
        
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>

            <div className="flex flex-1 overflow-hidden border border-neutral bg-base-100 shadow-2xl rounded-xl">
                {/* Conversation List Sidebar */}
                {(!showChat || !isMobileDevice) && (
                    <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col overflow-y-auto border-r border-neutral flex-shrink-0 transition-all duration-300 ease-in-out">
                        <div className="sticky top-0 z-10 bg-base-100 border-b border-neutral">
                            <h2 className="text-2xl font-extrabold text-base-content p-5">
                                <MessageSquare className="w-6 h-6 inline mr-2 text-primary" />
                                Chats
                            </h2>
                        </div>

                        {isLoading ? (
                            <div className="p-6 text-center text-gray-500">
                                <Loader2 className="w-6 h-6 text-primary mx-auto mb-2 animate-spin" />
                                Loading conversations...
                            </div>
                        ) : error ? (
                            <p className="p-4 text-red-500 flex items-center gap-2 bg-red-50 m-4 rounded-lg">
                                <X className="w-4 h-4" />
                                {error}
                            </p>
                        ) : conversations.length === 0 ? (
                            <div className="p-10 text-center text-gray-400">
                                <MessageSquare className="w-10 h-10 mx-auto mb-4 text-gray-300" />
                                <p className="font-semibold text-lg">No conversations yet.</p>
                                <p className="text-sm mt-1">Start a service request to initiate a chat!</p>
                            </div>
                        ) : (
                            <div className="flex flex-col py-2">
                                {conversations.map(conv => {
                                    return (
                                        <ConversationListItem
                                            key={conv._id}
                                            conv={conv}
                                            userId={user?.email}
                                            active={activeConversation?._id === conv._id}
                                            onSelect={handleSelectConversation}
                                            onDeleteUser={handleDeleteChat}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Main Chat Panel */}
                {(activeConversation && (showChat || !isMobileDevice)) ? (
                    <div className={`flex-1 flex flex-col overflow-hidden bg-base-100 ${isMobileDevice && activeConversation ? 'w-full' : ''}`}>
                        <>
                            {/* Chat Header */}
                            <div className="flex-shrink-0 flex items-center justify-between p-4 bg-primary text-white shadow-xl sticky top-0 z-10">
                                <div className="flex items-center gap-3">
                                    {isMobileDevice && (
                                        <button
                                            onClick={handleBackToConversations}
                                            className="p-1 rounded-full hover:bg-white/20 transition"
                                            aria-label="Back to conversations"
                                        >
                                            <ArrowLeft className="w-6 h-6" />
                                        </button>
                                    )}
                                    <AvatarHeader src={otherUserForHeader.image} alt={otherUserForHeader.name} size="small" />
                                    <div className="flex flex-col justify-center">
                                        <p className="font-extrabold text-xl max-w-[200px] sm:max-w-[250px] truncate md:max-w-none md:overflow-visible md:whitespace-normal md:text-ellipsis-none leading-snug">
                                            {otherUserForHeader.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="relative" ref={chatMenuRef}>
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="p-2 rounded-full hover:bg-white/20 transition focus:outline-none focus:ring-2 focus:ring-white"
                                        aria-expanded={isMenuOpen}
                                        aria-controls="chat-menu"
                                        aria-label="Chat options"
                                    >
                                        <MoreVertical className="w-6 h-6" />
                                    </button>
                                    {isMenuOpen && (
                                        <div className="absolute right-0 top-full mt-3 w-56 bg-base-200 rounded-xl shadow-2xl overflow-hidden z-20 border border-neutral">
                                            <button
                                                onClick={handleClearChatHistory}
                                                className="flex items-center gap-3 w-full px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Clear Chat History
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Message Container */}
                            <div
                                ref={messageContainerRef}
                                className="flex-1 p-6 space-y-4 overflow-y-auto hide-scrollbar bg-base-100"
                            >
                                <div className="text-gray-400 text-center py-6">
                                    <div>
                                        {otherUserForHeader.image ? (<img
                                            src={otherUserForHeader.image}
                                            alt={otherUserForHeader.name}
                                            className="h-20 w-20 mx-auto rounded-full object-cover border-2 border-primary"
                                        />
                                        ) : (
                                            <div className="flex items-center justify-center rounded-full text-primary w-fit p-2 border bg-primary/10 mx-auto">
                                                <UserIcon className="h-16 w-16" />
                                            </div>)
                                        }
                                    </div>
                                    <p className="font-semibold text-2xl mt-4 text-gray-600">Start your conversation!</p>
                                    <p className="mt-2">Type a message below to begin chatting with **{otherUserForHeader.name}**.</p>
                                </div>

                                {isMessageLoading && messages.length === 0 ? (
                                    <p className="text-gray-500 text-center py-10 flex justify-center items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                        Fetching messages...
                                    </p>
                                ) : (
                                    messagesWithSeparators.map((item, idx) => {
                                        if (item.type === 'separator') {
                                            return <DateSeparator key={`sep-${item.date}-${idx}`} dateString={item.date} />;
                                        }
                                        const msg = item.data;
                                        const isSender = msg?.sender?.email === user?.email;

                                        return (
                                            <div key={msg?._id || idx} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                                                <MessageBubble
                                                    msg={msg}
                                                    isSender={isSender}
                                                    time={msg?.createdAt}
                                                    isSeen={isSender ? msg.isSeen : false}
                                                    onReact={handleMessageReact}
                                                    onReply={handleMessageReply}
                                                    onEdit={handleMessageEdit}
                                                    onDelete={handleDeleteMessage}
                                                    userId={user?.email}
                                                />
                                            </div>
                                        );
                                    })
                                )}

                                {isOtherUserTyping && (
                                    <div className="flex justify-start">
                                        <TypingBubble />
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Interaction/Input Area */}
                            <div className="flex flex-col flex-shrink-0 p-4 border-t border-neutral gap-3 bg-base-200 sticky bottom-0 z-10 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">

                                {/* Edit Message Input */}
                                {editingMessage && (
                                    <div className="flex items-center gap-3 p-3 bg-base-300 rounded-xl shadow-inner border border-neutral">
                                        <Edit className="w-5 h-5 text-primary flex-shrink-0" />
                                        <input
                                            id="edit-input"
                                            type="text"
                                            value={editInput}
                                            onChange={handleEditInputChange}
                                            className="flex-1 outline-none text-base-content bg-transparent"
                                            onKeyDown={e => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleSaveEdit();
                                                }
                                            }}
                                            disabled={isMessageLoading}
                                        />
                                        <button
                                            onClick={handleSaveEdit}
                                            className="text-primary hover:text-primary/70 font-semibold flex-shrink-0"
                                            disabled={!editInput.trim() || isMessageLoading}
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => handleClearInteraction()}
                                            className="p-1 rounded-full hover:bg-base-100 text-gray-500 transition"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}

                                {/* Reply Preview */}
                                {replyingTo && (
                                    <div className="relative flex items-center p-3 bg-base-300 rounded-xl border-l-4 border-primary shadow-inner self-start w-full">
                                        <CornerDownLeft className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-primary truncate">Replying to {replyingTo.senderName}</p>
                                            <p className="text-sm text-base-content/70 truncate">{replyingTo.text}</p>
                                        </div>
                                        <button
                                            onClick={() => setReplyingTo(null)}
                                            className="p-1 rounded-full hover:bg-base-100 text-gray-500 transition ml-3 flex-shrink-0"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}

                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="relative w-24 h-24 rounded-lg border-2 border-primary/50 self-start shadow-lg">
                                        <img src={imagePreview} alt="Selected preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={handleClearImage}
                                            className="absolute top-0 right-0 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-0.5 transform translate-x-1 -translate-y-1 transition"
                                            aria-label="Remove image"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                {/* Main Input Bar */}
                                {!editingMessage && (
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isMessageLoading}
                                            className="text-base-content p-2 rounded-full hover:bg-base-300 transition disabled:opacity-50"
                                            aria-label="Attach Image"
                                        >
                                            <ImageIcon className="w-6 h-6 text-primary" />
                                        </button>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                        />

                                        <input
                                            id="message-input"
                                            ref={messageInputRef}
                                            type="text"
                                            value={input}
                                            onChange={handleInputChange}
                                            placeholder={imageFile ? "Add a caption..." : (replyingTo ? `Type a reply to ${replyingTo.senderName}` : "Type your message...")}
                                            className="flex-1 border-2 border-neutral outline-none rounded-full px-5 py-3 text-base-content bg-base-100 transition-all duration-200 focus:ring-4 focus:ring-primary/20 focus:border-primary/50 shadow-md placeholder:text-gray-400"
                                            onKeyDown={e => e.key === "Enter" && handleSend()}
                                            disabled={isMessageLoading}
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={(!input.trim() && !imageFile) || isMessageLoading}
                                            className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl shadow-primary/40 hover:bg-primary/90 transition-all duration-200 transform hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:shadow-none"
                                            aria-label="Send Message"
                                        >
                                            {isMessageLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6 -mr-0.5" />}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    </div>
                ) : (
                    /* Default View / No Conversation Selected */
                    <div className={`hidden lg:flex flex-1 items-center justify-center bg-base-100`}>
                        <div className="text-center text-gray-500 p-10">
                            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-xl font-semibold">Select a conversation to start chatting</p>
                            <p className="mt-2 text-sm">Your chats with mechanics and customers will appear here.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MessagePage;