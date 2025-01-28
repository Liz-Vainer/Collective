import * as chai from "chai";
import chaiHttp from "chai-http";
import jwt from "jsonwebtoken";
import app from "../index.js"; 
import User from "../models/user.js";
import mongoose from "mongoose";
import { signup } from "../controllers/user.controllers.js";


chai.use(chaiHttp);
const { expect } = chai;

describe("POST /signup", function () {
  it('should return 400 for invalid credentials', async () => {
    const newUser = {
        name: " ",
        email: "",
        password: "",
        age: "",
        religion: "",
        ethnicity: "",
        interest: "",
        gender: "",
        profilePic: "",
    };
  });
  it('should successfully create a new user', async () => {
    const newUser = {
        name: "test",
        email: "test@gmail.com",
        password: "M12345678",
        age: "18",
        religion: "Muslim",
        ethnicity: "Black",
        interest: "Sport",
        gender: "Male",
        profilePic: "",
    };
  });
});

describe("POST /add to fav", function () {
  this.timeout(10000); // Set timeout to 10 seconds for all tests in this block

  it("should add a community to favorites successfully", async () => {
    const response = await chai
      .request(app)
      .post("/add_to_fav")
      .send({
        id: ObjectId(''),
        community: "Park Y.A",
      });

    expect(re6787a809637aa9c21113129fsponse).to.have.status(200);
    expect(response.body.message).to.equal("Community added to favorites");
    expect(response.body.favorites).to.include("Park Y.A");
  });
});