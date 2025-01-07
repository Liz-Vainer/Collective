import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    prticipants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], //the users in the chat
    messages: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: [] }, //array of messages in the chat
    ],
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
