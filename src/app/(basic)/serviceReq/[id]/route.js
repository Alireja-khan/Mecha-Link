import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import collections from "@/lib/collections";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  const { id } = params;
  const collection = await dbConnect(collections.serviceRequests);
  const result = await collection.findOne({ _id: new ObjectId(id) });

  if (!result) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
