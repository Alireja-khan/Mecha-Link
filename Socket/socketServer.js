import express from "express";
import http from "http";
import {Server} from "socket.io";
import dotenv from "dotenv";
import {collections, dbConnect} from "./dbConnect.js";
import {ObjectId} from "mongodb";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {cors: {origin: "*"}});
const PORT = process.env.PORT || 5000;

app.use(express.json());

async function start() {
  try {
    // -----------------------------
    // Connect MongoDB collections
    // -----------------------------
    const serviceRequests = await dbConnect(collections.serviceRequests);
    const mechanicShops = await dbConnect(collections.mechanicShops);
    const announcements = await dbConnect(collections.announcements);
    const coupons = await dbConnect(collections.coupons);
    const users = await dbConnect(collections.users);

    console.log("✅ Connected to MongoDB collections");

    // -----------------------------
    // Helper: push notification
    // -----------------------------
    const sendNotification = async (filter, notif, socketEvent) => {
      // Use $addToSet to avoid duplicates
      await users.updateMany(filter, {$addToSet: {notifications: notif}});
      io.emit(socketEvent, notif);
    };

    // -----------------------------
    // WATCH: Service Requests
    // -----------------------------
    serviceRequests
      .watch([], {fullDocument: "updateLookup"})
      .on("change", async (change) => {
        try {
          const fullDoc = change.fullDocument;

          if (change.operationType === "insert") {
            const notif = {
              _id: `serviceRequest_${fullDoc._id.toString()}`, // deterministic _id
              message: "New service request added!",
              type: "serviceRequest",
              data: fullDoc,
              createdAt: new Date(),
              read: false,
              userEmail: fullDoc.userEmail,
            };

            await sendNotification(
              {email: fullDoc.userEmail},
              notif,
              "serviceRequestNotification"
            );
            await sendNotification(
              {role: {$in: ["mechanic", "admin"]}},
              notif,
              "serviceRequestNotification"
            );
          }

          if (change.operationType === "update") {
            const updatedFields = change.updateDescription.updatedFields;
            if (updatedFields.assignedShopId) {
              const shopDoc = await mechanicShops.findOne({
                _id: new ObjectId(updatedFields.assignedShopId),
              });
              const shopName = shopDoc?.shop?.shopName || "Assigned Shop";

              const notif = {
                _id: `assignment_${fullDoc._id.toString()}`,
                message: `Service request assigned to "${shopName}"`,
                type: "assignment",
                data: {
                  serviceId: fullDoc._id,
                  shopId: updatedFields.assignedShopId,
                  assignedUserId: fullDoc.userId,
                },
                createdAt: new Date(),
                read: false,
                userEmail: fullDoc.userEmail,
              };

              await sendNotification(
                {email: fullDoc.userEmail},
                notif,
                "assignmentNotification"
              );
              await sendNotification(
                {role: "admin"},
                notif,
                "assignmentNotification"
              );
            }
          }
        } catch (err) {
          console.error("❌ ServiceRequests watcher error:", err);
        }
      });

    // -----------------------------
    // WATCH: Mechanic Shops
    // -----------------------------
    mechanicShops.watch().on("change", async (change) => {
      if (change.operationType === "insert") {
        const fullDoc = change.fullDocument;
        const notif = {
          _id: `mechanicShop_${fullDoc._id.toString()}`,
          message: `New mechanic shop added: ${fullDoc?.shop?.shopName}`,
          type: "mechanicShopAdded",
          data: fullDoc,
          createdAt: fullDoc?.createdAt || new Date(),
          read: false,
          userEmail: fullDoc.userEmail,
        };

        await sendNotification(
          {role: "admin"},
          notif,
          "mechanicShopNotification"
        );
      }
    });

    // -----------------------------
    // WATCH: Announcements
    // -----------------------------
    announcements.watch().on("change", async (change) => {
      if (change.operationType === "insert") {
        const fullDoc = change.fullDocument;
        const notif = {
          _id: `announcement_${fullDoc._id.toString()}`,
          message: `New announcement: ${fullDoc.title}`,
          type: "announcement",
          data: fullDoc,
          createdAt: fullDoc?.createdAt || new Date(),
          read: false,
          userEmail: "all",
        };

        await sendNotification(
          {role: {$in: ["user", "mechanic"]}},
          notif,
          "announcementNotification"
        );
      }
    });

    // -----------------------------
    // WATCH: Coupons
    // -----------------------------
    coupons.watch().on("change", async (change) => {
      if (change.operationType === "insert") {
        const fullDoc = change.fullDocument;
        const notif = {
          _id: `coupon_${fullDoc._id.toString()}`,
          message: `New coupon available: ${fullDoc.code}`,
          type: "coupon",
          data: fullDoc,
          createdAt: fullDoc?.createdAt || new Date(),
          read: false,
          userEmail: "all",
        };

        await sendNotification(
          {role: {$in: ["user", "mechanic"]}},
          notif,
          "couponNotification"
        );
      }
    });

    // -----------------------------
    // Socket.IO connections
    // -----------------------------
    io.on("connection", (socket) => {
      console.log("⚡ User connected:", socket.id);

      socket.on("joinChat", (chatId) => socket.join(chatId));
      socket.on("sendMessage", (msg) =>
        io.to(msg.chatId).emit("newMessage", msg)
      );
      socket.on("typing", (chatId, senderId) =>
        socket.to(chatId).emit("typing", chatId, senderId)
      );
      socket.on("stopTyping", (chatId, senderId) =>
        socket.to(chatId).emit("stopTyping", chatId, senderId)
      );
      socket.on("disconnect", () =>
        console.log("❌ User disconnected:", socket.id)
      );
    });

    // -----------------------------
    // Root Route
    // -----------------------------
    app.get("/", (req, res) => res.send("🚀 Socket.IO server running!"));

    // -----------------------------
    // Server Listen
    // -----------------------------
    server.listen(PORT, () => {
      const host = process.env.PORT
        ? `https://mechalink-socket-server-production.up.railway.app/`
        : `http://localhost:${PORT}`;
      console.log(`✅ Socket.IO server running on ${host}`);
    });
  } catch (err) {
    console.error("❌ Server error:", err);
  }
}

start();
