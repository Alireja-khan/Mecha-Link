import dbConnect, { collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// ---------------- GET ----------------
export async function GET(req, { params }) {
  try {
    const { id } = params;

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
    console.error("GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ---------------- PUT ----------------
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    console.log(id)

    const collection = await dbConnect(collections.serviceRequests);

    const updateResult = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );

    return NextResponse.json(updateResult);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
