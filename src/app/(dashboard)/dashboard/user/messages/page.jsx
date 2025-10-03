"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import useUser from "@/hooks/useUser";
import {
    User as UserIcon,
    Send,
    Trash2,
    MoreVertical,
    MessageSquare,
    Loader2,
    X,
    ArrowLeft
} from "lucide-react";
import Swal from "sweetalert2";

let socket;

// --- UTILITY FUNCTIONS (Added/Modified) ---

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

// ✨ NEW UTILITY FUNCTION: Formats time for display inside the message bubble
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

// --- COMPONENTS ---

const DateSeparator = ({ dateString }) => (
    <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full shadow-sm">
            {formatDateSeparator(dateString)}
        </span>
        <div className="flex-grow border-t border-gray-200"></div>
    </div>
);


// ✨ UPGRADED COMPONENT: Now accepts 'time' and renders it
const MessageBubble = ({ text, isSender, time }) => (
    <div className="flex flex-col max-w-xs md:max-w-md lg:max-w-lg break-words transition-all duration-300 ease-in-out">
        {/* Message Bubble */}
        <div
            className={`flex flex-col py-2 px-4 rounded-xl text-base ${isSender
                ? "bg-primary text-white rounded-br-md ml-auto shadow-lg shadow-primary/20"
                : "bg-white text-gray-800 rounded-tl-md mr-auto shadow-sm border border-gray-100"
                }`}
        >
            <span>{text}</span>
        </div>

        {/* Timestamp outside the bubble */}
        <span className={`text-xs mt-1 flex ${isSender ? "text-gray-400 self-end" : "text-gray-400 self-start"}`}>
            {formatMessageTime(time)}
        </span>
    </div>
);

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
    const isCurrentUserCustomer = conv.customerId === userId;

    const otherUser = isCurrentUserCustomer
        ? {
            id: conv.mechanicId,
            name: conv.mechanicName || "Unknown User",
            image: conv.mechanicProfileImage,
        }
        : {
            id: conv.customerId,
            name: conv.customerName || "Unknown User",
            image: conv.customerProfileImage,
        };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDeleteUserClick = (e) => {
        e.stopPropagation();
        onDeleteUser(conv);
        setIsMenuOpen(false);
    };

    const timeDisplay = formatRelativeTime(conv.lastMessageAt);

    return (
        <div
            onClick={() => onSelect(conv)}
            className={`group flex items-center gap-4 p-4 mx-3 my-1.5 rounded-lg cursor-pointer transition-all duration-200 ease-in-out relative 
                ${active
                    ? "bg-primary/10 ring-2 ring-primary/20"
                    : "hover:bg-gray-50 border-gray-100"
                }`}
        >
            <Avatar src={otherUser.image} alt={otherUser.name} />

            <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 truncate text-base">{otherUser.name}</p>
                <p className={`text-sm mt-0.5 truncate max-w-[200px] ${active ? "text-primary font-medium" : "text-gray-500"}`}>
                    {conv.lastMessagePreview || conv.serviceTitle || "No messages yet"}
                </p>
            </div>

            <div className={`text-xs text-right flex-shrink-0 w-fit self-start mt-1 ${active ? "text-primary font-bold" : "text-gray-400"}`}>
                {timeDisplay}
            </div>

            <div className="relative z-20 flex-shrink-0" ref={menuRef} onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                    aria-label="Conversation actions"
                >
                    <MoreVertical className="w-5 h-5" />
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 z-30">
                        <button
                            onClick={handleDeleteUserClick}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
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
        <div className="bg-white p-3 rounded-xl rounded-tl-md flex items-center space-x-1.5 shadow-sm border border-gray-100">
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


export default function UserMessagesPage() {
    const { user } = useUser();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [error, setError] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [isMobileDevice, setIsMobileDevice] = useState(
        typeof window !== "undefined" ? window.innerWidth < 1280 : false
    );
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);

    const messagesEndRef = useRef(null);
    const messageContainerRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const chatMenuRef = useRef(null);

    const debouncedStopTyping = useDebouncedCallback(() => {
        if (socket && activeConversation?._id) {
            socket.emit("stopTyping", activeConversation._id, user._id);
        }
        typingTimeoutRef.current = null;
    }, 1500);

    // --- EFFECT: Resize and Mobile Check ---
    useEffect(() => {
        const handleResize = () => setIsMobileDevice(window.innerWidth < 1280);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // --- EFFECT: Handle Menu Outside Click ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatMenuRef.current && !chatMenuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatLastMessage = (msg, senderId, conv) => {
        if (!msg) return "";
        const words = msg.split(" ");
        const truncated = words.length > 7 ? words.slice(0, 7).join(" ") + "..." : msg;

        const otherName = conv.customerId === user?._id ? conv.mechanicName : conv.customerName;
        const displayedName = senderId === user?._id ? "You" : (otherName?.split(" ")[0] || "Them");

        return senderId === user?._id ? `You: ${truncated}` : `${displayedName}: ${truncated}`;
    };

    // --- EFFECT: Fetch Conversations ---
    useEffect(() => {
        if (!user?._id) return;

        const fetchChats = async () => {
            setError(null);
            setIsLoading(true);
            try {
                const res = await axios.get(`/api/chats?userId=${user._id}`);
                const allChats = res.data || [];

                const chatsWithLastMsg = await Promise.all(
                    allChats.map(async conv => {
                        try {
                            const resMsg = await fetch(`/api/chats/${conv._id}/messages`);
                            const data = await resMsg.json();
                            const lastMsg = data?.[data.length - 1];

                            const lastMessageTime = lastMsg?.createdAt || conv.updatedAt || new Date().toISOString();

                            return {
                                ...conv,
                                lastMessagePreview: lastMsg
                                    ? formatLastMessage(lastMsg.text, lastMsg.senderId, conv)
                                    : conv.serviceTitle || "",
                                lastMessageAt: lastMessageTime,
                            };
                        } catch {
                            return { ...conv, lastMessagePreview: conv.serviceTitle || "", lastMessageAt: conv.lastMessageAt || conv.updatedAt };
                        }
                    })
                );

                chatsWithLastMsg.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
                setConversations(chatsWithLastMsg);
            } catch (err) {
                console.error("Error fetching chats:", err);
                setError("Failed to load conversations. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchChats();
    }, [user]);

    // --- EFFECT: Socket Connection and Message Handling ---
    useEffect(() => {
        if (!activeConversation?._id || !user?._id) return;

        if (socket) socket.disconnect();

        socket = io("http://localhost:3001");
        socket.emit("joinChat", activeConversation._id);

        const handleNewMessage = msg => {
            if (msg.chatId === activeConversation._id) {
                if (msg.senderId !== user._id) {
                    setMessages(prev => [...prev, msg]);
                    setIsOtherUserTyping(false);
                }

                setConversations(prev => {
                    const updatedConvs = prev.map(conv =>
                        conv._id === msg.chatId
                            ? {
                                ...conv,
                                lastMessagePreview: formatLastMessage(msg.text, msg.senderId, conv),
                                lastMessageAt: new Date().toISOString(),
                            }
                            : conv
                    );
                    updatedConvs.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
                    return updatedConvs;
                });
            }
        };

        const handleTyping = (chatId, senderId) => {
            if (chatId === activeConversation._id && senderId !== user._id) {
                setIsOtherUserTyping(true);
            }
        };

        const handleStopTyping = (chatId, senderId) => {
            if (chatId === activeConversation._id && senderId !== user._id) {
                setIsOtherUserTyping(false);
            }
        };

        socket.on("newMessage", handleNewMessage);
        socket.on("typing", handleTyping);
        socket.on("stopTyping", handleStopTyping);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("typing", handleTyping);
            socket.off("stopTyping", handleStopTyping);
            socket.disconnect();
        };
    }, [activeConversation?._id, user?._id]);

    // --- EFFECT: Auto Scroll to Bottom ---
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (messageContainerRef.current) {
                const { scrollHeight, clientHeight } = messageContainerRef.current;
                const shouldScroll = scrollHeight - clientHeight <= messageContainerRef.current.scrollTop + 300;
                if (shouldScroll) {
                    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                }
            }
        }, 100);
        return () => clearTimeout(timeout);
    }, [messages, isOtherUserTyping]);

    // --- Message List Processor (Memoized for performance) ---
    const messagesWithSeparators = useMemo(() => {
        if (messages.length === 0) return [];

        const processed = [];
        for (let i = 0; i < messages.length; i++) {
            const currentMsg = messages[i];
            const prevMsg = messages[i - 1];

            // 1. Add Date Separator if it's the first message or a new day
            if (!prevMsg || !isSameDay(new Date(currentMsg.createdAt), new Date(prevMsg.createdAt))) {
                processed.push({
                    type: 'separator',
                    date: currentMsg.createdAt
                });
            }

            // 2. Add the actual message
            processed.push({
                type: 'message',
                data: currentMsg
            });
        }
        return processed;
    }, [messages]);


    const handleSelectConversation = async (conv) => {
        setActiveConversation(conv);
        setMessages([]);
        setIsMenuOpen(false);
        setShowChat(true);
        setIsOtherUserTyping(false);

        setIsMessageLoading(true);
        try {
            const res = await fetch(`/api/chats/${conv._id}/messages`);
            const data = await res.json();
            setMessages(data || []);
        } catch (err) {
            console.error("Error fetching messages:", err);
        } finally {
            setIsMessageLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const text = e.target.value;
        setInput(text);

        if (!socket || !activeConversation?._id) return;

        if (!typingTimeoutRef.current) {
            socket.emit("typing", activeConversation._id, user._id);
        }

        debouncedStopTyping();
    };


    const handleSend = async () => {
        const text = input.trim();
        if (!text || !activeConversation?._id) return;

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        socket.emit("stopTyping", activeConversation._id, user._id);

        const now = new Date().toISOString();
        const msg = { senderId: user._id, text, chatId: activeConversation._id, createdAt: now }; // Added createdAt for optimistic message
        const optimisticMsg = { ...msg, _id: Date.now() };

        setMessages(prev => [...prev, optimisticMsg]);
        setInput("");

        setConversations(prev => {
            const updatedConvs = prev.map(c =>
                c._id === activeConversation._id
                    ? { ...c, lastMessagePreview: formatLastMessage(text, user._id, c), lastMessageAt: now }
                    : c
            );
            updatedConvs.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
            return updatedConvs;
        });

        try {
            const res = await fetch(`/api/chats/${activeConversation._id}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(msg),
            });
            if (!res.ok) throw new Error("Failed to post message");

            socket.emit("sendMessage", msg);

        } catch (err) {
            console.error("Failed to send message:", err);
            setMessages(prev => prev.filter(m => m._id !== optimisticMsg._id));
            Swal.fire({
                title: "Error",
                text: "Failed to send message. Please try again.",
                icon: "error",
            });
        }
    };

    const handleDeleteChat = async (conv) => {
        if (!conv?._id) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete this conversation and all its messages.",
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
            const res = await fetch(`/api/chats?chatId=${conv._id}`, { method: "DELETE" });

            if (res.ok) {
                setConversations(prev => prev.filter(c => c._id !== conv._id));

                if (activeConversation?._id === conv._id) {
                    setActiveConversation(null);
                    setMessages([]);
                    if (isMobileDevice) setShowChat(false);
                }

                await Swal.fire({
                    title: "Deleted!",
                    text: "The chat has been removed successfully.",
                    icon: "success",
                });
            } else {
                const err = await res.json();
                console.error("Delete chat failed:", err.error);

                await Swal.fire({
                    title: "Error",
                    text: err.error || "Failed to delete chat.",
                    icon: "error",
                });
            }
        } catch (err) {
            console.error("Error deleting chat:", err);

            await Swal.fire({
                title: "Error",
                text: "An unexpected error occurred while deleting the chat.",
                icon: "error",
            });
        }
    };

    const handleDeleteMessage = async () => {
        if (!activeConversation?._id) return;
        setIsMenuOpen(false);

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete all messages in this chat? This action cannot be undone.",
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
            const res = await fetch(`/api/chats/${activeConversation._id}/messages`, { method: "DELETE" });

            if (res.ok) {
                setMessages([]);
                setConversations(prev => {
                    const updatedConvs = prev.map(c =>
                        c._id === activeConversation._id ? { ...c, lastMessagePreview: "Chat cleared.", lastMessageAt: new Date().toISOString() } : c
                    );
                    updatedConvs.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
                    return updatedConvs;
                });

                await Swal.fire({
                    title: "Deleted!",
                    text: "All messages have been deleted.",
                    icon: "success",
                });
            } else {
                const err = await res.json();
                console.error("Delete failed:", err.error);

                await Swal.fire({
                    title: "Error",
                    text: "Failed to clear chat: " + (err.error || "Unknown error"),
                    icon: "error",
                });
            }
        } catch (err) {
            console.error("Error clearing chat:", err);
            await Swal.fire({
                title: "Error",
                text: "An unexpected error occurred while clearing the chat.",
                icon: "error",
            });
        }
    };

    const otherUserForHeader = activeConversation ?
        (activeConversation.customerId === user._id ?
            { name: activeConversation.mechanicName, image: activeConversation.mechanicProfileImage } :
            { name: activeConversation.customerName, image: activeConversation.customerProfileImage })
        : { name: "", image: null };

    return (
        <div className="flex w-full overflow-x-hidden h-[calc(100vh-65px)] sm:h-[calc(100vh-77px)] lg:h-[calc(100vh-80px)]  mx-auto p-4">
            <style jsx global>{`
                @keyframes typing-dot {
                    0%, 100% { transform: translateY(0); opacity: 0.5; }
                    50% { transform: translateY(-3px); opacity: 1; }
                }

                .animate-typing-dot-0 { animation: typing-dot 0.9s infinite ease-in-out; animation-delay: 0s; }
                .animate-typing-dot-15 { animation: typing-dot 0.9s infinite ease-in-out; animation-delay: 0.15s; }
                .animate-typing-dot-30 { animation: typing-dot 0.9s infinite ease-in-out; animation-delay: 0.3s; }
                
                /* --- Scrollbar Hiding CSS START --- */
                .hide-scrollbar {
                    /* For Firefox */
                    scrollbar-width: none;
                    /* For IE and Edge */
                    -ms-overflow-style: none;
                }

                /* For Webkit browsers (Chrome, Safari, newer Edge) */
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                /* --- Scrollbar Hiding CSS END --- */
            `}</style>

            <div className="flex flex-1 overflow-hidden border border-gray-200 bg-white shadow-2xl rounded-xl">
                {/* --- Conversation List Panel --- */}
                {(!showChat || !isMobileDevice) && (
                    <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col overflow-y-auto border-r border-gray-100 flex-shrink-0 transition-all duration-300 ease-in-out">
                        <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
                            <h2 className="text-2xl font-extrabold text-gray-800 p-5">
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
                                {conversations.map(conv => (
                                    <ConversationListItem
                                        key={conv._id}
                                        conv={conv}
                                        userId={user?._id}
                                        active={activeConversation?._id === conv._id}
                                        onSelect={handleSelectConversation}
                                        onDeleteUser={handleDeleteChat}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* --- Chat Window Panel --- */}
                {(activeConversation && (showChat || !isMobileDevice)) ? (
                    <div className={`flex-1 flex flex-col overflow-hidden ${isMobileDevice && activeConversation ? 'w-full' : ''}`}>
                        <>
                            {/* Chat Header */}
                            <div className="flex-shrink-0 flex items-center justify-between p-4 bg-primary text-white shadow-xl sticky top-0 z-10">
                                <div className="flex items-center gap-3">
                                    {isMobileDevice && (
                                        <button
                                            onClick={() => setShowChat(false)}
                                            className="p-1 rounded-full hover:bg-white/20 transition"
                                            aria-label="Back to conversations"
                                        >
                                            <ArrowLeft className="w-6 h-6" />
                                        </button>
                                    )}
                                    <AvatarHeader src={otherUserForHeader.image} alt={otherUserForHeader.name} size="small" />
                                    <div className="flex flex-col justify-center">
                                        <p className="font-extrabold text-xl leading-snug">{otherUserForHeader.name}</p>
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
                                        <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-xl shadow-2xl overflow-hidden z-20 border border-gray-100">
                                            <button
                                                onClick={handleDeleteMessage}
                                                className="flex items-center gap-3 w-full px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Clear Chat History
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Message Area */}
                            <div
                                ref={messageContainerRef}
                                className="flex-1 p-6 space-y-4 overflow-y-auto hide-scrollbar"
                                style={{
                                    backgroundColor: '#F7F7F9',
                                }}
                            >
                                {isMessageLoading ? (
                                    <p className="text-gray-500 text-center py-10 flex justify-center items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                        Fetching messages...
                                    </p>
                                ) : messages.length === 0 ? (
                                    <div className="text-gray-400 text-center py-16">
                                        <Send className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p className="font-semibold text-lg text-gray-600">Start your conversation!</p>
                                        <p className="text-sm mt-1">Type a message below to begin chatting with **{otherUserForHeader.name}**.</p>
                                    </div>
                                ) : (
                                    messagesWithSeparators.map((item, idx) => {
                                        if (item.type === 'separator') {
                                            return <DateSeparator key={`sep-${item.date}-${idx}`} dateString={item.date} />;
                                        }

                                        const msg = item.data;
                                        return (
                                            <div key={msg?._id || idx} className={`flex ${msg?.senderId === user?._id ? "justify-end" : "justify-start"}`}>
                                                {/* ✨ KEY CHANGE HERE: Passing createdAt as 'time' prop */}
                                                <MessageBubble
                                                    text={msg?.text}
                                                    isSender={msg?.senderId === user?._id}
                                                    time={msg?.createdAt}
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

                            {/* Input Bar */}
                            <div className="flex items-center justify-center flex-shrink-0 p-4 border-t border-gray-100 gap-3 bg-white sticky bottom-0 z-10 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder="Type your message..."
                                    className="flex-1 border-2 border-gray-200 rounded-full px-5 py-3 text-gray-800 transition-all duration-200 focus:ring-4 focus:ring-primary/20 focus:border-primary/50 shadow-md placeholder:text-gray-400"
                                    onKeyDown={e => e.key === "Enter" && handleSend()}
                                    disabled={isMessageLoading}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isMessageLoading}
                                    className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl shadow-primary/40 hover:bg-primary/90 transition-all duration-200 transform hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:shadow-none"
                                    aria-label="Send Message"
                                >
                                    <Send className="w-6 h-6 -mr-0.5" />
                                </button>
                            </div>
                        </>
                    </div>
                ) : (
                    <div className={`hidden lg:flex flex-1 items-center justify-center bg-gray-50/50`}>
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