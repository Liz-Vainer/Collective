const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");    
const User = require("./models/user");
const methodOverride = require("method-override");  

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/UsersDb")  
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
app.use(methodOverride("_method"));

const categories = ["Gobnik", "Unknown", "some"];

app.get("/users", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const users = await User.find({ category });
    res.render("users/index", { users, category });
  } else {
    const users = await User.find({});
    res.render("users/index", { users, category: "All" });
  }
});

app.get("/users/new", (req, res) => {
  res.render("users/new", { categories });
});

app.post("/users", async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.redirect(`/users/${newUser.id}`);
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.render("users/profile", { user });
});

app.get("/users/:id/edit", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.render("users/edit", { user, categories });
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/users/${user.id}`);
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const deletedUser = await User.findByIdAndDelete(id);
  res.redirect("/users");
});

app.listen(3000, () => {
  console.log("App is listening on port 3000..");
});
