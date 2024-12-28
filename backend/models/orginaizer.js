import mongoose from "mongoose";

const orginaizerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: false },
  password: { type: String, required: true },
  favorites: [
    {
      id: String,
      name: String,
      lat: Number,
      lng: Number,
    },
  ],
});

const Orginaizer = mongoose.model("Orginaizer", orginaizerSchema);

export default Orginaizer;
