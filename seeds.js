const mongoose = require("mongoose");
const User = require("./models/user");
mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1:27017/UsersDb")
  .then(() => {
    console.log("Mongo connection open!");
  })
  .catch((err) => {
    console.log("A mongo connection error as occured");
    console.log(err);
  });

const profiles = [
  {
    name: "Jack",
    surname: "Sparrow",
    password: "123",
  },
  {
    name: "Will",
    surname: "Turner",
    password: "124",
  },
  {
    name: "Elizabeth",
    surname: "Swan",
    password: "125",
  },
];
