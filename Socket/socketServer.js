import express from "express";
import http from "http";
import {Server} from "socket.io";
import dotenv from "dotenv";
import {collections, dbConnect} from "./dbConnect.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {origin: "*"},
});

app.use(express.json());

async function start() {
  try {
    const serviceRequests = await dbConnect(collections.serviceRequests);
    const notifications = await dbConnect(collections.notifications);
    const mechanicShopsCollection = await dbConnect(collections.mechanicShops);
    const announcementsCollection = await dbConnect(collections.announcements);
    const couponsCollection = await dbConnect(collections.coupons);

    console.log("✅ Connected to MongoDB collections");

    // -----------------------------
    // Watch for new service requests
    // -----------------------------
    serviceRequests.watch().on("change", async (change) => {
      if (change.operationType === "insert") {
        const newRequest = change.fullDocument;
        console.log("📢 New Service Request:", newRequest);

        const notificationDoc = {
          userEmail: newRequest?.userEmail || "system@mechalink.com",
          message: "New service request added!",
          type: "serviceRequest",
          data: newRequest,
          createdAt: new Date(),
          read: false,
        };

        await notifications.insertOne(notificationDoc);
        io.emit("serviceRequestNotification", notificationDoc);
      }
    });

    // -----------------------------
    // Watch for new mechanic shops
    // -----------------------------
    mechanicShopsCollection.watch().on("change", async (change) => {
      if (change.operationType === "insert") {
        const newMechanic = change.fullDocument;
        console.log("📢 New Mechanic Shop Added:", newMechanic);

        const notificationDoc = {
          userEmail: newMechanic.userEmail,
          message: `New mechanic shop added: ${newMechanic?.shop?.shopName}`,
          type: "mechanicShopAdded",
          data: newMechanic,
          createdAt: newMechanic?.createdAt,
          read: false,
        };

        await notifications.insertOne(notificationDoc);
        io.emit("mechanicShopNotification", notificationDoc);
      }
    });

    // -----------------------------
    // Watch for new announcements
    // -----------------------------
    announcementsCollection.watch().on("change", async (change) => {
      if (change.operationType === "insert") {
        const newAnnouncement = change.fullDocument;
        console.log("📢 New Announcement Added:", newAnnouncement);

        const notificationDoc = {
          userEmail: newAnnouncement.email || "admin@gmail.com", // broadcast to all users and mechanics
          message: `New announcement: ${newAnnouncement.title}`,
          type: "announcement",
          data: newAnnouncement,
          createdAt: newAnnouncement?.createdAt || new Date(),
          read: false,
        };

        await notifications.insertOne(notificationDoc);
        io.emit("announcementNotification", notificationDoc);
      }
    });

    // -----------------------------
    // Watch for new coupons
    // -----------------------------
    couponsCollection.watch().on("change", async (change) => {
      if (change.operationType === "insert") {
        const newCoupon = change.fullDocument;
        console.log("📢 New Coupon Added:", newCoupon);

        const notificationDoc = {
          userEmail: "all", // broadcast to all users and mechanics
          message: `New coupon available: ${newCoupon.code}`,
          type: "coupon",
          data: newCoupon,
          createdAt: newCoupon?.createdAt || new Date(),
          read: false,
        };

        await notifications.insertOne(notificationDoc);
        io.emit("couponNotification", notificationDoc);
      }
    });

    // -----------------------------
    // Socket.io connection events
    // -----------------------------
    io.on("connection", (socket) => {
      console.log("⚡ User connected:", socket.id);

      socket.on("joinChat", (chatId) => {
        socket.join(chatId);
        console.log(`${socket.id} joined room: ${chatId}`);
      });

      socket.on("sendMessage", (msg) => {
        io.to(msg.chatId).emit("newMessage", msg);
      });

      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
      });
    });

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Socket.IO server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server error:", err);
  }
}

start();
