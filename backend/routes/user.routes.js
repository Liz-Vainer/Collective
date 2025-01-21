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
  checkJoined,
  joinCommunity,
  leaveCommunity,
  findUsers,
  showFriends,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  showRequests,
  removeUserFromCommunity,
  joinEvent,
  leaveEvent,
  likeEvent,
  dislikeEvent,
  checkJoinedEvent,
} from "../controllers/user.controllers.js";
import {
  add_community,
  fetch_communities,
  rem_community,
} from "../controllers/communities.controllers.js";
import protectRoute from "../middleware/protectRoute.js";
import {
  createEvent,
  deleteEvent,
  fetchEvents,
} from "../controllers/events.controlles.js";

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

//chek if a user is amember of the community
router.post("/check-joined-community", protectRoute, checkJoined);

//joining a community
router.post("/join-community", protectRoute, joinCommunity);

//leaving a community
router.post("/leave-community", protectRoute, leaveCommunity);

//removing a user from a community
router.post("/remove-member", protectRoute, removeUserFromCommunity);

//fetching community members
router.post("/find-users-by-community", protectRoute, findUsers);

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

//get events
router.get("/events", protectRoute, fetchEvents);

//join event
router.post("/events/join", protectRoute, joinEvent);

//leave event
router.post("/events/leave", protectRoute, leaveEvent);

//check if in event
router.post("/events/is-part", protectRoute, checkJoinedEvent);

//create event
router.post("/events/create", protectRoute, createEvent);

//delete event
router.post("/events/delete", protectRoute, deleteEvent);

//like event
router.post("/events/like", protectRoute, likeEvent);

//dislike event
router.post("/events/dislike", protectRoute, dislikeEvent);

export default router;
