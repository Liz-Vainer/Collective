const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/user");
mongoose.set("strictQuery", true);

mongoose.connect("mongodb://127.0.0.1:27017/UsersDb")
  .then(() => {
    console.log("Mongo connection open!");
  })
  .catch((err) => {
    console.log("A mongo connection error as occured");
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));     //for ejs stuff
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));     //so when you send data through POST it will be like json

app.get("/users", async (req, res) => {   //main page when you go to /users
  const users = await User.find({});     //await because connecting to mongo via .find takes time
  console.log(users);
  res.render("users/index", { users }); //sending it to to ejs template
});

  app.get("/users/new", (req, res) => {    //when going to /users/new sending page to template
    res.render("users/new");
  });

app.post("/users", async (req, res) => {   //getting the input from new.ejs for new user through POST method
  const newUser = new User(req.body);      //parsing it from json to js object
  await newUser.save();   
  console.log(newUser);
  res.redirect(`/users/${newUser.id}`);    //using .redirect and not .render because it is better to redirect after filling a form for example
});                                        //if you use .render can cause trouble if user is refreshing --> AFTER POST USE .redirect

app.get("/users/:id", async (req, res) => { //basically shows one user at a time
  const { id } = req.params;          //req.params is a js object and const {id} means that we want only the id part
  const user = await User.findById(id);   //finding the user with that same id
  console.log(user);
  res.render("users/profile", { user });
});

app.listen(3000, () => {
  console.log("App is listening on port 3000..");
});
