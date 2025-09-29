import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URI;
export const collections = {
  users: "users",
  mechanicShops: "mechanicShops",
  vehicles: "vehicles",
  mechanics: "mechanics",
  bookings: "bookings",
  serviceRequests: "serviceRequests",
  chats: "chats",
};

let client;
export let clientPromise;

if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");

if (process.env.NODE_ENV === "development") {

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


export default async function dbConnect(collectionName) {
  const client = await clientPromise;
  return client.db(process.env.DB_NAME).collection(collectionName);
}