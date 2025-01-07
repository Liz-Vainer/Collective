import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controlles.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages); //getting messages for chat

router.post("/send/:id", protectRoute, sendMessage); //sending a new message

export default router;
