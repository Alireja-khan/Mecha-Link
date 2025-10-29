import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // 💡 IMPORTANT: Import ObjectId for ID lookups

// PATCH: /api/reviews/[id]
// Used for responding to a review (setting 'response', 'respondedAt', etc.)
export async function PATCH(req, { params }) {
    try {
        const { id } = params;
        const body = await req.json();

        const collection = await dbConnect(collections.reviews);

        const result = await collection.updateOne(
            { _id: new ObjectId(id) }, // Convert string ID to MongoDB ObjectId
            { $set: body }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: "Review not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("PATCH error:", error);
        // Ensure to handle cases where ID is invalid
        if (error.name === 'BSONTypeError') {
            return NextResponse.json({ error: "Invalid Review ID" }, { status: 400 });
        }
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE: /api/reviews/[id]
// Used for deleting a review (called by the handleDeleteReview function)
export async function DELETE(req, { params }) {
    try {
        const { id } = params;

        const collection = await dbConnect(collections.reviews);

        const result = await collection.deleteOne(
            { _id: new ObjectId(id) } // Convert string ID to MongoDB ObjectId
        );

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Review not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("DELETE error:", error);
        // Ensure to handle cases where ID is invalid
        if (error.name === 'BSONTypeError') {
            return NextResponse.json({ error: "Invalid Review ID" }, { status: 400 });
        }
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}