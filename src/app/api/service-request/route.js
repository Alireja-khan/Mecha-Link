import { NextResponse } from "next/server";
import dbConnect, { collections } from "@/lib/dbConnect";

export async function POST(req) {
  try {
    const body = await req.json();

    const collection = await dbConnect(collections.serviceRequests);
    await collection.insertOne(body);
    return NextResponse.json({ success: true, data: body }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page"));
    const limit = parseInt(searchParams.get("limit"));
    const sort = searchParams.get("sort");
    const home = searchParams.get("home");
    const collection = await dbConnect(collections.serviceRequests);

    if (home) {
      const result = await collection.find().limit(6).toArray();
      return NextResponse.json(result);
    }

    // Added by Alireja //


    // ******************************** //

    let matchStage = {};
    if (search) {
      matchStage = {
        $or: [
          { problemCategory: { $regex: search, $options: "i" } },
          { deviceType: { $regex: search, $options: "i" } },
          { "location.address": { $regex: search, $options: "i" } },
        ],
      };
    }
    if (sort === "high") {
      matchStage["serviceDetails.urgency"] = "high";
    } else if (sort === "emergency") {
      matchStage["serviceDetails.urgency"] = "emergency";
    } else if (sort === "low") {
      matchStage["serviceDetails.urgency"] = "low";
    }

    const result = await collection
      .find(matchStage)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    const totalDocs = await collection.countDocuments(matchStage);
    const totalPage = limit > 0 ? Math.ceil(totalDocs / limit) : 1;

    return NextResponse.json({ result, totalDocs, totalPage });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}
