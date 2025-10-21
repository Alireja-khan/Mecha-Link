import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

// ✅ Create a new Advertisement
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      bannerImage,
      status,
      isPaid,
      shopEmail,
      duration,
      price,
    } = body;

    // 🛑 Validate required fields
    if (!title || !description || !bannerImage || !shopEmail || !duration || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const collection = await dbConnect(collections.ads);

    // 🆕 Create new ad document with duration and price
    const newAd = {
      title,
      description,
      bannerImage,
      shopEmail,
      status: status || "pending",
      isPaid: isPaid || false,
      duration: parseInt(duration), // store as number
      price: parseInt(price), // store as number
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newAd);

    return NextResponse.json(
      { message: "Ad created successfully", adId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating ad:", error);
    return NextResponse.json({ error: "Failed to create ad" }, { status: 500 });
  }
}

// ✅ Get all ads
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email"); // get ?email= from query

    const adsCollection = await dbConnect(collections.ads);
    const shopsCollection = await dbConnect(collections.mechanicShops);

    let query = {};
    if (email) {
      query.shopEmail = email;
    }

    const ads = await adsCollection.find(query).sort({ createdAt: -1 }).toArray();

    const adsWithShopId = await Promise.all(
      ads.map(async (ad) => {
        const shop = await shopsCollection.findOne({
          "shop.contact.email": ad.shopEmail,
        });
        return {
          ...ad,
          shopId: shop?._id || null,
          shopName: shop?.shopName || null,
        };
      })
    );

    return NextResponse.json(adsWithShopId);
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 });
  }
}
