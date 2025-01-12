import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3001"],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // userId: socketId

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// Emit the list of online users
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId !== "undefined") userSocketMap[userId] = socket.id;

  // Emit the list of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for disconnection and clean up
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
