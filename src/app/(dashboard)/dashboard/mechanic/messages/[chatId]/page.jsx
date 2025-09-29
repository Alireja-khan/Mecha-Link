"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import useUser from "@/hooks/useUser";
import { User as UserIcon, Send, Trash2, MoreVertical } from "lucide-react";

let socket;

export default function MechanicChatPage() {
    const { chatId } = useParams();
    const { user } = useUser();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for the menu
    const messagesEndRef = useRef(null);

    // Initialize Socket.IO and join chat room
    useEffect(() => {
        if (!chatId || !user?._id) return;

        socket = io("http://localhost:3001");
        socket.emit("joinChat", chatId);

        socket.on("newMessage", (msg) => {
            if (msg.senderId !== user._id) {
                setMessages((prev) => [...prev, msg]);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [chatId, user?._id]);

    // Fetch initial messages from backend
    useEffect(() => {
        if (!chatId) return;

        const fetchMessages = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`/api/chats/${chatId}/messages`);
                const data = await res.json();
                setMessages(data || []);
            } catch (err) {
                console.error("Error fetching messages:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, [chatId]);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Send message
    const handleSend = async () => {
        if (!input.trim() || !user?._id) return;

        const msg = {
            senderId: user._id,
            text: input.trim(),
            chatId,
        };

        // Optimistic UI
        setMessages((prev) => [...prev, { ...msg, createdAt: new Date().toISOString() }]);
        setInput("");

        // Save to backend
        try {
            await fetch(`/api/chats/${chatId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(msg),
            });
        } catch (err) {
            console.error("Failed to save message:", err);
        }

        // Emit for real-time
        socket.emit("sendMessage", msg);
    };

    const handleDeleteChat = async () => {
        if (!chatId) return;
        setIsMenuOpen(false);

        try {
            const res = await fetch(`/api/chats/${chatId}/messages`, {
                method: "DELETE",
            });

            if (res.ok) {
                setMessages([]); // clear UI
            } else {
                const err = await res.json();
                console.error("Delete failed:", err.error);
                alert("Failed to clear chat: " + err.error);
            }
        } catch (err) {
            console.error("Error clearing chat:", err);
            alert("Something went wrong while clearing chat.");
        }
    };

    return (
        <div className="p-4">
            <div className="flex flex-col h-[85vh] max-w-4xl mx-auto border border-gray-200 rounded-xl shadow-2xl overflow-hidden bg-white transition-all duration-300">
                {/* Header with 3-dot menu */}
                <div className="flex items-center justify-between p-4 bg-orange-600 text-white shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                            <UserIcon className="w-8 h-8" />
                        </div>
                        <h1 className="text-xl font-semibold">Chat with Customer</h1>
                    </div>

                    {/* 3-dot Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-full hover:bg-white/20 transition-colors"
                            aria-label="Chat options menu"
                        >
                            <MoreVertical className="w-6 h-6" />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden z-10 border border-gray-100">
                                <button
                                    onClick={handleDeleteChat}
                                    className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Chat
                                </button>
                                {/* Add more options here if needed */}
                            </div>
                        )}
                    </div>
                </div>

                {/* Message Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {isLoading ? (
                        <p className="text-gray-500 text-center py-10">Loading messages...</p>
                    ) : messages.length === 0 ? (
                        <p className="text-gray-500 text-center py-10">
                            Start your conversation now! 🚀
                        </p>
                    ) : (
                        messages.map((msg, idx) => (
                            <div
                                key={msg?._id || idx}
                                className={`flex ${msg?.senderId === user?._id ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`p-3 rounded-2xl max-w-sm sm:max-w-md break-words shadow-md transition-all duration-200 ${msg?.senderId === user?._id
                                        ? "bg-orange-500 text-white rounded-br-none" // User's message
                                        : "bg-white text-gray-800 rounded-tl-none border border-gray-100" // Other person's message
                                        }`}
                                >
                                    {msg?.text}
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input and Send Button */}
                <div className="p-4 border-t border-gray-200 flex gap-3 bg-white">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message here..."
                        className="flex-1 border border-gray-300 rounded-full px-5 py-3 text-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 focus:outline-none"
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        disabled={isLoading} // Disable input while loading
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        aria-label="Send message"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
