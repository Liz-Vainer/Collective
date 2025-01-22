import * as chai from "chai";
import chaiHttp from "chai-http";
import app from "../index.js"; 

chai.use(chaiHttp);
const { expect } = chai;

describe("POST /joinEvent", function () {
  this.timeout(10000); 

  let eventId;
  let userId;

  before(async () => {
    // Create a test event and user for the test
    const event = new Event({
      name: "park hayrkon",
      participants: [],
    });
    await event.save();
    eventId = event._id;
    userId = mongoose.Types.ObjectId(); 
  });

  it("should return 400 for missing EventId or userId", async () => {
    const response = await chai.request(app)
      .post("/joinEvent")
      .send({
        EventId: "", // Missing EventId
        userId: "",
      });

    expect(response).to.have.status(400);
    expect(response.body.message).to.equal("EventId and userId are required");
  });

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
