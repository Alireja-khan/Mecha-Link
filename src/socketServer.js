import express from "express";
import http from "http";
import {Server} from "socket.io";
import dotenv from "dotenv";
import {collections, dbConnect} from "./dbConnect.js";
import {ObjectId} from "mongodb";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {origin: "*"},
});
const PORT = process.env.PORT || 5000;

app.use(express.json());

async function start() {
  try {
    // -----------------------------
    // MongoDB Collections
    // -----------------------------
    const serviceRequests = await dbConnect(collections.serviceRequests);
    const mechanicShopsCollection = await dbConnect(collections.mechanicShops);
    const announcementsCollection = await dbConnect(collections.announcements);
    const couponsCollection = await dbConnect(collections.coupons);
    const usersCollection = await dbConnect(collections.users);

    console.log("✅ Connected to MongoDB collections");

    // -----------------------------
    // Watch: New Service Requests
    // -----------------------------
    serviceRequests.watch().on("change", async (change) => {
      if (change.operationType === "insert") {
        const newRequest = change.fullDocument;

        const notificationDoc = {
          _id: new ObjectId().toString(),
          message: "New service request added!",
          type: "serviceRequest",
          data: newRequest,
          createdAt: new Date(),
          read: false,
        };

        await usersCollection.updateOne(
          {email: newRequest.userEmail},
          {$push: {notifications: {$each: [notificationDoc], $position: 0}}}
        );

        await usersCollection.updateMany(
          {role: {$in: ["mechanic", "admin"]}},
          {$push: {notifications: {$each: [notificationDoc], $position: 0}}}
        );

        io.emit("serviceRequestNotification", notificationDoc);
      }
    });

    // -----------------------------
    // Watch: Assignment Updates
    // -----------------------------
    serviceRequests.watch().on("change", async (change) => {
      if (change.operationType === "update") {
        const updatedFields = change.updateDescription.updatedFields;

        if (updatedFields.assignedShopId) {
          const serviceId = change.documentKey._id;
          const updatedDoc = await serviceRequests.findOne({_id: serviceId});

          const shopDoc = await mechanicShopsCollection.findOne({
            _id: new ObjectId(updatedFields.assignedShopId),
          });

          const shopName = shopDoc?.shop?.shopName || "Assigned Shop";

          const notificationDoc = {
            _id: new ObjectId().toString(),
            userEmail: updatedDoc?.userEmail,
            message: `Service request has been assigned to "${shopName}"`,
            type: "assignment",
            data: {
              serviceId,
              shopId: updatedFields.assignedShopId,
              assignedUserId: updatedDoc?.userId,
            },
            createdAt: new Date(),
            read: false,
          };

          await usersCollection.updateOne(
            {email: updatedDoc.userEmail},
            {$push: {notifications: {$each: [notificationDoc], $position: 0}}}
          );

          await usersCollection.updateMany(
            {role: {$in: ["admin"]}},
            {$push: {notifications: {$each: [notificationDoc], $position: 0}}}
          );

          io.emit("assignmentNotification", notificationDoc);
        }
      }
    });

    // -----------------------------
    // Watch: New Mechanic Shops
    // -----------------------------
    mechanicShopsCollection.watch().on("change", async (change) => {
      if (change.operationType === "insert") {
        const newMechanic = change.fullDocument;

        const notificationDoc = {
          _id: new ObjectId().toString(),
          userEmail: newMechanic.userEmail,
          message: `New mechanic shop added: ${newMechanic?.shop?.shopName}`,
          type: "mechanicShopAdded",
          data: newMechanic,
          createdAt: newMechanic?.createdAt,
          read: false,
        };

        await usersCollection.updateMany(
          {role: {$in: ["admin"]}},
          {$push: {notifications: {$each: [notificationDoc], $position: 0}}}
        );

        io.emit("mechanicShopNotification", notificationDoc);
      }
    });

    // -----------------------------
    // Watch: New Announcements
    // -----------------------------
    announcementsCollection.watch().on("change", async (change) => {
      if (change.operationType === "insert") {
        const newAnnouncement = change.fullDocument;

        const notificationDoc = {
          _id: new ObjectId().toString(),
          userEmail: "all",
          message: `New announcement: ${newAnnouncement.title}`,
          type: "announcement",
          data: newAnnouncement,
          createdAt: newAnnouncement?.createdAt || new Date(),
          read: false,
        };

        await usersCollection.updateMany(
          {role: {$in: ["mechanic", "user"]}},
          {$push: {notifications: {$each: [notificationDoc], $position: 0}}}
        );

        io.emit("announcementNotification", notificationDoc);
      }
    });

    // -----------------------------
    // Watch: New Coupons
    // -----------------------------
    couponsCollection.watch().on("change", async (change) => {
      if (change.operationType === "insert") {
        const newCoupon = change.fullDocument;

        const notificationDoc = {
          _id: new ObjectId().toString(),
          userEmail: "all",
          message: `New coupon available: ${newCoupon.code}`,
          type: "coupon",
          data: newCoupon,
          createdAt: newCoupon?.createdAt || new Date(),
          read: false,
        };

        await usersCollection.updateMany(
          {role: {$in: ["user", "mechanic"]}},
          {$push: {notifications: {$each: [notificationDoc], $position: 0}}}
        );

        io.emit("couponNotification", notificationDoc);
      }
    });

    // -----------------------------
    // Socket.io: Chat + Events
    // -----------------------------
    io.on("connection", (socket) => {
      console.log("⚡ User connected:", socket.id);

      // Join Chat
      socket.on("joinChat", (chatId) => {
        socket.join(chatId);
        console.log(`${socket.id} joined room: ${chatId}`);
      });

      // Send Message
      socket.on("sendMessage", (msg) => {
        io.to(msg.chatId).emit("newMessage", msg);
      });

      // Typing
      socket.on("typing", (chatId, senderId) => {
        socket.to(chatId).emit("typing", chatId, senderId);
      });

      // Stop Typing
      socket.on("stopTyping", (chatId, senderId) => {
        socket.to(chatId).emit("stopTyping", chatId, senderId);
      });

      // Disconnect
      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
      });
    });

    // -----------------------------
    // Root Route
    // -----------------------------
    app.get("/", (req, res) => {
      res.send("🚀 Socket.IO server with Notifications + Chat is running!");
    });

    // -----------------------------
    // Server Listen
    // -----------------------------
    server.listen(PORT, () => {
      const host = process.env.PORT
        ? `https://mechalink-socket-server.onrender.com/`
        : `http://localhost:${PORT}`;
      console.log(`✅ Socket.IO server running on ${host}`);
    });
  } catch (err) {
    console.error("❌ Server error:", err);
  }
}

start();
