import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const collection = await dbConnect(collections.users);

  let result;
  if (email) {
    // get one user by email
    result = await collection.findOne({ email });
  } else {
    // get all users
    result = await collection.find().toArray();
  }


export async function GET(request) {
    const collection = await dbConnect(collections.users);

    // ✅ Hide sensitive fields (password, otp, otpExpiresAt)
    const result = await collection
        .find({}, { projection: { password: 0, otp: 0, otpExpiresAt: 0 } })
        .toArray();

    return NextResponse.json(result);

}

export async function POST(req) {
  const data = await req.json();
  const collection = await dbConnect(collections.users);

  const isExist = await collection.findOne({ email: data.email });
  if (isExist) {
    return NextResponse.json({
      success: false,
      message: "Your email already exists",
      status: 400,
    });
  }

  const hashPassword = await bcrypt.hash(data.password, 10);
  data.password = hashPassword;


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
