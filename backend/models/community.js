import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true, unique: false },
    population: { type: Number, required: false },
    lng: { type: Number, required: true, unique: false },
    lat: { type: Number, required: true, unique: false },
  },
  { timestamps: true }
);

const Community = mongoose.model("Community", communitySchema);

export default Community;
