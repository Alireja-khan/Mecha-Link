import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// GET - Fetch all announcements
export async function GET() {
  try {
    const collection = await dbConnect("announcements");
    const announcements = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(announcements);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

// POST - Create new announcement
export async function POST(request) {
  try {
    const { title, message, status = "active" } = await request.json();
    
    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
    }

    const collection = await dbConnect("announcements");
    const announcement = {
      title,
      message,
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(announcement);
    return NextResponse.json({ ...announcement, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}