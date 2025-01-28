import * as chai from "chai";
import chaiHttp from "chai-http";
import app from "../index.js"; 
import sinon from 'sinon';
import express from 'express';
import jwt from 'jsonwebtoken';


chai.use(chaiHttp);
const { expect } = chai;

//add to fav
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

//REMOVE FAV
describe("POST /remove_fav", function () {
    this.timeout(10000);
  
    let userId;
    let community;
    let user;

    it("should successfully remove a community from favorites", async () => {
      const response = await chai.request(app)
        .post("/remove_fav")
        .send({
          id: userId,
          community: community,
          userType: "User",
        });
  
      expect(response).to.have.status(200);
      expect(response.body.favorites).to.not.include(community);
    });
  });

 //add a community
 describe("POST /add Community", function () {
  this.timeout(10000);

  it("should return 400 if the community already exists", async () => {
    const response = await chai.request(app)
      .post("/add Community")
      .send({
        name: "Park Y.A",
        category: "Entertainment",
        lat: 34.791462, 
        lng: 31.252973,
      });

    if (response.body.error) {
      console.log('Error:', response.body.error); 
    }

    expect(response).to.have.status(400);
    expect(response.body.message).to.equal("Community already exists");
  });

  it("should return 400 if the community has the same coordinates", async () => {
    const response = await chai.request(app)
      .post("/add Community")
      .send({
        name: "Park Y.A",
        category: "Entertainment",
        lat: 34.791462, 
        lng: 31.252973,
      });

    if (response.body.error) {
      console.log('Error:', response.body.error);
    }

    expect(response).to.have.status(400);
    expect(response.body.message).to.equal("Community with the same cords already exists");
  });
}); 

//remove community
describe('POST /removeCommunity', () => {
  let communityStub;

  afterEach(() => {
    communityStub.restore(); 
  });

  it('should return 404 if the community is not found', async () => {
    // Mock the result of deleteOne to simulate community not found
    communityStub.resolves({ deletedCount: 0 });

    const response = await chai.request(app)
      .post('/removeCommunity')
      .send({ name: 'Non-existent Community' });

    expect(response).to.have.status(404);
    expect(response.body.message).to.equal('not found.');
  });

  it('should successfully delete a community', async () => {
    // Mock the result of deleteOne to simulate successful deletion
    communityStub.resolves({ deletedCount: 1 });

    const response = await chai.request(app)
      .post('/removeCommunity')
      .send({ name: 'Existing Community' });

    expect(response).to.have.status(200);
    expect(response.body.message).to.equal('deleted successfully!');
  });
});

//leave Community
  describe("leaveCommunity", () => {
    it("should return 404 if the community is not found", async () => {
      const req = { body: { communityId: "123", userId: "456" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(Community, "findById").resolves(null);

      await leaveCommunity(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: "Community not found" })).to.be.true;
    });

    it("should remove a user from the community and return success", async () => {
      const req = { body: { communityId: "123", userId: "456" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const mockCommunity = {
        users: ["456", "789"],
        save: sinon.stub().resolves(),
      };

      sinon.stub(Community, "findById").resolves(mockCommunity);

      await leaveCommunity(req, res);

      expect(mockCommunity.users).to.not.include("456");
      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWith({
          message: "User successfully left to the community",
          member: true,
        })
      ).to.be.true;
    });
  });

//join Community
  describe("joinCommunity", () => {
    it("should return 404 if the community is not found", async () => {
      const req = { body: { communityId: "123", userId: "456" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(Community, "findById").resolves(null);

      await joinCommunity(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: "Community not found" })).to.be.true;
    });

    it("should add a user to the community and return success", async () => {
      const req = { body: { communityId: "123", userId: "456" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const mockCommunity = {
        users: ["789"],
        save: sinon.stub().resolves(),
      };

      sinon.stub(Community, "findById").resolves(mockCommunity);

      await joinCommunity(req, res);

      expect(mockCommunity.users).to.include("456");
      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWith({
          message: "User successfully added to the community",
          member: true,
        })
      ).to.be.true;
    });
  });

  //fetch_communities
  describe("fetch_communities Controller", () => {
    afterEach(() => {
      sinon.restore(); // Restore all mocks/stubs after each test
    });
  
    it("should return a list of communities when found", async () => {
      const req = {}; // No specific request data needed for fetching communities
      const res = {
        json: sinon.stub(), // Mock json response method
      };
  
      // Mock community data to return
      const mockCommunities = [
        { name: "Community 1", description: "Description 1" },
        { name: "Community 2", description: "Description 2" },
      ];
  
      // Mock the Community.find() method to return the mock data
      sinon.stub(Community, "find").resolves(mockCommunities);
  
      // Call the function
      await fetch_communities(req, res);
  
      // Assertions
      expect(Community.find.calledOnce).to.be.true; // Ensure Community.find() was called once
      expect(res.json.calledWith({ communities: mockCommunities })).to.be.true; // Ensure correct communities are returned in response
    });
  
    it("should return a 500 error if there is an exception", async () => {
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      // Simulate an error by making Community.find() throw an error
      sinon.stub(Community, "find").throws(new Error("Database error"));
  
      // Call the function
      await fetch_communities(req, res);
  
      // Assertions
      expect(Community.find.calledOnce).to.be.true; // Ensure Community.find() was called once
      expect(res.status.calledWith(500)).to.be.true; // Ensure status 500 is returned for error
      expect(res.json.calledWith({ message: "failed to fetch communities." })).to.be.true; // Ensure correct error message is returned
    });
  });


//Settings
  describe("Settings", () => {
    afterEach(() => {
      sinon.restore(); // Restore all mocks/stubs after each test
    });
  
    it("should update settings for a user in the User collection", async () => {
      const req = {
        body: {
          userID: "123",
          gender: "female",
          age: 25,
          religion: "Christianity",
          ethnicity: "Asian",
          interest: "Sports",
          userType: "user",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      const mockUser = {
        id: "123",
        gender: "female",
        age: 25,
        religion: "Christianity",
        ethnicity: "Asian",
        interest: "Sports",
        name: "Test User",
        profilePic: "test-pic.jpg",
      };
  
      sinon.stub(User, "findByIdAndUpdate").resolves(mockUser);
  
      await settings(req, res);
  
      expect(User.findByIdAndUpdate.calledOnce).to.be.true;
      expect(User.findByIdAndUpdate.calledWith("123")).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWithMatch({
          message: "User settings updated successfully",
          id: "123",
          userType: "user",
          age: 25,
          gender: "female",
          isReligious: true,
          religioun: "Christianity",
          ethnicity: "Asian",
          interest: "Sports",
          name: "Test User",
          profilePic: "test-pic.jpg",
        })
      ).to.be.true;
    });
  
    it("should update settings for a user in the Organizer collection", async () => {
      const req = {
        body: {
          userID: "123",
          gender: "male",
          age: 30,
          religion: "no",
          ethnicity: "Hispanic",
          interest: "Music",
          userType: "organizer",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      const mockOrganizer = {
        id: "123",
        gender: "male",
        age: 30,
        religion: "no",
        ethnicity: "Hispanic",
        interest: "Music",
        name: "Test Organizer",
        profilePic: "test-organizer.jpg",
      };
  
      sinon.stub(User, "findByIdAndUpdate").resolves(null);
      sinon.stub(Organizer, "findByIdAndUpdate").resolves(mockOrganizer);
  
      await settings(req, res);
  
      expect(Organizer.findByIdAndUpdate.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWithMatch({
          message: "teOrganizer settings updated successfully",
          id: "123",
          userType: "organizer",
          age: 30,
          gender: "male",
          isReligious: false,
          religioun: "no",
          ethnicity: "Hispanic",
          interest: "Music",
          name: "Test Organizer",
          profilePic: "test-organizer.jpg",
        })
      ).to.be.true;
    });
  
    it("should update settings for a user in the Official collection", async () => {
      const req = {
        body: {
          userID: "123",
          gender: "non-binary",
          age: 40,
          religion: "Islam",
          ethnicity: "Middle Eastern",
          interest: "Politics",
          userType: "official",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      const mockOfficial = {
        id: "123",
        gender: "non-binary",
        age: 40,
        religion: "Islam",
        ethnicity: "Middle Eastern",
        interest: "Politics",
        name: "Test Official",
        profilePic: "test-official.jpg",
      };
  
      sinon.stub(User, "findByIdAndUpdate").resolves(null);
      sinon.stub(Organizer, "findByIdAndUpdate").resolves(null);
      sinon.stub(Official, "findByIdAndUpdate").resolves(mockOfficial);
  
      await settings(req, res);
  
      expect(Official.findByIdAndUpdate.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWithMatch({
          message: "Official settings updated successfully",
          id: "123",
          userType: "official",
          age: 40,
          gender: "non-binary",
          isReligious: true,
          religioun: "Islam",
          ethnicity: "Middle Eastern",
          interest: "Politics",
          name: "Test Official",
          profilePic: "test-official.jpg",
        })
      ).to.be.true;
    });
  
    it("should return 404 if the user is not found in any collection", async () => {
      const req = {
        body: {
          userID: "123",
          gender: "female",
          age: 25,
          religion: "no",
          ethnicity: "Asian",
          interest: "Sports",
          userType: "user",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      sinon.stub(User, "findByIdAndUpdate").resolves(null);
      sinon.stub(Organizer, "findByIdAndUpdate").resolves(null);
      sinon.stub(Official, "findByIdAndUpdate").resolves(null);
  
      await settings(req, res);
  
      expect(res.status.calledWith(404)).to.be.true;
      expect(
        res.json.calledWith({ message: "User not found in any collection" })
      ).to.be.true;
    });
  
    it("should return 500 if an error occurs", async () => {
      const req = { body: { userID: "123" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      sinon.stub(User, "findByIdAndUpdate").throws(new Error("Database error"));
  
      await settings(req, res);
  
      expect(res.status.calledWith(500)).to.be.true;
      expect(
        res.json.calledWith({
          message: "An error occurred while updating user settings",
        })
      ).to.be.true;
    });
  });

  //remove User FromCommunity
  describe("removeUserFromCommunity Controller", () => {
    afterEach(() => {
      sinon.restore(); // Restore all mocks/stubs after each test
    });
  
    it("should remove a user from the community successfully", async () => {
      const req = {
        body: {
          communityId: "community123",
          userId: "user123",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      // Mock community data with users array
      const mockCommunity = {
        _id: "community123",
        users: ["user123", "user456"],
        save: sinon.stub().resolves(),
      };
  
      // Mock the Community.findById() method to return the mock community data
      sinon.stub(Community, "findById").resolves(mockCommunity);
  
      // Call the function
      await removeUserFromCommunity(req, res);
  
      // Assertions
      expect(Community.findById.calledOnceWith("community123")).to.be.true; // Ensure findById was called with correct communityId
      expect(mockCommunity.users).to.not.include("user123"); // Ensure the user was removed from the users array
      expect(res.status.calledWith(200)).to.be.true; // Ensure status 200 is returned
      expect(res.json.calledWith({
        message: "User successfully Removed from the community",
        members: mockCommunity.users,
      })).to.be.true; // Ensure the correct response is sent
    });
  
    it("should return a 404 error if the community is not found", async () => {
      const req = {
        body: {
          communityId: "nonexistentCommunityId",
          userId: "user123",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      // Simulate community not being found by returning null
      sinon.stub(Community, "findById").resolves(null);
  
      // Call the function
      await removeUserFromCommunity(req, res);
  
      // Assertions
      expect(Community.findById.calledOnceWith("nonexistentCommunityId")).to.be.true; // Ensure findById was called with the correct communityId
      expect(res.status.calledWith(404)).to.be.true; // Ensure status 404 is returned
      expect(res.json.calledWith({ message: "Community not found" })).to.be.true; // Ensure correct error message is returned
    });
  
    it("should return a 500 error if there is an exception", async () => {
      const req = {
        body: {
          communityId: "community123",
          userId: "user123",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      // Simulate an error by making Community.findById() throw an error
      sinon.stub(Community, "findById").throws(new Error("Database error"));
  
      // Call the function
      await removeUserFromCommunity(req, res);
  
      // Assertions
      expect(Community.findById.calledOnceWith("community123")).to.be.true; // Ensure findById was called with the correct communityId
      expect(res.status.calledWith(500)).to.be.true; // Ensure status 500 is returned for error
      expect(res.json.calledWith({ message: "Internal Server Error (leaving a community)" })).to.be.true; // Ensure correct error message is returned
    });
  });
