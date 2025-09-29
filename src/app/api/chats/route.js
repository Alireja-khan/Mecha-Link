import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

async function getUserName(userId) {
  if (!userId) return { name: "Unknown User", profileImage: null };
  try {
    const usersCollection = await dbConnect('users');
    const user = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { name: 1, profileImage: 1 } }
    );
    return user
      ? { name: user.name || "Not provided", profileImage: user.profileImage || null }
      : { name: "Not provided", profileImage: null };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { name: "Fetch Error", profileImage: null };
  }
}

// GET chats (optionally filtered by userId)
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    const chatsCollection = await dbConnect('chats');

    let query = {};
    if (userId) {
      query = {
        $or: [{ customerId: userId }, { mechanicId: userId }],
      };
    }

    const chats = await chatsCollection
      .find(query)
      .sort({ lastMessageAt: -1 })
      .toArray();

    return new Response(JSON.stringify(chats), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("GET /api/chats error:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch chats' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

// POST create a new chat
export async function POST(req) {
  try {
    const body = await req.json();
    const { serviceRequestId, customerId, mechanicId } = body;

    if (!serviceRequestId || !customerId || !mechanicId) {
      return new Response(
        JSON.stringify({ error: 'Missing required IDs (serviceRequestId, customerId, mechanicId).' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const chatsCollection = await dbConnect('chats');

    // Prevent duplicate chat for the same serviceRequestId
    const existingChat = await chatsCollection.findOne({ serviceRequestId });
    if (existingChat) {
      return new Response(
        JSON.stringify({
          chatId: existingChat._id.toString(),
          message: "Chat already exists",
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 409 }
      );
    }

    // Fetch both users’ info
    const [customerInfo, mechanicInfo] = await Promise.all([
      getUserName(customerId),
      getUserName(mechanicId),
    ]);

    const now = new Date();

    const newChat = {
      serviceRequestId,
      customerId,
      customerName: customerInfo.name,
      customerProfileImage: customerInfo.profileImage,
      mechanicId,
      mechanicName: mechanicInfo.name,
      mechanicProfileImage: mechanicInfo.profileImage,
      messages: [],
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
    };

    const result = await chatsCollection.insertOne(newChat);

    return new Response(
      JSON.stringify({ chatId: result.insertedId.toString(), chat: newChat }),
      { headers: { 'Content-Type': 'application/json' }, status: 201 }
    );
  } catch (error) {
    console.error("POST /api/chats error:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}