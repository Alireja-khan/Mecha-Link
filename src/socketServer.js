import express from "express";
import http from "http";
import { Server } from "socket.io";
// import dbService from "./dbService"; // <-- Conceptual import for database operations

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    // Each conversation has its own room
    socket.join(chatId);
    console.log(`${socket.id} joined room: ${chatId}`);
  });

  // Listener for when a message is sent
  // The client sends the confirmed message (with DB ID) after the API POST request succeeds.
  socket.on("sendMessage", (msg) => {
    io.to(msg.chatId).emit("newMessage", msg);
  });

  // -----------------------------------
  // ✅ TYPING INDICATOR LISTENERS
  // -----------------------------------

  // 1. Listen for when a user starts typing
  socket.on("typing", (chatId, senderId) => {
    // Broadcast to everyone in the chat room *except* the sender
    // NOTE: Passing senderId ensures the recipient knows *who* is typing.
    socket.to(chatId).emit("typing", chatId, senderId);
  });

  // 2. Listen for when a user stops typing
  socket.on("stopTyping", (chatId, senderId) => {
    // Broadcast to everyone in the chat room *except* the sender
    socket.to(chatId).emit("stopTyping", chatId, senderId);
  });

  // -----------------------------------
  // ✨ MESSAGE SEEN/READ LISTENER
  // -----------------------------------
  /**
   * Listens for the 'markAsRead' event emitted by the recipient.
   * 1. Updates the database (conceptually).
   * 2. Notifies the sender (and all others) via 'readReceipt'.
   */
  socket.on("markAsRead", async (chatId, readerId, lastMessageId) => {
    console.log(`Read Receipt: User ${readerId} read up to message ${lastMessageId} in chat ${chatId}`);

    try {
      // 1. 💾 Update the Database
      /*
      // The crucial persistence step: update the chat document 
      // with the new last seen message ID for the reader's role.
      await dbService.updateChatLastSeen(
        chatId, 
        readerId, 
        lastMessageId
      );
      */

      // 2. 📡 Notify all clients in the room (including the sender)
      // The sender's client uses this to instantly show the double checkmark.
      io.to(chatId).emit("readReceipt", {
        chatId,
        readerId,
        lastMessageId,
      });

    } catch (error) {
      console.error("Error processing read receipt:", error);
    }
  });

  // -----------------------------------

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("✅ Socket.IO server running on http://localhost:3001");
});