import bcrypt from "bcrypt";
import User from "../models/user.js"; // user model
import Organizer from "../models/orginaizer.js"; // Organizer model
import Official from "../models/official.js"; // Official model
import Community from "../models/community.js"; // Community model
import Event from "../models/events.js"; // Event model
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { getReceiverSocketId, io } from "../socket/socket.js";


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
      name: user.name,
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
      name: newUser.name,
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

//to find all users in a community
export const findUsers = async (req, res) => {
  const { communityId } = req.body;
  try {
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    console.log(community.users);
    if (community.users.length > 0) {
      let arrayUsers = [];
      for (let i = 0; i < community.users.length; i++) {
        arrayUsers.push(community.users[i]);
      }
      const info = await userInfoById(arrayUsers);
      return res.status(200).json({
        message: `These are all the users from ${community.name}`,
        users: info,
      });
    } else {
      return res.status(200).json({
        message: `There are no users in ${community.name}`,
      });
    }
  } catch (err) {
    console.log(
      `There was an arror while trying to get all the users from ${community.name}`
    );
    res
      .status(500)
      .json({ message: "Internal Server Error (leaving a community)" });
  }
};

//function to get user info by id (idArray)
const userInfoById = async (idArray) => {
  let info = [];
  try {
    for (let i = 0; i < idArray.length; i++) {
      let user =
        (await User.findById(idArray[i])) ||
        (await Organizer.findById(idArray[i])) ||
        (await Official.findById(idArray[i]));

      info.push(user);
    }
    return info;
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching user information");
  }
};

//leave community
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

//join community
export const joinCommunity = async (req, res) => {
  const { communityId, userId } = req.body;
  try {
    const community = await Community.findById(communityId);
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

//check if user is already joined
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

export const deleteAccount = async (req, res) => {
  const { userId } = req.body;

  try {
    // Remove the user from any community they're part of
    const result = await Community.updateOne(
      { users: userId },
      { $pull: { users: userId } }
    );

    if (result.modifiedCount > 0) {
      console.log(
        `User ID ${userId} was successfully removed from a community.`
      );
    } else {
      console.log(`User ID ${userId} was not found in any community.`);
    }

    // Attempt to delete the user from one of the collections
    const userCollections = [User, Organizer, Official];

    for (const collection of userCollections) {
      const user = await collection.findById(userId);
      if (user) {
        res.cookie("jwt", "", { maxAge: 0 });
        await collection.deleteOne({ _id: userId });
        console.log(`User ID ${userId} deleted from ${collection.modelName}.`);
        return res.status(200).json({ message: "User successfully deleted" });
      }
    }

    // If no matching user was found
    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error("Error during account deletion:", error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

export const removeUserFromCommunity = async (req, res) => {
  const { communityId, userId } = req.body;
  try {
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    const userIndex = community.users.indexOf(userId);
    community.users.splice(userIndex, 1);
    console.log("members: ", community.users);
    await community.save();
    return res.status(200).json({
      message: "User successfully Removed from the community",
      members: community.users,
    });
  } catch (err) {
    console.error("Error while trying to leave a community ", err);
    res
      .status(500)
      .json({ message: "Internal Server Error (leaving a community)" });
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
        name: updatedUser.name,
        profilePic: updatedUser.profilePic,
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
        name: updatedUser.name,
        profilePic: updatedUser.profilePic,
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
        name: updatedUser.name,
        profilePic: updatedUser.profilePic,
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

    // Find the logged-in user to get their list of friends
    const loggedUser = await User.findById(loggedUserId);

    if (!loggedUser) {
      return res.status(404).json({ error: "Logged-in user not found" });
    }

    const filteredUsers = await User.find({
      _id: {
        $nin: [...loggedUser.friends, loggedUserId], // Exclude friends and the logged-in user
      },
    }).select("-password"); // Exclude the password field

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
      name: updatedUser.name,
      profilePic: updatedUser.profilePic,
    });
  } catch (err) {
    console.error("Error updating profile picture:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//friends for chat
export const showFriends = async (req, res) => {
  try {
    const loggedUserId = req.user.id;

    const user = await User.findById(loggedUserId).populate(
      "friends",
      "name profilePic"
    );
    const friends = user.friends;

    res.status(200).json(friends);
  } catch (err) {
    console.error("Error in showFriends: ", err.message);
    res.status(500).json({ err: "Internal server error" });
  }
};

//friends requests
export const showRequests = async (req, res) => {
  try {
    const loggedUserId = req.user.id;

    const user = await User.findById(loggedUserId).populate(
      "friendRequests",
      "name profilePic"
    );
    const friendsRequests = user.friendRequests;

    res.status(200).json(friendsRequests);
  } catch (err) {
    console.error("Error in showRequests: ", err.message);
    res.status(500).json({ err: "Internal server error" });
  }
};

//sending friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body; // ID of the user to whom the request is sent
    const senderId = req.user.id;

    const recipient = await User.findById(recipientId);
    const sender = await User.findById(senderId);

    if (!recipient || !sender) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if a friend request already exists or they are already friends
    if (recipient.friendRequests.includes(senderId)) {
      return res.status(400).json({ error: "Friend request already sent" });
    }

    if (sender.friendRequests.includes(recipientId)) {
      return res
        .status(400)
        .json({ error: "This user already sent a request" });
    }

    if (recipient.friends.includes(senderId)) {
      return res.status(400).json({ error: "User is already a friend" });
    }

    // Add the friend request
    recipient.friendRequests.push(senderId);
    await recipient.save();

    const user = await User.findById(recipientId).populate(
      "friendRequests",
      "name profilePic"
    );
    const friendsRequests = user.friendRequests;

    const receiverSocketId = getReceiverSocketId(recipientId); //retrieve the socket ID of the receiver (the user who should get the message)
    if (receiverSocketId) {
      //check if the receiver is currently connected (has an active socket)
      io.to(receiverSocketId).emit("newRequest", {
        requests: friendsRequests,
      }); //send a real-time event named "newMessage" to the receiver's socket
    } //this event will deliver the new message to the intended recipient

    res.status(200).json({ message: "Friend request sent successfully!" });
  } catch (err) {
    console.error("Error in sendFriendRequest: ", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//accept friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const { requesterId } = req.body; // ID of the user who sent the request
    const loggedUserId = req.user.id;

    const user = await User.findById(loggedUserId);
    const requester = await User.findById(requesterId);

    if (!user || !requester) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the friend request exists
    if (!user.friendRequests.includes(requesterId)) {
      return res
        .status(400)
        .json({ error: "No friend request from this user" });
    }

    // Add each other as friends
    user.friends.push(requester);
    requester.friends.push(user);

    // Remove the friend request
    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== requesterId
    );

    console.log(user.friendRequests);

    await user.save();
    await requester.save();

    // Get the socket IDs of both users
    const userSocketId = getReceiverSocketId(loggedUserId);
    const requesterSocketId = getReceiverSocketId(requesterId);

    // Emit the updated friends data to both users
    if (userSocketId) {
      io.to(userSocketId).emit("newFriend", { friends: requester.friends });
      io.to(userSocketId).emit("removeRequest", {
        updatedRequests: user.friendRequests,
      });
    }
    if (requesterSocketId) {
      io.to(requesterSocketId).emit("newFriend", { friends: user.friends });
    }

    res.status(200).json({
      message: "Friend request accepted!",
      friends: user.friends,
      requestes: user.friendRequests,
    });
  } catch (err) {
    console.error("Error in acceptFriendRequest: ", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//rejecting friend request
export const rejectFriendRequest = async (req, res) => {
  try {
    const { requesterId } = req.body; // ID of the user who sent the request
    const loggedUserId = req.user.id;

    const user = await User.findById(loggedUserId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the friend request exists
    if (!user.friendRequests.includes(requesterId)) {
      return res
        .status(400)
        .json({ error: "No friend request from this user" });
    }

    // Remove the friend request
    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== requesterId
    );

    await user.save();

    // Get the socket IDs of both users
    const userSocketId = getReceiverSocketId(loggedUserId);

    // Emit the updated friends data to both users
    if (userSocketId) {
      io.to(userSocketId).emit("removeRequest", {
        updatedRequests: user.friendRequests,
      });
    }

    res.status(200).json({ message: "Friend request rejected!" });
  } catch (err) {
    console.error("Error in rejectFriendRequest: ", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//removing a friend
export const removeFriend = async (req, res) => {
  try {
    const { selectedUserId } = req.body;
    const loggedUserId = req.user.id;

    const user = await User.findById(loggedUserId);
    const selectedUser = await User.findById(selectedUserId);
    // Check if the user is already not a friend
    if (!user.friends.includes(selectedUserId)) {
      return res.status(400).json({ error: "User is already not a friend" });
    }
    // Remove the selected user from the logged-in user's friends
    user.friends = user.friends.filter(
      (friendId) => friendId.toString() !== selectedUserId
    );
    await user.save();

    //  remove the logged-in user from the selected user's friends
    selectedUser.friends = selectedUser.friends.filter(
      (friendId) => friendId.toString() !== loggedUserId
    );

    await selectedUser.save();
    await user.save();

    // Notify the selected user (the friend who was removed) in real-time
    const receiverSocketId = getReceiverSocketId(selectedUserId); // Retrieve the socket ID of the removed friend
    if (receiverSocketId) {
      // If the removed friend is connected, send a real-time notification
      io.to(receiverSocketId).emit("removeFriend", user);
    }

    res
      .status(200)
      .json({ message: "friend removed succesfully!", friends: user.friends });
  } catch (err) {
    console.error("Error in removeFriend: ", err.message);
    res.status(500).json({ err: "Internal server error" });
  }
};

//leave Event
export const leaveEvent = async (req, res) => {
  const { EventId, userId } = req.body;
  try {
    const event = await Event.findById(EventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const userIndex = event.participants.indexOf(userId);
    event.participants.splice(userIndex, 1);
    await event.save();

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the event name from the user's joinedEvents array
    const eventIndex = user.joinedEvents.indexOf(event.name);
    if (eventIndex > -1) {
      user.joinedEvents.splice(eventIndex, 1);
      await user.save();
    }

    return res.status(200).json({
      message: "User successfully left the Event",
      participants: event.participants,
      userEvents: user.joinedEvents,
    });
  } catch (err) {
    console.error("Error in leaveEvent ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//join Event
export const joinEvent = async (req, res) => {
  const { EventId, userId } = req.body;

  // Validate input
  if (!EventId || !userId) {
    return res.status(400).json({ message: "EventId and userId are required" });
  }

  try {
    // Use $addToSet to prevent duplicates and update directly in the database
    const updatedEvent = await Event.findByIdAndUpdate(
      EventId,
      { $addToSet: { participants: userId } },
      { new: true } // Return the updated document
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const user = await User.findById(userId);
    if (!user.joinedEvents.includes(updatedEvent.name)) {
      user.joinedEvents.push(updatedEvent.name);
      await user.save();
    }

    return res.status(200).json({
      message: "User successfully added to the Event",
      participants: updatedEvent.participants,
      userEvents: user.joinedEvents,
    });
  } catch (err) {
    console.error("Error in joinEvent", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//check if user is already joined
export const checkJoinedEvent = async (req, res) => {
  const { eventId, user } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.participants.includes(user)) {
      return res.status(200).json({
        message: "User is already a member of the community",
        member: true,
      });
    } else {
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

export const likeEvent = async (req, res) => {
  const { eventId } = req.body;
  try {
    const event = await Event.findById(eventId);
    event.likes = event.likes + 1;
    await event.save();

    res
      .status(200)
      .json({ message: "Event liked succesfully", likes: event.likes });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred in likeEvent",
      error: error.message,
    });
  }
};

export const dislikeEvent = async (req, res) => {
  const { eventId } = req.body;
  try {
    const event = await Event.findById(eventId);
    event.dislikes = event.dislikes + 1;
    await event.save();

    res.status(200).json({
      message: "Event disliked succesfully",
      dislikes: event.dislikes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred in dislikeEvent",
      error: error.message,
    });
  }
};

export const EventsJoined = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      events: user.joinedEvents,
    });
  } catch (e) {
    return res.status(500).json({
      message: "An error occurred in EventsJoined",
      error: e.message,
    });
  }
};
