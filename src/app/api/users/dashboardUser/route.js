import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const overview = searchParams.get("overview");
    const collection = await dbConnect(collections.users)

    if (overview) {
        const result = await collection.find().limit(5).sort({createdAt:-1}).toArray();
        return NextResponse.json(result);
    }
    const result = await collection.find().toArray();
    return NextResponse.json(result);

}
