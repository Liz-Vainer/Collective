const mongoose = require("mongoose");

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

// const Orginaizer = mongoose.model("Orginaizer", orginaizerSchema);

module.exports = orginaizerSchema;
