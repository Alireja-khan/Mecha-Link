import dbConnect, { collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

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