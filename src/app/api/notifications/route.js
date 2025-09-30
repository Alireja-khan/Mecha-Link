import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET all notifications
export async function GET() {
  try {
    const collection = await dbConnect(collections.notifications);
    const result = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST a new notification
export async function POST(req) {
  try {
    const data = await req.json();
    if (!data.message) {
      return NextResponse.json(
        { success: false, message: "Notification message is required" },
        { status: 400 }
      );
    }
    const collection = await dbConnect(collections.notifications);
    const result = await collection.insertOne({
      ...data,
      createdAt: new Date(),
      read: false,
    });
    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("Error adding notification:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE a single notification by ID
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Notification ID is required" },
        { status: 400 }
      );
    }

    const collection = await dbConnect(collections.notifications);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
