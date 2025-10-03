import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect, { collections } from "@/lib/dbConnect";

// PATCH (mark as read)
export async function PATCH(req, { params }) {
  try {
    const collection = await dbConnect(collections.notifications);
    const id = params.id;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { read: true } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}


// DELETE /api/notifications/[id]
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

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