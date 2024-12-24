const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: false },
  password: { type: String, required: true },
  category: { type: String, required: false, unique: false },
  favorites: [
    {
      id: String,
      name: String,
      lat: Number,
      lng: Number,
    },
  ],
});

// const User = mongoose.model("User", userSchema);

module.exports = userSchema;
