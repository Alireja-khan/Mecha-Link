import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";


// export async function GET(request) {
//     const { searchParams } = new URL(request.url);
//     const email = searchParams.get('email');
//     const collection = await dbConnect(collections.users);
//     const result = await collection.findOne({ email });
//     return  NextResponse.json(result);
// }

export async function GET(request) {
    const collection = await dbConnect(collections.users)
    const result = await collection.find().toArray();
    return NextResponse.json(result);
}

// export async function GET(request) {
//     const collection = await dbConnect(collections.users)
//     const result = await collection.find().toArray();
//     return NextResponse.json(result);
// }



export async function POST(req, res) {
    const data = await req.json();
    const collection = await dbConnect(collections.users);
    const isExist =await collection.findOne({ email: data.email });    
    if (isExist) return NextResponse.json({success:false, message: "You email already exist", status: 400 });
    const hashPassword = await bcrypt.hash(data.password, 10);
    data.password = hashPassword;
 
    const result = await collection.insertOne(data);
    return NextResponse.json(result);
}