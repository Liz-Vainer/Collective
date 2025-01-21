import * as chai from "chai";
import chaiHttp from "chai-http";
import jwt from "jsonwebtoken";
import app from "../index.js"; // Your Express app
import User from "../models/user.js"; // User model for testing

chai.use(chaiHttp);
const { expect } = chai;

describe("POST /signup with protected route", function () {
  this.timeout(10000); // Set timeout to 10 seconds for all tests in this block
  let token;

  before(async () => {
    const mockUser = new User({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
      userType: "user",
    });

    await mockUser.save(); // Save the mock user to the database

    // Generate a valid token for this mock user
    token = jwt.sign(
      { userId: mockUser._id },
      "/8/daecwqK21qn/lUPuU09HrnnS2qf9eroVuiVQbd54=", // Use the same secret as in your protectRoute middleware
      { expiresIn: "1h" }
    );
  });

  after(async () => {
    await User.deleteMany(); // Remove all test users
  });

  it("should return 401 if no token is provided", async () => {
    const response = await chai.request(app)
      .post("/signup")
      .send({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        userType: "user",
        age: 25,
        religion: "Religion",
        ethnicity: "Ethnicity",
        interest: "Interest",
        gender: "Male",
      });

    expect(response).to.have.status(401);
    expect(response.body.error).to.equal("Unauthorized - No Token Provided");
  });

  it("should return 200 for successful signup with a valid token", async () => {
    const response = await chai.request(app)
      .post("/signup")
      .set("Cookie", `jwt=${token}`) // Send the token in the request cookies
      .send({
        name: "Jane Doe",
        email: "jane.doe@example.com",
        password: "password456",
        userType: "user",
        age: 28,
        religion: "Religion",
        ethnicity: "Ethnicity",
        interest: "Interest",
        gender: "Female",
      });

    expect(response).to.have.status(200);
    expect(response.body.message).to.equal("User created successfully");
  });

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
