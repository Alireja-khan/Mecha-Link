import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URI;
export const collections = {
  users: "users",
  services: "services",
  vehicles: "vehicles",
  mechanics: "mechanics",
  bookings: "bookings",
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

async function testConnection() {
  try {
    const client = await clientPromise;
    await client.db("admin").command({ ping: 1 });
    console.log("✅ MongoDB connection established successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
}

testConnection();


export default async function dbConnect(collectionName) {
  const client = await clientPromise;
  return client.db(process.env.DB_NAME).collection(collectionName);
}