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
    const serviceRequests = await dbConnect(collections.serviceRequests);
    const notifications = await dbConnect(collections.notifications);
    const mechanicShopsCollection = await dbConnect(collections.mechanicShops);
    const announcementsCollection = await dbConnect(collections.announcements);
    const couponsCollection = await dbConnect(collections.coupons);
    const usersCollection = await dbConnect(collections.users);

    console.log("✅ Connected to MongoDB collections");

    // -----------------------------
    // Watch for new service requests
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

        // Push to the user who created it
        await usersCollection.updateOne(
          {email: newRequest.userEmail},
          {$push: {notifications: {$each: [notificationDoc], $position: 0}}}
        );

        // Push to all mechanics & admins
        await usersCollection.updateMany(
          {role: {$in: ["mechanic", "admin"]}},
          {$push: {notifications: {$each: [notificationDoc], $position: 0}}}
        );

        io.emit("serviceRequestNotification", notificationDoc);
      }
    });

    // -----------------------------
    // Watch for assignment updates
    // -----------------------------
    serviceRequests.watch().on("change", async (change) => {
      if (change.operationType === "update") {
        const updatedFields = change.updateDescription.updatedFields;

        if (updatedFields.assignedShopId) {
          const serviceId = change.documentKey._id;
          const updatedDoc = await serviceRequests.findOne({_id: serviceId});

          // Fetch assigned shop details
          const shopDoc = await mechanicShopsCollection.findOne({
            _id: new ObjectId(updatedFields.assignedShopId),
          });
          console.log(shopDoc);

          const shopName = shopDoc?.shop?.shopName || "Assigned Shop";

          console.log(
            "📢 Service Request Assigned:",
            updatedDoc,
            "Shop:",
            shopName
          );

          const notificationDoc = {
            _id: new ObjectId().toString(),
            userEmail: updatedDoc?.userEmail, // notify the user who created the request
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

          
        // Push to the user who created it
        await usersCollection.updateOne(
          {email: updatedDoc.userEmail},
          {$push: {notifications: {$each: [notificationDoc], $position: 0}}}
        );

        // Push to all mechanics & admins
        await usersCollection.updateMany(
          {role: {$in: [ "admin"]}},
          {$push: {notifications: {$each: [notificationDoc], $position: 0}}}
        );
          io.emit("assignmentNotification", notificationDoc);
        }
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
          _id: new ObjectId().toString(),
          userEmail: newMechanic.userEmail,
          message: `New mechanic shop added: ${newMechanic?.shop?.shopName}`,
          type: "mechanicShopAdded",
          data: newMechanic,
          createdAt: newMechanic?.createdAt,
          read: false,
        };

       

        // Push to all mechanics & admins
        await usersCollection.updateMany(
          {role: {$in: ["admin"]}},
          {$push: {notifications: {$each: [notificationDoc], $position: 0}}}
        );
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
          _id: new ObjectId().toString(),
          userEmail: "all", 
          message: `New announcement: ${newAnnouncement.title}`,
          type: "announcement",
          data: newAnnouncement,
          createdAt: newAnnouncement?.createdAt || new Date(),
          read: false,
        };

     

        // Push to all mechanics & admins
        await usersCollection.updateMany(
          {role: {$in: ["mechanic","user"]}},
          {$push: {notifications: {$each: [notificationDoc], $position: 0}}}
        );
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
          _id: new ObjectId().toString(),
          userEmail: "all", // broadcast to all users and mechanics
          message: `New coupon available: ${newCoupon.code}`,
          type: "coupon",
          data: newCoupon,
          createdAt: newCoupon?.createdAt || new Date(),
          read: false,
        };

     

        // Push to all mechanics & admins
        await usersCollection.updateMany(
          {role: {$in: ["user","mechanic"]}},
          {$push: {notifications: {$each: [notificationDoc], $position: 0}}}
        );
        io.emit("couponNotification", notificationDoc);
      }
    });

    // -----------------------------
    // Socket.io connection events
    // -----------------------------
    io.on("connection", (socket) => {
      console.log("socket", socket);
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

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Socket.IO server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server error:", err);
  }
}

start();
