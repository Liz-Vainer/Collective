import Conversation from "../models/conversation.js"; // conversation model
import Message from "../models/message.js"; // message model
import { getReceiverSocketId, io } from "../socket/socket.js"; // socket-related utilities

// send a message from sender to receiver
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body; // extract message content from request body
    const { id: receiverId } = req.params; // get receiver id from request parameters
    const senderId = req.user.id; // get sender id from authenticated user

    // search for an existing conversation between sender and receiver
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      // if no conversation exists, create a new one
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // create a new message object
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      // if message is created, add its id to the conversation's messages array
      conversation.messages.push(newMessage._id);
    }

    await conversation.save(); // save the updated conversation to the database
    await newMessage.save(); // save the new message to the database

    // get the receiver's socket id
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      // if the receiver is connected, emit a "newMessage" event with the message
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage); // respond with the created message
  } catch (err) {
    console.log("error in sendMessage controllers", err.message);
    res.status(500).json({ err: "internal server error" }); // handle errors with a 500 response
  }
};

// get all messages between the current user and another user
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // get the id of the user to chat with from request parameters
    const senderId = req.user._id; // get sender id from authenticated user

    // search for an existing conversation between sender and the user to chat with
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); // populate messages for the conversation

    if (!conversation) return res.status(200).json([]); // if no conversation is found, return an empty array

    const messages = conversation.messages; // extract messages from the conversation

    res.status(200).json(messages); // respond with the messages
  } catch (err) {
    console.log("error in getMessages controllers", err.message);
    res.status(500).json({ err: "internal server error" }); // handle errors with a 500 response
  }
};
