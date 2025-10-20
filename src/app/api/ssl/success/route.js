import dbConnect, { collections } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function POST(req) {
  const formData = await req.formData();
  const data = Object.fromEntries(formData);

  const collection = await dbConnect(collections.mechanicShops);
  const shopData = await collection.findOne({ _id: new ObjectId(data.value_a) });

  if (!shopData) {
    return new Response(JSON.stringify({ error: "Shop not found" }), { status: 404 });
  }

  const payload = {
    tran_id: data.tran_id || "",
    amount: data.amount || "",
    card_type: data.card_type || "",
    bank_tran_id: data.bank_tran_id || "",
    status: data.status || "",
    cus_name: data.cus_name || "",
    shopID: data.value_a,
    purpose: data.value_b,
    paymentDate: new Date(),
    paymentStatus: "paid",
    shopName: shopData.shop.shopName,
    ownerName: shopData.shop.ownerName,
    ownerEmail: shopData.shop.ownerEmail,
  };

  const paymentCollection = await dbConnect(collections.payments);
  await paymentCollection.insertOne(payload);

  const {shopName, ownerEmail, ownerName, ...rest} = payload
  await collection.updateOne({ _id: new ObjectId(data.value_a) }, { $set: { paymentInfo: rest } });


  return new Response(null, {
    status: 302,
    headers: {
      Location: `${process.env.NEXT_PUBLIC_BASE_URL}/success?shopID=${data.value_a}`,
    },
  });
}
