import { NextResponse } from "next/server";
import dbConnect, { collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    
    // Validate ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid service request ID" }, { status: 400 });
    }

    const collection = await dbConnect(collections.serviceRequests);
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Service request not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Service request deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting service request:", error);
    return NextResponse.json(
      { error: "Failed to delete service request" },
      { status: 500 }
    );
  }
}

// Your existing GET and PUT handlers...
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const collection = await dbConnect(collections.serviceRequests);

    const pipeline = [
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "users",
          let: { userId: "$userId" }, 
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", { $toObjectId: "$$userId" }] },
              },
            },
            { $project: { password: 0 } }, 
          ],
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }, 
    ];

    const [request] = await collection.aggregate(pipeline).toArray();

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json(request);
  } catch (error) {
    return NextResponse.json({error: "Internal Server Error",})
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const updates = await request.json();
    
    const collection = await dbConnect(collections.serviceRequests);
    
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Service request not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Service request updated successfully" 
    });
  } catch (error) {
    console.error("Error updating service request:", error);
    return NextResponse.json(
      { error: "Failed to update service request" },
      { status: 500 }
    );
  }
}