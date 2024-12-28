import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://seanmatatov:XiE85MeNw2Iq0tJ6@cluster0.jgafp.mongodb.net/UsersDb"
    );
    console.log("Connected to UsersDB");
  } catch (error) {
    console.log("Error connecting to UsersDB");
  }
};

export default connectToMongoDB;
