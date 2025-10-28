import dbConnect, {collections} from "@/lib/dbConnect";
import {NextResponse} from "next/server";

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
      startDate,
      endDate,
      price,
    } = body;

    // 🛑 Validate required fields
    if (
      !title ||
      !description ||
      !bannerImage ||
      !shopEmail ||
      !startDate ||
      !endDate ||
      !price
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🧮 Calculate duration in days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1; // include both days

    if (duration <= 0) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      );
    }

    const collection = await dbConnect(collections.ads);

    // 🆕 Create new ad document
    const newAd = {
      title,
      description,
      bannerImage,
      shopEmail,
      status: status || "pending",
      isPaid: isPaid || false,
      startDate: start,
      endDate: end,
      duration,
      price: parseInt(price),
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newAd);

    return NextResponse.json(
      {
        message: "Ad created successfully",
        adId: result.insertedId,
        duration,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating ad:", error);
    return NextResponse.json(
      { error: "Failed to create ad" },
      { status: 500 }
    );
  }
}

// ✅ Get all ads
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const adsCollection = await dbConnect(collections.ads);
    const shopsCollection = await dbConnect(collections.mechanicShops);

    // ✅ Step 1: Auto reject expired ads
    const now = new Date();
    await adsCollection.updateMany(
      { endDate: { $lt: now }, status: { $ne: "expired" } },
      { $set: { status: "expired" } }
    );

    // ✅ Step 2: Continue normal fetch
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
          shopName: shop?.shop?.shopName || null,
        };
      })
    );

    return NextResponse.json(adsWithShopId);
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 });
  }
}