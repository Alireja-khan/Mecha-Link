import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

  try {

    const users =await dbConnect(collections.users);

    const [summary] = await users.aggregate([
      { $match: { email } },

      {
        $lookup: {
          from: "serviceRequests",
          localField: "email",
          foreignField: "userEmail",
          as: "services"
        }
      },

      {
        $lookup: {
          from: "reviews",
          localField: "email",
          foreignField: "userEmail",
          as: "reviews"
        }
      },

      {
        $addFields: {
          serviceStats: {
            total: { $size: "$services" },
            completed: {
              $size: {
                $filter: {
                  input: "$services",
                  as: "s",
                  cond: { $eq: ["$$s.status", "completed"] }
                }
              }
            },
            pending: {
              $size: {
                $filter: {
                  input: "$services",
                  as: "s",
                  cond: { $eq: ["$$s.status", "pending"] }
                }
              }
            },
            inProgress: {
              $size: {
                $filter: {
                  input: "$services",
                  as: "s",
                  cond: { $eq: ["$$s.status", "in-progress"] }
                }
              }
            }
          },
          reviewStats: {
            totalReviews: { $size: "$reviews" },
            averageRating: {
              $cond: [
                { $gt: [{ $size: "$reviews" }, 0] },
                {
                  $round: [
                    { $avg: "$reviews.rating" },
                    2
                  ]
                },
                0
              ]
            }
          }
        }
      },

      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          profileImage: 1,
          role: 1,
          createdAt: 1,
          bio: 1,
          location: 1,
          phone: 1,
          "serviceStats": 1,
          "reviewStats": 1
        }
      }
    ]).toArray();

    if (!summary) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error("Error fetching user summary:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
