// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const methodOverride = require("method-override");
const UserSchema = require("./models/user"); // Your user model
const CommunitySchema = require("./models/community"); // Community model
const OrginaizerSchema = require("./models/orginaizer"); // Orginaizer model
const OfficialSchema = require("./models/official"); // Official model
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

// Connection for UsersDb
const usersDbConnection = mongoose.createConnection(
  "mongodb://127.0.0.1:27017/UsersDb"
);

// Listen for connection success
usersDbConnection.once("open", () => {
  console.log("Connected to UsersDb");
});

// Connection for CommunityDb
const communityDbConnection = mongoose.createConnection(
  "mongodb://127.0.0.1:27017/CommunitiesDb"
);

// Listen for connection success
communityDbConnection.once("open", () => {
  console.log("Connected to CommunityDb");
});

// Connection for OrganizerDb
const organizerDbConnection = mongoose.createConnection(
  "mongodb://127.0.0.1:27017/Orginaizers"
);

// Listen for connection success
organizerDbConnection.once("open", () => {
  console.log("Connected to OrganizerDb");
});

// Connection for OfficialDb
const officialDbConnection = mongoose.createConnection(
  "mongodb://127.0.0.1:27017/Officials"
);

// Listen for connection success
officialDbConnection.once("open", () => {
  console.log("Connected to OfficialDb");
});

// Define the models for each connection
const User = usersDbConnection.model("User", UserSchema);
const Community = communityDbConnection.model("Community", CommunitySchema);
const Orginaizer = organizerDbConnection.model("Orginaizer", OrginaizerSchema);
const Official = officialDbConnection.model("Official", OfficialSchema);

module.exports = {
  User,
  Community,
  Orginaizer,
  Official,
};

// Routes

// Function to try to log in by checking each model (User, Organizer, Official)
async function handleLogin(name, password, res) {
  try {
    let user;
    let userType;

    // Check User model
    user = await User.findOne({ name });
    if (user) {
      userType = "User";
    } else {
      // Check Orginaizer model if not found in User model
      user = await Orginaizer.findOne({ name });
      if (user) {
        userType = "Orginaizer";
      } else {
        // Check Official model if not found in Orginaizer model
        user = await Official.findOne({ name });
        if (user) {
          userType = "Official";
        }
      }
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: `${userType} Login successful`,
      id: user.id,
      userType,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Login route for any user
app.post("/login", async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "Name and password are required" });
  }

  await handleLogin(name, password, res);
});

//function for handle signup
async function handleSignup(name, email, password, userType, res) {
  let Model;
  switch (userType) {
    case "citizen":
      userType = "User";
      Model = User;
      break;
    case "event-organizer":
      userType = "Orginaizer";
      Model = Orginaizer;
      break;
    case "city-official":
      userType = "Official";
      Model = Official;
      break;
    default:
      return res.status(400).json({ message: "Invalid user type" });
  }

  const existingUser = await Model.findOne({ name });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new Model({ name, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({
      message: `${userType} Login successful`,
      id: newUser.id,
      userType,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Create new user (SignUp)
app.post("/signup", async (req, res) => {
  const { name, email, password, userType } = req.body;

  if (!name || !password || !email || !userType) {
    return res.status(400).json({ message: "All fields are required" });
  }

  await handleSignup(name, email, password, userType, res);
});

//add community to favorite
app.post("/users/add-to-fav", async (req, res) => {
  const { id, community, userType } = req.body;

  let Model;
  switch (userType) {
    case "User":
      Model = User;
      break;
    case "Orginaizer":
      Model = Orginaizer;
      break;
    case "Official":
      Model = Official;
      break;
    default:
      return res.status(400).json({ message: "Invalid user type" });
  }

  try {
    // Check if the community is already in the user's favorites
    const user = await Model.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the community to the user's favorites
    user.favorites.push(community);
    await user.save();
    res.status(200).json({
      message: "Community added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Error updating favorites:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//fetch users favorites
app.get("/users/:id/fav/:userType", async (req, res) => {
  const { id, userType } = req.params;

  let Model;
  switch (userType) {
    case "User":
      Model = User;
      break;
    case "Orginaizer":
      Model = Orginaizer;
      break;
    case "Official":
      Model = Official;
      break;
    default:
      return res.status(400).json({ message: "Invalid user type" });
  }

  try {
    const user = await Model.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    for (let i = user.favorites.length - 1; i >= 0; i--) {
      const fav = user.favorites[i].name;
      const existingCommunity = await Community.findOne({ name: fav }); // Correct query
      if (!existingCommunity) {
        user.favorites.splice(i, 1); // Remove the item safely
      }
    }

    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error("Error retrieving user favorites:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Communities Routes
app.post("/add-community", async (req, res) => {
  const { name, category, lng, lat } = req.body;

  try {
    // Check if the community already exists
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
      return res.status(400).json({ message: "Community already exists" });
    }

    // Create a new community
    const newCommunity = new Community({
      name,
      category,
      lng,
      lat,
    });

    await newCommunity.save(); // Save the new community to the database

    res.status(201).json({ newCommunity });
  } catch (err) {
    console.error("Error creating community:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//deleting comminity
app.post("/remove-community", async (req, res) => {
  const { name } = req.body;

  try {
    const result = await Community.deleteOne({ name }); // Specify the query object
    if (result === 0) {
      return res
        .status(404)
        .json({ message: `Community '${name}' not found.` });
    }
    res
      .status(200)
      .json({ message: `Community '${name}' deleted successfully!` });
  } catch (err) {
    console.error("Error deleting community:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//deleting comminity from favorites
app.post("/remove-favorite", async (req, res) => {
  const { id, community, userType } = req.body;

  let Model;
  switch (userType) {
    case "User":
      Model = User;
      break;
    case "Orginaizer":
      Model = Orginaizer;
      break;
    case "Official":
      Model = Official;
      break;
    default:
      return res.status(400).json({ message: "Invalid user type" });
  }

  try {
    const user = await Model.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    for (let i = user.favorites.length - 1; i >= 0; i--) {
      if (user.favorites[i].name === community.name) {
        user.favorites.splice(i, 1); // Remove the item safely
      }
    }
    await user.save();
    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error("Error removing community:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch fake communities
app.get("/get-fake-communities", async (req, res) => {
  try {
    const communities = await Community.find();
    res.json({ communities });
  } catch (err) {
    console.error("Error fetching communities:", err);
    res.status(500).json({ message: "Failed to fetch communities." });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
