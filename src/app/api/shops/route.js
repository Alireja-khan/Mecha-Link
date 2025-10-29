import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    const collection = await dbConnect("mechanicShops");

    // Ensure status is set, default to "pending"
    const shopData = {
      ...data,
      status: data.status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(shopData);
    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
      message: "Shop submitted for approval",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // --- Query params ---
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const category = searchParams.get("category");
    const sort = searchParams.get("sort"); // "htl" or "lth"
    const admin = searchParams.get("admin") === "true";
    const home = searchParams.get("home") === "true";
    const email = searchParams.get("email");

    const collection = await dbConnect(collections.mechanicShops);

    // --- Search by email ---
    if (email) {
      const shop = await collection.findOne({
        $or: [
          { ownerEmail: email },
          { userEmail: email },
          { "shop.ownerEmail": email },
        ],
      });

      if (!shop) return NextResponse.json({ message: "No shop found for this email" }, { status: 404 });
      return NextResponse.json(shop);
    }

    // --- Home page request (approved + limit 6) ---
    if (home) {
      const result = await collection
        .find({ status: "approved" })
        .limit(6)
        .toArray();
      return NextResponse.json(result);
    }

    // --- Build query ---
    const matchStage = {};

    if (!admin) matchStage.status = "approved"; // non-admin only sees approved
    if (status && status !== "all") matchStage.status = status;
    if (category) matchStage["shop.categories"] = category;

    if (search) {
      matchStage.$or = [
        { "shop.shopName": { $regex: search, $options: "i" } },
        { "shop.address.city": { $regex: search, $options: "i" } },
        { "ownerName": { $regex: search, $options: "i" } },
        { "shop.address.country": { $regex: search, $options: "i" } },
        { "ownerEmail": { $regex: search, $options: "i" } },
      ];
    }

    // --- Sorting ---
    let sortStage = { createdAt: -1 }; // default newest first
    if (sort === "htl") sortStage = { avgRating: -1 };
    if (sort === "lth") sortStage = { avgRating: 1 };

    // --- Pagination calculation ---
    const skip = (page - 1) * limit;

    // --- Aggregation pipeline ---
    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "reviews",
          let: { shopId: { $toString: "$_id" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$shopId", "$$shopId"] } } },
          ],
          as: "reviews",
        },
      },
      {
        $addFields: {
          avgRating: { $avg: "$reviews.rating" },
        },
      },
      { $sort: sortStage },
      { $skip: skip },
      { $limit: limit },
    ];

    const result = await collection.aggregate(pipeline).toArray();

    // --- Total count for pagination ---
    const totalDocs = await collection.countDocuments(matchStage);
    const totalPages = Math.ceil(totalDocs / limit);

    return NextResponse.json({
      result,
      pagination: {
        page,
        limit,
        totalDocs,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error("Failed to fetch shops:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

