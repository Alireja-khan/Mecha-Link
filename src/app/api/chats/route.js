import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

// GET chats filtered by userId (either customer or mechanic)
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    const chatsCollection = await dbConnect('chats');

    let query = {};
    if (userId) {
      query = { $or: [{ customerId: userId }, { mechanicId: userId }] };
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

// POST: directly insert whatever data the frontend sends
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return new Response(
        JSON.stringify({ error: 'No data provided' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const chatsCollection = await dbConnect('chats');

    const result = await chatsCollection.insertOne(body);

    return new Response(
      JSON.stringify({ chatId: result.insertedId.toString(), chat: body }),
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

// DELETE a chat by its _id
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
