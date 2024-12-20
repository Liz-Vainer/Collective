const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true, unique: false },
  population: { type: Number, required: false },
});

// const Community = mongoose.model("Community", communitySchema);

module.exports = communitySchema;
