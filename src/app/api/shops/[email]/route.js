import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { email } = params;
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const collection = await dbConnect(collections.mechanicShops);

    // Find one shop by userEmail or ownerEmail
    const shop = await collection.findOne({
      $or: [{ userEmail: email }, { "shop.ownerEmail": email }],
    });

    if (!shop) {
      return NextResponse.json({ message: "Shop not found" }, { status: 404 });
    }

    return NextResponse.json(shop);
  } catch (error) {
    console.error("Error fetching shop by email:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
