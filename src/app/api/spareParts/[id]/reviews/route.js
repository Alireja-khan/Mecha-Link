import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET handler (No change)
export async function GET(request, { params }) {
  try {
    const partId = params.id;

    if (!partId) {
      return NextResponse.json({ error: "Missing partId" }, { status: 400 });
    }

    const collection = await dbConnect(collections.reviews);

    const reviews = await collection.find({ partId: partId }).sort({ createdAt: -1 }).toArray();

    let averageRating = 0;
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = totalRating / reviews.length;
    }

    return NextResponse.json({
      reviews,
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviewCount: reviews.length
    });
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST handler (No change from previous step, maintains userProfileImage)
export async function POST(request, { params }) {
  try {
    const partId = params.id;
    const reviewData = await request.json();
    const { userEmail, userName, userProfileImage, rating, comment } = reviewData;

    if (!partId || !userEmail || !rating || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const collection = await dbConnect(collections.reviews);

    const newReview = {
      partId,
      userEmail,
      userName,
      userProfileImage: userProfileImage || '',
      rating: parseInt(rating),
      comment: comment.trim(),
      createdAt: new Date(),
    };

    await collection.insertOne(newReview);

    return NextResponse.json({ success: true, message: "Review submitted successfully" });

  } catch (error) {
    console.error("❌ Error posting review:", error);
    return NextResponse.json({ error: "Failed to post review" }, { status: 500 });
  }
}

// DELETE handler (NEW)
export async function DELETE(request, { params }) {
  try {
    const partId = params.id;
    const { reviewId, userEmail } = await request.json();

    if (!reviewId || !userEmail) {
      return NextResponse.json({ error: "Missing review ID or user email" }, { status: 400 });
    }

    if (!ObjectId.isValid(reviewId)) {
      return NextResponse.json({ error: "Invalid review ID format" }, { status: 400 });
    }

    const collection = await dbConnect(collections.reviews);

    // Find and delete the review, ensuring it matches both the ID and the userEmail
    const result = await collection.deleteOne({
      _id: new ObjectId(reviewId),
      userEmail: userEmail,
      partId: partId, // Ensure the review belongs to this part as well (optional but good security)
    });

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true, message: "Review deleted successfully" });
    } else {
      // This will catch cases where the review ID is valid but doesn't belong to the user
      return NextResponse.json({ success: false, message: "Review not found or you don't have permission to delete it." }, { status: 403 });
    }

  } catch (error) {
    console.error("❌ Error deleting review:", error);
    return NextResponse.json({ error: "Failed to delete review due to a server error." }, { status: 500 });
  }
}