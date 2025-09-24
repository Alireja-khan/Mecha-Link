import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const data = await req.json();
        const collection = await dbConnect("mechanicShops"); // await dbConnect
        const result = await collection.insertOne(data);
        return NextResponse.json({ success: true, insertedId: result.insertedId });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const collection = await dbConnect("mechanicShops");
        const shops = await collection.find({}).toArray();
        return NextResponse.json(shops);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
