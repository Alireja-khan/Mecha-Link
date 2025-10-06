import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    const matchQuery = { status: "approved" };

    if (category && category !== "all") {
      matchQuery["shop.categories"] = { $in: [category] };
    }

    if (search) {
      matchQuery.$or = [
        { "shop.shopName": { $regex: search, $options: "i" } },
        { "shop.address.street": { $regex: search, $options: "i" } },
        { "shop.address.city": { $regex: search, $options: "i" } },
        { "shop.address.district": { $regex: search, $options: "i" } },
        { "shop.address.division": { $regex: search, $options: "i" } },
        { "shop.address.country": { $regex: search, $options: "i" } },
      ];
    }

    const collection = await dbConnect(collections.mechanicShops);

    const result = await collection
      .aggregate([
        { $match: matchQuery },
        {
          $project: {
            _id: 1,
            shopName: "$shop.shopName",
            latitude: "$shop.location.latitude",
            longitude: "$shop.location.longitude",
            logo: {
              $ifNull: [
                "$shop.logo",
                null,
              ],
            },
          },
        },
      ])
      .toArray();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
