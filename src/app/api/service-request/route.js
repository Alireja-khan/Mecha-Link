import {NextResponse} from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function POST(req) {
  try {
    const body = await req.json();

    // connect to collection
    const collection = dbConnect("serviceRequests");

    // insert into MongoDB
    await collection.insertOne(body);

    return NextResponse.json(
      {success: true, data: body},
      {status: 201}
    );
  } catch (error) {
    console.error("❌ Error saving service request:", error);
    return NextResponse.json({error: "Internal Server Error"}, {status: 500});
  }
}
