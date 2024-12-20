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
// Route 5: Show User Profile
// app.get("/users/:id", async (req, res) => {
//   const { id } = req.params; // Get the user ID from the URL parameters
//   const user = await User.findById(id);
//   res.render("users/profile", { user }); // Render the user's profile page
// });

// Route 6: List All Users or Filtered by Category
// app.get("/users", async (req, res) => {
//   const { category } = req.query; // Get the category from the query string (e.g., /users?category=Gobnik)
//   if (category) {
//     const users = await User.find({ category }); // Find users by the selected category
//     res.render("users/index", { users, category }); // Render the list of users filtered by category
//   } else {
//     // If no category is provided, show all users
//     const users = await User.find({});
//     res.render("users/index", { users, category: "All" }); // Show all users, and set category as "All"
//   }
// });

// Create new user (SignUp)
app.post("/citizen/signup", async (req, res) => {
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

// 6. Update user
// app.put("/users/:id", async (req, res) => {
//   const { id } = req.params;
//   const { name, email, password } = req.body;

//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       { name, email, password },
//       { new: true, runValidators: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(updatedUser);
//   } catch (err) {
//     console.error("Error updating user:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// 7. Delete user
// app.delete("/users/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedUser = await User.findByIdAndDelete(id);
//     if (!deletedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json({ message: "User deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting user:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

app.post("/users/add-to-fav", async (req, res) => {
  const { id, community, userType } = req.body; // Get user id and community details

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
    const existingUser = await Model.findById(id);
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

    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error("Error retrieving user favorites:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Communities Routes
app.post("/community", async (req, res) => {
  const { name, category } = req.body;

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
    });

    await newCommunity.save(); // Save the new community to the database

    res.status(201).json({
      message: "Community created successfully",
      communityId: newCommunity._id,
    });
  } catch (err) {
    console.error("Error creating community:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//fake communities to the database
// Automatically create fake communities when the server starts
const createFakeCommunities = async () => {
  await Community.deleteMany({ lan: null });

  const fakeCommunities = [
    {
      name: "Art Lovers",
      lat: 31.2561,
      lng: 34.7946,
      category: "Entertainment",
    },
    {
      name: "Tech Enthusiasts",
      lat: 31.2543,
      lng: 34.7921,
      category: "Entertainment",
    },
    { name: "Running club", lat: 31.2508, lng: 34.7905, category: "Sport" },
    { name: "Local church", lat: 31.2535, lng: 34.789, category: "Religion" },
    { name: "Swimming pool", lat: 31.2535, lng: 34.789, category: "Religion" },
  ];

  try {
    for (let community of fakeCommunities) {
      const existingCommunity = await Community.findOne({
        lat: community.lat, // Check if community with same lat exists
        lng: community.lng, // Check if community with same lng exists
      });

      if (!existingCommunity) {
        const newCommunity = new Community(community);
        await newCommunity.save();
      }
    }

    console.log("Fake communities added successfully.");
  } catch (err) {
    console.error("Error adding fake communities:", err);
    console.log("Failed to add fake communities.");
  }
};

// Run the function to create fake communities when the server starts
createFakeCommunities();

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

//Orginaizer Routes
app.post("/event-organizer/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingOrginaizer = await Orginaizer.findOne({ name });
    if (existingOrginaizer) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newOrginaizer = new Orginaizer({
      name,
      email,
      password: hashedPassword,
    });

    await newOrginaizer.save(); // Save the new user to the database

    res.status(201).json({
      message: "User created successfully",
      orginaizerId: newOrginaizer._id,
    });
  } catch (err) {
    console.error("Error creating Orginaizer:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Official Routes
app.post("/city-official/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the User already exists
    const existingOfficial = await Official.findOne({ name });
    if (existingOfficial) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User
    const newOfficial = new Official({
      name,
      email,
      password: hashedPassword,
    });

    await newOfficial.save(); // Save the new User to the database

    res.status(201).json({
      message: "User created successfully",
      officialId: newOfficial._id,
    });
  } catch (err) {
    console.error("Error creating Official:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
