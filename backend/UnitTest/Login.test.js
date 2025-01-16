import chai from "chai";
import chaiHttp from "chai-http";
import server from "../index.js"; 
import User from "../models/user.js";
import Organizer from "../models/orginaizer.js";
import Official from "../models/official.js";
import bcrypt from "bcrypt";


const should = chai.should();
chai.use(chaiHttp);

describe("User Login Routes", () => {
    // Clear the database before running tests
    before(async () => {
      await User.deleteMany({});
      await Organizer.deleteMany({});
      await Official.deleteMany({});
    });
  
    // Clear test data after each test
    afterEach(async () => {
      await User.deleteMany({});
      await Organizer.deleteMany({});
      await Official.deleteMany({});
    });
  
    it("should log in an existing user", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10); // Hash the password
      await User.create({
        name: "testuser",
        password: hashedPassword, // Save the hashed password
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
      const hashedPassword = await bcrypt.hash("password123", 10);
      await User.create({
        name: "testuser",
        password: hashedPassword,
      });
  
      const res = await chai
        .request(server)
        .post("/login") // Replace with actual route
        .send({ name: "testuser", password: "wrongpassword" });
  
      res.should.have.status(400);
      res.body.should.have.property("message").eql("Invalid credentials");
    });
  
    it("should log in an existing organizer", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      await Organizer.create({
        name: "testorganizer",
        password: hashedPassword,
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
      const hashedPassword = await bcrypt.hash("password123", 10);
      await Official.create({
        name: "testofficial",
        password: hashedPassword,
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