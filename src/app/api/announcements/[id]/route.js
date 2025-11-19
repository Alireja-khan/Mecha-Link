import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// GET - Fetch single announcement
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const collection = await dbConnect("announcements");
    const announcement = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!announcement) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }
    
    return NextResponse.json(announcement);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch announcement" }, { status: 500 });
  }
}

// PATCH - Update announcement
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    const collection = await dbConnect("announcements");
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 });
  }
}

// DELETE - Delete announcement
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const collection = await dbConnect("announcements");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}