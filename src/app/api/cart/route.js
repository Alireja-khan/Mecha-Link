import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // Import ObjectId for MongoDB _id operations

// Helper to check if a string is a valid ObjectId
const isValidObjectId = (id) => {
  try {
    return new ObjectId(id).toHexString() === id;
  } catch (e) {
    return false;
  }
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      // Return empty array if no userEmail is provided (for non-logged-in users)
      return NextResponse.json([]);
    }

    const collection = await dbConnect(collections.cart);
    const cartItems = await collection.find({ userEmail }).sort({ addedAt: -1 }).toArray();

    return NextResponse.json(cartItems);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { userEmail, partId, partsName, price, quantity, image, brand, category } = data;

    if (!userEmail || !partId || !partsName || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const actualQuantity = quantity > 0 ? quantity : 1;
    const collection = await dbConnect(collections.cart);

    const existingCartItem = await collection.findOne({ userEmail, partId });

    if (existingCartItem) {
      // Update to exact quantity instead of adding
      const result = await collection.updateOne(
        { _id: existingCartItem._id },
        {
          $set: {
            quantity: actualQuantity,
            updatedAt: new Date()
          }
        }
      );

      return NextResponse.json({
        success: true,
        action: "update",
        newQuantity: actualQuantity,
        message: "Cart item quantity updated successfully"
      });
    } else {
      const cartItemData = {
        userEmail,
        partId,
        partsName,
        price,
        quantity: actualQuantity,
        image: image || "",
        brand: brand || "",
        category: category || "",
        addedAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(cartItemData);

      return NextResponse.json({
        success: true,
        action: "add",
        newQuantity: actualQuantity,
        insertedId: result.insertedId,
        message: "Item added to cart successfully"
      });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Removes an item using its unique MongoDB _id
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('_id'); // Get _id from query parameters

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID (_id) is required" },
        { status: 400 }
      );
    }

    if (!isValidObjectId(itemId)) {
      return NextResponse.json({ error: "Invalid item ID format" }, { status: 400 });
    }

    const collection = await dbConnect(collections.cart);

    // Use ObjectId to query and delete the specific document
    const result = await collection.deleteOne({
      _id: new ObjectId(itemId)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Item removed from cart successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Updates the quantity of an item using its unique MongoDB _id
export async function PUT(req) {
  try {
    const data = await req.json();
    // Expecting _id and quantity in the request body
    const { _id, quantity } = data;

    if (!_id || quantity === undefined) {
      return NextResponse.json(
        { error: "Item ID (_id) and quantity are required" },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    if (!isValidObjectId(_id)) {
      return NextResponse.json({ error: "Invalid item ID format" }, { status: 400 });
    }

    const collection = await dbConnect(collections.cart);

    // Use ObjectId to find and update the specific document
    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          quantity,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cart item quantity updated successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}