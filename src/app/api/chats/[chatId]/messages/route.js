import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { encryptMessage, decryptMessage } from "@/lib/crypto";

export async function GET(req, context) {
    const { params } = context;
    const { chatId } = params;

    if (!chatId) return new Response(JSON.stringify({ error: "chatId required" }), { status: 400 });

    try {
        const chatsCollection = await dbConnect("chats");
        const chat = await chatsCollection.findOne(
            { _id: new ObjectId(chatId) },
            { projection: { messages: 1 } }
        );

        if (!chat) return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });

        const decryptedMessages = (chat.messages || []).map(msg => ({
            ...msg,
            text: decryptMessage(msg.text),
        }));

        return new Response(JSON.stringify(decryptedMessages), { headers: { "Content-Type": "application/json" }, status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Failed to fetch messages" }), { status: 500 });
    }
}

export async function POST(req, context) {
    const { params } = context;
    const { chatId } = params;

    if (!chatId) return new Response(JSON.stringify({ error: "chatId required" }), { status: 400 });

    try {
        const body = await req.json();
        const { senderId, text } = body;
        if (!senderId || !text) return new Response(JSON.stringify({ error: "Missing senderId or text" }), { status: 400 });

        const encryptedText = encryptMessage(text);
        const chatsCollection = await dbConnect("chats");
        const now = new Date();
        const newMessage = { _id: new ObjectId(), senderId, text: encryptedText, createdAt: now };

        const result = await chatsCollection.updateOne(
            { _id: new ObjectId(chatId) },
            { $push: { messages: newMessage }, $set: { lastMessageAt: now, updatedAt: now } }
        );

        if (result.matchedCount === 0) return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });

        // Send decrypted message back to frontend
        const decryptedMessage = { ...newMessage, text };

        return new Response(JSON.stringify(decryptedMessage), { headers: { "Content-Type": "application/json" }, status: 201 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Failed to send message" }), { status: 500 });
    }
}

export async function DELETE(req, context) {
    const { params } = context;
    const { chatId } = params;

    if (!chatId) return new Response(JSON.stringify({ error: "chatId required" }), { status: 400 });

    try {
        const chatsCollection = await dbConnect("chats");

        const result = await chatsCollection.updateOne(
            { _id: new ObjectId(chatId) },
            { $set: { messages: [], updatedAt: new Date(), lastMessageAt: null } }
        );

        if (result.matchedCount === 0) return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });

        return new Response(JSON.stringify({ message: "Messages cleared successfully" }), { headers: { "Content-Type": "application/json" }, status: 200 });
    } catch (err) {
        console.error("Error clearing messages:", err);
        return new Response(JSON.stringify({ error: "Failed to clear messages" }), { status: 500 });
    }
}
