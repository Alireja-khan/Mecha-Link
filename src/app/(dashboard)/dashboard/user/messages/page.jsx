"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import useUser from "@/hooks/useUser";
import { User as UserIcon, Send, Trash2, MoreVertical, MessageSquare, Loader2, X, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

let socket;

const MessageBubble = ({ text, isSender }) => (
    <div
        className={`p-3 rounded-xl max-w-xs md:max-w-md lg:max-w-lg break-words shadow-md transition-all duration-300 ease-in-out ${isSender
            ? "bg-primary text-white rounded-br-sm ml-auto"
            : "bg-white text-gray-800 rounded-tl-sm border border-gray-100 shadow-sm mr-auto"
            }`}
    >
        {text}
    </div>
);

const Avatar = ({ src, alt }) => {
    return src ? (
        <img
            src={src}
            alt={alt}
            className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-colors duration-200"
        />
    ) : (
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserIcon className="w-6 h-6" />
        </div>
    );
};

// Updated ConversationListItem to show "Delete User" option
const ConversationListItem = ({ conv, active, onSelect, onDeleteUser }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
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
        e.stopPropagation(); // Prevent the main conversation selection
        onDeleteUser(conv);
        setIsMenuOpen(false);
    };

    return (
        <div
            onClick={() => onSelect(conv)}
            className={`group flex items-center gap-4 p-4 cursor-pointer transition-all duration-200 ease-in-out border-b border-gray-100 last:border-b-0 relative ${active ? "bg-primary/10 border-r-4 border-primary" : "hover:bg-gray-100"
                }`}
        >
            {/* Show Mechanic's image and name */}
            <Avatar src={conv?.mechanicProfileImage} alt={conv.mechanicName} />
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate text-base">{conv.mechanicName || "Unknown Mechanic"}</p>
                <p className={`text-sm ${active ? "text-primary font-medium" : "text-gray-500"} truncate`}>
                    {conv.lastMessagePreview || conv.serviceTitle || "No messages yet"}
                </p>
            </div>

            {/* 3-dot Menu for Delete Chat Action */}
            <div className="relative z-20 flex-shrink-0" ref={menuRef} onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                    aria-label="Conversation actions"
                >
                    <MoreVertical className="w-5 h-5" />
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
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

export default function UserMessagesPage() {
    const { user } = useUser();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [error, setError] = useState(null);
    const [showChat, setShowChat] = useState(false); // for mobile view
    const [isMobileDevice, setIsMobileDevice] = useState(
        typeof window !== "undefined" ? window.innerWidth < 1024 : false
    ); // detect mobile/tablet
    const messagesEndRef = useRef(null);
    const [isMessageLoading, setIsMessageLoading] = useState(false);

    // Detect mobile devices (<1024px) dynamically
    useEffect(() => {
        const handleResize = () => setIsMobileDevice(window.innerWidth < 1024);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const formatLastMessage = (msg, senderId, senderName) => {
        if (!msg) return "";
        const words = msg.split(" ");
        const truncated = words.length > 7 ? words.slice(0, 7).join(" ") + "..." : msg;
        // Logic for User perspective: Sender is Mechanic if senderId != user._id
        const displayedName = senderId === user._id ? "You" : senderName;
        return senderId === user._id ? `You: ${truncated}` : `${displayedName.split(" ")[0]}: ${truncated}`;
    };

    useEffect(() => {
        if (!user?._id) return;

        const fetchChats = async () => {
            setError(null);
            setIsLoading(true);
            try {
                const res = await axios.get("/api/chats");
                // Filter chats for the logged-in user (customer)
                const filtered = (res.data || []).filter(conv => conv && conv.customerId === user._id);

                const chatsWithLastMsg = await Promise.all(
                    filtered.map(async conv => {
                        try {
                            const resMsg = await fetch(`/api/chats/${conv._id}/messages`);
                            const data = await resMsg.json();
                            const lastMsg = data?.[data.length - 1];
                            if (lastMsg) {
                                return {
                                    ...conv,
                                    // Pass mechanicName for display if sender isn't "You"
                                    lastMessagePreview: formatLastMessage(lastMsg.text, lastMsg.senderId, conv.mechanicName),
                                };
                            }
                            return { ...conv, lastMessagePreview: conv.serviceTitle || "" };
                        } catch {
                            return { ...conv, lastMessagePreview: conv.serviceTitle || "" };
                        }
                    })
                );

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

    useEffect(() => {
        if (!activeConversation?._id || !user?._id) return;

        if (socket) socket.disconnect();

        socket = io("http://localhost:3001");
        socket.emit("joinChat", activeConversation._id);

        const handleNewMessage = msg => {
            if (msg.chatId === activeConversation._id) {
                if (msg.senderId !== user._id) {
                    setMessages(prev => [...prev, msg]);
                }

                setConversations(prev =>
                    prev.map(conv =>
                        conv._id === msg.chatId
                            ? {
                                ...conv,
                                // Update conversation list with new last message
                                lastMessagePreview: formatLastMessage(msg.text, msg.senderId, conv.mechanicName),
                            }
                            : conv
                    )
                );
            }
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.disconnect();
        };
    }, [activeConversation?._id, user?._id]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timeout);
    }, [messages]);

    const handleSelectConversation = async (conv) => {
        setActiveConversation(conv);
        setMessages([]);
        setIsMenuOpen(false);
        setShowChat(true);

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

    const handleSend = async () => {
        const text = input.trim();
        if (!text || !activeConversation?._id) return;

        const msg = { senderId: user._id, text, chatId: activeConversation._id };
        const optimisticMsg = { ...msg, _id: Date.now(), createdAt: new Date().toISOString() };
        setMessages(prev => [...prev, optimisticMsg]);
        setInput("");

        setConversations(prev =>
            prev.map(c =>
                c._id === activeConversation._id
                    ? { ...c, lastMessagePreview: formatLastMessage(text, user._id, "You") }
                    : c
            )
        );

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
            // Optionally, show an error toast/sweetalert here
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
                container: 'z-30' // Ensure SweetAlert is above all other modals/elements
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
                container: 'z-30' // Ensure SweetAlert is above all other modals/elements
            }
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch(`/api/chats/${activeConversation._id}/messages`, { method: "DELETE" });

            if (res.ok) {
                setMessages([]);
                setConversations(prev =>
                    prev.map(c =>
                        c._id === activeConversation._id ? { ...c, lastMessagePreview: "Chat cleared." } : c
                    )
                );

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


    return (
        <div className="flex flex-1 overflow-hidden">
            <div className="flex flex-1 overflow-hidden border border-gray-200 bg-white shadow-2xl">
                {/* Conversation List */}
                {(!showChat || !isMobileDevice) && (
                    <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col overflow-y-auto">
                        <div className="sticky top-0 z-10 bg-white shadow-sm">
                            <h2 className="text-2xl font-extrabold text-gray-800 p-5 border-b border-gray-100">
                                <MessageSquare className="w-6 h-6 inline mr-2 text-primary" />
                                Chats
                            </h2>
                        </div>

                        {isLoading ? (
                            <div className="p-6 text-center text-gray-500">
                                <Loader2 className="w-6 h-6 text-primary-500 mx-auto mb-2 animate-spin" />
                                Loading conversations...
                            </div>
                        ) : error ? (
                            <p className="p-4 text-red-500 flex items-center gap-2 bg-red-50 m-4 rounded">
                                <X className="w-4 h-4" />
                                {error}
                            </p>
                        ) : conversations.length === 0 ? (
                            <div className="p-10 text-center text-gray-500">
                                <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                <p className="font-semibold text-lg">No conversations yet.</p>
                                <p className="text-sm mt-1">Mechanics will appear here when you contact them.</p>
                            </div>
                        ) : (
                            conversations.map(conv => (
                                <ConversationListItem
                                    key={conv._id}
                                    conv={conv}
                                    active={activeConversation?._id === conv._id}
                                    onSelect={handleSelectConversation}
                                    onDeleteUser={handleDeleteChat} // Renamed to onDeleteUser for consistency with Mechanic page, but performs handleDeleteChat
                                />
                            ))
                        )}
                    </div>
                )}

                {/* Chat Panel */}
                {(showChat || !isMobileDevice) && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {activeConversation ? (
                            <>
                                {/* Header */}
                                <div className="flex-shrink-0 flex items-center justify-between p-4 bg-primary text-white shadow-lg sticky top-0 z-10">
                                    <div className="flex items-center gap-3">
                                        {isMobileDevice && (
                                            <button onClick={() => setShowChat(false)}>
                                                <ArrowLeft className="w-6 h-6 mr-2" />
                                            </button>
                                        )}
                                        {activeConversation?.mechanicProfileImage ? (
                                            <img
                                                src={activeConversation.mechanicProfileImage}
                                                alt={activeConversation.mechanicName}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/30">
                                                <UserIcon className="w-5 h-5" />
                                            </div>
                                        )}
                                        <p className="font-extrabold text-xl">{activeConversation.mechanicName}</p>
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                                            className="p-2 rounded-full hover:bg-white/20 transition focus:outline-none focus:ring-2 focus:ring-white"
                                            aria-expanded={isMenuOpen}
                                            aria-controls="chat-menu"
                                        >
                                            <MoreVertical className="w-6 h-6" />
                                        </button>
                                        {isMenuOpen && (
                                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl overflow-hidden z-20 border border-gray-100 transform translate-y-1 transition-all duration-200">
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

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                                    {isMessageLoading ? (
                                        <p className="text-gray-500 text-center py-10 flex justify-center items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Fetching messages...
                                        </p>
                                    ) : messages.length === 0 ? (
                                        <div className="text-gray-400 text-center py-16">
                                            <Send className="w-12 h-12 mx-auto mb-4" />
                                            <p className="font-semibold text-lg">Start your conversation!</p>
                                            <p className="text-sm">Type a message below to begin chatting with {activeConversation.mechanicName}.</p>
                                        </div>
                                    ) : (
                                        messages.map((msg, idx) => (
                                            <div key={msg?._id || idx} className={`flex ${msg?.senderId === user?._id ? "justify-end" : "justify-start"}`}>
                                                <MessageBubble text={msg?.text} isSender={msg?.senderId === user?._id} />
                                            </div>
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="flex items-center justify-center flex-shrink-0 p-4 border-t border-gray-200 gap-4 bg-white sticky bottom-0 z-10">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 border-2 border-gray-200 rounded-full px-5 py-3 text-gray-800 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 shadow-inner"
                                        onKeyDown={e => e.key === "Enter" && handleSend()}
                                        disabled={isMessageLoading}
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!input.trim() || isMessageLoading}
                                        className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-primary/50 hover:bg-primary transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:shadow-none"
                                    >
                                        <Send className="w-6 h-6 " />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                                <MessageSquare className="w-20 h-20 mb-4" />
                                <p className="text-xl font-bold">Welcome to your Message Center</p>
                                <p className="mt-2 text-lg">Select a conversation from the left to start chatting.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}