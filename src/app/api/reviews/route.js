import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";


// In your reviews API route
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const shopId = searchParams.get('shopId');
        
        const collection = await dbConnect(collections.reviews);
        
        let query = {};
        if (shopId) {
            query.shopId = shopId; // or whatever field links reviews to shops
        }
        
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


export async function POST(req) {
    try {
        const body = await req.json();
        const collection = await dbConnect(collections.reviews);
        const result = await collection.insertOne(body);
        return NextResponse.json(result);
    } catch (error) {
        console.error("POST error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
