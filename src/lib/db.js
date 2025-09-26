import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URI;
let client;
let db;

export default async function dbConnect(collectionName) {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: { version: ServerApiVersion.v1 },
    });
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log("✅ MongoDB Connected");
  }

  return db.collection(collectionName);
}
