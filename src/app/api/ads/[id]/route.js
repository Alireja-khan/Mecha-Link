import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect, { collections } from "@/lib/dbConnect";


export async function GET(req, { params }) {
  const { id } = await params;
   if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid or missing ID" },
      { status: 400 }
    );
  }


  const collection = await dbConnect(collections.ads);
  const ad = await collection.findOne({ _id: new ObjectId(id) });
  if (!ad) {
    return NextResponse.json({ message: "Ad not found" }, { status: 404 });
  }
  return NextResponse.json(ad);

}

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status } = body;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ad ID" }, { status: 400 });
    }

    const db = await dbConnect(collections.ads);

    const result = await db.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Ad not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Ad status updated successfully",
      status,
    });
  } catch (error) {
    console.error("Error updating ad:", error);
    return NextResponse.json(
      { message: "Failed to update ad", error: error.message },
      { status: 500 }
    );
  }
}


export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ad ID" }, { status: 400 });
    }

    const db = await dbConnect(collections.ads);

    const result = await db.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Ad not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Ad deleted successfully" });
  } catch (error) {
    console.error("Error deleting ad:", error);
    return NextResponse.json(
      { message: "Failed to delete ad", error: error.message },
      { status: 500 }
    );
  }
}