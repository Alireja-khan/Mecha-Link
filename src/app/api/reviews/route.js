import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";


export async function GET(req) {
    try {
        const collection = await dbConnect(collections.reviews);
        const result = await collection.find().toArray();
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
