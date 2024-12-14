const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: false },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
