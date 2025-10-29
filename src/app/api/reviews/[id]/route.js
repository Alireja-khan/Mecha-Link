import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect, { collections } from "@/lib/dbConnect";

export async function DELETE(req, { params }) {
    try {
        const { id } = params;
        
        // Validate the ID
        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid review ID" },
                { status: 400 }
            );
        }

        const collection = await dbConnect(collections.reviews);
        const result = await collection.deleteOne(
            { _id: new ObjectId(id) }
        );
        
        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Review not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ 
            message: "Review deleted successfully",
            result 
        });
    } catch (error) {
        console.error("DELETE error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}


export async function PATCH(req, { params }) {
    try {
        const { id } = params;
        const body = await req.json();
        
        // Validate the ID
        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid review ID" },
                { status: 400 }
            );
        }

        const collection = await dbConnect(collections.reviews);
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: body }
        );
        
        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: "Review not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(result);
    } catch (error) {
        console.error("PATCH error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}