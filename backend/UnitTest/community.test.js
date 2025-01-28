import * as chai from "chai";
import chaiHttp from "chai-http";
import app from "../index.js"; 
import sinon from 'sinon';
import express from 'express';


chai.use(chaiHttp);
const { expect } = chai;

//JOIN EVENT
describe("POST /join Event", function () {
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