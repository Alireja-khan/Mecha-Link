import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
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

    // Validate required fields
    if (!userEmail || !partId || !partsName || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const collection = await dbConnect(collections.cart);

    // Check if item already exists in cart for this user
    const existingCartItem = await collection.findOne({
      userEmail,
      partId
    });

    if (existingCartItem) {
      // Update quantity if item already exists
      const result = await collection.updateOne(
        { _id: existingCartItem._id },
        { 
          $set: { 
            quantity: existingCartItem.quantity + quantity,
            updatedAt: new Date()
          } 
        }
      );

      return NextResponse.json({
        success: true,
        message: "Cart item quantity updated",
        updated: result.modifiedCount > 0
      });
    } else {
      // Create new cart item
      const cartItemData = {
        userEmail,
        partId,
        partsName,
        price,
        quantity,
        image: image || "",
        brand: brand || "",
        category: category || "",
        addedAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(cartItemData);
      
      return NextResponse.json({
        success: true,
        insertedId: result.insertedId,
        message: "Item added to cart successfully",
      });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail');
    const partId = searchParams.get('partId');

    if (!userEmail || !partId) {
      return NextResponse.json(
        { error: "User email and part ID are required" },
        { status: 400 }
      );
    }

    const collection = await dbConnect(collections.cart);
    const result = await collection.deleteOne({ userEmail, partId });

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

export async function PUT(req) {
  try {
    const data = await req.json();
    const { userEmail, partId, quantity } = data;

    if (!userEmail || !partId || quantity === undefined) {
      return NextResponse.json(
        { error: "User email, part ID and quantity are required" },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    const collection = await dbConnect(collections.cart);
    const result = await collection.updateOne(
      { userEmail, partId },
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