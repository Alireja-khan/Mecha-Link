"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { User as UserIcon, MessageSquare } from "lucide-react";
import Swal from "sweetalert2";

export default function UserMessagesPage() {
    const { user: loggedInUser } = useUser();
    const router = useRouter();
    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!loggedInUser?._id) {
            setIsLoading(false);
            return;
        }

        const fetchChats = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await axios.get("/api/chats");
                // Filter out null/invalid conversations and match customerId
                const filtered = (res.data || []).filter(
                    (conv) => conv && conv.customerId === loggedInUser._id
                );
                setConversations(filtered);
            } catch (err) {
                console.error("Error fetching chats:", err);
                setError("Failed to load conversations. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchChats();
    }, [loggedInUser]);

    const handleMessageClick = (conversationId, mechanicName) => {
        if (!conversationId) return; // Safety check
        Swal.fire({
            title: `Chat with ${mechanicName || "Unknown Mechanic"}`,
            text: "Do you want to open this chat?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, open chat",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#ea580c",
        }).then((result) => {
            if (result.isConfirmed) {
                router.push(`/dashboard/user/messages/${conversationId}`);
            }
        });
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-4xl text-center font-extrabold mb-12 text-orange-600 pb-2">
                Messages with Mechanics
            </h1>

            {isLoading ? (
                <p className="text-center text-lg text-orange-500">Loading conversations...</p>
            ) : error ? (
                <p className="text-center text-lg text-red-500">{error}</p>
            ) : conversations.length === 0 ? (
                <div className="p-10 border border-gray-200 rounded-xl bg-gray-50 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-lg text-gray-600">
                        You have not started any conversations with mechanics yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {conversations.map((conv) => (
                        <div
                            key={conv?._id || Math.random()} // Safe key fallback
                            className="bg-white border border-gray-200 rounded-xl shadow-lg 
                                       hover:shadow-2xl transition-all duration-300 ease-in-out 
                                       flex flex-col overflow-hidden"
                        >
                            <div className="p-5 bg-orange-50 border-b border-orange-100 flex items-center gap-4">
                                {conv?.mechanicProfileImage ? (
                                    <img
                                        src={conv.mechanicProfileImage}
                                        alt={conv?.mechanicName || "Mechanic"}
                                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                                    />
                                ) : (
                                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-orange-200 border-2 border-white shadow-md">
                                        <UserIcon className="w-7 h-7 text-orange-700" />
                                    </div>
                                )}
                                <h2 className="text-xl font-bold text-gray-800 leading-tight">
                                    {conv?.mechanicName || "Unknown Mechanic"}
                                </h2>
                            </div>

                            <div className="p-5 flex-1 space-y-3">
                                <div className="text-sm">
                                    <p className="font-medium text-gray-500">Service Request:</p>
                                    <p className="text-gray-800 font-semibold truncate">
                                        {conv?.serviceTitle || conv?.serviceRequestId || "N/A"}
                                    </p>
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium text-gray-500">Mechanic Id:</p>
                                    <p className="text-gray-800 font-mono text-xs overflow-hidden truncate">
                                        {conv?.mechanicId || "Not available"}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 pt-0">
                                <button
                                    onClick={() => handleMessageClick(conv?._id, conv?.mechanicName)}
                                    className="w-full flex items-center justify-center gap-2 
                                               px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg 
                                               hover:bg-orange-700 transition-colors duration-200 
                                               shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-300"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    Start Chat
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
