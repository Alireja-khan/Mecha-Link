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
    ArrowLeft
} from "lucide-react";
import Swal from "sweetalert2";
import useUser from "@/hooks/useUser"; // Assuming this hook provides user object with email

// --- CONFIGURATION / GLOBAL STATE ---
let socket;

// --- UTILITY FUNCTIONS (Kept from previous version, they are standard date utilities) ---

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

// --- PRESENTATIONAL COMPONENTS (Minimal changes, mostly removing unused props) ---

const DateSeparator = ({ dateString }) => (
    <div className="flex items-center my-6">
        <div className="flex-grow border-t border-neutral"></div>
        <span className="flex-shrink mx-4 text-xs font-medium text-base-content bg-base-300/50 px-3 py-1 rounded-full shadow-sm">
            {formatDateSeparator(dateString)}
        </span>
        <div className="flex-grow border-t border-neutral"></div>
    </div>
);

const MessageBubble = ({ text, isSender, time }) => (
    <div className="flex flex-col max-w-xs md:max-w-md lg:max-w-lg break-words transition-all duration-300 ease-in-out">
        <div
            className={`flex flex-col py-2 px-4 rounded-xl text-base ${isSender
                ? "bg-primary text-white rounded-br-md ml-auto shadow-lg shadow-primary/20"
                : "bg-base-200 text-base-content rounded-tl-md mr-auto shadow-sm border border-neutral"
                }`}
        >
            <span>{text}</span>
        </div>

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

// --- NEW/UPDATED ConversationListItem Component ---
const ConversationListItem = ({ conv, userEmail, active, onSelect, onDeleteUser }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // LOGIC CHANGE: Find the *other* participant from the array
    const otherUser = useMemo(() => {
        return conv.participants.find(p => p.email !== userEmail) || {
            name: "Unknown User",
            profileImage: null,
            email: "N/A"
        };
    }, [conv.participants, userEmail]);

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
    
    // Fallback preview logic for the new structure:
    const lastMessagePreview = conv.lastMessagePreview || "Start conversation...";

    return (
        <div
            onClick={() => onSelect(conv)}
            className={`group flex items-center gap-4 p-4 mx-3 my-1.5 rounded-lg border cursor-pointer transition-all duration-200 ease-in-out relative
                    ${active
                    ? "bg-primary/10 border-2 border-primary/20"
                    : "hover:bg-base-300/30 border-base-300/50"
                }`}
        >
            <Avatar src={otherUser.profileImage} alt={otherUser.name} />

            <div className="flex-1 min-w-0">
                <p className="font-bold max-w-[200px] truncate text-base">{otherUser.name}</p>
                <p className={`text-sm mt-0.5 truncate max-w-[150px] ${active ? "text-primary font-medium" : "text-gray-500"}`}>
                    {lastMessagePreview}
                </p>
            </div>

            <div className={`text-xs text-right flex-shrink-0 w-fit self-start mt-1 ${active ? "text-primary font-bold" : "text-gray-400"}`}>
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
        <div className="bg-base-300/50 p-3 rounded-xl rounded-tl-md flex items-center space-x-1.5 shadow-sm border border-base-content/10">
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

// --- MAIN COMPONENT (Centralized Logic Changes) ---

export default function MessagesPage() {
    const { user } = useUser();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [error, setError] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);

    // Refs
    const messagesEndRef = useRef(null);
    const messageContainerRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const chatMenuRef = useRef(null);
    const inputRef = useRef(null);

    const [isMobileDevice, setIsMobileDevice] = useState(
        typeof window !== "undefined" ? window.innerWidth < 1024 : false
    );

    const debouncedStopTyping = useDebouncedCallback(() => {
        if (socket && activeConversation?._id) {
            socket.emit("stopTyping", activeConversation._id, user.email);
        }
        typingTimeoutRef.current = null;
    }, 1500);

    // --- Effects & Utility Logic ---

    // Mobile/Resize/ClickOutside Effects
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

    /**
     * LOGIC CHANGE: Format Last Message Preview for the new structure.
     * It now finds the other user from the participants array.
     */
    const formatLastMessage = useCallback((msg, senderId, conv) => {
        if (!msg) return "Start conversation...";
        const words = msg.split(" ");
        const truncated = words.length > 7 ? words.slice(0, 7).join(" ") + "..." : msg;

        const isSenderCurrentUser = senderId === user?.email;

        const otherUser = conv.participants.find(p => p.email !== user?.email);
        const otherName = otherUser?.name;

        const displayedName = isSenderCurrentUser ? "You" : (otherName?.split(" ")[0] || "Them");

        return isSenderCurrentUser ? `You: ${truncated}` : `${displayedName}: ${truncated}`;
    }, [user?.email]);

    /**
     * LOGIC CHANGE: Fetch chats based on the new structure.
     * Assuming the API endpoint `/api/chats` can find chats where `user.email`
     * is present in the `participants` array.
     */
    useEffect(() => {
        if (!user?.email) return;

        const fetchChats = async () => {
            setError(null);
            setIsLoading(true);
            try {
                // Fetch chats using user email, assuming the backend handles the participants array lookup
                const res = await axios.get(`/api/chats?userEmail=${user.email}`);
                const allChats = res.data || [];

                // Filter/map to ensure structure consistency
                const chatsWithLastMsg = await Promise.all(
                    allChats.map(async conv => {
                        // Check if the current user is actually a participant (redundant if API filters, but safer)
                        const isParticipant = conv.participants.some(p => p.email === user.email);
                        if (!isParticipant) return null;

                        try {
                            // Fetch messages if your backend doesn't embed them
                            const resMsg = await fetch(`/api/chats/${conv._id}/messages`);
                            const data = await resMsg.json();
                            const lastMsg = data?.[data.length - 1];

                            const lastMessageTime = lastMsg?.createdAt || conv.lastMessageAt || new Date().toISOString();

                            return {
                                ...conv,
                                lastMessagePreview: lastMsg
                                    ? formatLastMessage(lastMsg.text, lastMsg.senderId, conv)
                                    : "Start conversation...",
                                lastMessageAt: lastMessageTime,
                            };
                        } catch {
                            return {
                                ...conv,
                                lastMessagePreview: "Error loading preview",
                                lastMessageAt: conv.lastMessageAt || conv.updatedAt || new Date().toISOString()
                            };
                        }
                    })
                );

                const validChats = chatsWithLastMsg.filter(c => c !== null);
                validChats.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
                setConversations(validChats);

            } catch (err) {
                console.error("Error fetching chats:", err);
                setError("Failed to load conversations. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchChats();
    }, [user?.email, formatLastMessage]);

    // Socket Setup
    useEffect(() => {
        if (!activeConversation?._id || !user?.email) return;

        if (socket) socket.disconnect();
        // NOTE: Replace with your actual backend socket URL
        socket = io("https://mechalink-socket-server-production.up.railway.app/");
        socket.emit("joinChat", activeConversation._id);

        const handleNewMessage = msg => {
            if (msg.chatId === activeConversation._id) {
                if (msg.senderId !== user.email) {
                    setMessages(prev => [...prev, msg]);
                    setIsOtherUserTyping(false);
                }

                setConversations(prev => {
                    const updatedConvs = prev.map(conv =>
                        conv._id === msg.chatId
                            ? { ...conv, lastMessagePreview: formatLastMessage(msg.text, msg.senderId, conv), lastMessageAt: msg.createdAt }
                            : conv
                    );
                    updatedConvs.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
                    return updatedConvs;
                });
            }
        };

        const handleTyping = (chatId, senderId) => {
            if (chatId === activeConversation._id && senderId !== user.email) {
                setIsOtherUserTyping(true);
            }
        };

        const handleStopTyping = (chatId, senderId) => {
            if (chatId === activeConversation._id && senderId !== user.email) {
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
    }, [activeConversation?._id, user?.email, formatLastMessage]);

    // Auto-scroll messages Effect
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
    }, [messages, isOtherUserTyping, isMessageLoading]);

    // Message List Processor (with date separators)
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

    // --- Handlers ---
    const handleSelectConversation = async conv => {
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

        if (!socket || !activeConversation?._id || !user?.email) return;

        if (!typingTimeoutRef.current) {
            socket.emit("typing", activeConversation._id, user.email);
        }

        debouncedStopTyping();
    };

    const handleSend = async () => {
        const text = input.trim();
        if (!text || !activeConversation?._id || !user?.email) return;

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        socket.emit("stopTyping", activeConversation._id, user.email);

        const now = new Date().toISOString();

        // The message object should use senderId for identification
        const msgToSend = {
            senderId: user.email,
            text,
            chatId: activeConversation._id,
            senderName: user.name, // Assuming user has a name field
        };

        const optimisticMsg = {
            ...msgToSend,
            _id: Date.now(),
            createdAt: now,
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setInput("");
        inputRef.current?.focus();

        setConversations(prev => {
            const updatedConvs = prev.map(c =>
                c._id === activeConversation._id
                    ? { ...c, lastMessagePreview: formatLastMessage(text, user.email, c), lastMessageAt: now }
                    : c
            );
            updatedConvs.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
            return updatedConvs;
        });

        try {
            const res = await fetch(`/api/chats/${activeConversation._id}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(msgToSend),
            });
            if (!res.ok) throw new Error("Failed to post message");

            socket.emit("sendMessage", optimisticMsg);
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
                        c._id === activeConversation._id ? { ...c, lastMessagePreview: "Chat cleared.", lastMessageAt: new Date().toISOString() } : c
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

    // LOGIC CHANGE: Get Other User for Header
    const otherUserForHeader = useMemo(() => {
        if (!activeConversation || !user?.email) return { name: "", image: null, email: "" };

        const other = activeConversation.participants.find(p => p.email !== user.email);

        return {
            name: other?.name || "Unknown User",
            image: other?.profileImage || null,
            email: other?.email || "N/A"
        };
    }, [activeConversation, user?.email]);


    return (
        <div className="flex w-full overflow-x-hidden h-full bg-base-200 mx-auto p-4">
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
                {/* --- Conversation List Panel --- */}
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
                                <p className="text-sm mt-1">Start chatting with a new user to begin!</p>
                            </div>
                        ) : (
                            <div className="flex flex-col py-2">
                                {conversations.map(conv => (
                                    <ConversationListItem
                                        key={conv._id}
                                        conv={conv}
                                        userEmail={user?.email}
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
                    <div className={`flex-1 flex flex-col overflow-hidden bg-base-100 ${isMobileDevice && activeConversation ? 'w-full' : ''}`}>
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
                                        <p className="font-extrabold text-xl max-w-[200px] sm:max-w-[250px] truncate md:max-w-none md:overflow-visible md:whitespace-normal md:text-ellipsis-none leading-snug">
                                            {otherUserForHeader.name}
                                        </p>
                                        <p className="text-sm opacity-80">{otherUserForHeader.email}</p>
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
                                                onClick={handleDeleteMessage}
                                                className="flex items-center gap-3 w-full px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
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
                                className="flex-1 p-6 space-y-4 overflow-y-auto hide-scrollbar bg-base-100"
                            >
                                {isMessageLoading ? (
                                    <p className="text-gray-500 text-center py-10 flex justify-center items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                        Fetching messages...
                                    </p>
                                ) : messagesWithSeparators.length === 0 ? (
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
                                            <div key={msg?._id || idx} className={`flex ${msg?.senderId === user?.email ? "justify-end" : "justify-start"}`}>
                                                <MessageBubble
                                                    text={msg?.text}
                                                    isSender={msg?.senderId === user?.email}
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
                            <div className="flex items-center justify-center flex-shrink-0 p-4 border-t border-neutral gap-3 bg-base-200 sticky bottom-0 z-10 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder="Type your message..."
                                    className="flex-1 border-2 border-neutral outline-none rounded-full px-5 py-3 text-base-content transition-all duration-200 focus:ring-4 focus:ring-primary/20 focus:border-primary/50 shadow-md placeholder:text-gray-400"
                                    onKeyDown={e => e.key === "Enter" && handleSend()}
                                    disabled={isMessageLoading}
                                    ref={inputRef}
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
                    <div className={`hidden lg:flex flex-1 items-center justify-center bg-base-100`}>
                        <div className="text-center text-gray-500 p-10">
                            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-xl font-semibold">Select a conversation to start chatting</p>
                            <p className="mt-2 text-sm">Your chats will appear here.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}