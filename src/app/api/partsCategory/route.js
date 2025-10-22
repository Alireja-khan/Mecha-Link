import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const collection = await dbConnect(collections.partsCategories);
    const categories = await collection.find({}).toArray();
    
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const collection = await dbConnect(collections.partsCategories);

    const existingCategory = await collection.findOne({ 
      name: { $regex: new RegExp(`^${data.name}$`, 'i') } 
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }

    const categoryData = {
      name: data.name.trim(),
      subCategories: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(categoryData);
    
    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
      message: "Category created successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}