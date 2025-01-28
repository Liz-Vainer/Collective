import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';
import sinon from 'sinon';
import User from '../models/user.js'; 
import { expect } from 'chai';
//import request from 'supertest';
import mongoose from 'mongoose';


chai.use(chaiHttp);

//accept friend requset
  describe('POST /accept Friend Request', () => {
    it('should accept a friend request and add both users as friends', async () => {
      const mockUser = {
        _id: 'user1',
        friendRequests: ['requesterId'],
        friends: [],
        save: sinon.stub().resolves()
      };
      const mockRequester = {
        _id: 'requesterId',
        friends: [],
        save: sinon.stub().resolves()
      };

        sinon.stub(User, 'findById')
        .onCall(0).resolves(mockUser) // First call returns mockUser
        .onCall(1).resolves(mockRequester); // Second call returns mockRequester

      // Mock the socket ID retrieval function
      const getReceiverSocketId = sinon.stub().callsFake((id) => `${id}SocketId`);
      global.getReceiverSocketId = getReceiverSocketId;

      const res = await chai.request(app)
        .post('/accept Friend Request')
        .send({ requesterId: 'requesterId' })
        .set('Authorization', 'Bearer valid-jwt-token'); // Adjust according to your authentication method

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Friend request accepted!');
      expect(res.body.friends).to.deep.equal([mockRequester]);
      expect(res.body.requestes).to.deep.equal([]);

      // Check if socket emits were called for both users
      expect(getReceiverSocketId.calledTwice).to.be.true;

      // Restore the stubs after the test
      User.findById.restore();
      getReceiverSocketId.restore();
    });

    it('should return 404 if user or requester not found', async () => {
      sinon.stub(User, 'findById').resolves(null); // Simulate user not found

      const res = await chai.request(app)
        .post('/accept Friend Request')
        .send({ requesterId: 'requesterId' })
        .set('Authorization', 'Bearer valid-jwt-token');

      expect(res.status).to.equal(404);
      expect(res.body.error).to.equal('User not found');

      User.findById.restore();
    });
});

//fetch fav
// Mock the authentication middleware
const mockAuthMiddleware = (req, res, next) => {
  req.user = { id: 'someUserId' }; // Mock authenticated user
  next();
};

// Replace the actual auth middleware with the mock middleware
app.use(mockAuthMiddleware);

describe('fetch_fav API', () => {
  /*before(async () => {
    // Connect to a test database
    await mongoose.connect('mongodb://127.0.0.1:27017/UsersDb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });*/

  after(async () => {
    // Disconnect from the database
    await mongoose.connection.close();
  });

  it('should fetch favorites for a valid user', async () => {
    // Create a test user with favorites
    const user = new User({
      name: 'testuser',
      email: 'test@example.com',
      password: 'password',
      favorites: [
        { id: '1', name: 'Community1', lat: 10, lng: 20 },
        { id: '2', name: 'Community2', lat: 30, lng: 40 },
      ],
    });
    await user.save();

    // Create test communities
    const community1 = new Community({ name: 'Community1' });
    const community2 = new Community({ name: 'Community2' });
    await community1.save();
    await community2.save();

    // Make the request
    const res = await request(app)
      .get('/api/fetch_fav/User/someUserId') // Adjust the route as needed
      .set('Authorization', 'Bearer someToken'); // Mock the authorization header

    expect(res.status).to.equal(200);
    expect(res.body.favorites).to.have.lengthOf(2);
    expect(res.body.favorites[0].name).to.equal('Community1');
    expect(res.body.favorites[1].name).to.equal('Community2');
  });

  it('should return 404 if user not found', async () => {
    // Make the request for a non-existent user
    const res = await request(app)
      .get('/api/fetch_fav/User/nonexistentUserId') // Adjust the route as needed
      .set('Authorization', 'Bearer someToken'); // Mock the authorization header

    // Assertions
    expect(res.status).to.equal(404);
    expect(res.body.message).to.equal('User not found');
  });

  it('should return 400 for invalid user type', async () => {
    // Make the request with an invalid user type
    const res = await request(app)
      .get('/api/fetch_fav/InvalidType/someUserId') // Adjust the route as needed
      .set('Authorization', 'Bearer someToken'); // Mock the authorization header

    // Assertions
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Invalid user type');
  });

  it('should remove non-existent communities from favorites', async () => {
    // Create a test user with a non-existent community in favorites
    const user = new User({
      name: 'testuser',
      email: 'test@example.com',
      password: 'password',
      favorites: [
        { id: '1', name: 'Community1', lat: 10, lng: 20 },
        { id: '2', name: 'NonExistentCommunity', lat: 30, lng: 40 },
      ],
    });
    await user.save();

    // Create only one community
    const community1 = new Community({ name: 'Community1' });
    await community1.save();

    // Make the request
    const res = await request(app)
      .get('/api/fetch_fav/User/someUserId') // Adjust the route as needed
      .set('Authorization', 'Bearer someToken'); // Mock the authorization header

    // Assertions
    expect(res.status).to.equal(200);
    expect(res.body.favorites).to.have.lengthOf(1);
    expect(res.body.favorites[0].name).to.equal('Community1');
  });
});

//update profile pic
describe('updateProfilePicture', () => {
  let req, res;

  it('should update the profile picture for a User', async () => {
    const mockUpdatedUser = {
      _id: '12345',
      profilePic: 'new-profile-pic-url',
      religion: 'Christian',
      age: 25,
      gender: 'Male',
      ethnicity: 'Asian',
      interest: 'Sports',
      name: 'John Doe',
    };

    User.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

    await updateProfilePicture(req, res);

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      '12345',
      { profilePic: 'new-profile-pic-url' },
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Profile picture updated',
      id: '12345',
      userType: 'User',
      age: 25,
      gender: 'Male',
      isReligious: true,
      religion: 'Christian',
      ethnicity: 'Asian',
      interest: 'Sports',
      name: 'John Doe',
      profilePic: 'new-profile-pic-url',
    });
  });
});

//like Event
describe("likeEvent", () => {
  it("should return 200 and increase likes for the event", async () => {
    const req = { body: { eventId: "123" } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const mockEvent = {
      likes: 10,
      save: sinon.stub().resolves(),
    };

    sinon.stub(Event, "findById").resolves(mockEvent);

    await likeEvent(req, res);

    expect(mockEvent.likes).to.equal(11); // Check if likes were incremented
    expect(res.status.calledWith(200)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Event liked succesfully",
        likes: 11,
      })
    ).to.be.true;
  });

  it("should return 500 if an error occurs", async () => {
    const req = { body: { eventId: "123" } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    sinon.stub(Event, "findById").throws(new Error("Database error"));

    await likeEvent(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(
      res.json.calledWithMatch({
        message: "An error occurred in likeEvent",
        error: "Database error",
      })
    ).to.be.true;
  });
});


//dislike Event
describe("dislikeEvent", () => {
  it("should return 200 and increase dislikes for the event", async () => {
    const req = { body: { eventId: "123" } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const mockEvent = {
      dislikes: 5,
      save: sinon.stub().resolves(),
    };

    sinon.stub(Event, "findById").resolves(mockEvent);

    await dislikeEvent(req, res);

    expect(mockEvent.dislikes).to.equal(6); // Check if dislikes were incremented
    expect(res.status.calledWith(200)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Event disliked succesfully",
        dislikes: 6,
      })
    ).to.be.true;
  });

  it("should return 500 if an error occurs", async () => {
    const req = { body: { eventId: "123" } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    sinon.stub(Event, "findById").throws(new Error("Database error"));

    await dislikeEvent(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(
      res.json.calledWithMatch({
        message: "An error occurred in dislikeEvent",
        error: "Database error",
      })
    ).to.be.true;
  });
});