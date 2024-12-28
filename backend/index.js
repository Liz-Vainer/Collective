// Import required modules
import userRoutes from "./routes/user.routes.js";
import express from "express";
import cors from "cors";
import methodOverride from "method-override";
import connectToMongoDB from "./db/connectToMongoDb.js";

// Initialize Express
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // For PUT and DELETE requests from forms
app.use(
  cors({
    origin: "http://localhost:3001", // Adjust this to your frontend URL
  })
); // Enable Cross-Origin Resource Sharing for frontend

app.use("/", userRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
