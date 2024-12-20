// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const methodOverride = require("method-override");
const User = require("./models/user"); // Your user model
const bcrypt = require("bcrypt");
require("dotenv").config();

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

// MongoDB connection setup
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/UsersDb";
mongoose.set("strictQuery", true);
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo connection open!");
  })
  .catch((err) => {
    console.log("Mongo connection error:");
    console.log(err);
  });

// Routes

// 1. Homepage or Root Route (e.g., redirect to login)
app.get("/", (req, res) => {
  res.redirect("/login");
});

// 2. Login Route
app.get("/login", (req, res) => {
  res.send("Login page here"); // Your login page here (can be rendered or just send a message)
});

// 3. Handle Login POST request
app.post("/users/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ message: "Wrong name" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Wrong password" });
    }

    res.json({ message: "Login successful", id: user.id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 4. Create new user (SignUp)
app.post("/users/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ name });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ name, email, password: hashedPassword });

  try {
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", id: newUser.id });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 5. Get user profile
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error retrieving user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 6. Update user
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, password },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 7. Delete user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/users/add-to-fav", async (req, res) => {
  const { id, community } = req.body; // Get user id and community details

  try {
    const existingUser = await User.findById(id);
    const isAlreadyFavorite = existingUser.favorites.includes(community);
    if (isAlreadyFavorite) {
      return res.status(400).json({
        message: `${community.name} is already in your favorites.`,
      });
    }

    existingUser.favorites.push(community); // Add to favorites
    await existingUser.save(); // Save changes to the database

    res.status(200).json({
      message: `${community.name} has been added to your favorites.`,
    });
  } catch (error) {
    console.error("Error updating favorites:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//fetch users favorites
app.get("/users/:id/fav", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error("Error retrieving user favorites:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
