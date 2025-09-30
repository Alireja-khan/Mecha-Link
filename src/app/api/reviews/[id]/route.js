// app/api/reviews/[id]/route.js
export async function PATCH(req, { params }) {
    try {
        const { id } = params;
        const body = await req.json();
        
        const collection = await dbConnect(collections.reviews);
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: body }
        );
        
        return NextResponse.json(result);
    } catch (error) {
        console.error("PATCH error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}