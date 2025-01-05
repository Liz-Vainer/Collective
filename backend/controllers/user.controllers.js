import bcrypt from "bcrypt";
import User from "../models/user.js"; // Your user model
import Organizer from "../models/orginaizer.js"; // Organizer model
import Official from "../models/official.js"; // Official model
import Community from "../models/community.js"; // Adjust the import path as needed
import generateTokenAndSetCookie from "../utils/generateToken.js";

// Function to try to log in by checking each model (User, Organizer, Official)
const handleLogin = async (name, password, res) => {
  try {
    let user;
    let userType = "";
    // Check User model
    user = await User.findOne({ name });
    if (user) {
      userType = "User";
    } else {
      // Check Organizer model if not found in User model
      user = await Organizer.findOne({ name });
      if (user) {
        userType = "Organizer";
      } else {
        // Check Official model if not found in Organizer model
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

    generateTokenAndSetCookie(user._id, res);
    console.log("THIS IS AGE FROM USER CONTROLLES (BAACKENMD): ", user);
    let isReligious;
    if (user.religion !== "no") {
      isReligious = true;
    } else {
      isReligious = false;
    }

    res.json({
      message: `${userType} Login successful`,
      id: user.id,
      userType,
      age: user.age,
      gender: user.gender,
      isReligious: isReligious,
      religioun: user.religion,
      ethnicity: user.ethnicity,
      interest: user.interest,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//function for handle signup
const handleSignup = async (
  name,
  email,
  password,
  userType,
  res,
  age,
  religion,
  ethnicity,
  interest,
  gender
) => {
  let Model;
  switch (userType) {
    case "citizen":
      userType = "User";
      Model = User;
      break;
    case "event-organizer":
      userType = "Organizer";
      Model = Organizer;
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
  const newUser = new Model({
    name,
    email,
    password: hashedPassword,
    age: age,
    religion: religion,
    ethnicity: ethnicity,
    interest: interest,
    gender: gender,
  });

  try {
    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);
    res.status(201).json({
      message: `${userType} Login successful`,
      id: newUser.id,
      userType,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//signup
export const signup = async (req, res) => {
  const {
    name,
    email,
    password,
    userType,
    age,
    religion,
    ethnicity,
    interest,
    gender,
  } = req.body;

  if (!name || !password || !email || !userType) {
    return res.status(400).json({ message: "All fields are required" });
  }

  await handleSignup(
    name,
    email,
    password,
    userType,
    res,
    age,
    religion,
    ethnicity,
    interest,
    gender
  );
};

//add to favorites
export const add_to_fav = async (req, res) => {
  const { id, community, userType } = req.body;

  let Model;
  switch (userType) {
    case "User":
      Model = User;
      break;
    case "Organizer":
      Model = Organizer;
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
};

//fetch users favorites
export const fetch_fav = async (req, res) => {
  const { id, userType } = req.params;

  let Model;
  switch (userType) {
    case "User":
      Model = User;
      break;
    case "Organizer":
      Model = Organizer;
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
};

//login
export const login = async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "Name and password are required" });
  }

  await handleLogin(name, password, res);
};

//remove favorites
export const remove_fav = async (req, res) => {
  const { id, community, userType } = req.body;

  let Model;
  switch (userType) {
    case "User":
      Model = User;
      break;
    case "Organizer":
      Model = Organizer;
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
};

export const settings = async (req, res) => {
  const { userID, gender, age, isReligious, religion, ethnicity, interest } =
    req.body;

  try {
    // Find the user by ID in the User collection
    let updatedUser;

    // If user is in the User collection
    updatedUser = await User.findByIdAndUpdate(
      userID,
      {
        gender,
        age,
        isReligious,
        religion,
        ethnicity,
        interest,
      },
      { new: true }
    );

    if (updatedUser) {
      return res.status(200).json({
        message: "User settings updated successfully",
        user: updatedUser,
      });
    }

    // If not in the User collection, check the Organizer collection
    updatedUser = await Organizer.findByIdAndUpdate(
      userID,
      {
        gender,
        age,
        isReligious,
        religion,
        ethnicity,
        interest,
      },
      { new: true }
    );

    if (updatedUser) {
      return res.status(200).json({
        message: "teOrganizer settings updated successfully",
        user: updatedUser,
      });
    }

    // If not in the Organizer collection, check the Official collection
    updatedUser = await Official.findByIdAndUpdate(
      userID,
      {
        gender,
        age,
        isReligious,
        religion,
        ethnicity,
        interest,
      },
      { new: true }
    );

    if (updatedUser) {
      return res.status(200).json({
        message: "Official settings updated successfully",
        user: updatedUser,
      });
    }

    updatedUser = await Official.findByIdAndUpdate(
      userID,
      {
        gender,
        age,
        isReligious,
        religion,
        ethnicity,
        interest,
      },
      { new: true }
    );

    // If the user is not found in any collection
    return res.status(404).json({
      message: "User not found in any collection",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while updating user settings",
    });
  }
};
