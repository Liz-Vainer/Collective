const express = require("express");
const path = require("path");
const mongoose = require("mongoose"); // like import from Python or include in C —> we need to import mongoose to our file in order to use it
const methodOverride = require("method-override"); // to use PUT method, when you want to change existing data you need this line to use method PUT
const User = require("./models/user"); // Import the User model
const cors = require("cors");

const app = express();

// Set up MongoDB connection with Mongoose
mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1:27017/UsersDb") // to establish a connection to MongoDB database
  .then(() => {
    console.log("Mongo connection open!"); // Success message when MongoDB connection is established
  })
  .catch((err) => {
    console.log("A mongo connection error has occurred"); // Error handling in case of connection failure
    console.log(err);
  });

// EJS setup
app.set("views", path.join(__dirname, "views")); // views directory is where templates are stored
app.set("view engine", "ejs"); // Set EJS as the templating engine

// Middleware
app.use(express.urlencoded({ extended: true })); // In order to parse form data (needed for POST requests)
app.use(methodOverride("_method")); // Allow PUT and DELETE methods in forms (not just POST and GET)
app.use(express.json());
app.use(cors());

// Categories for user selection (This will be used in creating or editing users)
const categories = ["Gobnik", "Unknown", "some"]; // Change this as per your needs (e.g., user roles or types)

// Route 1: Homepage / Root (Redirect to login)
app.get("/", (req, res) => {
  res.redirect("/login"); // Redirect to the login page when the root page is accessed
});

// Route 2: Login Page
app.get("/login", async (req, res) => {
  res.render("users/login"); // Render the login page for users to enter their credentials
});

// Route 3: Handle POST request for Login
app.post("/users/login", async (req, res) => {
  const { name, password } = req.body; // Change email to name

  try {
    const user = await User.findOne({ name }); // Find user by name

    if (!user) {
      // If no user is found with the provided name
      return res.status(400).json({ message: "Wrong name" });
    }

    if (user.password !== password) {
      // If password doesn't match
      return res.status(400).json({ message: "Wrong password" });
    }

    // If login is successful, send success message
    return res.json({ message: "Login successful", id: user.id });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route 4: New User Creation (Render New User Form)
app.get("/users/new", async (req, res) => {
  const { name, password, email } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ name });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Create new user
  const newUser = new User({ name, password, email });
  await newUser.save(); // Save to the database
  res.status(201).json({ message: "User created successfully", user: newUser });
});

// Route 5: Show User Profile
app.get("/users/:id", async (req, res) => {
  const { id } = req.params; // Get the user ID from the URL parameters
  const user = await User.findById(id);
  res.render("users/profile", { user }); // Render the user's profile page
});

// Route 6: List All Users or Filtered by Category
app.get("/users", async (req, res) => {
  const { category } = req.query; // Get the category from the query string (e.g., /users?category=Gobnik)
  if (category) {
    const users = await User.find({ category }); // Find users by the selected category
    res.render("users/index", { users, category }); // Render the list of users filtered by category
  } else {
    // If no category is provided, show all users
    const users = await User.find({});
    res.render("users/index", { users, category: "All" }); // Show all users, and set category as "All"
  }
});

// Route 7: Handle POST request for creating a new user
app.post("/users", async (req, res) => {
  const newUser = new User(req.body); // Create a new User object from the form data
  await newUser.save(); // Save the new user to the database
  res.redirect(`/users/${newUser.id}`); // Redirect to the new user's profile page
});

// Route 8: Edit User (Render Edit User Form)
app.get("/users/:id/edit", async (req, res) => {
  // Render form to edit an existing user's information
  const { id } = req.params; // Extract user ID from the URL
  const user = await User.findById(id); // Find the user by ID from the database
  res.render("users/edit", { user, categories }); // Render the edit form, passing the current user data and categories
});

// Route 9: Handle PUT request to update user information
app.put("/users/:id", async (req, res) => {
  const { id } = req.params; // Extract the user ID from the URL
  const user = await User.findByIdAndUpdate(id, req.body, {
    runValidators: true, // Run validation rules when updating user data
    new: true, // Return the updated user data (not the old one)
  });
  res.redirect(`/users/${user.id}`); // After updating, redirect to the updated user's profile page
});

// Route 10: Delete User (Handle DELETE request)
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params; // Get user ID from the URL parameters
  const deletedUser = await User.findByIdAndDelete(id); // Delete the user from the database
  res.redirect("/users"); // After deletion, redirect to the list of all users
});

// Start the Express server
app.listen(3000, () => {
  console.log("App is listening on port 3000.."); // Confirm the server is running
});
