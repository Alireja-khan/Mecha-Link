import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// GET - Fetch single coupon
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const collection = await dbConnect("coupons");
    const coupon = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    
    return NextResponse.json(coupon);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch coupon" }, { status: 500 });
  }
}

// PATCH - Update coupon
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    const collection = await dbConnect("coupons");
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

// DELETE - Delete coupon
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const collection = await dbConnect("coupons");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}