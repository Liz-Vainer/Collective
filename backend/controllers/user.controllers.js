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
    console.log(
      "THIS IS RELIGIOUN FROM USER CONTROLLES (BAACKENMD): ",
      user.religion
    );
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
      profilePic: user.profilePic,
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

  const boyPic = `https://avatar.iran.liara.run/public/boy?username=${name}`;
  const girlPic = `https://avatar.iran.liara.run/public/girl?username=${name}`;

  const newUser = new Model({
    name,
    email,
    password: hashedPassword,
    age: age,
    religion: religion,
    ethnicity: ethnicity,
    interest: interest,
    gender: gender,
    profilePic: gender === "male" ? boyPic : girlPic,
  });

  try {
    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);
    let isReligious;
    if (newUser.religion !== "no") {
      isReligious = true;
    } else {
      isReligious = false;
    }
    res.status(201).json({
      message: `${userType} Login successful`,
      id: newUser.id,
      userType,
      age: newUser.age,
      gender: newUser.gender,
      religioun: newUser.religion,
      ethnicity: newUser.ethnicity,
      interest: newUser.interest,
      profilePic: newUser.profilePic,
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

//logout functionallity
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error logging out:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const leaveCommunity = async (req, res) => {
  const { communityId, userId } = req.body;
  try {
    const community = await Community.findById(communityId);
    console.log("fROM BBACK ENMD : ", community);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    const userIndex = community.users.indexOf(userId);
    community.users.splice(userIndex, 1);
    await community.save();
    return res.status(200).json({
      message: "User successfully left to the community",
      member: true,
    });
  } catch (err) {
    console.error("Error while trying to leave a community ", err);
    res
      .status(500)
      .json({ message: "Internal Server Error (leaving a community)" });
  }
};

export const joinCommunity = async (req, res) => {
  const { communityId, userId } = req.body;
  try {
    const community = await Community.findById(communityId);
    console.log("fROM BBACK ENMD : ", community);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    community.users.push(userId);
    await community.save();
    return res.status(200).json({
      message: "User successfully added to the community",
      member: true,
    });
  } catch (err) {
    console.error("Error while trying to join a community ", err);
    res
      .status(500)
      .json({ message: "Internal Server Error (joining a community)" });
  }
};

export const checkJoined = async (req, res) => {
  const { communityId, userId } = req.body;
  console.log("THIS IS ID FROM BBACK: ", communityId);
  try {
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    if (community.users.includes(userId)) {
      console.log("member is true");
      return res.status(200).json({
        message: "User is already a member of the community",
        member: true,
      });
    } else {
      console.log("member is false");
      return res.status(200).json({
        message: "User is not a member of the community",
        member: false,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};
//settings change
export const settings = async (req, res) => {
  const { userID, gender, age, religion, ethnicity, interest, userType } =
    req.body;

  try {
    // Find the user by ID in the User collection
    let isReligious;
    if (religion !== "no") {
      isReligious = true;
    } else {
      isReligious = false;
    }
    let updatedUser;

    // If user is in the User collection
    updatedUser = await User.findByIdAndUpdate(
      userID,
      {
        gender,
        age,
        religion,
        ethnicity,
        interest,
      },
      { new: true }
    );

    if (updatedUser) {
      return res.status(200).json({
        message: "User settings updated successfully",
        id: updatedUser.id,
        userType,
        age: updatedUser.age,
        gender: updatedUser.gender,
        isReligious: isReligious,
        religioun: updatedUser.religion,
        ethnicity: updatedUser.ethnicity,
        interest: updatedUser.interest,
      });
    }

    // If not in the User collection, check the Organizer collection
    updatedUser = await Organizer.findByIdAndUpdate(
      userID,
      {
        gender,
        age,
        religion,
        ethnicity,
        interest,
      },
      { new: true }
    );

    if (updatedUser) {
      return res.status(200).json({
        message: "teOrganizer settings updated successfully",
        id: updatedUser.id,
        userType,
        age: updatedUser.age,
        gender: updatedUser.gender,
        isReligious: isReligious,
        religioun: updatedUser.religion,
        ethnicity: updatedUser.ethnicity,
        interest: updatedUser.interest,
      });
    }

    // If not in the Organizer collection, check the Official collection
    updatedUser = await Official.findByIdAndUpdate(
      userID,
      {
        gender,
        age,
        religion,
        ethnicity,
        interest,
      },
      { new: true }
    );

    if (updatedUser) {
      return res.status(200).json({
        message: "Official settings updated successfully",
        id: updatedUser.id,
        userType,
        age: updatedUser.age,
        gender: updatedUser.gender,
        isReligious: isReligious,
        religioun: updatedUser.religion,
        ethnicity: updatedUser.ethnicity,
        interest: updatedUser.interest,
      });
    }

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

//users for chat
export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedUserId = req.user.id;

    const filteredUsers = await User.find({
      //getting all users exept the logged user
      _id: { $ne: loggedUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (err) {
    console.error("Error in getUsersSideBar: ", err.message);
    res.status(500).json({ err: "Internal server error" });
  }
};

//updating profile pic
export const updateProfilePicture = async (req, res) => {
  try {
    const { profilePic, userType } = req.body;
    const userId = req.user._id; // Assuming user ID is in the request

    console.log(userType);

    let Model;
    switch (userType) {
      case "User":
        Model = User;
        break;
      case "event-organizer":
        Model = Organizer;
        break;
      case "city-official":
        Model = Official;
        break;
      default:
        return res.status(400).json({ message: "Invalid user type" });
    }
    // Update user profile picture in the database
    const updatedUser = await Model.findByIdAndUpdate(
      userId,
      { profilePic },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    let isReligious;
    if (updatedUser.religion !== "no") {
      isReligious = true;
    } else {
      isReligious = false;
    }

    res.status(200).json({
      message: "Profile picture updated",
      id: updatedUser.id,
      userType,
      age: updatedUser.age,
      gender: updatedUser.gender,
      isReligious: isReligious,
      religioun: updatedUser.religion,
      ethnicity: updatedUser.ethnicity,
      interest: updatedUser.interest,
      profilePic: updatedUser.profilePic,
    });
  } catch (err) {
    console.error("Error updating profile picture:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
