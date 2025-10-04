import dbConnect, { collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const collection = await dbConnect(collections.mechanicShops);

    const pipeline = [
      {
        $match: { _id: new ObjectId(id) },
      },
      {
        $lookup: {
          from: "reviews",
          let: { shopId: { $toString: "$_id" } }, 
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$shopId", "$$shopId"] }, 
              },
            },
          ],
          as: "reviews",
        },
      },
      {
        $addFields: {
          avgRating: {
            $ifNull: [
              {
                $avg: {
                  $map: {
                    input: "$reviews",
                    as: "r",
                    in: {
                      $cond: [
                        { $ifNull: ["$$r.rating", false] },
                        { $toDouble: "$$r.rating" },
                        null,
                      ],
                    },
                  },
                },
              },
              0,
            ],
          },
        },
      },
    ];

    const result = await collection.aggregate(pipeline).toArray();
    return NextResponse.json(result[0] || {});
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}


export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    
    // Validate ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid service request ID" }, { status: 400 });
    }

    const collection = await dbConnect(collections.mechanicShops);
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Mechanic Shop not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Mechanic Shop deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting mechanic shop:", error);
    return NextResponse.json(
      { error: "Failed to delete mechanic shop" },
      { status: 500 }
    );
  }
}