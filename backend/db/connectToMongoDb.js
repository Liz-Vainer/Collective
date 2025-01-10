import mongoose from "mongoose";
import dotenv from "dotenv";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(
      //connecting to data base in atlas
      process.env.MONGO_DB_URI
    );
    console.log("Connected to UsersDB");
  } catch (error) {
    console.log("Error connecting to UsersDB");
  }
};

export default connectToMongoDB;
