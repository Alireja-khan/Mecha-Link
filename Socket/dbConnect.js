import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI must be defined...");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Reuse client in dev to prevent creating multiple connections
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  clientPromise = client.connect();
}

export async function dbConnect(collectionName) {
  const client = await clientPromise;
  return client.db(process.env.DB_NAME).collection(collectionName);
}


export const collections = {
  users: "users",
  mechanicShops: "mechanicShops",
  vehicles: "vehicles",
  mechanics: "mechanics",
  bookings: "bookings",
  serviceRequests: "serviceRequests",
  chats: "chats",
  announcements: "announcements",
  coupons: "coupons",
  notifications: "notifications",
  reviews: "reviews",
};