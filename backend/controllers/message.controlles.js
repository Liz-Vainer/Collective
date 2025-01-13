import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    let conversation = await Conversation.findOne({
      //searching for the chat between the sender and receiver
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      //if chat doesnt exist we create a new one
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      //creating new message object
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      //if message is created successfully we push it to the chat messages array
      conversation.messages.push(newMessage._id);
    }

    await conversation.save(); //saving conversation to database
    await newMessage.save(); //saving message to database

    const receiverSocketId = getReceiverSocketId(receiverId); //retrieve the socket ID of the receiver (the user who should get the message)
    if (receiverSocketId) {
      //check if the receiver is currently connected (has an active socket)
      io.to(receiverSocketId).emit("newMessage", newMessage); //send a real-time event named "newMessage" to the receiver's socket
    } //this event will deliver the new message to the intended recipient

    res.status(201).json(newMessage);
  } catch (err) {
    console.log("Error in sendMessage controllers", err.message);
    res.status(500).json({ err: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      //searching for the chat and getting all the messages
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]); //if chat is not found we send an error

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (err) {
    console.log("Error in sendMessage controllers", err.message);
    res.status(500).json({ err: "Internal server error" });
  }
};
