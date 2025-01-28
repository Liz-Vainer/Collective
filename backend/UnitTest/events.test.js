import * as chai from "chai";
import chaiHttp from "chai-http";
import app from "../index.js"; 
import sinon from 'sinon';
import express from 'express';
import jwt from 'jsonwebtoken';

chai.use(chaiHttp);
const { expect } = chai;

//JOIN EVENT
describe("join Event", function () {
    this.timeout(10000); 
    let eventId;
    let userId;
    
    it("should return 400 for missing EventId or userId", async () => {
      const response = await chai.request(app)
        .post("/join Event")
        .send({
          EventId: "", 
          userId: "",
        });
  
       expect(response).to.have.status(400);
       expect(response.body.message).to.equal("EventId and userId are required");
    });
  
    it("should successfully add a user to the event", async () => {
      const response = await chai.request(app)
        .post("/join Event")
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
        .post("/join Event")
        .send({
          EventId: mongoose.Types.ObjectId(), 
          userId: userId,
        });
  
      expect(response).to.have.status(404);
      expect(response.body.message).to.equal("Event not found");
    });
  });

  //LEAVE EVENT
  describe('POST /leave Event', () => {
    it('should remove the user from the event participants', async () => {
      const mockEvent = {
        participants: ['user1', 'user2'],
        save: sinon.stub().resolves()
      };
      sinon.stub(Event, 'findById').resolves(mockEvent);

      const res = await chai.request(app)
        .post('/leaveEvent')
        .send({ EventId: 'eventId123', user: 'user1' });

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('User successfully left the Event');
      expect(res.body.participants).to.deep.equal(['user2']);

      Event.findById.restore();
    });

    it('should return 404 if the event is not found', async () => {
      sinon.stub(Event, 'findById').resolves(null); 

      const res = await chai.request(app)
        .post('/leaveEvent')
        .send({ EventId: 'invalidEventId', user: 'user1' });

      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Event not found');

      Event.findById.restore();
    });
});
//CREATE EVENT
describe('POST /create Event', () => {
      /*  it('should return 400 if the event already exists', async () => {
      // Stub findOne to return an event that matches the incoming data
      sinon.stub(Event, 'findOne').callsFake(async (query) => {
        // Check if the query matches your existing event criteria
        if (
          query.name === 'Event1' && 
          query.location === 'Park Y.A' &&
          query.start === '2025-01-16'
        ) {
          return {
            name: 'Event1',
            location: 'Park Y.A',
            image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gxYSUNDX1BST0ZJTEU…',
            start: '2025-01-16',
            end: '2025-01-23',
          };
        }
        return null;
      });

      const res = await chai.request(app)
        .post('/createEvent')
        .send({
          eventName: 'Event1',
          location: 'Park Y.A',
          eventImg: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gxYSUNDX1BST0ZJTEU…',
          start: '2025-01-16',
          end: '2025-01-23',
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Event already exists');

      Event.findOne.restore();
    });*/

    it('should return 400 if the event already exists', async () => {
        const ExistsEventData = {
          eventName: 'exists Event',
          location: 'exists Location',
          eventImg: 'newImage.jpg',
          start: '2025-02-01T00:00:00Z',
          end: '2025-02-01T02:00:00Z',
        };
      });

    it('should successfully create a new event', async () => {
      const newEventData = {
        eventName: 'New Event',
        location: 'New Location',
        eventImg: 'newImage.jpg',
        start: '2025-02-01T00:00:00Z',
        end: '2025-02-01T02:00:00Z',
      };
    });
});
//DELETE EVENT
describe('DELETE /delete Event', () => {
    it('should successfully delete an existing event', async () => {
      const deleteEventData = {
        eventName: 'New Event',
        location: 'New Location',
        eventImg: 'newImage.jpg',
        start: '2025-02-01T00:00:00Z',
        end: '2025-02-01T02:00:00Z',
      };
    });
  });

  //fetch Events
  describe("fetchEvents Controller", () => {
    afterEach(() => {
      sinon.restore(); // Restore all mocks/stubs after each test
    });
  
    it("should return a list of events when found", async () => {
      const req = {}; // No specific request data needed for fetching events
      const res = {
        json: sinon.stub(), // Mock json response method
      };
  
      // Mock event data to return
      const mockEvents = [
        { name: "Event 1", location: "Location 1", start: "2025-01-01", end: "2025-01-02" },
        { name: "Event 2", location: "Location 2", start: "2025-01-03", end: "2025-01-04" },
      ];
  
      // Mock the Event.find() method to return the mock data
      sinon.stub(Event, "find").resolves(mockEvents);
  
      // Call the function
      await fetchEvents(req, res);
  
      // Assertions
      expect(Event.find.calledOnce).to.be.true; // Ensure Event.find() was called once
      expect(res.json.calledWith({ events: mockEvents })).to.be.true; // Ensure correct events are returned in response
    });
  
    it("should return a 500 error if there is an exception", async () => {
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      // Simulate an error by making Event.find() throw an error
      sinon.stub(Event, "find").throws(new Error("Database error"));
  
      // Call the function
      await fetchEvents(req, res);
  
      // Assertions
      expect(Event.find.calledOnce).to.be.true; // Ensure Event.find() was called once
      expect(res.status.calledWith(500)).to.be.true; // Ensure status 500 is returned for error
      expect(res.json.calledWith({ message: "failed to fetch communities." })).to.be.true; // Ensure correct error message is returned
    });
  });

  describe("EventsJoined Controller", () => {
    afterEach(() => {
      sinon.restore(); // Restore all mocks/stubs after each test
    });
  
    it("should return the list of events the user has joined", async () => {
      const req = {
        body: {
          userId: "user123",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      // Mock user data with a joinedEvents array
      const mockUser = {
        _id: "user123",
        joinedEvents: ["event1", "event2", "event3"],
      };
  
      // Mock the User.findById() method to return the mock user data
      sinon.stub(User, "findById").resolves(mockUser);
  
      // Call the function
      await EventsJoined(req, res);
  
      // Assertions
      expect(User.findById.calledOnceWith("user123")).to.be.true; // Ensure findById was called with the correct userId
      expect(res.status.calledWith(200)).to.be.true; // Ensure status 200 is returned
      expect(res.json.calledWith({
        events: mockUser.joinedEvents,
      })).to.be.true; // Ensure the list of events is returned
    });
  
    it("should return a 404 error if the user is not found", async () => {
      const req = {
        body: {
          userId: "nonexistentUserId",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      // Simulate user not being found by returning null
      sinon.stub(User, "findById").resolves(null);
  
      // Call the function
      await EventsJoined(req, res);
  
      // Assertions
      expect(User.findById.calledOnceWith("nonexistentUserId")).to.be.true; // Ensure findById was called with the correct userId
      expect(res.status.calledWith(404)).to.be.true; // Ensure status 404 is returned
      expect(res.json.calledWith({ message: "User not found" })).to.be.true; // Ensure the correct error message is returned
    });
  
    it("should return a 500 error if there is an exception", async () => {
      const req = {
        body: {
          userId: "user123",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      // Simulate an error by making User.findById() throw an error
      sinon.stub(User, "findById").throws(new Error("Database error"));
  
      // Call the function
      await EventsJoined(req, res);
  
      // Assertions
      expect(User.findById.calledOnceWith("user123")).to.be.true; // Ensure findById was called with the correct userId
      expect(res.status.calledWith(500)).to.be.true; // Ensure status 500 is returned for error
      expect(res.json.calledWith({ message: "An error occurred in EventsJoined", error: "Database error" })).to.be.true; // Ensure the correct error message is returned
    });
  });
  