import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page")) || 1;

    const collection = await dbConnect("payments");
    const skip = (page - 1) * 20;

    const query = search
      ? {
          $or: [
            { shopID: { $regex: search, $options: "i" } },
            { shopName: { $regex: search, $options: "i" } },
            { ownerName: { $regex: search, $options: "i" } },
            { ownerEmail: { $regex: search, $options: "i" } },
            { purpose: { $regex: search, $options: "i" } },
            { tran_id: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const filteredCount = await collection.countDocuments(query);
    const totalPages = Math.ceil(filteredCount / 20);

    const payments = await collection
      .find(query)
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(20)
      .toArray();

    const totalItems = await collection.countDocuments();

    const totalAmountAgg = await collection
      .aggregate([
        {
          $group: {
            _id: null,
            totalAmount: {
              $sum: {
                $toDouble: {
                  $ifNull: ["$amount", 0],
                },
              },
            },
          },
        },
      ])
      .toArray();

    const totalAmount =
      totalAmountAgg.length > 0 ? totalAmountAgg[0].totalAmount : 0;
  
    return NextResponse.json({
      success: true,
      totalItems, 
      totalAmount, 
      totalPages, 
      payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
