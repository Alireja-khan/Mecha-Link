import dbConnect, { collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";


export async function GET(req, { params }) {
  try {
    const { id } = await params;

  
  const collection = await dbConnect(collections.serviceRequests);

    const request = await collection.findOne({ _id: new ObjectId(id) });

    if (!request) {
      return new Response(
        JSON.stringify({ error: "Service request not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(request), { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching service request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch service request" }),
      { status: 500 }
    );
  }
}