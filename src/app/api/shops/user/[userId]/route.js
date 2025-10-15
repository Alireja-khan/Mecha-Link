import { NextResponse } from "next/server";
import dbConnect, { collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const { userId } = await params;
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const collection = await dbConnect(collections.mechanicShops);
    
    // Find shop by owner ID or userId
    const shop = await collection.findOne({ 
      $or: [
        { "ownerId": userId },
        { "userId": userId },
        { "shop.ownerEmail": { $exists: true } } // Fallback to check any shop data
      ]
    });

    if (!shop) {
      // Return a default shop structure if no shop found
      return NextResponse.json({ 
        shop: { 
          shopName: "Your Shop",
          contact: {
            businessEmail: "",
            phone: ""
          },
          address: {
            city: "Unknown"
          }
        },
        status: "pending",
        avgRating: 0
      });
    }

    return NextResponse.json(shop);
  } catch (error) {
    console.error("Error fetching user shop:", error);
    return NextResponse.json(
      { error: "Failed to fetch shop" },
      { status: 500 }
    );
  }
}