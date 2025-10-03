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

// **UPDATED** GET chats (filters by userId in customerId OR mechanicId field)
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    const chatsCollection = await dbConnect('chats');

    let query = {};
    if (userId) {
      // Find chats where the logged-in user is either the customer OR the mechanic
      query = { $or: [{ customerId: userId }, { mechanicId: userId }] };
    } else {
      // If no userId is provided, return all chats (or handle as an error/access denied)
      // For security, you might prefer to throw an error or return an empty array if userId is missing.
      // return new Response(JSON.stringify({ error: 'Authentication required' }), {
      //   headers: { 'Content-Type': 'application/json' },
      //   status: 401,
      // });
    }

    const chats = await chatsCollection.find(query).sort({ lastMessageAt: -1 }).toArray();

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

// **UPDATED** POST create a new chat
export async function POST(req) {
  try {
    const body = await req.json();
    // shopId is optional for direct user-to-user chats, but still expected for shop-initiated chats
    const { shopId, customerId, mechanicId, mechanicName, mechanicLogo } = body;

    // 1. Basic Validation
    if (!customerId || !mechanicId) {
      return new Response(
        JSON.stringify({ error: 'Missing required IDs (customerId, mechanicId).' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const chatsCollection = await dbConnect('chats');

    // 2. Check for an existing chat between these two IDs.
    // Use $all to check that both IDs exist in the chat document, regardless of which field they land in.
    const existingChat = await chatsCollection.findOne({
      $or: [
        { customerId: customerId, mechanicId: mechanicId },
        { customerId: mechanicId, mechanicId: customerId }
      ]
    });

    // 3. If chat exists, return the existing chat ID
    if (existingChat) {
      return new Response(
        JSON.stringify({
          chatId: existingChat._id.toString(),
          message: "Chat already exists",
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // 4. Fetch User Info for both sides
    const [customerInfo, mechanicInfo] = await Promise.all([
      getUserName(customerId),
      getUserName(mechanicId),
    ]);

    // Safety check for user ID format
    try {
      new ObjectId(customerId);
      new ObjectId(mechanicId);
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid ID format for customerId or mechanicId.' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const now = new Date();

    // 5. Create the new chat object
    const newChat = {
      // shopId is included but may be null/undefined for general user-to-user chats
      shopId: shopId || null,

      // Store the roles based on who initiated the chat (or simply as User A and User B)
      // We will stick to the existing field names (customer/mechanic) but treat them as User A/User B
      customerId: customerId,
      mechanicId: mechanicId,

      // User info for display (use fetched names if body names are missing)
      customerName: customerInfo.name,
      customerProfileImage: customerInfo.profileImage,
      mechanicName: mechanicName || mechanicInfo.name, // Use body name if provided (from shop data), otherwise use fetched name
      mechanicProfileImage: mechanicLogo || mechanicInfo.profileImage || null,

      // Chat state
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

// DELETE a particular chat by its _id
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const chatId = url.searchParams.get('chatId');

    if (!chatId) {
      return new Response(
        JSON.stringify({ error: 'chatId is required' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const chatsCollection = await dbConnect('chats');
    const result = await chatsCollection.deleteOne({ _id: new ObjectId(chatId) });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ error: 'Chat not found' }),
        { headers: { 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Chat deleted successfully' }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/chats error:", error);
    return new Response(JSON.stringify({ error: 'Failed to delete chat' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}