import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: false, default: "" },
    location: { type: String, required: true, unique: false },
    start: { type: String, required: true, unique: false },
    end: { type: String, required: true, unique: false },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
