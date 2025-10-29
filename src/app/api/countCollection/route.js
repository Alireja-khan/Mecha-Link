import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const usersCollection = await dbConnect("users");

    // today's date range (00:00 → 23:59)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const pipeline = [
      // 1️⃣ total users count
      { $group: { _id: "users", count: { $sum: 1 } } },

      // 2️⃣ mechanicShops total, totalMechanic, todayMechanicShops (approved only)
      {
        $unionWith: {
          coll: "mechanicShops",
          pipeline: [
            { $match: { status: "approved" } },
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
      {
        $unionWith: {
          coll: "mechanicShops",
          pipeline: [
            {
              $match: {
                status: "approved",
                createdAt: { $gte: startOfDay, $lte: endOfDay },
              },
            },
            {
              $group: {
                _id: "todayMechanicShops",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },

      // 3️⃣ serviceRequests total + todayServiceRequests (based on requestedDate)
      {
        $unionWith: {
          coll: "serviceRequests",
          pipeline: [
            { $group: { _id: "serviceRequests", count: { $sum: 1 } } },
          ],
        },
      },
      {
        $unionWith: {
          coll: "serviceRequests",
          pipeline: [
            {
              $match: {
                requestedDate: { $gte: startOfDay, $lte: endOfDay },
              },
            },
            {
              $group: {
                _id: "todayServiceRequests",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },

      // 4️⃣ reviews average rating (for completed)
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

      // 5️⃣ combine everything into one object
      {
        $group: {
          _id: null,
          users: { $max: { $cond: [{ $eq: ["$_id", "users"] }, "$count", null] } },
          mechanicShops: {
            $max: { $cond: [{ $eq: ["$_id", "mechanicShops"] }, "$count", null] },
          },
          totalMechanic: {
            $max: { $cond: [{ $eq: ["$_id", "mechanicShops"] }, "$totalMechanic", null] },
          },
          serviceRequests: {
            $max: { $cond: [{ $eq: ["$_id", "serviceRequests"] }, "$count", null] },
          },
          todayMechanicShops: {
            $max: { $cond: [{ $eq: ["$_id", "todayMechanicShops"] }, "$count", null] },
          },
          todayServiceRequests: {
            $max: { $cond: [{ $eq: ["$_id", "todayServiceRequests"] }, "$count", null] },
          },
          averageRating: {
            $max: { $cond: [{ $eq: ["$_id", "averageRating"] }, "$avgRating", null] },
          },
        },
      },

      // 6️⃣ ensure no nulls (replace null → 0)
      {
        $project: {
          _id: 0,
          users: { $ifNull: ["$users", 0] },
          mechanicShops: { $ifNull: ["$mechanicShops", 0] },
          totalMechanic: { $ifNull: ["$totalMechanic", 0] },
          serviceRequests: { $ifNull: ["$serviceRequests", 0] },
          todayMechanicShops: { $ifNull: ["$todayMechanicShops", 0] },
          todayServiceRequests: { $ifNull: ["$todayServiceRequests", 0] },
          averageRating: { $ifNull: ["$averageRating", 0] },
        },
      },
    ];

    const result = await usersCollection.aggregate(pipeline).toArray();
    return NextResponse.json(result[0] || {});
  } catch (error) {
    console.error("Aggregation Error:", error);
    return NextResponse.json(
      { error: "Aggregation failed", message: error.message },
      { status: 500 }
    );
  }
}
