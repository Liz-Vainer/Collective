const express = require("express");
const app = express();
const path = require("path");
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

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/users", async (req, res) => {
  const users = await User.find({});
  console.log(users);
  res.render("users/index", { users });
});

app.get("/users/new", (req, res) => {
  res.render("users/new");
});

app.post("/users", async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  console.log(newUser);
  res.redirect(`/users/${newUser.id}`);
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  console.log(user);
  res.render("users/profile", { user });
});

app.listen(3000, () => {
  console.log("App is listening on port 3000..");
});
