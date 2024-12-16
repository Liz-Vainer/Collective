const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");      //like import from python or include in c ----> we need to import mongoose to our file in order to use it
const User = require("./models/user");
const methodOverride = require("method-override");   //to use PUT methos, when you want to change existing data you need this line to use method PUT

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/UsersDb")  //to establish a connection to MongoDB database
  .then(() => {    //the connect method returns a promise so we can then and catch it
    console.log("Mongo connection open!");
  })
  .catch((err) => {
    console.log("A mongo connection error as occured");
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));   //for ejs (also the views is the directory we keep all the templates)
app.set("view engine", "ejs");    //for ejs too

app.use(express.urlencoded({ extended: true }));   //in order to use the method override (PUT)
app.use(methodOverride("_method"));      //in order to use the method override (PUT)

const categories = ["Gobnik", "Unknown", "some"];   //CHANGE THIS!

app.get("/", (req, res) => {    //when user launches the site he will be transported (redirected to /login as main page)
  //root page goes to lgin page
  res.redirect("/login");     //redirect to /login (root)
});

app.get("/login", async (req, res) => {       //when user is lending to /login, we render a page for him so he can log in
  //login after submit goes to post request in /users/login
  res.render("users/login");
});

app.post("/users/login", async (req, res) => {        //after we typed our account in /login, our information is transported via POST methos, and here we catch that POST info
  //gets body from login page and check if user exists in database
  const { email, password } = req.body;     //getting the email and passowrd as key value pairs
  try {
    const user = await User.findOne({ email });     //if the email was accurate it will find one in the data base  (await function because .findOne takes time)
    if (!user) {    
      res.send("Wrong email");     //NEED TO CHANGE THAT! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    } else if (user.password != password) {        //if the email is right but the password is wrong, we might need to stop the procces, if it is right we transfer him to next page
      res.send("Wrong password");
    }
    res.redirect(`/users/${user.id}`);     //if none of the ifs are true, meaning the info was right, we redirect the user the /users/the user he typed in, via user.id
  } catch (err) {      //if there are any other error, it will catch it here and stop
    console.error(err);
    res.status(500).send("An error occurred during login");
  }
});

app.get("/users/:id", async (req, res) => {    //after you logged in as a user, it will show us the user
  const { id } = req.params;  //getting the id of a user
  const user = await User.findById(id);   
  res.render("users/profile", { user });    //after it found the user, via id, it will render us his page
});

 //in user/profile, we have to options, either we go back to all users (/users) or we go to specifid user (/user?category=regular) for example
app.get("/users", async (req, res) => {   
  const { category } = req.query;   //if we used /user?query than it will show us that same users with the same category
  if (category) {
    const users = await User.find({ category });
    res.render("users/index", { users, category });  //sends us to a new page with those users with same category
  } else {      //if the GET is without query (/users) than it shows all the users
    const users = await User.find({});
    res.render("users/index", { users, category: "All" });
  }
});

app.get("/users/new", (req, res) => {   //if player wants new user, than he clicks on the new button and he gets redirected to /users/new
  res.render("users/new", { categories });
});

//this POST function is to recieve POST info when you are creating new user from users/new
app.post("/users", async (req, res) => {   //NEW USER
  const newUser = new User(req.body);
  await newUser.save();
  res.redirect(`/users/${newUser.id}`);    //after creating new users, redirecting us to new page (.redirect and not .render because it is a POST function)
});

app.get("/users/:id/edit", async (req, res) => {     //if user wants to edit his user from the /users/profile
  const { id } = req.params;
  const user = await User.findById(id);
  res.render("users/edit", { user, categories });
});

app.put("/users/:id", async (req, res) => {    //to get the function you need to edit user via /users/profile, .put because we used in the href: "?_method=PUT"
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, req.body, {
    runValidators: true,    //??
    new: true,              //??
  });
  res.redirect(`/users/${user.id}`);   //after finishing editing users info, redirecting to his page vie users/id
});

app.delete("/users/:id", async (req, res) => {   //if user decided to delete his user via /user/profile (via "?_method=DELETE")
  const { id } = req.params;
  const deletedUser = await User.findByIdAndDelete(id);
  res.redirect("/users");  //after finishing deleting redirects to page with all the users
});

app.listen(3000, () => {
  console.log("App is listening on port 3000..");   
});