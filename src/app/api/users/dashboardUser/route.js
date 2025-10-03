import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET - Fetch all users
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

// POST - Create new user
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      role = "customer",
      status = "pending",
      phone,
      location
    } = body;

    if (!email || !name) {
      return NextResponse.json({ message: "Name and email are required" }, { status: 400 });
    }

    const collection = await dbConnect(collections.users);

    // Check if user already exists
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const userData = {
      name,
      email,
      role,
      status,
      phone: phone || null,
      location: location || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(userData);

    return NextResponse.json({ 
      success: true, 
      message: "User created successfully",
      userId: result.insertedId 
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PUT - update user info
export async function PUT(request) {
  try {
    const body = await request.json();
    const { 
      email, 
      name, 
      phone, 
      location, 
      jobTitle, 
      department, 
      bio, 
      profileImage,
      role,
      status
    } = body;

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
        ...(profileImage && { profileImage }),
        ...(role && { role }),
        ...(status && { status }),
        updatedAt: new Date(),
      },
    };

    const result = await collection.updateOne(
      { email },
      updateDoc,
      { upsert: false }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Profile updated successfully",
      updatedFields: Object.keys(body).filter(key => key !== 'email')
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}