import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    const collection = await dbConnect("mechanicShops");

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
    const sort = searchParams.get("sort");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page"));
    const limit = parseInt(searchParams.get("limit"));
    const status = searchParams.get("status");
    const admin = searchParams.get("admin");
    const home = searchParams.get("home");
    const email = searchParams.get("email");
    const category = searchParams.get("category");

    const collection = await dbConnect(collections.mechanicShops);

    if (email) {
      const shop = await collection.findOne({
        $or: [
          { ownerEmail: email },
          { userEmail: email },
          { "shop.ownerEmail": email },
        ],
      });

      if (!shop) {
        return NextResponse.json(
          { message: "No shop found for this email" },
          { status: 404 }
        );
      }

      return NextResponse.json(shop);
    }

    let matchStage = {};

    if (!admin) matchStage.status = "approved";
    if (status && status !== "all") matchStage.status = status;

    if (category) {
      matchStage["shop.categories"] = category;
    }

    if (search) {
      matchStage.$or = [
        { "shop.shopName": { $regex: search, $options: "i" } },
        { "shop.address.city": { $regex: search, $options: "i" } },
        { "ownerName": { $regex: search, $options: "i" } },
        { "shop.address.country": { $regex: search, $options: "i" } },
        { ownerName: { $regex: search, $options: "i" } },
        { ownerEmail: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      matchStage["shop.categories"] = category;
    }

    let sortStage = {};
    if (sort === "htl") sortStage = { avgRating: -1 };
    if (sort === "lth") sortStage = { avgRating: 1 };

    const pipeline = [
      { $match: matchStage },
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

    if (Object.keys(sortStage).length) pipeline.push({ $sort: sortStage });
    if (limit > 0) {
      pipeline.push({ $skip: (page - 1) * limit });
      pipeline.push({ $limit: limit });
    }

    if (home) {
      const result = await collection.aggregate(pipeline).limit(6).toArray();
      return NextResponse.json(result);
    }
    const result = await collection.aggregate(pipeline).toArray();
    const totalDocs = await collection.countDocuments(matchStage);
    const totalPage = limit > 0 ? Math.ceil(totalDocs / limit) : 1;

    return NextResponse.json({ result, totalDocs, totalPage });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch shop data" },
      { status: 500 }
    );
  }
}

