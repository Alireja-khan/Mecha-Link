import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv"; 
import { collections, dbConnect } from "./dbConnect.js"; // ✅ add .js

dotenv.config(); // ✅ load .env

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Start server and MongoDB change stream
async function start() {
  try {
    const serviceRequests = await dbConnect(collections.serviceRequests);
    console.log("✅ Connected to MongoDB serviceRequests collection");

    // Watch for new service requests
    const changeStream = serviceRequests.watch();
    changeStream.on("change", (change) => {
      if (change.operationType === "insert") {
        const newRequest = change.fullDocument;
        console.log("📢 New Service Request:", newRequest);

        // Emit notification to all connected clients
        io.emit("serviceRequestNotification", {
          message: "New service request added!",
          data: newRequest,
        });
      }
    });

    // Socket.io events
    io.on("connection", (socket) => {
      console.log("⚡ User connected:", socket.id);

      // Chat room join
      socket.on("joinChat", (chatId) => {
        socket.join(chatId);
        console.log(`${socket.id} joined room: ${chatId}`);
      });

      // Chat message
      socket.on("sendMessage", (msg) => {
        io.to(msg.chatId).emit("newMessage", msg);
      });

      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
      });
    });

    // Start HTTP server
    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`🚀 Socket.IO server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server error:", err);
  }
}

start();
