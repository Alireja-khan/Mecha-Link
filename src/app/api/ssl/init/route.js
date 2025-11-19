import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  let product_name = "";
  if(body.purpose === "Shop Add") {
    product_name = "Shop Add";
  }else if(body.purpose === "Ads") {
    product_name = "Ads";
  }

  const transactionId = `tran_${Date.now()}`;

  const postData = {
    store_id: process.env.SSL_STORE_ID,
    store_passwd: process.env.SSL_STORE_PASS,
    total_amount: body.amount,
    currency: "BDT",
    tran_id: transactionId,
    success_url:`${process.env.NEXT_PUBLIC_BASE_URL}/api/ssl/success`,
    fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/ssl/fail`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/ssl/cancel`,
    emi_option: 0,
    cus_name: body.ownerName,
    cus_email: body.email,
    cus_add1: "Dhaka",
    cus_country: "Bangladesh",
    cus_city: "Dhaka",
    cus_postcode: "1000",
    cus_phone: body.phone,
    product_name,
    product_category: body.category,
    product_profile: "general",
    shipping_method: "NO",
    num_of_item: 1,
    weight_of_items: 1,
    logistic_pickup_id: 0,
    logistic_delivery_type: "DOMESTIC",
    value_a: body.shopID,
    value_b: body.purpose,
    value_c: body.adID
  };
 
  const response = await fetch("https://sandbox.sslcommerz.com/gwprocess/v4/api.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(postData).toString(),
  });

  const result = await response.json();
  return NextResponse.json(result);
}
