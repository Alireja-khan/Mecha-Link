import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

// -----------------------------
// GET → Fetch chats for a user (by email)
// -----------------------------
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userEmail = url.searchParams.get('userEmail'); // ✅ match frontend

    const chatsCollection = await dbConnect('chats');

    let query = {};
    if (userEmail) {
      // ✅ Find chats where this user is a participant by email
      query = { 'participants.email': userEmail };
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
    console.error('GET /api/chats error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch chats' }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

// -----------------------------
// POST → Create new chat
// -----------------------------
export async function POST(req) {
  try {
    const body = await req.json();
    const { participants } = body;

    // ✅ Validate
    if (!participants || !Array.isArray(participants) || participants.length !== 2) {
      return new Response(
        JSON.stringify({ error: 'Participants array (2 users) is required' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const chatsCollection = await dbConnect('chats');

    // ✅ Check if chat between these two participants already exists
    const existingChat = await chatsCollection.findOne({
      $and: [
        { 'participants.email': participants[0].email },
        { 'participants.email': participants[1].email },
      ],
    });

    if (existingChat) {
      return new Response(
        JSON.stringify({ message: 'Chat already exists', chatId: existingChat._id }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // ✅ Create new chat
    const newChat = {
      participants,
      messages: [],
      lastMessageAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await chatsCollection.insertOne(newChat);

    return new Response(
      JSON.stringify({
        message: 'Chat created successfully',
        chatId: result.insertedId.toString(),
        chat: newChat,
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 201 }
    );
  } catch (error) {
    console.error('POST /api/chats error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

// -----------------------------
// DELETE → Remove chat
// -----------------------------
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
    console.error('DELETE /api/chats error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete chat' }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}
