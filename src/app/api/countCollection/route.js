import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const usersCollection = await dbConnect("users");

    const pipeline = [
      // 1️⃣ users count
      { $group: { _id: "users", count: { $sum: 1 } } },

      // 2️⃣ mechanicShops count & totalMechanic (only approved)
      {
        $unionWith: {
          coll: "mechanicShops",
          pipeline: [
            { $match: { status: "approved" } }, // only approved shops
            {
              $group: {
                _id: "mechanicShops",
                count: { $sum: 1 },
                totalMechanic: { $sum: "$shop.mechanicCount" },
              },
            },
          ],
        },
      },

      // 3️⃣ serviceRequests count
      {
        $unionWith: {
          coll: "serviceRequests",
          pipeline: [{ $group: { _id: "serviceRequests", count: { $sum: 1 } } }],
        },
      },

      // 4️⃣ reviews average rating
      {
        $unionWith: {
          coll: "reviews",
          pipeline: [
            { $match: { status: "completed" } },
            {
              $group: {
                _id: "averageRating",
                avgRating: { $avg: "$rating" },
              },
            },
            {
              $project: {
                _id: 1,
                avgRating: { $round: ["$avgRating", 1] },
              },
            },
          ],
        },
      },

      // 5️⃣ combine everything into single object
      {
        $group: {
          _id: null,
          users: {
            $max: { $cond: [{ $eq: ["$_id", "users"] }, "$count", null] },
          },
          mechanicShops: {
            $max: {
              $cond: [
                { $eq: ["$_id", "mechanicShops"] },
                "$count",
                null,
              ],
            },
          },
          serviceRequests: {
            $max: { $cond: [{ $eq: ["$_id", "serviceRequests"] }, "$count", null] },
          },
          averageRating: {
            $max: { $cond: [{ $eq: ["$_id", "averageRating"] }, "$avgRating", null] },
          },
          totalMechanic: {
            $max: {
              $cond: [
                { $eq: ["$_id", "mechanicShops"] },
                "$totalMechanic",
                null,
              ],
            },
          },
        },
      },
      { $project: { _id: 0 } }, // remove _id
    ];

    const result = await usersCollection.aggregate(pipeline).toArray();

    return NextResponse.json(result[0] || {});
  } catch (error) {
    console.error("Aggregation Error:", error);
    return NextResponse.json({ error: "Aggregation failed", message: error.message }, { status: 500 });
  }
}
