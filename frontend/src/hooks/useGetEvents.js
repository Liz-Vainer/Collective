import { useEffect } from "react";
import useEvents from "../zustand/useEvents";
const useGetEvents = () => {
  const { setEvents } = useEvents();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const res = await fetch("/events");
        const data = await res.json();
        if (!data) {
          throw new Error(data.error);
        }
        setEvents(data.events);
      } catch (err) {
        console.error("Error fetching events:", err);
        alert("An error occurred. Please try again.");
      }
    };
    getEvents();
  }, [setEvents]);
};

export default useGetEvents;
