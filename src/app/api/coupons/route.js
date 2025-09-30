import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// GET - Fetch all coupons
export async function GET() {
  try {
    const collection = await dbConnect("coupons");
    const coupons = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(coupons);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

// POST - Create new coupon
export async function POST(request) {
  try {
    const { code, discount, expiryDate, usageLimit, status = "active" } = await request.json();
    
    if (!code || !discount || !expiryDate) {
      return NextResponse.json({ error: "Code, discount and expiry date are required" }, { status: 400 });
    }

    const collection = await dbConnect("coupons");
    const coupon = {
      code: code.toUpperCase(),
      discount: parseInt(discount),
      expiryDate: new Date(expiryDate),
      usageLimit: usageLimit ? parseInt(usageLimit) : null,
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(coupon);
    return NextResponse.json({ ...coupon, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}