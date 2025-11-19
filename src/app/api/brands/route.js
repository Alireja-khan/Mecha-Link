import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

// Get all brands
export async function GET(req) {
  try {
    const collection = await dbConnect("brands");
    const brands = await collection.find({}).sort({ name: 1 }).toArray();
    
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Create new brand
export async function POST(req) {
  try {
    const data = await req.json();
    const collection = await dbConnect("brands");

    // Check if brand already exists
    const existingBrand = await collection.findOne({ 
      name: { $regex: new RegExp(`^${data.name}$`, 'i') } 
    });

    if (existingBrand) {
      return NextResponse.json(
        { error: "Brand already exists" },
        { status: 400 }
      );
    }

    const brandData = {
      name: data.name.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(brandData);
    
    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
      message: "Brand created successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}