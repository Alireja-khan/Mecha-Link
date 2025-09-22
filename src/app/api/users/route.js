import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET (request){
    const bookingCollection = dbConnect("users");
    const result = await bookingCollection.find({}).toArray();
    return NextResponse.json(result);
}