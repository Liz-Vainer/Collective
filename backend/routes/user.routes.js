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
router.post("/users/add-to-fav", add_to_fav);

//fetch users favorites
router.get("/users/:id/fav/:userType", fetch_fav);

//Communities Routes
router.post("/add-community", add_community);

//deleting comminity
router.post("/remove-community", rem_community);

//deleting comminity from favorites
router.post("/remove-favorite", remove_fav);

// Fetch fake communities
router.get("/get-fake-communities", fetch_communities);

// Login route for any user
router.post("/login", login);

// Setting route for user
router.post("/settings", settings);

//get users for side bar for chat
router.get("/side-bar", protectRoute, getUsersForSideBar);

export default router;
