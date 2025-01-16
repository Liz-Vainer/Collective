import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index.js"; 


chai.use(chaiHttp);
const { expect } = chai;

describe("Signup Functionality", () => {
  it("should successfully register a new user", (done) => {
    chai
      .request(app)
      .post("/api/users/signup") 
      .send({
        name: "testUser",
        email: "testuser@example.com",
        password: "test1234",
        userType: "citizen",
        age: 25,
        religion: "no",
        ethnicity: "unknown",
        interest: ["reading", "coding"],
        gender: "male",
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("message", "User Login successful");
        expect(res.body).to.have.property("userType", "User");
        expect(res.body).to.have.property("age", 25);
        done();
      });
  });

  it("should fail when required fields are missing", (done) => {
    chai
      .request(app)
      .post("/api/auth/signup")
      .send({
        name: "missingEmailUser",
        password: "test1234",
        userType: "citizen",
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message", "All fields are required");
        done();
      });
  });

  it("should fail when the userType is invalid", (done) => {
    chai
      .request(app)
      .post("/api/auth/signup")
      .send({
        name: "invalidUserType",
        email: "invaliduser@example.com",
        password: "test1234",
        userType: "invalid-type",
        age: 30,
        religion: "yes",
        ethnicity: "unknown",
        interest: ["sports"],
        gender: "female",
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message", "Invalid user type");
        done();
      });
  });

  it("should fail when the user already exists", (done) => {
    // First, register a user
    chai
      .request(app)
      .post("/api/auth/signup")
      .send({
        name: "existingUser",
        email: "existinguser@example.com",
        password: "test1234",
        userType: "citizen",
        age: 30,
        religion: "yes",
        ethnicity: "unknown",
        interest: ["sports"],
        gender: "female",
      })
      .end(() => {
        // Attempt to register the same user again
        chai
          .request(app)
          .post("/api/auth/signup")
          .send({
            name: "existingUser",
            email: "existinguser@example.com",
            password: "test1234",
            userType: "citizen",
            age: 30,
            religion: "yes",
            ethnicity: "unknown",
            interest: ["sports"],
            gender: "female",
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("message", "User already exists");
            done();
          });
      });
  });
});
