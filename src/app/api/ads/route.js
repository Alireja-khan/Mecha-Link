import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

// ✅ Create a new Advertisement
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, bannerImage, status, isPaid } = body;

    if (!title || !description || !bannerImage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const collection = await dbConnect(collections.ads);

    const newAd = {
      title,
      description,
      bannerImage,
      status: status || "pending",
      isPaid: isPaid || false,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newAd);

    return NextResponse.json(
      { message: "Ad created successfully", adId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating ad:", error);
    return NextResponse.json(
      { error: "Failed to create ad" },
      { status: 500 }
    );
  }
}

// ✅ Get all ads
export async function GET() {
  try {
    const collection = await dbConnect(collections.ads);
    const ads = await collection.find().sort({ createdAt: -1 }).toArray();
    return NextResponse.json(ads);
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { error: "Failed to fetch ads" },
      { status: 500 }
    );
  }
}
