const mongoose = require("mongoose");

const officialSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: false },
  password: { type: String, required: true },
});

// const Official = mongoose.model("Official", officialSchema);

module.exports = officialSchema;
