// Import required modules
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";
import express from "express";
import cors from "cors";
import methodOverride from "method-override";
import connectToMongoDB from "./db/connectToMongoDb.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { app, server } from "./socket/socket.js";
import path from "path";

const __dirname = path.resolve();

dotenv.config();

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // For PUT and DELETE requests from forms
app.use(
  cors({
    origin: "http://localhost:3001", // Adjust this to your frontend URL
    credentials: true,
  })
); // Enable Cross-Origin Resource Sharing for frontend

app.use("/", userRoutes);
app.use("/messages", messageRoutes);

// app.use(express.static(path.join(__dirname, "/frontend/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// });

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
