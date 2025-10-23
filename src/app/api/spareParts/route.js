

import dbConnect, { collections } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Check if it's a request for filter options
    const getFilters = searchParams.get("filters");
    if (getFilters === "true") {
      return await handleFiltersRequest();
    }
    
    // Otherwise, handle spare parts data request
    return await handleSparePartsRequest(req);
  } catch (error) {
    console.error("Error in spareParts API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle spare parts data request with filters
async function handleSparePartsRequest(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 12;
  const category = searchParams.get("category");
  const subCategory = searchParams.get("subCategory");
  const brand = searchParams.get("brand");
  const search = searchParams.get("search");
  const sortBy = searchParams.get("sortBy") || "newest";

  const collection = await dbConnect(collections.spareParts);

  let matchStage = {};
  
  // Apply filters
  if (category && category !== "all") {
    matchStage.category = category;
  }
  
  if (subCategory && subCategory !== "all") {
    matchStage.subCategory = subCategory;
  }
  
  if (brand && brand !== "all") {
    matchStage.brands = brand;
  }

  if (search) {
    matchStage.$or = [
      { partsName: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { brands: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } }
    ];
  }

  // Sort configuration
  let sortStage = {};
  switch (sortBy) {
    case "price-low":
      sortStage = { price: 1 };
      break;
    case "price-high":
      sortStage = { price: -1 };
      break;
    case "name":
      sortStage = { partsName: 1 };
      break;
    case "newest":
    default:
      sortStage = { createdAt: -1 };
  }

  const pipeline = [
    { $match: matchStage },
    {
      $facet: {
        metadata: [{ $count: "totalCount" }],
        data: [
          { $sort: sortStage },
          { $skip: (page - 1) * limit },
          { $limit: limit }
        ]
      }
    }
  ];

  const result = await collection.aggregate(pipeline).toArray();
  const totalCount = result[0]?.metadata[0]?.totalCount || 0;
  const spareParts = result[0]?.data || [];

  return NextResponse.json({
    spareParts,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page
  });
}

// Handle filters data request - fetch from categories and brands collections
async function handleFiltersRequest() {
  try {
    const categoriesCollection = await dbConnect(collections.partsCategories);
    const brandsCollection = await dbConnect("brands");

    // console.log("🔍 Fetching categories and brands from collections...");

    // Get all categories with their subcategories
    const categoriesData = await categoriesCollection.find({}).toArray();
    
    // Format categories for dropdown
    const categories = categoriesData.map(cat => ({
      _id: cat._id,
      name: cat.name,
      subCategories: cat.subCategories?.map(sub => sub.name) || []
    }));

    // Get all brands
    const brandsData = await brandsCollection.find({}).sort({ name: 1 }).toArray();
    const brands = brandsData.map(brand => brand.name);

    // console.log("✅ Filters data:", {
    //   categories: categories.map(c => c.name),
    //   brands
    // });

    return NextResponse.json({
      categories,
      brands
    });
  } catch (error) {
    console.error("❌ Error fetching filters:", error);
    return NextResponse.json({ 
      categories: [],
      brands: []
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const collection = await dbConnect(collections.spareParts);

    const sparePartData = {
      ...data,
      price: parseFloat(data.price),
      quantity: parseInt(data.quantity),
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(sparePartData);
    
    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
      message: "Spare part added successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}