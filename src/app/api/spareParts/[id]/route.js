import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Fetch a single spare part
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const collection = await dbConnect(collections.spareParts);
    const part = await collection.findOne({ _id: new ObjectId(id) });

    if (!part) {
      return NextResponse.json({ error: "Part not found" }, { status: 404 });
    }

    return NextResponse.json(part);
  } catch (error) {
    console.error("❌ Error fetching part:", error);
    return NextResponse.json({ error: "Failed to fetch part" }, { status: 500 });
  }
}

// Update a spare part
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const updateData = await request.json();

    const collection = await dbConnect(collections.spareParts);

    // Clean up input data
    const sanitizedData = {
      ...updateData,
      price: updateData.price ? parseFloat(updateData.price) : undefined,
      quantity: updateData.quantity ? parseInt(updateData.quantity) : undefined,
      updatedAt: new Date(),
    };

    // Remove undefined fields so Mongo doesn’t overwrite with null
    Object.keys(sanitizedData).forEach(
      (key) => sanitizedData[key] === undefined && delete sanitizedData[key]
    );

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: sanitizedData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Part not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Spare part updated successfully",
    });
  } catch (error) {
    console.error("❌ Error updating part:", error);
    return NextResponse.json({ error: "Failed to update part" }, { status: 500 });
  }
}

// Delete a spare part
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const collection = await dbConnect(collections.spareParts);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Part not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Spare part deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting part:", error);
    return NextResponse.json({ error: "Failed to delete part" }, { status: 500 });
  }
}
