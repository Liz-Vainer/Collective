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
const userFriendsMap = {}; // userId: [friendId1, friendId2, ...]

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

  // Emit the list of friends for the current user
  if (userFriendsMap[userId]) {
    socket.emit("getFriends", userFriendsMap[userId]);
  }

  // Listen for accepting a friend request
  socket.on("acceptFriendRequest", (friendId) => {
    if (!userFriendsMap[userId]) {
      userFriendsMap[userId] = [];
    }

    // Add the friend to the user's friend list
    if (!userFriendsMap[userId].includes(friendId)) {
      userFriendsMap[userId].push(friendId);
    }

    // Emit updated friends list to all connected clients
    io.emit("updatedFriends", userFriendsMap[userId]);
  });

  // Listen for removing a friend
  socket.on("removeFriend", (friendId) => {
    if (userFriendsMap[userId]) {
      // Remove the friend from the user's friend list
      userFriendsMap[userId] = userFriendsMap[userId].filter(
        (id) => id !== friendId
      );
    }

    // Emit updated friends list to all connected clients
    io.emit("updatedFriends", userFriendsMap[userId]);
  });

  // Listen for disconnection and clean up
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
