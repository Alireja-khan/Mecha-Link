import { NextResponse } from "next/server";
import dbConnect, { collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const { shopId } = await params;
    
    if (!shopId) {
      return NextResponse.json({ error: "Shop ID is required" }, { status: 400 });
    }

    const collection = await dbConnect(collections.serviceRequests);
    
    // Find service requests accepted by this shop
    const serviceRequests = await collection.find({
      $or: [
        { acceptedBy: shopId },
        { assignedShop: shopId }
      ]
    }).sort({ updatedAt: -1 }).toArray();

    return NextResponse.json(serviceRequests);
  } catch (error) {
    console.error("Error fetching shop service requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch service requests" },
      { status: 500 }
    );
  }
}