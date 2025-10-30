// app/api/service-request/route.js
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
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const sort = searchParams.get("sort");
    const home = searchParams.get("home");
    const status = searchParams.get("status"); // filter by status

    const collection = await dbConnect(collections.serviceRequests);

    if (home) {
      const result = await collection.find().limit(6).toArray();
      return NextResponse.json(result);
    }

    let matchStage = {};

    if (search) {
      matchStage = {
        ...matchStage,
        $or: [
          { problemCategory: { $regex: search, $options: "i" } },
          { "serviceDetails.problemTitle": { $regex: search, $options: "i" } },
          { deviceType: { $regex: search, $options: "i" } },
          { "location.address": { $regex: search, $options: "i" } },
        ],
      };
    }

    if (sort && ["high", "low", "emergency"].includes(sort)) {
      matchStage["serviceDetails.urgency"] = sort;
    }

    if (status) {
      matchStage.status = status; // filter by status
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
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}
