import {NextResponse} from "next/server";

import dbConnect, {collections} from "@/lib/dbConnect";
export async function GET() {
  try {
    const collection = await dbConnect(collections.blogs);

    // Sort newest first
    const blogs = await collection.find({}).sort({createdAt: -1}).toArray();

    return NextResponse.json(blogs, {status: 200});
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      {message: "Failed to fetch blogs", error: error.message},
      {status: 500}
    );
  }
}
export async function POST(req) {
  try {
    const body = await req.json();
    const {title, description, category, image, date} = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        {message: "Missing required fields"},
        {status: 400}
      );
    }

    const collection = await dbConnect(collections.blogs);

    const newBlog = {
      title,
      description,
      category,
      image,
      date: date || new Date().toLocaleDateString(),
      likes: 0,
      views: 0,
    };

    const result = await collection.insertOne(newBlog);

    return NextResponse.json(
      {message: "Blog added successfully", id: result.insertedId},
      {status: 201}
    );
  } catch (error) {
    console.error("Error adding blog:", error);
    return NextResponse.json(
      {message: "Internal Server Error", error: error.message},
      {status: 500}
    );
  }
}
