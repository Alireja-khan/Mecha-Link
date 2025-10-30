import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect, { collections } from "@/lib/dbConnect";

export async function DELETE(req, { params }) {
    try {
        const { id } =await params;
        
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
            { _id: new ObjectId(id) }, // Convert string ID to MongoDB ObjectId
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
        // Ensure to handle cases where ID is invalid
        if (error.name === 'BSONTypeError') {
            return NextResponse.json({ error: "Invalid Review ID" }, { status: 400 });
        }
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
