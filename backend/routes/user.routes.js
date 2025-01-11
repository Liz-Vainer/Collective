import express from "express";
const router = express.Router();
import {
  add_to_fav,
  fetch_fav,
  login,
  remove_fav,
  signup,
  settings,
  getUsersForSideBar,
  logout,
  updateProfilePicture,
  showFriends,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  showRequests,
} from "../controllers/user.controllers.js";
import {
  add_community,
  fetch_communities,
  rem_community,
} from "../controllers/communities.controllers.js";
import protectRoute from "../middleware/protectRoute.js";

// Create new user (SignUp)
router.post("/signup", signup);

//add community to favorite
router.post("/users/add-to-fav", protectRoute, add_to_fav);

//fetch users favorites
router.get("/users/:id/fav/:userType", protectRoute, fetch_fav);

//Communities Routes
router.post("/add-community", protectRoute, add_community);

//deleting comminity
router.post("/remove-community", protectRoute, rem_community);

//deleting comminity from favorites
router.post("/remove-favorite", protectRoute, remove_fav);

// Fetch fake communities
router.get("/get-fake-communities", protectRoute, fetch_communities);

// Login route for any user
router.post("/login", login);

// Setting route for user
router.post("/settings", protectRoute, settings);

//get users for side bar for chat
router.get("/side-bar", protectRoute, getUsersForSideBar);

//logout functionallity
router.post("/logut", protectRoute, logout);

//updating user profile pic
router.post("/update-profile-pic/:id", protectRoute, updateProfilePicture);

//get users friends
router.get("/friends", protectRoute, showFriends);

//send friend request to another user
router.post("/friends/send-req", protectRoute, sendFriendRequest);

//accept friends request from another user
router.post("/friends/accept-req", protectRoute, acceptFriendRequest);

//reject friend request from other users
router.post("/friends/reject-req", protectRoute, rejectFriendRequest);

//remove friend from users friends list
router.post("/friends/remove-friend", protectRoute, removeFriend);

//get users requests
router.get("/friends/requests", protectRoute, showRequests);

export default router;
