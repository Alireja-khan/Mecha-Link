import dbConnect, { collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { status, assignedShop, assignedMechanic, adminNotes } = await request.json();
    
    if (!status || !["pending", "in-progress", "completed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const collection = await dbConnect(collections.serviceRequests);
    
    const updateData = {
      status,
      updatedAt: new Date()
    };

    // Add optional fields if provided
    if (assignedShop) updateData.assignedShop = assignedShop;
    if (assignedMechanic) updateData.assignedMechanic = assignedMechanic;
    if (adminNotes) updateData.adminNotes = adminNotes;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Service request not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Service request ${status} successfully` 
    });
  } catch (error) {
    console.error("Error updating service request status:", error);
    return NextResponse.json(
      { error: "Failed to update service request status" },
      { status: 500 }
    );
  }
}   