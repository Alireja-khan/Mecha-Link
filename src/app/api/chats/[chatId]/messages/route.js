import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { encryptMessage, decryptMessage } from "@/lib/crypto";

// Helper to validate ObjectId
function isValidObjectId(id) {
    try {
        return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
    } catch {
        return false;
    }
}

// -----------------------------
// GET: Fetch all messages
// -----------------------------
export async function GET(req, { params }) {
    const { chatId } = params;

    if (!chatId || !isValidObjectId(chatId)) {
        return new Response(JSON.stringify({ error: "Invalid or missing chatId" }), { status: 400 });
    }

    try {
        const chatsCollection = await dbConnect("chats");
        const chat = await chatsCollection.findOne(
            { _id: new ObjectId(chatId) },
            { projection: { messages: 1 } }
        );

        if (!chat) {
            return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });
        }

        const decryptedMessages = (chat.messages || []).map(msg => ({
            ...msg,
            text: decryptMessage(msg.text),
        }));

        return new Response(JSON.stringify(decryptedMessages), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (err) {
        console.error("GET messages error:", err);
        return new Response(JSON.stringify({ error: "Failed to fetch messages" }), { status: 500 });
    }
}

// -----------------------------
// POST: Send a message
// -----------------------------
export async function POST(req, { params }) {
    const { chatId } = params;

    if (!chatId || !isValidObjectId(chatId)) {
        return new Response(JSON.stringify({ error: "Invalid or missing chatId" }), { status: 400 });
    }

    try {
        const body = await req.json();
        const { senderId, text } = body;

        if (!senderId || !text) {
            return new Response(JSON.stringify({ error: "Missing senderId or text" }), { status: 400 });
        }

        const chatsCollection = await dbConnect("chats");
        const now = new Date();
        const newMessage = {
            _id: new ObjectId(),
            senderId,
            text: encryptMessage(text),
            createdAt: now,
        };

        const result = await chatsCollection.updateOne(
            { _id: new ObjectId(chatId) },
            { $push: { messages: newMessage }, $set: { lastMessageAt: now, updatedAt: now } }
        );

        if (result.matchedCount === 0) {
            return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });
        }

        // Return decrypted message for front-end
        const decryptedMessage = { ...newMessage, text };
        return new Response(JSON.stringify(decryptedMessage), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        });
    } catch (err) {
        console.error("POST message error:", err);
        return new Response(JSON.stringify({ error: "Failed to send message" }), { status: 500 });
    }
}

// -----------------------------
// DELETE: Clear all messages or delete chat
// -----------------------------
export async function DELETE(req, { params, searchParams }) {
    const { chatId } = params;

    if (!chatId || !isValidObjectId(chatId)) {
        return new Response(JSON.stringify({ error: "Invalid or missing chatId" }), { status: 400 });
    }

    try {
        const chatsCollection = await dbConnect("chats");
        const deleteChat = searchParams?.get("deleteChat") === "true";

        if (deleteChat) {
            const result = await chatsCollection.deleteOne({ _id: new ObjectId(chatId) });
            if (result.deletedCount === 0) {
                return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });
            }
            return new Response(JSON.stringify({ message: "Chat deleted successfully" }), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            });
        } else {
            const result = await chatsCollection.updateOne(
                { _id: new ObjectId(chatId) },
                { $set: { messages: [], updatedAt: new Date(), lastMessageAt: null } }
            );

            if (result.matchedCount === 0) {
                return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });
            }

            return new Response(JSON.stringify({ message: "Messages cleared successfully" }), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            });
        }
    } catch (err) {
        console.error("DELETE messages/chat error:", err);
        return new Response(JSON.stringify({ error: "Failed to process request" }), { status: 500 });
    }
}
