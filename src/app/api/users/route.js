import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const collection = await dbConnect(collections.users);

  // ✅ Hide sensitive fields (password, otp, otpExpiresAt)
  const result = await collection
    .findOne({email}, { projection: { otp: 0, otpExpiresAt: 0 } });

  return NextResponse.json(result);
}


export async function POST(req, res) {
  const data = await req.json();
  const collection = await dbConnect(collections.users);

  const isExist = await collection.findOne({ email: data.email });
  if (isExist) {
    return NextResponse.json(
      { success: false, message: "Your email already exists" },
      { status: 400 }
    );
  }

  const hashPassword = await bcrypt.hash(data.password, 10);
  data.password = hashPassword;

  const result = await collection.insertOne(data);

  return NextResponse.json({
    success: true,
    insertedId: result.insertedId,
  });
}


//mark as read patch api



export async function PATCH(req) {
  const data = await req.json(); 
  const collection = await dbConnect(collections.users);

  const result = await collection.updateOne(
    { email: data.email },
    { $set: { "notifications.$[].read": true } } // mark all notifications as read
  );

  return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
}

//delete notification api
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const notifId = searchParams.get("notifId"); 
    if (!email || !notifId) {
      return NextResponse.json(
        { success: false, message: "Email and notifId are required" },
        { status: 400 }
      );
    }

    const collection = await dbConnect(collections.users);

    // Remove the notification from user's notifications array
    const result = await collection.updateOne(
      { email },
      { $pull: { notifications: { _id: notifId } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Notification not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    console.error("❌ Failed to delete notification:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
