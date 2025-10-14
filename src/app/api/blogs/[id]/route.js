import { NextResponse } from "next/server";

import { ObjectId } from "mongodb";
import dbConnect, { collections } from "@/lib/dbConnect";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid blog ID" },
        { status: 400 }
      );
    }

    const collection = await dbConnect(collections.blogs);
    const blog = await collection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return NextResponse.json(
        { message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { message: "Failed to fetch blog", error: error.message },
      { status: 500 }
    );
  }
}
