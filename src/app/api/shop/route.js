import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

// POST: Add a new shop
export async function POST(request) {
    try {
        const data = await request.json();
        const shopsCollection = await dbConnect("shops");
        const result = await shopsCollection.insertOne(data);
        return NextResponse.json({ success: true, insertedId: result.insertedId });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Failed to add shop" },
            { status: 500 }
        );
    }
}

// GET: Retrieve all shops
export async function GET() {
    try {
        const shopsCollection = await dbConnect("shops");
        const result = await shopsCollection.find({}).toArray();
        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch shops" },
            { status: 500 }
        );
    }
}
