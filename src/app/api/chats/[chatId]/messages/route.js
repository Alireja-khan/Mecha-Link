import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(req, context) {
    const { params } = context;
    const { chatId } = params;

    if (!chatId) {
        return new Response(JSON.stringify({ error: "chatId required" }), { status: 400 });
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

        const messages = Array.isArray(chat.messages) ? chat.messages : [];

        return new Response(JSON.stringify(messages), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (err) {
        console.error("GET /messages error:", err);
        return new Response(JSON.stringify({ error: "Failed to fetch messages" }), { status: 500 });
    }
}

export async function POST(req, context) {
    const { params } = context;
    const { chatId } = params;

    if (!chatId) {
        return new Response(JSON.stringify({ error: "chatId required" }), { status: 400 });
    }

    try {
        const body = await req.json();
        const { senderId, text, imageUrl } = body;

        if (!senderId || (!text && !imageUrl)) {
            return new Response(
                JSON.stringify({ error: "Missing senderId or both text and imageUrl" }),
                { status: 400 }
            );
        }

        const chatsCollection = await dbConnect("chats");
        const now = new Date();

        const newMessage = {
            _id: new ObjectId(),
            senderId,
            text: text || "", 
            imageUrl: imageUrl || null, 
            createdAt: now,
        };

        const result = await chatsCollection.updateOne(
            { _id: new ObjectId(chatId) },
            {
                $push: { messages: newMessage },
                $set: { lastMessageAt: now, updatedAt: now },
            }
        );

        if (result.matchedCount === 0) {
            return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(newMessage), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        });
    } catch (err) {
        console.error("POST /messages error:", err);
        return new Response(JSON.stringify({ error: "Failed to send message" }), { status: 500 });
    }
}

export async function DELETE(req, context) {
    const { params, searchParams } = context;
    const { chatId } = params;

    if (!chatId) {
        return new Response(JSON.stringify({ error: "chatId required" }), { status: 400 });
    }

    try {
        const chatsCollection = await dbConnect("chats");
        const deleteChat = searchParams?.get("deleteChat") === "true";

        if (deleteChat) {
            const result = await chatsCollection.deleteOne({ _id: new ObjectId(chatId) });
            if (result.deletedCount === 0) {
                return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });
            }
            return new Response(JSON.stringify({ message: "Chat deleted successfully" }), { status: 200 });
        } else {
            const result = await chatsCollection.updateOne(
                { _id: new ObjectId(chatId) },
                { $set: { messages: [], updatedAt: new Date(), lastMessageAt: null } }
            );
            if (result.matchedCount === 0) {
                return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });
            }
            return new Response(JSON.stringify({ message: "Messages cleared successfully" }), { status: 200 });
        }
    } catch (err) {
        console.error("DELETE /messages error:", err);
        return new Response(JSON.stringify({ error: "Failed to process request" }), { status: 500 });
    }
}