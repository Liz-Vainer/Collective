import Event from "../models/events.js"; // Event model

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
    res.status(200).json({ message: `Event '${name}' deleted successfully!` });
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
