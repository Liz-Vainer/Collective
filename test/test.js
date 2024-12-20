const request = require("supertest");
const app = require("../index"); // Import your app
const { expect } = require("chai");
const Community = require("../models/community"); // Import the Community model

describe("GET /communities", function () {
  beforeEach(async function () {
    // Clear the database and insert test data before each test
    await Community.deleteMany({});
    await Community.insertMany([
      { name: "Community 1", description: "Test community 1" },
      { name: "Community 2", description: "Test community 2" },
    ]);
  });

  afterEach(async function () {
    // Clear the database after each test
    await Community.deleteMany({});
  });

  it("should return an array of communities", async function () {
    const res = await request(app).get("/communities");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.be.greaterThan(0);
  });

  it("should return an empty array if no communities exist", async function () {
    // Clear all communities for this specific test
    await Community.deleteMany({});
    const res = await request(app).get("/communities");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(0);
  });
});
