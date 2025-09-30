import dbConnect, { collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { status, rejectionReason } = await request.json();
    
    if (!status || !["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const collection = await dbConnect(collections.mechanicShops);
    
    const updateData = {
      status,
      updatedAt: new Date()
    };
    
    // Add rejection reason if provided
    if (status === "rejected" && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }
    
    // If approving, set approvedAt timestamp
    if (status === "approved") {
      updateData.approvedAt = new Date();
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Shop ${status} successfully` 
    });
  } catch (error) {
    console.error("Error updating shop status:", error);
    return NextResponse.json(
      { error: "Failed to update shop status" },
      { status: 500 }
    );
  }
}