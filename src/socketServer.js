import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`${socket.id} joined room: ${chatId}`);
  });

  socket.on("sendMessage", (msg) => {
    io.to(msg.chatId).emit("newMessage", msg);
  });

  socket.on("typing", (chatId, senderId) => {
    socket.to(chatId).emit("typing", chatId, senderId);
  });

  socket.on("stopTyping", (chatId, senderId) => {
    socket.to(chatId).emit("stopTyping", chatId, senderId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("✅ Socket.IO server running on http://localhost:3001");
});
