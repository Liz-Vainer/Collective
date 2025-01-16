import { useState, useEffect } from "react";
const useGetEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const res = await fetch("/events");
        const data = await res.json();
        if (!data) {
          throw new Error(data.error);
        }
        console.log("all events:", data.events);
        setEvents(data.events);
      } catch (err) {
        console.error("Error fetching events:", err);
        alert("An error occurred. Please try again.");
      }
    };
    getEvents();
  }, []);
  return { events, setEvents };
};

export default useGetEvents;
