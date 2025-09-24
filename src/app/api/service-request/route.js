import {NextResponse} from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function POST(req) {
  try {
    const body = await req.json();


    const collection = await dbConnect("serviceRequests");

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

export async function GET() {
  try {
    const collection = await dbConnect("serviceRequests");
    const requests = await collection.find().toArray();

    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    console.error("❌ Error fetching service requests:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}