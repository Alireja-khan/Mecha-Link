import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

async function getUserName(userId) {
    if (!userId) return "Unknown User";
    try {
        const usersCollection = await dbConnect('users');
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) }, { projection: { name: 1 } });
        return user ? user.name : "Not provided";
    } catch (error) {
        console.error(error);
        return "Fetch Error";
    }
}

export async function GET() {
    try {
        const chatsCollection = await dbConnect('chats');
        const chats = await chatsCollection.find({}).toArray();
        return new Response(JSON.stringify(chats), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to fetch chats' }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { serviceRequestId, customerId, mechanicId } = body;

        if (!serviceRequestId || !customerId || !mechanicId) {
            return new Response(JSON.stringify({ error: 'Missing required IDs (serviceRequestId, customerId, mechanicId).' }), { status: 400 });
        }

        const chatsCollection = await dbConnect('chats');

        const existingChat = await chatsCollection.findOne({ serviceRequestId });

        if (existingChat) {
            return new Response(JSON.stringify({ chatId: existingChat._id.toString(), message: "Chat already exists" }), {
                headers: { 'Content-Type': 'application/json' },
                status: 409
            });
        }

        const [customerName, mechanicName] = await Promise.all([
            getUserName(customerId),
            getUserName(mechanicId)
        ]);

        const newChat = {
            serviceRequestId,
            customerId,
            customerName,
            mechanicId,
            mechanicName,
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            lastMessageAt: new Date()
        };

        const result = await chatsCollection.insertOne(newChat);

        return new Response(JSON.stringify({ chatId: result.insertedId.toString(), chat: newChat }), {
            headers: { 'Content-Type': 'application/json' },
            status: 201
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
