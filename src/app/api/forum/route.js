import { NextResponse } from "next/server";
import dbConnect, { collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// Simple helper to get user from session ID
async function getUserFromSession(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    if (userId) {
      const usersCollection = await dbConnect(collections.users);
      const user = await usersCollection.findOne(
        { _id: new ObjectId(userId) },
        { projection: { password: 0, otp: 0 } }
      );
      return user;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user from session:", error);
    return null;
  }
}

// 🟢 CREATE POST - Updated for multiple images
export async function POST(req) {
  try {
    const body = await req.json();
    const { content, images, authorId, authorName, authorRole, authorImage, category } = body;

    if (!content || !authorId) {
      return NextResponse.json({ success: false, message: "Content and author ID are required" }, { status: 400 });
    }

    const collection = await dbConnect(collections.forumPosts);
    const result = await collection.insertOne({
      authorId: authorId,
      authorName: authorName || "Unknown User",
      authorRole: authorRole || "user",
      authorImage: authorImage || null,
      content,
      images: images || [], // Save images array instead of single image
      category: category || "general",
      likes: [],
      dislikes: [], // Make sure dislikes array exists
      comments: [],
      reports: [],
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("POST /api/forum error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// 🟣 GET ALL POSTS - Updated for search and categories
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    const collection = await dbConnect(collections.forumPosts);
    let query = {};

    // Search in content
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: "i" } },
        { authorName: { $regex: search, $options: "i" } }
      ];
    }

    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    const result = await collection.find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, posts: result });
  } catch (error) {
    console.error("GET /api/forum error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// 🟡 UPDATE (LIKE, DISLIKE, COMMENT, REPORT)
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { postId, action, commentText, userId, userName, userImage } = body;

    if (!postId || !action) {
      return NextResponse.json({ success: false, message: "Post ID and action are required" }, { status: 400 });
    }

    const collection = await dbConnect(collections.forumPosts);
    const post = await collection.findOne({ _id: new ObjectId(postId) });
    if (!post) return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });

    let update;

    switch (action) {
      case "like":
        if (!userId) {
          return NextResponse.json({ success: false, message: "User ID required for like" }, { status: 400 });
        }
        // Remove from dislikes if user disliked before
        // Add to likes and remove from dislikes
        update = {
          $addToSet: { likes: userId },
          $pull: { dislikes: userId }
        };
        break;

      case "dislike":
        if (!userId) {
          return NextResponse.json({ success: false, message: "User ID required for dislike" }, { status: 400 });
        }
        // Remove from likes if user liked before
        // Add to dislikes and remove from likes
        update = {
          $addToSet: { dislikes: userId },
          $pull: { likes: userId }
        };
        break;

      case "comment":
        if (!commentText || !userId || !userName) {
          return NextResponse.json({ success: false, message: "Comment text, user ID, and user name required" }, { status: 400 });
        }
        update = {
          $push: {
            comments: {
              _id: new ObjectId(),
              userId: userId,
              userName: userName,
              userImage: userImage || null,
              text: commentText,
              createdAt: new Date(),
            },
          },
        };
        break;

      case "report":
        if (!userId) {
          return NextResponse.json({ success: false, message: "User ID required for report" }, { status: 400 });
        }
        update = { $addToSet: { reports: userId } };
        break;

      default:
        return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
    }

    await collection.updateOne({ _id: new ObjectId(postId) }, update);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/forum error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// 🔴 DELETE POST (ADMIN ONLY)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID required" }, { status: 400 });
    }

    // Check if user is admin
    const usersCollection = await dbConnect(collections.users);
    const user = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { role: 1 } }
    );

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const forumCollection = await dbConnect(collections.forumPosts);
    const result = await forumCollection.deleteOne({ _id: new ObjectId(postId) });

    if (!result.deletedCount) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("DELETE /api/forum error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}