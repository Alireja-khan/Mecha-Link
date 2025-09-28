import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";


// ✅ GET — already implemented

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const overview = searchParams.get("overview");
  const collection = await dbConnect(collections.users);

  if (overview) {
    const result = await collection.find().sort({ _id: -1 }).limit(5).toArray();
    return NextResponse.json(result);
  }
  const result = await collection.find().toArray();
  return NextResponse.json(result);
}




// ✅ PUT — update user info (add fields if missing)

export async function PUT(request) {
  try {
    const body = await request.json();
    const { email, name, phone, location, jobTitle, department, bio } = body;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const collection = await dbConnect(collections.users);

    const updateDoc = {
      $set: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(location && { location }),
        ...(jobTitle && { jobTitle }),
        ...(department && { department }),
        ...(bio && { bio }),
        updatedAt: new Date(),
      },
    };

    const result = await collection.updateOne(
      { email }, // find by email
      updateDoc,
      { upsert: false } // only update if user exists
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
