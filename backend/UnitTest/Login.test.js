const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index"); // Import the main server
const User = require("../models/user"); // Import the User model
const Organizer = require("../models/orginaizer");
const Official = require("../models/official");

const should = chai.should();
chai.use(chaiHttp);

describe("User Login Routes", () => {
  
  it("should log in an existing user", async () => {
    await User.create({
      name: "testuser",
      password: "$2b$10$testpasswordhash", // Use a hashed password
    });

    const res = await chai
      .request(server)
      .post("/login") // Replace with actual route
      .send({ name: "testuser", password: "password123" });

    res.should.have.status(200);
    res.body.should.have.property("message").eql("User Login successful");
    res.body.should.have.property("id");
    res.body.should.have.property("userType").eql("User");
  });

  it("should not log in with wrong credentials", async () => {
    await User.create({
      name: "testuser",
      password: "$2b$10$testpasswordhash", // Use a hashed password
    });

    const res = await chai
      .request(server)
      .post("/login") // Replace with actual route
      .send({ name: "testuser", password: "wrongpassword" });

    res.should.have.status(400);
    res.body.should.have.property("message").eql("Invalid credentials");
  });

  it("should log in an existing organizer", async () => {
    await Organizer.create({
      name: "testorganizer",
      password: "$2b$10$testpasswordhash", // Use a hashed password
    });

    const res = await chai
      .request(server)
      .post("/login") // Replace with actual route
      .send({ name: "testorganizer", password: "password123" });

    res.should.have.status(200);
    res.body.should.have.property("message").eql("Organizer Login successful");
    res.body.should.have.property("userType").eql("Organizer");
  });

  it("should not log in with missing credentials", async () => {
    const res = await chai
      .request(server)
      .post("/login") // Replace with actual route
      .send({ name: "testuser" });

    res.should.have.status(400);
    res.body.should.have.property("message").eql("Name and password are required");
  });

  it("should log in an existing official", async () => {
    await Official.create({
      name: "testofficial",
      password: "$2b$10$testpasswordhash", // Use a hashed password
    });

    const res = await chai
      .request(server)
      .post("/login") // Replace with actual route
      .send({ name: "testofficial", password: "password123" });

    res.should.have.status(200);
    res.body.should.have.property("message").eql("Official Login successful");
    res.body.should.have.property("userType").eql("Official");
  });

});
