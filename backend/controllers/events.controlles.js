import Event from "../models/events.js"; // Event model
import User from "../models/user.js";

export const createEvent = async (req, res) => {
  const { eventName, location, eventImg, start, end } = req.body;

  try {
    const existingEvent = await Event.findOne({ eventName });
    if (existingEvent) {
      return res.status(400).json({ message: "Event already exists" });
    }

    const newEvent = new Event({
      name: eventName,
      image: eventImg,
      location: location,
      start: start,
      end: end,
    });

    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Error in backend createEvent:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteEvent = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await Event.deleteOne({ name });
    if (result === 0) {
      return res.status(404).json({ message: `Event '${name}' not found.` });
    }
    const events = await Event.find();
    res.status(200).json({
      message: `Event '${name}' deleted successfully!`,
      events: events,
    });
  } catch (err) {
    console.error("Error in backend deleteEvent:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const fetchEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json({ events });
  } catch (err) {
    console.error("Error fetching communities:", err);
    res.status(500).json({ message: "Failed to fetch communities." });
  }
};

export const fetchParticipants = async (req, res) => {
  const { eventId } = req.body;
  console.log(eventId);
  try {
    const event = await Event.findById(eventId);
    const participants = await Promise.all(
      event.participants.map(async (participantId) => {
        const user = await User.findById(participantId).select(
          "name profilePic" // Adjust the fields as needed
        );
        return user;
      })
    );
    res.json({ participants });
  } catch (err) {
    console.error("Error in fetchParticipants:", err);
    res.status(500).json({ message: "Failed to fetch participants." });
  }
};
