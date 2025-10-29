import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

// GET: /api/reviews
// Used to fetch all reviews for the frontend to filter, or filtered by shopId (if implemented)
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const shopId = searchParams.get('shopId');

        const collection = await dbConnect(collections.reviews);

        let query = {};
        // The frontend currently fetches ALL reviews, so this shopId filter is optional 
        // but included based on your original code.
        if (shopId) {
            query.shopId = shopId;
        }

        // Fetch all reviews matching the query
        const result = await collection.find(query).toArray();

        return NextResponse.json(result);
    } catch (error) {
        console.error("GET error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// POST: /api/reviews
// Used when a customer submits a new review
export async function POST(req) {
    try {
        const body = await req.json();
        const collection = await dbConnect(collections.reviews);

        // Insert the new review document
        const result = await collection.insertOne({
            ...body,
            createdAt: new Date(), // Add a timestamp for consistency
        });

        // Return the inserted document's ID (or the result object)
        return NextResponse.json(result);
    } catch (error) {
        console.error("POST error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}