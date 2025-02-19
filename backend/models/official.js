import mongoose from "mongoose";

const officialSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: false },
  password: { type: String, required: true },
  age: { type: Number, min: 10, max: 100, required: false },
  religion: { type: String, required: false },
  ethnicity: { type: String, required: false },
  interest: { type: String, required: false },
  gender: { type: String, required: false },
  profilePic: { type: String, required: false, default: "" },
});

const Official = mongoose.model("Official", officialSchema);

export default Official;
