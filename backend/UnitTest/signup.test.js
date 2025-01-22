import * as chai from "chai";
import chaiHttp from "chai-http";
import jwt from "jsonwebtoken";
import app from "../index.js"; // Your Express app
import User from "../models/user.js"; // User model for testing
import mongoose from "mongoose";

chai.use(chaiHttp);
const { expect } = chai;

describe("POST /signup", function () {
  this.timeout(10000); // Set timeout to 10 seconds for all tests in this block
  let token;

  it("should return 400 for missing required fields", async () => {
    const response = await chai.request(app)
      .post("/signup")
      .set("Cookie", `jwt=${token}`) // Send the token in the request cookies
      .send({
        name: "",
        email: "",
        password: "",
        userType: "",
      });

    expect(response).to.have.status(400);
    expect(response.body.message).to.equal("All fields are required");
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
describe("POST /joinEvent", function () {
  this.timeout(10000); // Set timeout to 10 seconds for all tests in this block

  let eventId;
  let userId;

  it("should successfully add a user to the event", async () => {
    const response = await chai.request(app)
      .post("/joinEvent")
      .send({
        EventId: eventId,
        userId: userId,
      });

    expect(response).to.have.status(200);
    expect(response.body.message).to.equal("User successfully added to the Event");
    expect(response.body.participants).to.include(userId.toString());
  });

  it("should return 404 if the event does not exist", async () => {
    const response = await chai.request(app)
      .post("/joinEvent")
      .send({
        EventId: mongoose.Types.ObjectId(), 
        userId: userId,
      });

    expect(response).to.have.status(404);
    expect(response.body.message).to.equal("Event not found");
  });
});