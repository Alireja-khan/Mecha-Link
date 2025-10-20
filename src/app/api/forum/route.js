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
      images: images || [],
      category: category || "general",
      likes: [],
      dislikes: [],
      comments: [],
      reports: [],
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("POST /api/forum error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// 🟣 GET ALL POSTS - Enhanced with sorting and pagination
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "latest";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;

    const collection = await dbConnect(collections.forumPosts);
    let query = {};

    // Search in content and author name
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: "i" } },
        { authorName: { $regex: search, $options: "i" } },
        { "comments.text": { $regex: search, $options: "i" } }
      ];
    }

    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    // Build sort object - Fixed syntax
    let sortOptions = {};
    switch (sort) {
      case "latest":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "popular":
        // Sort by engagement score (likes + comments)
        sortOptions = { 
          // We'll calculate this in memory for simplicity
        };
        break;
      case "most-liked":
        sortOptions = { 
          likes: -1,
          createdAt: -1 
        };
        break;
      case "most-commented":
        // Sort by comment count
        sortOptions = { 
          // We'll handle this with aggregation
        };
        break;
      case "trending":
        // Recent posts with high engagement
        sortOptions = { 
          // We'll handle this with aggregation
        };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Get total count for pagination
    const totalPosts = await collection.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);
    const skip = (page - 1) * limit;

    // For complex sorts, use aggregation
    let posts = [];
    if (sort === "most-commented" || sort === "trending" || sort === "popular") {
      // Use aggregation pipeline for complex sorting
      const aggregationPipeline = [
        { $match: query },
        { 
          $addFields: {
            likesCount: { $size: "$likes" },
            commentsCount: { $size: "$comments" },
            dislikesCount: { $size: "$dislikes" },
            isRecent: { 
              $cond: {
                if: { $gte: ["$createdAt", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                then: 1,
                else: 0
              }
            }
          }
        }
      ];

      // Add sort stage based on sort type
      if (sort === "most-commented") {
        aggregationPipeline.push({ $sort: { commentsCount: -1, createdAt: -1 } });
      } else if (sort === "popular") {
        aggregationPipeline.push({ 
          $addFields: {
            engagementScore: {
              $add: [
              "$likesCount",
              { $multiply: ["$commentsCount", 2] }
              ]
            }
          }
        });
        aggregationPipeline.push({ $sort: { engagementScore: -1, createdAt: -1 } });
      } else if (sort === "trending") {
        aggregationPipeline.push({ 
          $addFields: {
            trendingScore: {
              $add: [
                "$likesCount",
                { $multiply: ["$commentsCount", 2] },
                { $multiply: ["$isRecent", 10] }
              ]
            }
          }
        });
        aggregationPipeline.push({ $sort: { trendingScore: -1, createdAt: -1 } });
      }

      // Add pagination
      aggregationPipeline.push(
        { $skip: skip },
        { $limit: limit }
      );

      posts = await collection.aggregate(aggregationPipeline).toArray();
    } else {
      // Use regular find for simple sorts
      posts = await collection.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .toArray();
    }

    // Calculate engagement stats
    const stats = {
      totalPosts,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };

    return NextResponse.json({ 
      success: true, 
      posts,
      stats
    });
  } catch (error) {
    console.error("GET /api/forum error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// 🟡 UPDATE POST (LIKE, DISLIKE, COMMENT, REPORT, VIEW)
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { postId, action, commentText, userId, userName, userImage, commentId } = body;

    if (!postId || !action) {
      return NextResponse.json({ success: false, message: "Post ID and action are required" }, { status: 400 });
    }

    const collection = await dbConnect(collections.forumPosts);
    const post = await collection.findOne({ _id: new ObjectId(postId) });
    if (!post) return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });

    let update;
    let arrayFilters;

    switch (action) {
      case "like":
        if (!userId) {
          return NextResponse.json({ success: false, message: "User ID required for like" }, { status: 400 });
        }
        // Toggle like - if already liked, remove like; otherwise add like and remove dislike
        const alreadyLiked = post.likes.includes(userId);
        update = alreadyLiked 
          ? { $pull: { likes: userId } }
          : { 
              $addToSet: { likes: userId },
              $pull: { dislikes: userId }
            };
        break;

      case "dislike":
        if (!userId) {
          return NextResponse.json({ success: false, message: "User ID required for dislike" }, { status: 400 });
        }
        // Toggle dislike - if already disliked, remove dislike; otherwise add dislike and remove like
        const alreadyDisliked = post.dislikes?.includes(userId);
        update = alreadyDisliked
          ? { $pull: { dislikes: userId } }
          : {
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
              likes: [],
            },
          },
          $set: { updatedAt: new Date() }
        };
        break;

      case "like-comment":
        if (!userId || !commentId) {
          return NextResponse.json({ success: false, message: "User ID and comment ID required" }, { status: 400 });
        }
        update = {
          $addToSet: { 
            "comments.$[comment].likes": userId 
          }
        };
        arrayFilters = [{ "comment._id": new ObjectId(commentId) }];
        break;

      case "view":
        update = { $inc: { viewCount: 1 } };
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

    await collection.updateOne(
      { _id: new ObjectId(postId) }, 
      update,
      { arrayFilters }
    );

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