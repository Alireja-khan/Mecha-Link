import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } =await params;
  const collection = await dbConnect(collections.payments);
  const payment = await collection.findOne({ shopID: id });

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  return NextResponse.json(payment);
}
