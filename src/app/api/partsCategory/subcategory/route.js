import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { categoryId, subCategoryName } = await req.json();
    const collection = await dbConnect(collections.partsCategories);

    const category = await collection.findOne({ 
      _id: new ObjectId(categoryId),
      "subCategories.name": { $regex: new RegExp(`^${subCategoryName}$`, 'i') }
    });

    if (category) {
      return NextResponse.json(
        { error: "Subcategory already exists in this category" },
        { status: 400 }
      );
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(categoryId) },
      {
        $push: {
          subCategories: {
            name: subCategoryName.trim(),
            createdAt: new Date()
          }
        },
        $set: { updatedAt: new Date() }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subcategory added successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}