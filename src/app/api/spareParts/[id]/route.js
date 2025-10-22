import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const collection = await dbConnect(collections.spareParts);
    const part = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!part) {
      return NextResponse.json(
        { error: "Part not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(part);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch part" },
      { status: 500 }
    );
  }
}