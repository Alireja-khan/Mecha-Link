import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { URL } from 'url';

const SOCKET_EMIT_URL = "http://localhost:3001/api/socket/emit";

// Simple stub functions
const encryptMessage = (text) => text;
const decryptMessage = (text) => text;

function isValidObjectId(id) {
    try {
        return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
    } catch {
        return false;
    }
}

async function triggerSocketEmit(chatId, action, data) {
    try {
        const res = await fetch(SOCKET_EMIT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatId, action, data }),
        });

        if (!res.ok) {
            const errorBody = await res.text();
            console.error("Failed to push event to socket server. Status:", res.status, "Body:", errorBody);
        } else {
        }
    } catch (err) {
        console.error("Error connecting to socket server:", err.message);
    }
}

// --- GET Messages ---
// (No changes needed here for the unread feature)
export async function GET(req, { params }) {
    const { chatId } = params;
    if (!chatId || !isValidObjectId(chatId)) return new Response(JSON.stringify({ error: "Invalid chatId" }), { status: 400 });

    try {
        const chatsCollection = await dbConnect("chats");

        const url = new URL(req.url, `http://${req.headers.host}`);
        const limit = url.searchParams.get("limit");

        let projection = { messages: 1 };

        if (limit === "1") {
            projection = { messages: { $slice: -1 } };
        }

        const chat = await chatsCollection.findOne(
            { _id: new ObjectId(chatId) },
            { projection }
        );

        if (!chat) return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });

        const messagesArray = chat.messages || [];

        const decryptedMessages = messagesArray.map(msg => ({
            ...msg,
            text: decryptMessage(msg.text),
            imageUrl: msg.imageUrl || null,
            _id: msg._id.toString(),
            replyTo: msg.replyTo || null,
            reactions: msg.reactions || [],
            isEdited: msg.isEdited || false,
            deletedBy: msg.deletedBy || null,
        }));

        return new Response(JSON.stringify(decryptedMessages), { headers: { "Content-Type": "application/json" }, status: 200 });
    } catch (err) {
        console.error("GET /api/chats/[chatId]/messages failed:", err);
        return new Response(JSON.stringify({ error: "Failed to fetch messages" }), { status: 500 });
    }
}

// --- POST New Message (Updated to increment unreadCount) ---

export async function POST(req, { params }) {
    const { chatId } = params;
    if (!chatId || !isValidObjectId(chatId))
        return new Response(JSON.stringify({ error: "Invalid chatId" }), { status: 400 });

    try {
        const body = await req.json();
        // Assume 'sender' and 'receiver' in the body are full objects sent from the client
        const { sender, receiver, text, optimisticId, replyTo } = body;

        if (!sender?.userId || !receiver?.userId || !text || !optimisticId)
            return new Response(JSON.stringify({ error: "Missing required message data (sender.userId, receiver.userId, text, or optimisticId)" }), { status: 400 });

        const chatsCollection = await dbConnect("chats");
        const usersCollection = await dbConnect("users");
        const now = new Date();
        const newMessageId = new ObjectId();
        const encryptedText = encryptMessage(text);

        // --- FETCHING USER INFO ---
        // We'll rely on the client providing the full sender/receiver objects in the request body.
        // We only need to ensure their 'userId' is a valid ObjectId if we want to query by it later.

        // Use the data directly from the body for the message structure
        const messageSender = {
            userId: sender.userId,
            email: sender.email,
            name: sender.name,
            profileImage: sender.profileImage || "",
        };

        const messageReceiver = {
            userId: receiver.userId,
            email: receiver.email,
            name: receiver.name,
            profileImage: receiver.profileImage || "",
        };

        const newMessage = {
            _id: newMessageId,
            // 🔥 CRITICAL CHANGE: Store the full participant objects
            sender: messageSender,
            receiver: messageReceiver,

            text: encryptedText,
            isSeen: false,
            createdAt: now,
            chatId,
            isEdited: false,
            reactions: [],
            replyTo: replyTo || null,
            deletedBy: null,
        };

        const updateOperations = {
            $push: { messages: newMessage },
            $set: { lastMessageAt: now, updatedAt: now },
            // Increment the recipient's unreadCount using the receiver's email
            $inc: { "participants.$[receiver].unreadCount": 1 }
        };

        const arrayFilters = [
            // Filter to target the specific recipient within the participants array using email
            { "receiver.email": receiver.email }
        ];

        const result = await chatsCollection.updateOne(
            { _id: new ObjectId(chatId) },
            updateOperations,
            { arrayFilters }
        );

        if (result.matchedCount === 0)
            return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });

        // The final message object that will be stored in the DB and sent to the client
        const savedMsgForClient = {
            ...newMessage,
            text: decryptMessage(encryptedText), // Decrypt for the client
            _id: newMessageId.toString(),
            // sender and receiver are already full objects
        };

        // Pass the data to the socket server
        triggerSocketEmit(chatId, "newMessage", {
            savedMsg: savedMsgForClient,
            optimisticId: optimisticId
        });

        return new Response(JSON.stringify(savedMsgForClient), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        });
    } catch (err) {
        console.error("POST /api/chats/[chatId]/messages failed:", err);
        return new Response(JSON.stringify({ error: "Failed to post message to DB" }), { status: 500 });
    }
}

// --- PATCH Message (Updated to reset unreadCount when messages are seen) ---

export async function PATCH(req, { params }) {
    const { chatId } = params;
    if (!chatId || !isValidObjectId(chatId)) return new Response(JSON.stringify({ error: "Invalid chatId" }), { status: 400 });

    try {
        const body = await req.json();
        const { action, messageId, viewerEmail, newText, emoji, userEmail, deleterEmail } = body;

        if (!action) return new Response(JSON.stringify({ error: "Missing required action" }), { status: 400 });

        const chatsCollection = await dbConnect("chats");
        let updateQuery = {};
        let result;
        const msgObjectId = isValidObjectId(messageId) ? new ObjectId(messageId) : null;


        if (action === "seen") {
            if (!viewerEmail) return new Response(JSON.stringify({ error: "Missing viewerEmail for seen action" }), { status: 400 });
            if (!msgObjectId) return new Response(JSON.stringify({ error: "Invalid messageId for seen action" }), { status: 400 });

            // 1. Mark individual message as seen
            updateQuery = { $set: { "messages.$[msg].isSeen": true } };
            await chatsCollection.updateOne(
                { _id: new ObjectId(chatId) },
                updateQuery,
                { arrayFilters: [{ "msg._id": msgObjectId }] }
            );

            // 2. 🔥 NEW LOGIC: Reset the viewer's unreadCount to 0
            const resetUnreadResult = await chatsCollection.updateOne(
                { _id: new ObjectId(chatId), "participants.email": viewerEmail },
                { $set: { "participants.$[viewer].unreadCount": 0 } },
                { arrayFilters: [{ "viewer.email": viewerEmail }] }
            );

            if (resetUnreadResult.matchedCount === 0) {
                console.warn(`[PATCH] Could not reset unreadCount for viewer ${viewerEmail} in chat ${chatId}`);
            }

            // Return success even if only the unreadCount reset occurred or the message seen update occurred
            return new Response(JSON.stringify({ message: "Message seen and unreadCount reset successfully" }), { headers: { "Content-Type": "application/json" }, status: 200 });

        } else if (action === "edit") {
            if (!newText || !msgObjectId) return new Response(JSON.stringify({ error: "Missing newText or invalid messageId for edit action" }), { status: 400 });

            const encryptedText = encryptMessage(newText);
            updateQuery = {
                $set: {
                    "messages.$[msg].text": encryptedText,
                    "messages.$[msg].isEdited": true,
                    "messages.$[msg].updatedAt": new Date()
                }
            };
            result = await chatsCollection.updateOne(
                { _id: new ObjectId(chatId) },
                updateQuery,
                { arrayFilters: [{ "msg._id": msgObjectId, "msg.imageUrl": { $exists: false } }] }
            );

            if (result.matchedCount > 0) {
                triggerSocketEmit(chatId, "messageEdit", { messageId, newText });
            }

        } else if (action === "delete") {
            if (!deleterEmail || !msgObjectId) return new Response(JSON.stringify({ error: "Missing deleterEmail or invalid messageId for delete action" }), { status: 400 });

            updateQuery = { $set: { "messages.$[msg].deletedBy": deleterEmail } };
            result = await chatsCollection.updateOne(
                { _id: new ObjectId(chatId) },
                updateQuery,
                { arrayFilters: [{ "msg._id": msgObjectId }] }
            );

            if (result.matchedCount > 0) {
                triggerSocketEmit(chatId, "messageDelete", { messageId, deletedBy: deleterEmail });
            }

        } else if (action === "react") {
            if (!emoji || !userEmail || !msgObjectId) return new Response(JSON.stringify({ error: "Missing emoji, userEmail, or invalid messageId for react action" }), { status: 400 });

            const chat = await chatsCollection.findOne({ _id: new ObjectId(chatId) });
            const message = chat?.messages.find(m => m._id.toString() === messageId);
            if (!message) return new Response(JSON.stringify({ error: "Message not found" }), { status: 404 });

            let reactions = message.reactions || [];
            let reactionIndex = reactions.findIndex(r => r.emoji === emoji);
            let userReacted = reactionIndex !== -1 && reactions[reactionIndex].userEmails.includes(userEmail);

            if (userReacted) {
                // Remove reaction
                const userEmails = reactions[reactionIndex].userEmails.filter(e => e !== userEmail);
                if (userEmails.length === 0) {
                    reactions.splice(reactionIndex, 1);
                } else {
                    reactions[reactionIndex].count = userEmails.length;
                    reactions[reactionIndex].userEmails = userEmails;
                }
            } else {
                // Add/Toggle reaction
                if (reactionIndex !== -1) {
                    reactions[reactionIndex].count += 1;
                    reactions[reactionIndex].userEmails.push(userEmail);
                } else {
                    reactions.push({ emoji, count: 1, userEmails: [userEmail] });
                }
            }

            // Atomically update the message's reactions array
            result = await chatsCollection.updateOne(
                { _id: new ObjectId(chatId), "messages._id": msgObjectId },
                { $set: { "messages.$.reactions": reactions } }
            );

            if (result.matchedCount > 0) {
                triggerSocketEmit(chatId, "messageReact", { messageId, reactions });
            }

        } else {
            return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), { status: 400 });
        }


        if (result && result.matchedCount === 0) {
            return new Response(JSON.stringify({ message: "Chat or message not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Message updated successfully" }), { headers: { "Content-Type": "application/json" }, status: 200 });
    } catch (err) {
        console.error("PATCH /api/chats/[chatId]/messages failed:", err);
        return new Response(JSON.stringify({ error: "Failed to process request" }), { status: 500 });
    }
}

// --- DELETE Messages (clear history or delete chat) ---
// (No changes needed here for the unread feature)
export async function DELETE(req, { params }) {
    const { chatId } = params;
    if (!chatId || !isValidObjectId(chatId)) return new Response(JSON.stringify({ error: "Invalid chatId" }), { status: 400 });

    try {
        const chatsCollection = await dbConnect("chats");

        const url = new URL(req.url, `http://${req.headers.host}`);
        const deleteChat = url.searchParams.get("deleteChat") === "true";

        if (deleteChat) {
            const result = await chatsCollection.deleteOne({ _id: new ObjectId(chatId) });
            if (result.deletedCount === 0) return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });
            return new Response(JSON.stringify({ message: "Chat deleted successfully" }), { headers: { "Content-Type": "application/json" }, status: 200 });
        } else {
            // Clear messages
            const result = await chatsCollection.updateOne(
                { _id: new ObjectId(chatId) },
                { $set: { messages: [], updatedAt: new Date(), lastMessageAt: null } }
            );
            if (result.matchedCount === 0) return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });
            return new Response(JSON.stringify({ message: "Messages cleared successfully" }), { headers: { "Content-Type": "application/json" }, status: 200 });
        }
    } catch (err) {
        console.error("DELETE /api/chats/[chatId]/messages failed:", err);
        return new Response(JSON.stringify({ error: "Failed to process request" }), { status: 500 });
    }
}