import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
    const collection = await dbConnect(collections.payments);
    const result = await collection.find().toArray();
    return NextResponse.json(result);
}

