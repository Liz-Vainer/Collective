import Event from "../models/events.js"; // event model
import User from "../models/user.js";

// create a new event
export const createEvent = async (req, res) => {
  const { eventName, location, eventImg, start, end } = req.body; // extract event details from the request body

  try {
    // check if an event with the same name already exists
    const existingEvent = await Event.findOne({ eventName });
    if (existingEvent) {
      return res.status(400).json({ message: "event already exists" });
    }

    // create a new event object
    const newEvent = new Event({
      name: eventName,
      image: eventImg,
      location: location,
      start: start,
      end: end,
    });

    await newEvent.save(); // save the new event to the database

    res.status(201).json(newEvent); // respond with the created event
  } catch (err) {
    console.error("error in backend createEvent:", err);
    res.status(500).json({ message: "internal server error" });
  }
};

// delete an event by name
export const deleteEvent = async (req, res) => {
  const { name } = req.body; // extract event name from the request body
  try {
    // delete the event by name
    const result = await Event.deleteOne({ name });
    if (result.deletedCount === 0) {
      // check if no event was deleted
      return res.status(404).json({ message: `event '${name}' not found.` });
    }

    // fetch all remaining events after deletion
    const events = await Event.find();
    res.status(200).json({
      message: `event '${name}' deleted successfully!`,
      events: events, // include the updated list of events
    });
  } catch (err) {
    console.error("error in backend deleteEvent:", err);
    res.status(500).json({ message: "internal server error" });
  }
};

// fetch all events
export const fetchEvents = async (req, res) => {
  try {
    const events = await Event.find(); // fetch all events from the database
    res.json({ events }); // send the events as the response
  } catch (err) {
    console.error("error fetching communities:", err);
    res.status(500).json({ message: "failed to fetch communities." });
  }
};

// fetch all participants of a specific event
export const fetchParticipants = async (req, res) => {
  const { eventId } = req.body; // extract event id from the request body
  console.log(eventId);
  try {
    // find the event by its id
    const event = await Event.findById(eventId);

    // fetch participants' details
    const participants = await Promise.all(
      event.participants.map(async (participantId) => {
        const user = await User.findById(participantId).select(
          "name profilePic" // specify the fields to include in the response
        );
        return user;
      })
    );

    res.json({ participants }); // send the participants as the response
  } catch (err) {
    console.error("error in fetchParticipants:", err);
    res.status(500).json({ message: "failed to fetch participants." });
  }
};
